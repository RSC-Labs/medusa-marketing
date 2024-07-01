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
import { AdminMarketingEmailSettingsGetReq, AdminMarketingEmailSettingsResponse } from "../../../../types/api";
import { useAdminCustomQuery } from "medusa-react";
import { EmailSentType } from "../../../../types/models";

const StatusBadge = ({enabled} : {enabled?: boolean}) => {
  if (enabled === undefined) {
    return <Badge color="grey" size="xsmall">Undefined</Badge>
  }
  if (enabled) {
    return <Badge color="green" size="xsmall">Enabled</Badge>
  }
  return <Badge color="red" size="xsmall">Disabled</Badge>
}

export const EmailMessageIsEnabled = ({ emailType } : { emailType: EmailSentType}) => {
  const { data, isLoading } = useAdminCustomQuery
    <AdminMarketingEmailSettingsGetReq, AdminMarketingEmailSettingsResponse>(
      "/marketing/email-settings",
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

  return <StatusBadge enabled={data?.settings?.enabled}/>
}