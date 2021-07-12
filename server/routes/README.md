# Routes

All files in the `/routes` directory define ExpressJS server routes for the project. The `/server/authorization/authorize` function and `/server/controller` functions are called for each route. All of these routes are pulled into express in the `/server/express.js` file. 

While Express has acces to the root of the server `/` in this project, all server routes should begin with `/server/...` to prevent collision with client-side routes. 

The only exception is the ClickFunnels API routes `/funnel_webhooks/test` and `/webhook_events`, which are **required by ClickFunnels** to be at the root of the server.


## captchaRoutes.js
This route generates a text or math captcha and returns the data to the client. It is used on the `/login` form. The captcha appears only if the user enters an invalid password.

## productRoutes.js
CRUD for the `products` table.

## purchaseRoutes.js
CRUD for the `purchases` table.

## userRoutes.js
CRUD, login, logout, register, verify and authorize for the `users` table.

## webhookRoutes.js
`/funnel_webhooks/test` and `/webhook_events` are for the ClickFunnels webhooks API. 

Note that all these two routes do not start with `/server` because ClickFunnels requires them to be at the root of the project. 

## More Info

[Expressjs.com - Routing](https://expressjs.com/en/guide/routing.html)

[Npmjs.com - SVG Captcha](https://www.npmjs.com/package/svg-captcha)