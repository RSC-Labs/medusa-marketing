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

import { Container, Heading, Text } from "@medusajs/ui"
import { Grid } from "@mui/material";
import { EmailMessageIsEnabled } from "./common/email-message-enabled";
import { EmailSentType } from "../../../types/models";
import { EmailMessageNumber } from "./common/email-message-number";
import { SubscriptionsNumber } from "./common/subscriptions-number";

export const BackInStockStats = () => {
  return (
    <Container>
      <Grid container direction={'column'}>
        <Grid container justifyContent={'space-between'}>
          <Grid item>
            <Heading>Back in stock</Heading>
          </Grid>
          <Grid item>
            <EmailMessageIsEnabled emailType={EmailSentType.BACK_IN_STOCK}/>
        </Grid >
        </Grid>
        <Grid item marginTop={2}>
          <Grid container spacing={1} alignItems={'center'}>
            <Grid item>
              <EmailMessageNumber emailType={EmailSentType.BACK_IN_STOCK}/>
            </Grid>
            <Grid item>
              <Text size="xsmall">emails processed</Text>
            </Grid>
          </Grid>
        </Grid>
        <Grid item marginTop={2}>
          <Grid container spacing={1} alignItems={'center'}>
            <Grid item>
              <SubscriptionsNumber emailType={EmailSentType.BACK_IN_STOCK}/>
            </Grid>
            <Grid item>
              <Text size="xsmall">subscriptions</Text>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}