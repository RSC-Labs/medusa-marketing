# Store API

Some actions (like `back in stock`) requires customer interaction. For example customers wants to subscribe for a variant which is not available and wants to get notification that it is back in stock.

This plugin exposes endpoints for your storefront to use it for above scenarios.

**_NOTE:_** All APIs require logged-in customer. That's why the APIs are defined under `store/me/...`. For more information how it works - please check MedusaJS documentation - https://docs.medusajs.com/development/api-routes/create#protect-store-api-routes. It is needed to properly map subscription to customer id and retrieve proper email address.

API definition can be found here: [Subscription API](./api-definition.yaml).