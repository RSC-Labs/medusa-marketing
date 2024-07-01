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
import { EmailMessageNumber } from "./common/email-message-number";
import { EmailSentType } from "../../../types/models";

export const WelcomeMessagesStats = () => {
  return (
    <Container>
      <Grid container direction={'column'}>
        <Grid container justifyContent={'space-between'}>
          <Grid item>
            <Heading>Welcome</Heading>
          </Grid>
          <Grid item>
            <EmailMessageIsEnabled emailType={EmailSentType.WELCOME}/>
          </Grid>
        </Grid>
        <Grid item marginTop={2}>
          <Grid container spacing={1} alignItems={'center'}>
            <Grid item>
              <EmailMessageNumber emailType={EmailSentType.WELCOME}/>
            </Grid>
            <Grid item>
              <Text size="xsmall">emails processed</Text>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  )
}