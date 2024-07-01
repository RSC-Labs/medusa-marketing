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


import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { BaseEntity } from "@medusajs/medusa";

@Entity()
export class MarketingEmailSent extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  receiver_email: string;

  @Column()
  status: string;

  @Column()
  type: string;

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
      this.id = generateEntityId(this.id, "memailsent")
  }
}