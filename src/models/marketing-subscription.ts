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

import { BeforeInsert, Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { BaseEntity, Customer } from "@medusajs/medusa";

@Entity()
export class MarketingSubscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Customer, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column()
  email_type: string;

  @Column()
  target_id: string | undefined;

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
      this.id = generateEntityId(this.id, "marsub")
  }
}