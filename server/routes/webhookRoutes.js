import { Router } from 'express'
import { test, webhookEvents } from '../controllers/webhookController'

const webhookRoutes = Router()

/** Route for testing - required by ClickFunnels */
webhookRoutes.post('/funnel_webhooks/test', test)
/** Listen for Purchases */
webhookRoutes.post('/webhook_events', webhookEvents)

export { webhookRoutes }
