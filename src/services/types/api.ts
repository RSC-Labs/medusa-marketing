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

import { MarketingEmailSettings } from "../../models/marketing-email-settings"
import { EmailTemplateProperties } from "./email"

export type EmailPreview = {
  htmlContent: string
}

export type AvailableEmailSettings = {
  availableTransports: string[],
  availableTemplates: EmailTemplateProperties[],
}


export type EmailSettings = {
  settings?: MarketingEmailSettings,
  availableSettings: AvailableEmailSettings
}