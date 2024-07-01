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

import { Customer, CustomerService, Logger, TransactionBaseService } from "@medusajs/medusa"
import { EmailSentType } from "./types/email";
import { MedusaError } from "@medusajs/utils";
import { MarketingSubscription } from "../models/marketing-subscription";
import { DeleteResult } from "typeorm";

export default class MarketingSubscriptionService extends TransactionBaseService {

  protected readonly options: any;
  private readonly customerService: CustomerService;
  protected readonly logger: Logger;

  constructor(
    container,
    options
  ) {
    super(container),
    this.options = options;
    this.customerService = container.customerService;
    this.logger = container.logger;
  }

  async retrieveSubscribedCustomers(emailType: EmailSentType, targetId?: string) : Promise<Customer[]> {
    const marketingSubscriptionRepository = this.activeManager_.getRepository(MarketingSubscription);
    if (targetId) {
      const marketingSubscriptions: MarketingSubscription[] = await marketingSubscriptionRepository.createQueryBuilder('marketingSubscription')
        .leftJoinAndSelect('marketingSubscription.customer', 'customer')
        .where('marketingSubscription.email_type = :emailType',  { emailType })
        .andWhere('marketingSubscription.target_id = :targetId',  { targetId })
        .getMany();
        return marketingSubscriptions.map(marketingSubscription => marketingSubscription.customer);
    }
    const marketingSubscriptions: MarketingSubscription[] = await marketingSubscriptionRepository.createQueryBuilder('marketingSubscription')
      .leftJoinAndSelect('marketingSubscription.customer', 'customer')
      .where('marketingSubscription.email_type = :emailType',  { emailType })
      .getMany();

    return marketingSubscriptions.map(marketingSubscription => marketingSubscription.customer);
  }

  async retrieveNumberOfSubscriptions(emailType: EmailSentType) : Promise<number> {
    const marketingSubscriptionRepository = this.activeManager_.getRepository(MarketingSubscription);
    const numberOfSubscriptions: number = await marketingSubscriptionRepository.createQueryBuilder('marketingSubscription')
      .leftJoinAndSelect('marketingSubscription.customer', 'customer')
      .where('marketingSubscription.email_type = :emailType',  { emailType })
      .getCount();
    return numberOfSubscriptions;
  }

  async retrieveSubscription(customerId: string, emailType: EmailSentType, targetId?: string) : Promise<MarketingSubscription | null> {
    const marketingSubscriptionRepository = this.activeManager_.getRepository(MarketingSubscription);
    if (targetId) {
      const marketingSubscription: MarketingSubscription | null = await marketingSubscriptionRepository.createQueryBuilder('marketingSubscription')
        .leftJoinAndSelect('marketingSubscription.customer', 'customer')
        .where('marketingSubscription.email_type = :emailType',  { emailType })
        .andWhere('marketingSubscription.target_id = :targetId',  { targetId })
        .andWhere('customer.id = :customerId', { customerId })
        .getOne();
      return marketingSubscription;
    }
    const marketingSubscription: MarketingSubscription | null = await marketingSubscriptionRepository.createQueryBuilder('marketingSubscription')
      .leftJoinAndSelect('marketingSubscription.customer', 'customer')
      .where('marketingSubscription.email_type = :emailType',  { emailType })
      .andWhere('customer.id = :customerId', { customerId })
      .getOne();
    return marketingSubscription;
  }
  
  
  async subscribe(customerId: string, emailType: EmailSentType, targetId?: string) : Promise<MarketingSubscription> {
    const customer: Customer | null = await this.customerService.retrieve(customerId);
    if (customer) {
      const possibleExistingSubscription: MarketingSubscription | null = await this.retrieveSubscription(customer.id, emailType, targetId);
      if (!possibleExistingSubscription) {
        this.logger.info(`Customer ${customer} subscribes for ${emailType} with targetId ${targetId}`);
        const newEntry = this.activeManager_.create(MarketingSubscription);

        newEntry.customer = customer;
        newEntry.email_type = emailType;
        newEntry.target_id = targetId;
    
        const result: MarketingSubscription  = await this.activeManager_.getRepository(MarketingSubscription).save(newEntry);
        return result;
      } else {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          `You are already subscribed as ${customerId} for ${emailType}`
        )
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Customer not found`
      )
    }
  }

  async unsubscribe(customerId: string, emailType: EmailSentType, targetId?: string) : Promise<boolean> {
    const customer: Customer | null = await this.customerService.retrieve(customerId);
    if (customer) {
      const possibleExistingSubscription: MarketingSubscription | null = await this.retrieveSubscription(customer.id, emailType, targetId);
      if (possibleExistingSubscription) {
        this.logger.info('Unsubscribing');
        const result: DeleteResult =  await this.activeManager_.getRepository(MarketingSubscription).delete(possibleExistingSubscription.id);
        if (result.affected) {
          return true;
        }
      } else {
        this.logger.warn('There is no subscription to unsubscribe');
        return false;
      }
    } else {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Customer not found`
      )
    }
  }
}