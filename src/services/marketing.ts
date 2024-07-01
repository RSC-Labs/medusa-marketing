/*
 * Copyright 2024 RSC-Labs, https://rsoftcon.com/
 *
 * MIT License
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Customer, CustomerService, Logger, ProductVariant, ProductVariantService, TransactionBaseService } from "@medusajs/medusa"
import EmailService from "./email";
import { AvailableEmailSettings, EmailPreview, EmailSettings } from "./types/api";
import { MarketingSubscription } from "../models/marketing-subscription";
import { MarketingEmailSent, } from "../models/marketing-email-sent";
import { MarketingEmailSettings } from "../models/marketing-email-settings";
import { EmailSentType, EmailSettingsBackInStockConfiguration } from "./types/email";
import { MedusaError } from "@medusajs/utils";
import MarketingSubscriptionService from "./marketingSubscription";

export default class MarketingService extends TransactionBaseService {

  protected readonly options: any;
  private emailService: EmailService;
  private marketingSubscriptionService: MarketingSubscriptionService;
  private readonly productVariantService: ProductVariantService;
  private readonly logger: Logger;
  private readonly customerService: CustomerService;

  constructor(
    container,
    options
  ) {
    super(container),
    this.options = options;
    this.emailService = container.emailService;
    this.marketingSubscriptionService = container.marketingSubscriptionService;
    this.customerService = container.customerService;
    this.productVariantService = container.productVariantService;
    this.logger = container.logger;
  }

  private isEnabled(settings: MarketingEmailSettings) : boolean {
    return settings.enabled;
  }

  async createNewEmailSettings(settings: Omit<MarketingEmailSettings, "id">) : Promise<EmailSettings> {
    const newEntry = this.activeManager_.create(MarketingEmailSettings);

    if (settings.email_template_name === undefined ||
      settings.email_template_type === undefined ||
      settings.email_type === undefined ||
      settings.enabled === undefined ||
      settings.email_transport === undefined ||
      settings.email_subject === undefined
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Some settings are not passed`
      )
    }
    newEntry.email_transport = settings.email_transport;
    newEntry.email_template_name = settings.email_template_name;
    newEntry.email_template_type = settings.email_template_type;
    newEntry.email_type = settings.email_type;
    newEntry.email_subject = settings.email_subject,
    newEntry.enabled = settings.enabled;

    const resultSettings = await this.activeManager_.getRepository(MarketingEmailSettings).save(newEntry);

    return {
      settings: resultSettings,
      availableSettings: {
        availableTransports: this.emailService.getAvailableTransports(),
        availableTemplates: this.emailService.getAvailableTemplates()
      }
    }
  }

  async getEmailSettings(type: EmailSentType): Promise<EmailSettings> {

    const availableSettings: AvailableEmailSettings = {
      availableTransports: this.emailService.getAvailableTransports(),
      availableTemplates: this.emailService.getAvailableTemplates()
    };
    
    const marketingEmailSentRepository = this.activeManager_.getRepository(MarketingEmailSettings);
    const marketingEmailSettings: MarketingEmailSettings | null = await marketingEmailSentRepository.createQueryBuilder('emailSettings')
      .where('emailSettings.email_type = :type',  { type })
      .orderBy('emailSettings.created_at', 'DESC')
      .getOne()

    if (marketingEmailSettings === null) {
      return {
        availableSettings: availableSettings,
        settings: undefined
      }
    }
    return {
      availableSettings: availableSettings,
      settings: marketingEmailSettings
    }
  }

  async getEmailsSentNumber(emailType?: EmailSentType) : Promise<number | undefined> {
    const marketingEmailSentRepository = this.activeManager_.getRepository(MarketingEmailSent);
    let emailsSentNumber: number | null = null;
    if (emailType) {
      emailsSentNumber = await marketingEmailSentRepository.createQueryBuilder('emailSent')
        .where('emailSent.type = :emailType',  { emailType })
        .getCount()
    } else {
      emailsSentNumber = await marketingEmailSentRepository.createQueryBuilder('emailSent')
        .getCount()
    }
    
    if (emailsSentNumber === null) {
      return undefined;
    }
    return emailsSentNumber;
  }

  async getEmailsSent() : Promise<MarketingEmailSent[]> {
    const marketingEmailSentRepository = this.activeManager_.getRepository(MarketingEmailSent);
    const emailsSent: MarketingEmailSent[] | null = await marketingEmailSentRepository.createQueryBuilder('emailSent')
      .orderBy('emailSent.created_at', 'DESC')
      .getMany()

    if (emailsSent === null) {
      return [];
    }
    return emailsSent;
  }

  async subscribeBackInStock(customerId: string, variantId: string) : Promise<MarketingSubscription> {
    const variant: ProductVariant | undefined = await this.productVariantService.retrieve(variantId);
    if (!variant) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Variant ${variantId} does not exist.`
      )
    }
    if (variant.inventory_quantity > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `You cannot subscribe back in stock for variant which is not sold out.`
      )
    }
    return await this.marketingSubscriptionService.subscribe(customerId, EmailSentType.BACK_IN_STOCK, variantId);
  }

  async getLocales(emailType: EmailSentType) : Promise<Record<string, string>> {
    const lastCustomer = await this.customerService.list({}, {
      take: 1
    });
    if (lastCustomer.length) {
      switch (emailType) {
        case EmailSentType.WELCOME:
          return {
            first_name: lastCustomer[0].first_name,
            last_name: lastCustomer[0].last_name,
            email: lastCustomer[0].email
          }
        case EmailSentType.BACK_IN_STOCK:
          const lastProductVariant = await this.productVariantService.list({
          }, {
            relations: ['product'],
            take: 1
          })
          if (lastProductVariant.length) {
            return {
              variant_title: lastProductVariant[0].title,
              product_title: lastProductVariant[0].product.title,
              product_thumbnail: lastProductVariant[0].product.thumbnail,
              product_handle: lastProductVariant[0].product.handle,
              first_name: lastCustomer[0].first_name,
              last_name: lastCustomer[0].last_name
            }
          } else {
            throw new MedusaError(
              MedusaError.Types.NOT_FOUND,
              `You need to have at least 1 product variant to see preview`
            )
          }
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `You need to have at least 1 customer to see preview`
      )  
    }
  }

  async welcomeCustomer(customer: Customer) {
    const emailWelcomeSettings = await this.getEmailSettings(EmailSentType.WELCOME);
    if (emailWelcomeSettings && emailWelcomeSettings.settings) {
      if (this.isEnabled(emailWelcomeSettings.settings)) {
          this.logger.debug(`Customer ${customer.id} created account. Sending welcome email.`)
          await this.emailService.sendEmail(
            customer.email, 
            emailWelcomeSettings.settings.email_transport,
            emailWelcomeSettings.settings.email_template_type,
            emailWelcomeSettings.settings.email_template_name,
            emailWelcomeSettings.settings.email_subject,
            EmailSentType.WELCOME,
            {
              first_name: customer.first_name,
              last_name: customer.last_name,
              email: customer.email
            }
          );
      } else {
        this.logger.debug(`Welcome customer is disabled due to configuration`);
      }
    } else {
      this.logger.warn(`Welcome customer is disabled due to lack of settings`);
    }
  }

  async handleInventoryQuantityChange(variantId: string) {
    const variant = await this.productVariantService.retrieve(variantId, {
      relations: ['product']
    });
    if (variant) {
      const emailBackInStockSettings = await this.getEmailSettings(EmailSentType.BACK_IN_STOCK);
      if (emailBackInStockSettings && emailBackInStockSettings.settings) {
        if (this.isEnabled(emailBackInStockSettings.settings)) {
          let minInventoryRequired = 0;
          if (emailBackInStockSettings.settings.configuration) {
            const configuration = emailBackInStockSettings.settings.configuration as EmailSettingsBackInStockConfiguration;
            minInventoryRequired = configuration.min_inventory_required ?? 0;
          }
          if (variant.inventory_quantity > minInventoryRequired) {
            this.logger.debug(`Variant ${variant.id} is back in stock. Sending emails to subscribers.`)
            const customers = await this.marketingSubscriptionService.retrieveSubscribedCustomers(EmailSentType.BACK_IN_STOCK, variant.id);

            for (const customer of customers) {
              this.logger.debug(`Unsubscribe ${customer.id} from back in stock subscription due to sending email.`)
              await this.marketingSubscriptionService.unsubscribe(customer.id, EmailSentType.BACK_IN_STOCK, variant.id);
              await this.emailService.sendEmail(
                customer.email, 
                emailBackInStockSettings.settings.email_transport,
                emailBackInStockSettings.settings.email_template_type,
                emailBackInStockSettings.settings.email_template_name,
                emailBackInStockSettings.settings.email_subject,
                EmailSentType.BACK_IN_STOCK,
                {
                  variant_title: variant.title,
                  product_title: variant.product.title,
                  product_thumbnail: variant.product.thumbnail,
                  product_handle: variant.product.handle,
                  first_name: customer.first_name,
                  last_name: customer.last_name
                }
              );
            }
          }
        } else {
          this.logger.debug(`Back in stock is disabled`);
        }
      } else {
        this.logger.warn(`Back in stock is disabled due to lack of settings`);
      }
    }
  }
}