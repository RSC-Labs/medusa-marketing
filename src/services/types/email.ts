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


export type EmailTransport = {
  name: string,
  configuration: any
}

export enum EmailTemplateType {
  HTML = 'html',
  PUG = 'pug'
}

export type EmailTemplateProperties = {
  templateType: EmailTemplateType,
  templateName: string,
}

export enum EmailSentStatus {
  PROCESSED = 'processed',
  FAILED = 'failed'
}

export enum EmailSentType {
  WELCOME = 'welcome',
  BACK_IN_STOCK = 'back in stock',
}

export type EmailSettingsBackInStockConfiguration = {
  min_inventory_required?: number,
  smart_inventory_enabled?: boolean
}