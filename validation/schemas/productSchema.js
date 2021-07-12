import Joi from 'joi'
import { msg } from '../JoiMessages'
import html from '../sanitizeHtml'

/**
 * Product validation Schema
 *
 * Note that 'empty()' will trigger before 'required()' so we need a separate
 * trigger and message for it.
 *
 * For .email(): We are validating TLDs (top-level domains) but you can turn
 * this off if you wish, like this: .email({ tlds: { allow: false } })
 * Adding TLD validation means ~20kb added to page load on the client side.
 *
 */
export const schema = {
  id: Joi.number()
    .integer()
    .required()
    .greater(0)
    .less(2147483647)
    .messages(msg('id', 'number', ['integer', 'required', 'greater', 'less'])),
  product_name: Joi.string()
    .custom(html.removeAll)
    .trim()
    .required()
    .empty()
    .min(2)
    .max(255)
    .messages(
      msg('product_name', 'string', ['required', 'empty', 'min', 'max'])
    ),
  clickfunnels_id: Joi.number()
    .integer()
    .required()
    .less(2147483647)
    .messages(
      msg('clickfunnels_id', 'number', ['integer', 'required', 'less'])
    ),
  sendy_id: Joi.string()
    .custom(html.removeAll)
    .trim()
    .required()
    .empty()
    .max(255)
    .allow('')
    .messages(msg('sendy_id', 'string', ['required', 'empty', 'max'])),
  aliexpress_id: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('aliexpress_id', 'string', ['max'])),
  aliexpress_color: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('aliexpress_color', 'string', ['max'])),
  aliexpress_url: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('aliexpress_url', 'string', ['max'])),
  quantity: Joi.number()
    .integer()
    .required()
    .less(2147483647)
    .messages(msg('quantity', 'number', ['integer', 'required', 'less'])),
  description: Joi.string()
    .custom(html.removeAll)
    .trim()
    .max(255)
    .allow('')
    .messages(msg('description', 'string', ['max'])),
  status: Joi.string()
    .trim()
    .required()
    .empty()
    .valid('active', 'unavailable')
    .messages(msg('status', 'string', ['required', 'empty', 'valid'])),
  created_at: Joi.date()
    .iso()
    .required()
    .empty()
    .messages(msg('created_at', 'date', ['required', 'empty'])),
  updated_at: Joi.date()
    .iso()
    .required()
    .empty()
    .messages(msg('updated_at', 'date', ['required', 'empty'])),
}
