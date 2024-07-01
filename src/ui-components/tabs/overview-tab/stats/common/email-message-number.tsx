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

import { Badge, Container, Heading, Text } from "@medusajs/ui"
import { CircularProgress, Grid } from "@mui/material";
import { AdminMarketingEmailsSentGetReq, AdminMarketingEmailsSentResponse } from "../../../../types/api";
import { useAdminCustomQuery } from "medusa-react";
import { EmailSentType } from "../../../../types/models";

type AdminMarketingEmailsSentNumberResponse = {
  result?: number
}

export const EmailMessageNumber = ({ emailType } : {emailType: EmailSentType}) => {
  const { data, isLoading } = useAdminCustomQuery
    <AdminMarketingEmailsSentGetReq, AdminMarketingEmailsSentNumberResponse>(
      "/marketing/emails-sent-number",
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