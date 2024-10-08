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
import MarketingService from "../../../../../../services/marketing";
import { MarketingSubscription } from "../../../../../../models/marketing-subscription";

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const id = req.user.customer_id;
  const body: any = req.body as any;
  const variantId: string | undefined = body.variantId;
  const marketingService: MarketingService = req.scope.resolve('marketingService');

  if (!id) {
    return res.status(400).json({
      message: 'You need to be logged-in to subscribe'
    })
  }
  if (!variantId) {
    return res.status(400).json({
      message: 'You need to set variantId for back-in-stock subscription'
    })
  }
  const subscription: MarketingSubscription = await marketingService.subscribeBackInStock(id, variantId);
  return res.status(200).json({
    result: subscription
  })
}