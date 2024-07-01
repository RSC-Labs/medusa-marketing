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
import EmailService from "../../../../services/email";
import MarketingService from "../../../../services/marketing";
import { EmailSentType } from "../../../../services/types/email";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {

  const templateType = req.query.templateType;
  const templateName = req.query.templateName;
  const emailType = req.query.emailType;
  const emailService: EmailService = req.scope.resolve('emailService');
  const marketingService: MarketingService = req.scope.resolve('marketingService');

  try {
    const locales = await marketingService.getLocales(emailType as EmailSentType);
    if (locales) {
      const previewMail = await emailService.previewMail(templateType as string, templateName as string, emailType as EmailSentType, locales);
      res.status(200).json({
        result: previewMail
      });
    }
  } catch (e) {
    res.status(400).json({
      message: e.message
    })
  }
}