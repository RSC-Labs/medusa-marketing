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

import { EmailSentType } from "../../../../../ui-components/types/models";
import SettingsEmailConfigurationPage from "../settings-email-configuration";

const SettingsBackInStockEmailPage = () => {
  return <SettingsEmailConfigurationPage emailType={EmailSentType.BACK_IN_STOCK}/>
}
export default SettingsBackInStockEmailPage