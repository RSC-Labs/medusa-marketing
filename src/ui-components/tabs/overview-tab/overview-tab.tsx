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
import { EmailsSent } from "./emails-sent";
import { WelcomeMessagesStats } from "./stats/welcome-message-stats";
import { BackInStockStats } from "./stats/back-in-stock-stats";

export const OverviewTab = () => {
  return (
    <Grid container spacing={2} direction={'column'}>
      <Grid item>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6} xl={6}>
            <WelcomeMessagesStats/>
          </Grid>
          <Grid item xs={6} md={6} xl={6}>
            <BackInStockStats/>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <EmailsSent/>
      </Grid>
    </Grid>
  )
}