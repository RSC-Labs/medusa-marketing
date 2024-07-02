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

import { Container, Heading, Text, Select, Alert, Switch, Button, toast, Toaster, Input } from "@medusajs/ui"
import { CircularProgress, Grid } from "@mui/material";
import { PreviewEmail } from "../../../../ui-components/common/email-preview";
import { useState } from "react";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react"
import { AdminMarketingEmailSettingsGetReq, AdminMarketingEmailSettingsResponse, AvailableEmailSettings, EmailTemplateProperties, EmailTemplateType } from "../../../../ui-components/types/api";
import { EmailSentType, MarketingEmailSettings } from "../../../../ui-components/types/models";
import Link from '@mui/material/Link';
import { InfoDrawer } from "./settings-info-drawer";

const SelectEmailSettings = ({
  availableTransports, 
  availableTemplates, 
  templateType, 
  setTemplateType, 
  templateName, 
  setTemplateName, 
  setTransport, 
  emailTransport, 
} : 
  {availableTransports: string[], availableTemplates: EmailTemplateProperties[], templateType: string, setTemplateType: any, templateName: string, setTemplateName: any,
    setTransport: any, emailTransport: string
  }) => {
  
  return (
    <Grid container direction={'column'} rowSpacing={2}>
      <Grid item>
        <SelectEmailTransport availableTransports={availableTransports} setTransport={setTransport} emailTransport={emailTransport}/>
      </Grid>
      {emailTransport && <Grid item>
        <SelectTemplateType availableTemplates={availableTemplates} setTemplateType={setTemplateType} setTemplateName={setTemplateName} templateType={templateType}/>
      </Grid>}
      {templateType && <Grid item>
        <SelectTemplateName 
          availableTemplatesNames={availableTemplates.filter(item => item.templateType === templateType).map(item => item.templateName)} 
          setTemplateName={setTemplateName}
          templateName={templateName}/>
      </Grid>}
    </Grid>
  )
}

const SelectEmailTransport = ({availableTransports, setTransport, emailTransport} : {availableTransports: string[], setTransport: any, emailTransport: string}) => {

  function chooseValue(value: string) {
    setTransport(value);
  }

  return (
    <Select onValueChange={chooseValue} value={emailTransport}>
      <Select.Trigger>
        <Select.Value placeholder="Select email transport"/>
      </Select.Trigger>
      <Select.Content>
        {availableTransports.map((item) => (
          <Select.Item key={item} value={item}>
            {item}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  )
}

const SelectTemplateName = ({availableTemplatesNames, setTemplateName, templateName} : {availableTemplatesNames: string[], setTemplateName: any, templateName: string}) => {

  function chooseValue(value: string) {
    setTemplateName(value);
  }

  return (
    <Select onValueChange={chooseValue} value={templateName}>
      <Select.Trigger>
        <Select.Value placeholder="Select template name"/>
      </Select.Trigger>
      <Select.Content>
        {availableTemplatesNames.map((item) => (
          <Select.Item key={item} value={item}>
            {item}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  )
}

const SelectTemplateType = ({availableTemplates, setTemplateType, setTemplateName, templateType} : 
  {availableTemplates: EmailTemplateProperties[], setTemplateType: any, setTemplateName: any, templateType: string}) => {

  function chooseValue(value: string) {
    setTemplateName(undefined);
    setTemplateType(value);
  }

  const uniqueTemplateTypes = [...new Set(availableTemplates.map(availableTemplate => availableTemplate.templateType))];

  return (
    <Select onValueChange={chooseValue} value={templateType}>
      <Select.Trigger>
        <Select.Value placeholder="Select template type"/>
      </Select.Trigger>
      <Select.Content>
        {uniqueTemplateTypes.map(uniqueTemplateType => (
          <Select.Item key={uniqueTemplateType} value={uniqueTemplateType}>
            {uniqueTemplateType}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  )
}

const InputSubject = ({subject, setSubject} : {subject: string, setSubject: any}) => {
  return (
    <Input 
      defaultValue={subject}
      onChange={e => setSubject(e.target.value)}
    />
  )
}

type AdminMarketingEmailSettingsPostReq = {
  settings: Omit<MarketingEmailSettings, 'id'>
}

const SettingsEmailConfiguration = ({ emailType, emailSettings, availableEmailSettings } : 
  {emailType: EmailSentType, emailSettings?: MarketingEmailSettings, availableEmailSettings: AvailableEmailSettings}) => {
  const [emailTransport, setTransport] = useState<string | undefined>(
    emailSettings ? (emailSettings.email_transport ? emailSettings.email_transport : undefined) : undefined)
  const [templateType, setTemplateType] = useState<string | undefined>(
    emailSettings ? (emailSettings.email_template_type ? emailSettings.email_template_type : undefined) : undefined)
  const [templateName, setTemplateName] = useState<string | undefined>(
    emailSettings ? (emailSettings.email_template_name ? emailSettings.email_template_name : undefined) : undefined)
  const [subject, setSubject] = useState<string | undefined>(
    emailSettings ? (emailSettings.email_subject ? emailSettings.email_subject : undefined) : undefined)
  const [enabled, setEnabled] = useState<boolean>(emailSettings ? (emailSettings.enabled ? emailSettings.enabled : false) : false);


  const { mutate } = useAdminCustomPost<
    AdminMarketingEmailSettingsPostReq,
    AdminMarketingEmailSettingsResponse  
  >
  (
    `/marketing/email-settings`,
    ["welcome-email-settings"]
  )
  const onSubmit = () => {
    return mutate(
      {
        settings: {
          email_transport: emailTransport,
          email_template_type: templateType,
          email_template_name: templateName,
          email_type: emailType,
          email_subject: subject,
          enabled: enabled
        }
      }, {
        onSuccess: async ( { response,  settings } ) => {
          if (response.status == 201 && settings) {
            toast.success('Settings', {
              description: "New settings saved",
            });
          } else {
            toast.error('Settings', {
              description: "Settings cannot be saved, some error happened.",
            });
          }
        },
        onError: ( { } ) => {
          toast.error('Settings', {
            description: "Settings cannot be saved, some error happened.",
          });
        },
      }
    )  
  }

  function isSavePossible(): boolean {
    return (templateName !== undefined 
      && templateType !== undefined
      && subject !== undefined
    );
  }

  return (
    <Grid container direction={'column'}>
      <Grid item>
        <Heading>
          {`Marketing settings - ${emailType} messages`}
        </Heading>
      </Grid>
      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={4} md={4} xl={4}>
          <Container>
            <Grid container direction={'column'}>
              <Grid container alignItems={'center'} justifyContent={'space-between'}>
                <Grid item xs={9} md={9} xl={9}>
                  <Text size="small">
                    See trigger and parameters
                  </Text>
                </Grid>
                <Grid item>
                  <InfoDrawer emailType={emailType}/>
                </Grid>
              </Grid>
              <div className="bg-grey-20 my-xlarge h-px w-full" />
              <Grid container alignItems={'center'} justifyContent={'space-between'}>
                <Grid item xs={9} md={9} xl={9}>
                  <Text size="small">
                    Enable or disable sending messages.
                  </Text>
                </Grid>
                <Grid item>
                  <Switch checked={enabled} onCheckedChange={setEnabled}></Switch>
                </Grid>
              </Grid>
              <div className="bg-grey-20 my-xlarge h-px w-full" />
              <Grid container direction={'column'}>
                <Grid item>
                  <Text size="small">
                    Email subject
                  </Text>
                </Grid>
                <Grid item marginTop={2}>
                  <InputSubject subject={subject} setSubject={setSubject}/>
                </Grid>
              </Grid>
              <div className="bg-grey-20 my-xlarge h-px w-full" />
              <Grid container justifyContent={'space-between'}>
                <Grid item>
                  <Text size="small">
                    Choose template for email
                  </Text>
                </Grid>
                <Grid item>
                  <Link href="">
                    <Text size="xsmall">
                      How to add?
                    </Text>
                  </Link>
                </Grid>
              </Grid>
              <Grid item marginTop={2}>
                <SelectEmailSettings 
                  availableTransports={availableEmailSettings.availableTransports}
                  availableTemplates={availableEmailSettings.availableTemplates} 
                  templateType={templateType}
                  templateName={templateName}
                  setTemplateName={setTemplateName}
                  setTemplateType={setTemplateType}
                  setTransport={setTransport}
                  emailTransport={emailTransport}
                  />
              </Grid>
              <div className="bg-grey-20 my-xlarge h-px w-full" />
              <Grid container justifyContent={'end'}>
                <Grid item>
                  <Button variant="primary" onClick={onSubmit} disabled={!isSavePossible()}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={8} md={8} xl={8}>
          <PreviewEmail subject={subject} emailType={emailType} templateName={templateName} templateType={templateType}/>
        </Grid>
      </Grid>
    </Grid>
  )
}

const SettingsEmailConfigurationPage = ({ emailType } : { emailType: EmailSentType }) => {
  const { data, isLoading } = useAdminCustomQuery
    <AdminMarketingEmailSettingsGetReq, AdminMarketingEmailSettingsResponse>(
      "/marketing/email-settings",
      [''],
      {
        emailType: emailType
      }
  )

  if (isLoading) {
    return (
      <CircularProgress size={10}/>
    )
  }

  if (data) {
    return (
      <>
        <Toaster/>
        <SettingsEmailConfiguration emailType={emailType} emailSettings={data.settings} availableEmailSettings={data.availableSettings}/>
      </>
    )
  }
  return (
    <Alert variant="error">Cannot load email settings</Alert>
  )

}
export default SettingsEmailConfigurationPage