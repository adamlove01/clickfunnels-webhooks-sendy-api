import db from '../database/knex.cjs'
import { schema } from '../../validation/schemas/productSchema'
import { validate, response, joiResponse } from '../../validation/JoiValidate'
import consola from 'consola'
import Try from '../../helpers/tryCatch'

/** Create new product */
export async function create(req, res) {
  /** --- Validate input */

  /** Sanitize and validate product input */
  /** @var {Array} - [vErr false || {object}, v {object} || false] */
  const [vErr, v] = validate(
    `product_name,
    clickfunnels_id,
    sendy_id,
    aliexpress_id,
    aliexpress_color,
    aliexpress_url,
    quantity,
    description,
    status`,
    req.body,
    schema
  )

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** --- Check if clickfunnels_id is unique */

  /** Check db for clickfunnels_id */
  /** @var {Array} r - row data from db */
  const [err, r] = await Try(
    db
      .knex('products')
      .select('*')
      .where({ clickfunnels_id: v.clickfunnels_id })
  )

  /** Error: DB error */
  if (err) {
    consola.error({
      message: `DB Error while checking clickfunnels_id: ${err}`,
      badge: true,
    })
    return
  }

  /** Error: clickfunnels_id already exists */
  if (r.length > 0) return res.json(response('error, clickfunnels ID, exists'))

  /** --- Save new product */

  const dateString = new Date().toISOString()
  v.created_at = dateString
  v.updated_at = dateString

  /** Save product in db */
  /** @var {Array} r2 - row data returned from db */
  const [err2, r2] = await Try(db.knex('products').insert(v))

  /** Error: db error */
  if (err2) return res.json(response('error, product, errorCreating', err2))

  /** Error: Nothing inserted in db */
  if (r2 === undefined)
    return res.json(response('error, product, errorCreating'))

  /** --- Success */

  /** Return message to client */
  return res.json(response('success, product, created', r2))
}

/** Read all products */
export async function read(req, res) {
  /** --- Read products */

  /** Read all products in db */
  /** @var {Array} rows - all product rows in db */
  const [err, rows] = await Try(db.knex('products').select('*'))

  /** Error: db error */
  if (err) res.json(response('error, products, errorReading'))

  /** Error: No products found */
  if (rows.length < 1) return res.json(response('info, products, noneInList'))

  /** --- Success */

  /** Return all v to client */
  return res.json(response('success, products, read', rows))
}

/** Update a products */
export async function update(req, res) {
  /** --- Validate input */

  /** Sanitize and validate product input */
  /** @var {Array} - [vErr false || {object}, v {object} || false] */
  const [vErr, v] = validate(
    `id,
    product_name,
    clickfunnels_id,
    sendy_id,
    aliexpress_id,
    aliexpress_color,
    aliexpress_url,
    quantity,
    description,
    status`,
    req.body,
    schema
  )

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** Create timestamp for update */
  const dateISO = new Date().toISOString()
  v.updated_at = dateISO

  /** Update product in db */
  /** @var {Array} row.data - product row returned from db  */
  const [err2, row] = await Try(
    db.knex('products').update(v, ['id']).where('id', v.id)
  )

  /** Error: db error */
  if (err2) {
    return res.json(response('error, product, errorUpdating'))
  }

  /** Error: Nothing inserted in db */
  if (row === undefined) return res.json(response('error, product, notFound'))

  /** --- Success */

  /** Return message to client */
  return res.json(response('success, product, updated', row[0]))
}

/** Delete a product */
export async function del(req, res) {
  /** --- Validate input */

  /** Sanitize and validate product ID */
  /** Key @var {Object} v - v[inputValues] or v.err */
  const [vErr, v] = validate('id', req.params, schema)

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** --- Delete product */

  /** Delete product in db */
  /** @var {Number} r - number of rows deleted */
  const [err, count] = await Try(db.knex('products').delete().where('id', v.id))

  /** Error: db error */
  if (err) res.json(response('error, product, errorDeleting'))

  /** Error: no product deleted */
  if (count < 1) return res.json(response('error, product, notFoundDeleted'))

  /** --- Success */

  /** Return message to the client */
  return res.json(response('success, product, deleted', count))
}
