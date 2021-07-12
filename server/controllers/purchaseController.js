import db from '../database/knex.cjs'
import { schema } from '../../validation/schemas/purchaseSchema'
import { validate, response, joiResponse } from '../../validation/JoiValidate'
import consola from 'consola'
import Try from '../../helpers/tryCatch'

/** Register purchase */
export async function create(req, res) {
  /** --- Validate input */

  /** Sanitize and validate purchase input */
  /** @var {Array} - [vErr false || {object}, v {object} || false] */
  const [vErr, v] = validate(
    `contact_id,
    ip,
    funnel_id,
    funnel_step_id,
    first_name,
    last_name,
    name,
    shipping_address,
    shipping_city,
    shipping_country,
    shipping_state,
    shipping_zip,
    vat_number,
    email,
    phone,
    optin,
    status,
    event,
    purchase_id,
    product_id,
    product_name,
    quantity,
    cents,
    currency_iso,
    bump,
    billing_integration,
    promo_code`,
    req.body,
    schema
  )

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** --- Check if (purchase_id / product_id) combo are unique */

  /** Check db for purchase_id & product_id */
  /** @var {Array} r - row data from db */
  const [err, r] = await Try(
    db
      .knex('purchases')
      .select('*')
      .where({ purchase_id: v.purchase_id, product_id: v.product_id })
  )

  /** Error: DB error */
  if (err) {
    consola.error({
      message: `DB Error while checking purchase_id / product_id: ${err}`,
      badge: true,
    })
    return
  }

  /** Error: purchase record already exists */
  if (r.length > 0) return res.json(response('error, purchase record, exists'))

  /** --- Save new purchase */

  const dateString = new Date().toISOString()
  v.created_at = dateString
  v.updated_at = dateString
  v.received_at = dateString

  /** Save purchase in db */
  /** @var {Array} r2 - row data returned from db */
  const [err2, r2] = await Try(db.knex('purchases').insert(v))

  /** Error: db error */
  if (err2) return res.json(response('error, purchase, errorCreating', err2))

  /** Error: Nothing inserted in db */
  if (r2 === undefined)
    return res.json(response('error, purchase, errorCreating'))

  /** --- Success */

  /** Return message to client */
  return res.json(response('success, purchase, created', r2))
}

/** Read all purchases */
export async function read(req, res) {
  /** --- Read purchases */

  /** Read all purchases in db */
  /** @var {Array} rows - all purchase rows in db */
  const [err, rows] = await Try(db.knex('purchases').select('*'))

  /** Error: db error */
  if (err) res.json(response('error, purchases, errorReading'))

  /** Error: No purchases found */
  if (rows.length < 1) return res.json(response('info, purchases, noneInList'))

  /** --- Success */

  /** Return all purchases to client */
  return res.json(response('success, purchases, read', rows))
}

/** Update a purchase */
export async function update(req, res) {
  /** --- Validate input */

  /** Sanitize and validate purchase input */
  /** @var {Array} - [vErr false || {object}, v {object} || false] */
  const [vErr, v] = validate(
    `id,
    contact_id,
    ip,
    funnel_id,
    funnel_step_id,
    first_name,
    last_name,
    name,
    shipping_address,
    shipping_city,
    shipping_country,
    shipping_state,
    shipping_zip,
    vat_number,
    email,
    phone,
    optin,
    status,
    event,
    created_at,
    updated_at,
    received_at,
    purchase_id,
    product_id,
    product_name,
    quantity,
    cents,
    currency_iso,
    bump,
    billing_integration,
    promo_code`,
    req.body,
    schema
  )

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** Update purchase in db */
  /** @var {Array} row.data - purchase row returned from db  */
  const [err2, row] = await Try(
    db.knex('purchases').update(v, ['email']).where('id', v.id)
  )

  /** Error: db error */
  if (err2) {
    return res.json(response('error, purchase, errorUpdating'))
  }

  /** Error: Nothing inserted in db */
  if (row === undefined) return res.json(response('error, purchase, notFound'))

  /** --- Success */

  /** Return message to client */
  return res.json(response('success, purchase, updated', row[0]))
}

/** Delete a purchase */
export async function del(req, res) {
  /** --- Validate input */

  /** Sanitize and validate purchase ID */
  /** Key @var {Object} v - v[inputValues] or v.err */
  const [vErr, v] = validate('id', req.params, schema)

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** --- Delete purchase */

  /** Delete purchase in db */
  /** @var {Number} r - number of rows deleted */
  const [err, count] = await Try(
    db.knex('purchases').delete().where('id', v.id)
  )

  /** Error: db error */
  if (err) res.json(response('error, purchase, errorDeleting'))

  /** Error: no purchase deleted */
  if (count < 1) return res.json(response('error, purchase, notFoundDeleted'))

  /** --- Success */

  /** Return message to the client */
  return res.json(response('success, purchase, deleted', count))
}
