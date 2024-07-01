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

import { RouteConfig } from "@medusajs/admin"
import { Gift } from "@medusajs/icons"
import { Tabs, Text, Toaster } from "@medusajs/ui"
import { Box, Grid } from "@mui/material";
import { OverviewTab } from "../../../ui-components/tabs/overview-tab/overview-tab";
import { SettingsTab } from "../../../ui-components/tabs/settings-tab/settings-tab";


const MarketingPage = () => {
  return (
    <Tabs defaultValue='overview'>
      <Toaster position="top-right"/>
      <Tabs.List >
        <Tabs.Trigger value='overview'>Overview</Tabs.Trigger>
        <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value='overview'>
        <Box height={20}></Box>
        <OverviewTab/>
      </Tabs.Content>
      <Tabs.Content value='settings'>
        <Box height={20}></Box>
        <SettingsTab/>
      </Tabs.Content>
    </Tabs>
  )
}
export const config: RouteConfig = {
  link: {
    label: "Marketing",
    icon: Gift,
  },
}

export default MarketingPage