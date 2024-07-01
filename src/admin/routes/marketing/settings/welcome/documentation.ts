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

import { MessageDocumentation } from "../types";


export const WelcomeDocumentation: MessageDocumentation = {
  trigger: 'customer.created',
  triggerDescription: 'This message is triggered when customer creates an account and event "customer.created" is generated.',
  availableParameters: [
    "first_name",
    "last_name",
    "email"
  ]
}