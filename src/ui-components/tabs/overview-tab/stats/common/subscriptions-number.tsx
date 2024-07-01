

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

import { Heading } from "@medusajs/ui"
import { CircularProgress } from "@mui/material";
import { useAdminCustomQuery } from "medusa-react";
import { EmailSentType } from "../../../../types/models";

type AdminMarketingSubscriptionsCountGetReq = {
  emailType?: EmailSentType
};

type AdminMarketingSubscriptionsCountResponse = {
  result?: number
}

export const SubscriptionsNumber = ({ emailType } : {emailType: EmailSentType}) => {
  const { data, isLoading } = useAdminCustomQuery
    <AdminMarketingSubscriptionsCountGetReq, AdminMarketingSubscriptionsCountResponse>(
      "/marketing/subscriptions/count",
      [''],
      {
        emailType: emailType
      }
  )

  if (isLoading) {
    return (
      <CircularProgress size={6}/>
    )
  }

  return <Heading>{data.result}</Heading>
}