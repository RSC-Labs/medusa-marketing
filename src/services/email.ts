import { Logger, TransactionBaseService } from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";
import Email from "email-templates";
import path from "path";
import { EmailSentStatus, EmailSentType, EmailTemplateProperties, EmailTemplateType, EmailTransport } from "./types/email";
import { EmailPreview } from "./types/api";
import { MarketingEmailSent } from "../models/marketing-email-sent";

export enum SupportedEmailTransport {
  SMTP = 'smtp'
}

const DEFAULT_TEMPLATE_DIR = '../assets/email-templates'

export default class EmailService extends TransactionBaseService {
  static identifier = "email-sender";
  static is_installed = true;
  protected logger: Logger;
  protected emailTransports: EmailTransport[];
  private templateDir: string;

  constructor(container: any, options: any) {
      super(container);

      this.logger = container.logger;
      this.emailTransports = options.email_transports;
      if (options.templateDir) {
        this.templateDir = path.resolve(__dirname, (options.templateDir));
      } else {
        this.templateDir = path.resolve(__dirname, DEFAULT_TEMPLATE_DIR);
      }
  }

  private constructTemplateProperties(templateType: string, templateName: string) : EmailTemplateProperties {
    switch (templateType) {
      case EmailTemplateType.HTML:
      case EmailTemplateType.PUG:
        break;
      default:
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Email template type not supported - got ${templateType}`
        )
    }
    return {
      templateName: templateName,
      templateType: templateType as EmailTemplateType
    }
  }

  private validateTemplateProperties(templatePros: EmailTemplateProperties): boolean {
    const fs = require('fs');
    const possibleTemplate = path.join(this.templateDir, templatePros.templateType, templatePros.templateName);
    if (!fs.existsSync(possibleTemplate)) {
      return false;
    }
    const possibleTemplateHtml = path.join(possibleTemplate, `html.${templatePros.templateType}`);
    if (!fs.existsSync(possibleTemplateHtml)) {
      return false;
    }
    return true;
  }

  private async sendEmailUsingSmtp(
    toAddress: string,
    templateProperties: EmailTemplateProperties,
    emailSubject: string,
    transportConfiguration: any,
    availableTemplateParameters: Record<string, string>
  ) {
    const email = new Email({
      views: {
        root: this.templateDir,
        options: {
          extension: templateProperties.templateType.toString(),
          map: {
            html: 'htmling' 
          }
        }
      },
      send: true,
      transport: transportConfiguration
    })

    try {
      const result = await email.send({
        template: `${templateProperties.templateType}/${templateProperties.templateName}`,
        message: {
          to: toAddress,
          subject: emailSubject
        },
        locals: availableTemplateParameters
      })
      const smtpResponse = result.response as string;
      if (!smtpResponse || !smtpResponse.includes('250')) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Cannot send email due to problem with SMTP`
        )
      }
    } catch (error) {
      this.logger.error(error);
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot send email due to ${error}`
      )
    }
  }

  private async logEmail(receiverEmail: string, status: EmailSentStatus, type: EmailSentType) : Promise<MarketingEmailSent> {
    const newEntry = this.activeManager_.create(MarketingEmailSent);
    newEntry.receiver_email = receiverEmail;
    newEntry.status = status;
    newEntry.type = type;

    const resultEmail = await this.activeManager_.getRepository(MarketingEmailSent).save(newEntry);
    return resultEmail;
  }

  private async send(
    toAddress: string, 
    transportType: string, 
    templateType: string, 
    templateName: string, 
    subject: string,
    emailType: EmailSentType,
    availableTemplateParameters: Record<string, string>
  ) {
    const templateProperties = this.constructTemplateProperties(templateType, templateName);
    if (!this.validateTemplateProperties(templateProperties)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Template file does not exist: ${templateProperties.templateName}`
      )
    }
    const emailTransportConfiguration = this.getConfigurationFromAvailableTransports(transportType);
    if (!emailTransportConfiguration) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Email transport not found in medusa-config - got ${transportType}`
      )
    }

    switch (templateType) {
      case EmailTemplateType.HTML:
      case EmailTemplateType.PUG:
        switch (transportType) {
          case SupportedEmailTransport.SMTP:
            this.logger.debug('Sending SMTP mail');
            await this.sendEmailUsingSmtp(
              toAddress, 
              templateProperties,
              subject,
              emailTransportConfiguration,
              availableTemplateParameters
            );
            await this.logEmail(toAddress, EmailSentStatus.PROCESSED, emailType);
            return;
          default:
            throw new MedusaError(
              MedusaError.Types.NOT_FOUND,
              `Email transport not supported - got ${transportType}`
            )
        }
      default:
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Email template type not supported - got ${templateType}`
        )
    }
  }

  
  getAvailableTransports() : string[] {
    return this.emailTransports.map(emailTransport => emailTransport.name);
  }

  getConfigurationFromAvailableTransports(emailTransportName: string) : any | undefined {
    const foundEmailTransport = this.emailTransports.find(transport => transport.name === emailTransportName);
    if (foundEmailTransport) {
      return foundEmailTransport.configuration;
    }
    return undefined;
  }

  getAvailableTemplates() : EmailTemplateProperties[] {
    
    const fs = require('fs');

    function containsHTMLFile(dirPath: string, extension: string): boolean {
      try {
        const filePath = path.join(dirPath, `html.${extension}`);
        return fs.statSync(filePath).isFile();
      } catch (error) {
        return false;
      }
    }

    function findTemplates(baseDir: string, templateType: EmailTemplateType): EmailTemplateProperties[] {
      const templates: EmailTemplateProperties[] = [];
      const subDirs = fs.readdirSync(baseDir).filter(dir => fs.statSync(path.join(baseDir, dir)).isDirectory());
  
      for (const dir of subDirs) {
          const fullPath = path.join(baseDir, dir);
          if (containsHTMLFile(fullPath, templateType)) {
              templates.push({templateType, templateName: dir });
          }
      }
  
      return templates;
    }

    const allTemplates: EmailTemplateProperties[] = [];
    for (const templateType of Object.values(EmailTemplateType)) {
      const baseDir = path.join(this.templateDir, templateType);
      const templates = findTemplates(baseDir, templateType);
      allTemplates.push(...templates);
    }

    return allTemplates;
  }

  async sendEmail(
    toAddress: string, 
    transportType: string, 
    templateType: string, 
    templateName: string,
    emailSubject: string,
    emailType: EmailSentType,
    availableTemplateParameters: Record<string, string>
  ) {
    try {
      await this.send(toAddress, transportType, templateType, templateName, emailSubject, emailType, availableTemplateParameters);
    } catch (error) {
      await this.logEmail(toAddress, EmailSentStatus.FAILED, emailType);
    }
  } 

  async previewMail(templateType: string, templateName: string, emailType: EmailSentType, locales: Record<string, string>) : Promise<EmailPreview> {
    const templateProperties = this.constructTemplateProperties(templateType, templateName);
    if (!this.validateTemplateProperties(templateProperties)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Template file does not exist: ${templateProperties.templateName}}`
      )
    }

    // TODO: Validation of locales against constant

    const email = new Email({
      views: {
        root: this.templateDir,
        options: {
          extension: templateProperties.templateType,  
          map: {
            html: 'htmling' 
          }
        }
      },
      send: false,
      transport: {
        jsonTransport: true
      }
    });
    const emailContent = await email.render(`${templateType}/${templateName}/html.${templateProperties.templateType}`, locales);
    return {
      htmlContent: emailContent
    };
  }
}