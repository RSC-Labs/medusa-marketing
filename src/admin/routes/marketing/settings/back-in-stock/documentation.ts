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


export const BackInStockDocumentation: MessageDocumentation = {
  triggerDescription: 'This message is triggered when variant.inventory_quantity becomes bigger than 0',
  availableParameters: [
    'variant_title',
    'product_title',
    'product_thumbnail',
    'product_handle',
    "first_name",
    "last_name"
  ]
}