# LFTruck follow-up test

## Product and route

Test the **Square-Body LED Headlight Set** at `/products/square-body-led-headlight-set`.

This product is not featured on the homepage. A participant can reach it by starting at `/`, opening the Lighting category, and selecting the product. The shop also supports the product name or part number search `LITE-LED-7387`.

The catalog describes it as a pair of sealed-beam-style LED lamps with a period-friendly outer profile. Its purpose is a front lighting upgrade. The displayed price is `$119.95` per set. The product description says to verify wiring and local road requirements before installation. It is fictional class-project catalog data, so no real purchase or shipping service is available.

## Participant task

> Starting from the LFTruck homepage, find the pair of sealed-beam-style LED lamps intended as a front lighting upgrade for a classic square-body truck. Add one set to the cart. Tell me the displayed price and what costs or purchase details are not included or are still only estimates.

Do not explain where to click or name the Lighting category. The formal measurement is the successful `add_to_cart` action on the selected product page. Finding the product is an observed usability task, not an additional analytics event.

## Observation prompts

- How does the participant look for the product from the homepage?
- Do they confidently identify the headlight set and understand that it is a pair of lamps?
- Where do they hesitate, and which product or pricing information is unclear?
- Does the product-page Add to cart action succeed, and does the participant notice the confirmation?
- Do they understand the displayed `$119.95` price and the prototype's estimated or excluded costs?

## GA4 verification

For a debug session, open the product page with `?ga_debug=1`, then add one set once. In GA4, open **Admin -> Data display -> DebugView** and select `add_to_cart`.

The expected event contains:

```js
{
  currency: "USD",
  value: 119.95,
  items: [{
    item_id: "led-headlight-set",
    item_name: "Square-Body LED Headlight Set",
    price: 119.95,
    quantity: 1,
  }],
  source_page: "/products/square-body-led-headlight-set",
  debug_mode: true,
}
```

The event is sent once from the selected product page after the existing cart action. It is not sent during rendering, cart restoration, or failed product lookup. Local verification can confirm the browser payload; only GA4 DebugView or Realtime can confirm receipt by GA4.