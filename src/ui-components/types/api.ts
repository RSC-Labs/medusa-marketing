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

import { EmailSent, EmailSentType, MarketingEmailSettings } from "./models";

export enum EmailTemplateType {
  HTML = 'html',
  PUG = 'pug'
}
export type EmailTemplateProperties = {
  templateType: EmailTemplateType,
  templateName: string
}

export type AvailableEmailSettings = {
  availableTransports: string[],
  availableTemplates: EmailTemplateProperties[],
}

export type AdminMarketingEmailSettingsGetReq = {
  emailType: EmailSentType
};


export type AdminMarketingEmailSettingsResponse = {
  settings?: MarketingEmailSettings
  availableSettings: AvailableEmailSettings
}

export type AdminMarketingWelcomeMessageSettings = {}

export type WelcomeMessageSettings = {

}

export type AdminMarketingEmailsSentGetReq = {
  emailType?: EmailSentType
};
export type AdminMarketingEmailsSentResponse = {
  result?: EmailSent[]
}