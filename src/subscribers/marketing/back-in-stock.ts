import { 
  type SubscriberConfig, 
  type SubscriberArgs,
  ProductVariantService,
  Logger, 
} from "@medusajs/medusa"
import MarketingService from "../../services/marketing"

export default async function marketingBackInStock({ 
  data, eventName, container, pluginOptions, 
}: SubscriberArgs<Record<string, any>>) {
  const { id, fields } = data;

  if (fields.includes('inventory_quantity')) {
    const marketingService: MarketingService = container.resolve("marketingService");
    const logger = container.resolve<Logger>("logger")
    logger.debug('Marketing catches change of inventory quantity');
    marketingService.handleInventoryQuantityChange(id);
  }
}

export const config: SubscriberConfig = {
  event: ProductVariantService.Events.UPDATED,
  context: {
    subscriberId: "marketing-back-in-stock",
  },
}