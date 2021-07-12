import Joi from 'joi'
import { msg } from '../JoiMessages'
import html from '../sanitizeHtml'
import { tlds } from '../tlds'

/**
 * Funnel validation Schema
 *
 * Note that 'empty()' will trigger before 'required()' so we need a separate
 * trigger and message for it.
 */
export const schema = {
  id: Joi.number()
    .integer()
    .required()
    .greater(0)
    .less(2147483647)
    .messages(msg('id', 'number', ['integer', 'required', 'greater', 'less'])),
  purchase_id: Joi.number()
    .integer()
    .less(2147483647)
    .messages(msg('purchase_id', 'number', ['integer', 'less'])),

  product_id: Joi.number()
    .integer()
    .less(2147483647)
    .messages(msg('product_id', 'number', ['integer', 'less'])),
  product_name: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('product_name', 'string', ['max'])),
  quantity: Joi.number()
    .integer()
    .less(2147483647)
    .messages(msg('quantity', 'number', ['integer', 'less'])),
  cents: Joi.number()
    .integer()
    .less(2147483647)
    .messages(msg('cents', 'number', ['integer', 'less'])),
  currency_iso: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('currency_iso', 'string', ['max'])),
  bump: Joi.boolean().messages(msg('bump', 'boolean')),
  billing_integration: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('billing_integration', 'string', ['max'])),

  contact_id: Joi.number()
    .integer()
    .less(2147483647)
    .messages(msg('contact_id', 'number', ['integer', 'less'])),
  first_name: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('first_name', 'string', ['max'])),
  last_name: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('last_name', 'string', ['max'])),
  name: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('name', 'string', ['max'])),
  email: Joi.string()
    .custom(html.removeAll)
    .trim()
    .lowercase()
    .email({ tlds: { allow: tlds } })
    .max(255)
    .allow('')
    .messages(msg('email', 'string', ['email', 'max'])),
  phone: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('phone', 'string', ['max'])),
  ip: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('ip', 'string', ['max'])),
  funnel_id: Joi.number()
    .integer()
    .less(2147483647)
    .messages(msg('funnel_id', 'number', ['integer', 'less'])),
  funnel_step_id: Joi.number()
    .integer()
    .less(2147483647)
    .messages(msg('funnel_step_id', 'number', ['integer', 'less'])),
  shipping_address: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('shipping_address', 'string', ['max'])),
  shipping_city: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('shipping_city', 'string', ['max'])),
  shipping_country: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('shipping_country', 'string', ['max'])),
  shipping_state: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('shipping_state', 'string', ['max'])),
  shipping_zip: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('shipping_zip', 'string', ['max'])),
  vat_number: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('vat_number', 'string', ['max'])),

  action_id: Joi.number()
    .integer()
    .less(2147483647)
    .messages(msg('purchase_id', 'number', ['integer', 'less'])),
  status: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('status', 'string', ['max'])),
  event: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('event', 'string', ['max'])),

  promo_code: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('promo_code', 'string', ['max'])),
  optin: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('optin', 'string', ['max'])),

  created_at: Joi.date().iso().messages(msg('created_at', 'date')),
  updated_at: Joi.date().iso().messages(msg('updated_at', 'date')),
  received_at: Joi.date()
    .iso()
    .required()
    .empty()
    .messages(msg('received_at', 'date', ['required', 'empty'])),
}
