import db from '../database/knex.cjs'
import { schema } from '../../validation/schemas/purchaseSchema'
import { validate, joiResponse } from '../../validation/JoiValidate'
import { subscribe } from '../utilities/sendyApi'
import md5 from 'md5'
import { promises as fs } from 'fs'
import consola from 'consola'
import Try from '../../helpers/tryCatch'

/**
 * Test Clickfunnels Webhook
 */
export async function test(req, res) {
  /** Get current time in UTC with this format: 'YYYY-MM-DD HH:MM:SS UTC' */
  const dateUTC = new Date()
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '')
    .concat(' UTC')

  /** Create MD5 hash for header as ClickFunnels requires */
  const md5hash = md5(`https://olbworld.org/webhook_events ${dateUTC}`)

  consola.info({ message: `Test body received = ${JSON.stringify(req.body)}` })
  consola.info({
    message: `Test params received = ${JSON.stringify(req.params)}`,
  })

  /** Set headers as ClickFunnels requires */
  res.header({
    'content-type': 'application/json',
    'X-Clickfunnels-Webhook-Delivery-Id': md5hash,
  })

  /** Return "HTTP message body" in the format that ClickFunnels requires */
  return res.status(200).json({ time: dateUTC })
}

/**
 * Capture incoming Clickfunnels webhook events
 */
export async function webhookEvents(req, res) {
  res.sendStatus(200)

  /** --- Handle purchase records */

  if ('status' in req.body) {
    /** Sanitize and validate status input */
    /** @var {Array} - [vErr false || {object}, v {object} || false] */
    const [vErr, v] = validate(
      'id, status, event, created_at, updated_at',
      req.body,
      schema
    )

    /** Error: Invalid input */
    if (vErr || !v) {
      /** do something */
      consola.error({
        message: `Joi 'status' validation failed: ${JSON.stringify(
          joiResponse(vErr)
        )}`,
        badge: true,
      })
      return
    }

    /** --- Handle PAID purchase records */

    if (v.status === 'paid') {
      /** Sanitize and validate id, first_name & last_name input */
      /** @var {Object} v1 - v[inputValues] or v.err */
      const [v1Err, v1] = validate(
        `id, first_name, last_name`,
        req.body.contact.contact_profile,
        schema
      )

      /** Error: Invalid input */
      if (v1Err || !v1) {
        consola.error({
          message: `Joi Contact validation failed: ${JSON.stringify(
            joiResponse(v1Err)
          )}`,
          badge: true,
        })
        return
      }

      /** Add 'optin' & 'promo_code' custom keys if they do not exist */
      if (!('optin' in req.body.contact)) {
        req.body.contact.optin = ''
      }
      if (!('promo_code' in req.body.contact)) {
        req.body.contact.promo_code = ''
      }

      /** Sanitize and validate Contact input */
      /** @var {Array} - [v2Err false || {object}, v2 {object} || false] */
      const [v2Err, v2] = validate(
        `ip, funnel_id, funnel_step_id, shipping_address, shipping_city,
        shipping_country, shipping_state, shipping_zip, vat_number, email,
        phone, optin, promo_code`,
        req.body.contact,
        schema
      )

      /** Error: Invalid input */
      if (v2Err || !v2) {
        consola.error({
          message: `Joi Contact validation failed: ${JSON.stringify(
            joiResponse(v2Err)
          )}`,
          badge: true,
        })
        return
      }

      /** Initialize user data */
      let contact = {
        contact_id: v1.id,
        ip: v2.ip,
        funnel_id: v2.funnel_id,
        funnel_step_id: v2.funnel_step_id,
        first_name: v1.first_name,
        last_name: v1.last_name,
        name: `${v1.first_name} ${v1.last_name}`,
        shipping_address: v2.shipping_address,
        shipping_city: v2.shipping_city,
        shipping_country: v2.shipping_country,
        shipping_state: v2.shipping_state,
        shipping_zip: v2.shipping_zip,
        vat_number: v2.vat_number,
        email: v2.email,
        phone: v2.phone,
        optin: v2.optin,
        status: v.status,
        event: v.event,
        created_at: v.created_at,
        updated_at: v.updated_at,
        received_at: new Date().toISOString(),
      }

      /** --- Loop through products */

      for (const product of req.body.products) {
        /** Sanitize and validate Product input */
        /** @var {Array} - [v3Err false || {object}, v3 {object} || false] */
        const [v3Err, v3] = validate(
          `id, name, bump, billing_integration`,
          product,
          schema
        )

        /** Error: Invalid input */
        if (v3Err || !v3) {
          consola.error({
            message: `Joi Product validation failed: ${JSON.stringify(
              joiResponse(v3Err)
            )}`,
            badge: true,
          })
          continue
        }

        /** Sanitize and validate cents & currency_iso input */
        /** @var {Array} - [v4Err false || {object}, v4 {object} || false] */
        const [v4Err, v4] = validate(
          `cents, currency_iso`,
          product.amount,
          schema
        )

        /** Error: Invalid input */
        if (v4Err || !v4) {
          consola.error({
            message: `Joi cents/currency_iso validation failed: ${JSON.stringify(
              joiResponse(v4Err)
            )}`,
            badge: true,
          })
          continue
        }

        /** Parse product quantity from product name (ex. 'Puzzle Set x4') */
        let quantity = 1
        let xValue = v3.name.indexOf(' x')
        if (xValue > -1) {
          quantity = parseInt(v3.name.slice(xValue + 2, v3.name.length))
        }

        /** Initialize purchase data */
        let purchase = {
          purchase_id: v.id,
          product_id: v3.id,
          product_name: v3.name,
          quantity: quantity,
          cents: v4.cents,
          currency_iso: v4.currency_iso,
          bump: v3.bump,
          billing_integration: v3.billing_integration,
          promo_code: v2.promo_code,
        }

        /** --- Check if (purchase_id / product_id) combo are unique */

        /** Check db for purchase_id & product_id */
        /** @var {Array} r - row data from db */
        const [err, r] = await Try(
          db
            .knex('purchases')
            .select('*')
            .where({ purchase_id: v.id, product_id: v3.id })
        )

        /** Error: DB error */
        if (err) {
          consola.error({
            message: `DB Error while checking purchase_id / product_id: ${err}`,
            badge: true,
          })
          continue
        }

        /** Error: record is already in db */
        if (r.length > 0) {
          consola.info({
            message: `Duplicate order! Original date=${
              r[0].created_at
            }; Original id=${r[0].id}, 
            Duplicate date=${v.created_at}, 
            Duplicate Product=${JSON.stringify(purchase)}`,
            badge: true,
          })
          continue
        }

        /** --- Save new purchase record */

        const purchase_record = { ...contact, ...purchase }

        /** Save purchase_record in db */
        /** @var {Array} r2 - row data returned from db */
        const [err2, r2] = await Try(
          db.knex('purchases').insert(purchase_record)
        )

        /** Error: db error */
        if (err2) {
          consola.error({
            message: `DB Error while saving purchase_record`,
            badge: true,
          })
          continue
        }

        /** Error: Nothing inserted in db */
        if (r2 === undefined) {
          consola.error({
            message: `DB Error - nothing inserted, while saving purchase_record`,
            badge: true,
          })
          continue
        }

        /** --- Push product/contact to Sendy List:[product_name] */

        /** Get ListID from products db */

        /** @var {Array} r - row data from db */
        const [err3, r3] = await Try(
          db.knex('products').select('sendy_id').where('clickfunnels_id', v3.id)
        )

        /** Error: DB error */
        if (err3) {
          consola.error({
            message: `DB Error while getting clickfunnels_id from 'products': ${err3}`,
            badge: true,
          })
          continue
        }

        /** Error: No sendy_id found in db */
        if (r3.length < 1) {
          consola.error({
            message: `No sendy_id found for clickfunnels_id = ${v3.id} in 'products' db.`,
            badge: true,
          })
          continue
        }

        /** --- Add/update Sendy list */

        subscribe(r3[0].sendy_id, {
          name: `${v1.first_name} ${v1.last_name}`,
          first_name: v1.first_name,
          email: v2.email,
          ipaddress: v2.ip,
          city: v2.shipping_city,
          state: v2.shipping_state,
          country: v2.shipping_country,
          optin: v2.optin,
        })
      }
      return
    }

    /** --- 'status' exists but is not 'paid'. */

    /** Push data to file for manual review */
    /** @var {Undefined} r - If no error, undefined is expected. */
    const [err4, r4] = await Try(
      fs.appendFile(
        './files/funnelData.log',
        `STATUS=${v.status} DATA: ${JSON.stringify(req.body, 0, 4)}/n`
      )
    )
    /** Error: File write error */
    if (err4) {
      consola.error(`Error opening file funnelData.log: ${err4.message}`)
      return
    }

    if (r4 === undefined) {
      consola.info({
        message: `STATUS=${v.status} DATA: ${JSON.stringify(req.body, 0, 4)}`,
        badge: true,
      })
    }
    return
  }

  /** --- Not a purchase. Currently we do nothing. */
  consola.info({
    message: `DATA is not a purchase! - No 'status' field received.`,
    badge: true,
  })
  return
}
