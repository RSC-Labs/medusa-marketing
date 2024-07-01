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

import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/medusa"
import MarketingService from "../../../../services/marketing";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const marketingService: MarketingService = req.scope.resolve('marketingService');

  try {
    const emailsSent = await marketingService.getEmailsSent();
    res.status(200).json({
      result: emailsSent
    });
    
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
}