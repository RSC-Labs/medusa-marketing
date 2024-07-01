import { 
  type SubscriberConfig, 
  type SubscriberArgs,
  CustomerService,
  Customer,
  Logger, 
} from "@medusajs/medusa"
import MarketingService from "../../services/marketing"

export default async function marketingCustomerCreated({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<Record<string, any>>) {
  const marketingService: MarketingService = container.resolve("marketingService");
  const logger = container.resolve<Logger>("logger")
  logger.debug('Marketing catches creation of customer');
  marketingService.welcomeCustomer(data as Customer);
}

export const config: SubscriberConfig = {
  event: CustomerService.Events.CREATED,
  context: {
    subscriberId: "marketing-customer-created",
  },
}