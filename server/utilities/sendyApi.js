import axios from 'axios'
import consola from 'consola'
import { promises as fs } from 'fs'
import Try from '../../helpers/tryCatch'

/**
 * Add/update subscriber for Sendy List
 *
 * @param  {String} listID - The Sendy email list ID for the product.
 * @param  {Object} params - All the params for the Sendy email list:
 *                           name, email, ipaddress, country, city, state,
 *                           first_name, optin
 * @return {void}
 */
export async function subscribe(listID, params) {
  /** --- prepare data as x-www-form-urlencoded */

  /** Sendy requires at minimum: api_key, list, email
   * Custom fields are: city, state, first_name and optin
   */
  const data = new URLSearchParams()
  data.append('api_key', 'Pdrnx4BFgGdEap0KIHxM')
  data.append('list', listID)
  /** Standard fields */
  data.append('name', params.name)
  data.append('email', params.email)
  data.append('country', params.country)
  /** Single-optin if true */
  data.append('silent', true)
  /** Plain text response if 'true' */
  data.append('boolean', true)
  /** Custom fields */
  data.append('city', params.city)
  data.append('state', params.state)
  data.append('first_name', params.first_name)
  data.append('optin', params.optin)

  /** Subscribe/update the user to the list */
  const [err, res] = await Try(
    axios.post('https://email.olbworld.org/subscribe', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
      },
    })
  )

  /** Error: Axios */
  if (err || !res) {
    consola.error({
      message: `AXIOS sendy subscribe failed: ${err}`,
      badge: true,
    })
    return
  }

  /**
   * res.data: Possible Sendy return values
   * --------------------------------------
   * - 1 (OK)
   * - Some fields are missing.
   * - API key not passed
   * - Invalid API key
   * - Invalid email address.
   * - Already subscribed.
   * - Bounced email address.
   * - Email is suppressed.
   * - Invalid list ID.
   */

  if (res.data !== 1) {
    /** Log any errors */
    consola.info({
      message: `SENDY: ${res.data} ListID: ${listID}, name: ${params.name}, email: ${params.email}\n`,
      badge: true,
    })

    /** @var {Undefined} r - If no error, undefined is expected. */
    const [err, r] = await Try(
      fs.appendFile(
        './files/sendyErrors.log',
        `SENDY: ${res.data} ListID: ${listID}, name: ${params.name}, email: ${params.email}\n`
      )
    )

    /** Error: File write error */
    if (err || r !== undefined) {
      consola.error({
        message: `Error opening file sendyErrors.log: ${err.message}\n`,
        badge: true,
      })
      return
    }
  }
}
