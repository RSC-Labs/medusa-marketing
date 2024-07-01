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
import { EmailSentType } from "../../../../services/types/email";
import { MarketingEmailSettings } from "../../../../models/marketing-email-settings";
import { EmailSettings } from "../../../../services/types/api";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const emailType = req.query.emailType as EmailSentType;

  const marketingService: MarketingService = req.scope.resolve('marketingService');

  try {
    switch (emailType) {
      case EmailSentType.BACK_IN_STOCK:
        const emailSettingsBackInStock = await marketingService.getEmailSettings(EmailSentType.BACK_IN_STOCK);
        return res.status(200).json(emailSettingsBackInStock);
      case EmailSentType.WELCOME:
        const emailSettingsWelcome = await marketingService.getEmailSettings(EmailSentType.WELCOME);
        return res.status(200).json(emailSettingsWelcome);
    }
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const body: any = req.body as any;
  const settings: Omit<MarketingEmailSettings, "id"> | undefined = body.settings;
  const marketingService: MarketingService = req.scope.resolve('marketingService');

  try {
    if (settings !== undefined) {
      const newSettings: EmailSettings | undefined = await marketingService.createNewEmailSettings(settings);
    if (newSettings !== undefined) {
        res.status(201).json({
          settings: newSettings
        }); 
      } else {
        res.status(400).json({
          message: 'Cant update settings'
        })
      }
    } else {
      res.status(400).json({
        message: 'Settings not passed'
      })
    }
    
  } catch (e) {
    res.status(400).json({
        message: e.message
    })
  }
}