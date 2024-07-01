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

import { Container, Heading, Text, Button } from "@medusajs/ui"
import { Grid } from "@mui/material";
import { Link } from "react-router-dom"

export const SettingsTab = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4} md={4} xl={4}>
        <Container>
          <Grid container direction={'column'}>
            <Grid item>
              <Heading level="h1">
                Welcome messages
              </Heading>
            </Grid>
            <Grid item>
              <Text size="small">
                Welcome customer after registration
              </Text>
            </Grid>
          </Grid>
          <Grid container marginTop={5} direction={'row'} columnSpacing={2}>
            <Grid item>
              <Link to={"/a/marketing/settings/welcome"}>
                <Button>
                  Configure
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid item xs={4} md={4} xl={4}>
        <Container>
          <Grid container direction={'column'}>
            <Grid item>
              <Heading level="h1">
                Back in stock
              </Heading>
            </Grid>
            <Grid item>
              <Text size="small">
                Notify customer that variant is back in stock
              </Text>
            </Grid>
          </Grid>
          <Grid container marginTop={5} direction={'row'} columnSpacing={2}>
            <Grid item>
              <Link to={"/a/marketing/settings/back-in-stock"}>
                <Button>
                  Configure
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Grid>
  )
}