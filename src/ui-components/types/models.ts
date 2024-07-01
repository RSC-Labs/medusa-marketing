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

export enum EmailSentStatus {
  PROCESSED = 'processed',
  FAILED = 'failed'
}

export enum EmailSentType {
  WELCOME = 'welcome',
  BACK_IN_STOCK = 'back in stock',
}

export type EmailSent = {
  id: string,
  receiver_email: string,
  status: EmailSentStatus;
  type: EmailSentType;
  created_at: number
}

export type MarketingEmailSettings = {
  id: string,
  email_transport: string,
  email_template_type: string,
  email_template_name: string,
  email_type: string,
  email_subject: string,
  enabled: boolean
}