# Controllers

The controller functions perform all the actions required by the Express server routes in the `/routes` folder.

## productController.js
This controller is used for the ClickFunnels API. The `products` table matches a ClickFunnels product ID with a Sendy email list ID.
When a new purchase arrives from ClickFunnels, we can push the user email and other data into a Sendy email list for that product.

The methods for this controller are `create, read, update, del`.

## purchaseController.js
This controller is used for the ClickFunnels API. The `purchase` table contains all data for every purchase that comes through the `/webhook_events` API.


The methods for this controller are `create, read, update, del`.

## userController.js

This controller contains all the database methods for a user in the `users` table. 

The methods are `create, read, update, del, login, logout, verify`.

The `create` method also handles registration of a new user.

## webhookController.js

The APIs in this controller are for receiving ClickFunnels webhook events. This allows ClickFunnels users to store all their user purchase information on their own server, and they can then push that data into their own email list manager, in this case Sendy. The benefits are:

- You don't need to use or pay for Zapier, or other API automation tools.
- You can easily analyze your user and purchase data since it's in your own database.
- If you install Sendy on your server, you also control your email list data.
- If you should move on from ClickFunnels, you still have all your customer data.
<br>


### `test()`

This method is required by Clickfunnels to verify the API url. See [help.clickfunnels.com - Creating a Webhook](https://help.clickfunnels.com/hc/en-us/articles/360039820293-Webhooks-in-ClickFunnels) under `Step 1: Creating An Endpoint -> 1. Creating A Test Endpoint`. Once the test method has succeeded, you no longer need to use it.

### `webhookEvents()`

This method receives the ClickFunnels data and stores it in the `purchases` table. Then it pushes each product purchase to a custom Sendy email list. So if you have 20 products, you will have 20 email lists -- one for each product.
<br>

## More Info:

[help.clickfunnels.com - Creating a Webhook](https://help.clickfunnels.com/hc/en-us/articles/360039820293-Webhooks-in-ClickFunnels)

[Sendy -- Self-hosted Email List Manager](https://sendy.co/)


