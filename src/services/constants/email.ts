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

import { EmailSentType } from "../types/email";

export const EMAIL_TEMPLATE_PARAMETERS_MAP: Record<EmailSentType, Record<string, string>> = {
  [EmailSentType.WELCOME] : {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com'
  },
  [EmailSentType.BACK_IN_STOCK] : {
    variant_title: 'Product Variant Title',
    product_title: 'Product Title',
    first_name: 'John',
    last_name: 'Doe'
  }
}
  
