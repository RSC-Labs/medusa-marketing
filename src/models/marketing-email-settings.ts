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

import { BeforeInsert, Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { BaseEntity } from "@medusajs/medusa";

@Entity()
export class MarketingEmailSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  email_transport: string

  @Column()
  email_template_type: string

  @Column()
  email_template_name: string

  @Column()
  email_type: string

  @Column()
  email_subject: string

  @Column()
  enabled: boolean

  @Column('jsonb', { nullable: true, default: {}})
  configuration: Record<string, any>

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
      this.id = generateEntityId(this.id, "memailset")
  }
}