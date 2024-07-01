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

import { LightBulb } from "@medusajs/icons"
import { Badge, Button, Drawer, Heading, IconButton, Text } from "@medusajs/ui"
import { EmailSentType } from "../../../../ui-components/types/models"
import { BackInStockDocumentation } from "./back-in-stock/documentation"
import { WelcomeDocumentation } from "./welcome/documentation"
import { Grid } from "@mui/material"
import { MessageDocumentation } from "./types"

const parameters: string[] = [
  "first_name",
  "last_name",
  "email"
]

export function InfoDrawer({ emailType } : { emailType: EmailSentType}) {
  let documentation: MessageDocumentation | undefined;

  switch (emailType) {
    case EmailSentType.BACK_IN_STOCK:
      documentation = BackInStockDocumentation;
      break;
    case EmailSentType.WELCOME:
      documentation = WelcomeDocumentation;
      break;
  }

  if (documentation) {
    return (
      <Drawer>
        <Drawer.Trigger asChild>
          <IconButton>
            <LightBulb/>
          </IconButton>
        </Drawer.Trigger>
        <Drawer.Content style={{ right: '0px', width: '33vw', minWidth: '640px', overflowY: 'auto' }}>
          <Drawer.Header>
            <Drawer.Title>Message details</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Grid container direction={'column'} rowSpacing={3}>
              <Grid item>
                <Heading>Trigger</Heading>
              </Grid>
              {documentation.trigger && <Grid item>
                <Badge>customer.created</Badge>
              </Grid>}
              <Grid item>
                <Text>
                  {documentation.triggerDescription}
                </Text>
              </Grid>
              <Grid item>
                <Heading>Available parameters</Heading>
              </Grid>
              <Grid item>
                <Text>
                  {
                    `These parameters you can use in your templates`
                  }
                </Text>
              </Grid>
              {documentation.availableParameters.map(parameter => (
                <Grid item key={parameter}>
                  <Badge>{parameter}</Badge>
                </Grid>
              ))}
            </Grid>
          </Drawer.Body>
          <Drawer.Footer>
            <Drawer.Close asChild>
              <Button variant="secondary">Close</Button>
            </Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    )
  } else {
    return (
      <IconButton disabled={true}>
        <LightBulb/>
      </IconButton>
    )
  }
}