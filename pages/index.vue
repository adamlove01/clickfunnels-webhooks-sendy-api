<template>
  <div>
    <SectionHero
      hero-title="ClickFunnels WebHooks"
      title="and Sendy API"
      background-image="/img/bg_sunset.jpg"
    ></SectionHero>
    <SectionTechnology
      title="Built with the latest technology."
      button-text="Learn More"
      :cards="sectionTechnologyCards"
      background-image="/img/bg_white_geometric.jpg"
    ></SectionTechnology>
    <SectionBenefitsIcons
      :cards="sectionBenefitsIconsCards"
    ></SectionBenefitsIcons>
    <SectionBenefits
      title="Production-ready security you can trust."
      sub-title="You need a stable, reliable website that won't be hacked two days after launch. We've got you covered."
      background-image="/img/bg_white_parchment.jpg"
      :cards="sectionBenefitsCards"
    ></SectionBenefits>

    <v-snackbar v-model="sb.open" top rounded :color="sb.color">
      {{ sb.text }}
      <template #action="{ attrs }">
        <v-btn
          color="#ddd"
          text
          min-width="30px"
          class="body-1"
          v-bind="attrs"
          @click="sb.open = false"
        >
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  middleware: 'authorize',

  data() {
    return {
      sectionTechnologyCards: [
        {
          title: 'Nuxt.js',
          subTitle: 'A popular framework for creating Vue.js applications.',
          image: '/img/logo-nuxt.png',
          href: 'https://nuxtjs.org/',
        },
        {
          title: 'Express',
          subTitle: 'The Node.js server framework you know and love.',
          image: '/img/logo-expressjs.png',
          href: 'https://expressjs.com/',
        },
        {
          title: 'Vuetify',
          subTitle: 'The Material Design CSS framework for fantastic UI/UX.',
          image: '/img/logo-vuetify.png',
          href: 'https://vuetifyjs.com/en/',
        },
        {
          title: 'Knex.js',
          subTitle:
            'The awesome SQL query builder for Postgres, MariaDB & more.',
          image: '/img/logo-knex.png',
          href: 'http://knexjs.org/',
        },
        {
          title: 'Joi Validation',
          subTitle: 'The most powerful data validation library for Javascript.',
          image: '/img/logo-joi.png',
          href: 'https://joi.dev/api/?v=17.4.0',
        },
        {
          title: 'Node ES Modules',
          subTitle: 'Share code between the Vue client and the Express server!',
          image: '/img/logo-node+esm.png',
          href: 'https://blog.logrocket.com/es-modules-in-node-today/',
        },
      ],

      sectionBenefitsIconsCards: [
        {
          title: 'Professional UI',
          subTitle: 'Trendy design and user-friendly interface',
          icon: 'mdi-gesture-double-tap',
          iconColor: 'blue',
        },
        {
          title: 'Mobile-friendly Nav',
          subTitle: 'Adjusts to any screen size with nice menus',
          icon: 'mdi-cellphone-text',
          iconColor: 'orange darken-1',
        },
        {
          title: 'Well Documented',
          subTitle: 'Heavily-commented code and READMEs for every file',
          icon: 'mdi-text-box-check-outline',
          iconColor: 'green accent-4',
        },
      ],

      sectionBenefitsCards: [
        {
          title: 'Helmet.js',
          subTitle: `Adds security-related HTTP response headers to prevent 
            attacks like ClickJacking, sniffing attacks and more.`,
        },
        {
          title: 'Content Security Policy (CSP)',
          subTitle: `An added layer of security that helps to detect and 
            mitigate certain types of attacks, including Cross Site Scripting 
            (XSS) and data injection.`,
        },
        {
          title: 'Sanitized & Validated input',
          subTitle: `All input on both the client and server is sanitized & 
            validated using the powerful Joi validation and sanitize-html libraries.`,
        },
        {
          title: 'Login Captcha',
          subTitle: `SVG Captcha prevents bots from spamming your login page. 
            The captcha randomly shows text or a math problem to keep bots 
            guessing.`,
        },
        {
          title: 'User Access List',
          subTitle: `Controls access to all pages and routes based on user type.
            You can change access rules for any page or server route from 
            a single file.`,
        },
        {
          title: 'Secure JSON WebTokens',
          subTitle: `Uses JWT to verify login. The accessToken is 
          stored in memory (VUEX) and the refreshToken is HttpOnly with 
          'expires' and 'sameSite' flags.`,
        },
      ],

      sb: { open: false, color: 'success', text: '' },
    }
  },

  mounted() {
    if (this.$route.query.login === 'yes') {
      this.sb.color = 'success'
      this.sb.text = 'You are signed in.'
      return (this.sb.open = true)
    }
    if (this.$route.query.logout === 'yes') {
      this.sb.color = 'success'
      this.sb.text = 'You are signed out.'
      return (this.sb.open = true)
    }
    if (this.$route.query.logout === 'error') {
      this.sb.color = 'error'
      this.sb.text = 'Sign-out error. Please try again.'
      return (this.sb.open = true)
    }
  },

  // methods: {
  //   async funnelTest() {
  //     /** Log in the user */
  //     const [err, res] = await Try(
  //       this.$axios.post('/funnel_webhooks/test', {
  //         email: 'meow',
  //         password: 'password123',
  //       })
  //     )

  //     /** Error: Axios */
  //     if (err || !res.data)
  //       return (this.errors.other = `Error while signing in.
  //        Please try again later.`)

  //     /** @var {Object} r - r.status, r.message, r[other] from server */
  //     const r = res.data
  //     return console.log(`Funnel Test=${JSON.stringify(r)}`)
  //   },

  //   async webhookEvents() {
  //     /** Test webhook_events route */
  //     const [err, res] = await Try(
  //       this.$axios.post('/webhook_events', {
  //         id: 82320158,
  //         products: [
  //           {
  //             id: 3199902,
  //             name: '40PC Puzzle x2',
  //             stripe_plan: null,
  //             amount: {
  //               cents: 1797,
  //               currency_iso: 'USD',
  //             },
  //             amount_currency: 'USD',
  //             created_at: '2020-11-17T15:58:24.000Z',
  //             updated_at: '2021-04-28T15:26:47.000Z',
  //             subject: '',
  //             html_body:
  //               '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">\r\n\r\n',
  //             thank_you_page_id: 60290105,
  //             stripe_cancel_after_payments: null,
  //             bump: false,
  //             cart_product_id: null,
  //             billing_integration: 'stripe_account-192284',
  //             infusionsoft_product_id: null,
  //             infusionsoft_subscription_id: null,
  //             ontraport_product_id: null,
  //             ontraport_payment_count: null,
  //             ontraport_payment_type: null,
  //             ontraport_unit: null,
  //             ontraport_gateway_id: null,
  //             ontraport_invoice_id: null,
  //             commissionable: false,
  //             statement_descriptor: '',
  //             netsuite_id: null,
  //             netsuite_tag: null,
  //             netsuite_class: null,
  //           },
  //           {
  //             id: 3205239,
  //             name: 'Moon Stacking Game',
  //             stripe_plan: null,
  //             amount: {
  //               cents: 1797,
  //               currency_iso: 'USD',
  //             },
  //             amount_currency: 'USD',
  //             created_at: '2020-11-19T15:31:10.000Z',
  //             updated_at: '2021-01-11T17:04:18.000Z',
  //             subject: '',
  //             html_body:
  //               '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">\r\n\r\n',
  //             thank_you_page_id: 60366007,
  //             stripe_cancel_after_payments: null,
  //             bump: true,
  //             cart_product_id: null,
  //             billing_integration: 'stripe_account-192284',
  //             infusionsoft_product_id: null,
  //             infusionsoft_subscription_id: null,
  //             ontraport_product_id: null,
  //             ontraport_payment_count: null,
  //             ontraport_payment_type: null,
  //             ontraport_unit: null,
  //             ontraport_gateway_id: null,
  //             ontraport_invoice_id: null,
  //             commissionable: false,
  //             statement_descriptor: '',
  //             netsuite_id: null,
  //             netsuite_tag: null,
  //             netsuite_class: null,
  //           },
  //         ],
  //         member_id: null,
  //         contact: {
  //           id: 1703170260,
  //           page_id: 44519065,
  //           first_name: 'Happy',
  //           last_name: 'test',
  //           name: 'Happy test',
  //           address: '1 Happy Road',
  //           city: 'Happy City',
  //           country: 'US',
  //           state: 'MI',
  //           zip: '12345',
  //           email: 'adam@adamlove.ca',
  //           phone: '',
  //           webinar_at: null,
  //           webinar_last_time: null,
  //           webinar_ext: 'Wo0dVTQx',
  //           created_at: '2021-05-13T17:16:20.000Z',
  //           updated_at: '2021-05-13T17:16:34.000Z',
  //           ip: '2.57.169.247',
  //           funnel_id: 10173108,
  //           funnel_step_id: 60139298,
  //           unsubscribed_at: null,
  //           cf_uvid: 'null',
  //           cart_affiliate_id: '',
  //           shipping_address: '1 Happy Road',
  //           shipping_city: 'Happy City',
  //           shipping_country: 'US',
  //           shipping_state: 'MI',
  //           shipping_zip: '12345',
  //           vat_number: '',
  //           affiliate_id: null,
  //           aff_sub: null,
  //           aff_sub2: null,
  //           cf_affiliate_id: null,
  //           contact_profile: {
  //             id: 676048058,
  //             first_name: 'Happy',
  //             last_name: 'test',
  //             address: '1 Happy Road',
  //             city: 'Happy City',
  //             country: 'US',
  //             state: 'MI',
  //             zip: '12345',
  //             email: 'adam@adamlove.ca',
  //             phone: null,
  //             created_at: '2020-09-23T19:43:26.000Z',
  //             updated_at: '2021-05-13T17:16:20.000Z',
  //             unsubscribed_at: null,
  //             cf_uvid: '5fb2be50be7ae53129ff3d340e4fecf3',
  //             shipping_address: '1 Happy Road',
  //             shipping_country: 'US',
  //             shipping_city: 'Happy City',
  //             shipping_state: 'MI',
  //             shipping_zip: '12345',
  //             vat_number: null,
  //             middle_name: null,
  //             websites: null,
  //             location_general: null,
  //             normalized_location: null,
  //             deduced_location: null,
  //             age: null,
  //             gender: null,
  //             age_range_lower: null,
  //             age_range_upper: null,
  //             action_score: 50,
  //             known_ltv: '476.28',
  //             tags: [],
  //           },
  //           additional_info: {
  //             cf_affiliate_id: '',
  //             time_zone: null,
  //             utm_source: '',
  //             utm_medium: '',
  //             utm_campaign: '',
  //             utm_term: '',
  //             utm_content: '',
  //             cf_uvid: 'null',
  //             webinar_delay: '-63788126212862',
  //             purchase: {
  //               product_ids: ['3199902', '3205239'],
  //               payment_method_nonce: '',
  //               order_saas_url: '',
  //               stripe_customer_token: 'pm_1Iqi90CSANHPqVleDOlbtdct',
  //             },
  //             optin: 'yes',
  //           },
  //           time_zone: null,
  //           optin: 'yes',
  //         },
  //         funnel_id: 10173108,
  //         stripe_customer_token: 'pm_1Iqi90CSANHPqVleDOlbtdct',
  //         created_at: '2021-05-13T17:16:21.000Z',
  //         updated_at: '2021-05-13T17:16:21.000Z',
  //         subscription_id: null,
  //         charge_id: 'pi_1Iqi94CSANHPqVlet09rLjfd',
  //         ctransreceipt: null,
  //         status: 'paid',
  //         fulfillment_status: null,
  //         fulfillment_id: null,
  //         fulfillments: {},
  //         payments_count: null,
  //         infusionsoft_ccid: null,
  //         oap_customer_id: null,
  //         payment_instrument_type: null,
  //         original_amount_cents: 3594,
  //         original_amount: {
  //           cents: 3594,
  //           currency_iso: 'USD',
  //         },
  //         original_amount_currency: 'USD',
  //         manual: false,
  //         error_message: null,
  //         nmi_customer_vault_id: null,
  //         event: 'updated',
  //       })
  //     )

  //     /** Error: Axios */
  //     if (err || !res.data)
  //       return (this.errors.other = `Error while signing in.
  //        Please try again later.`)

  //     /** @var {Object} r - r.status, r.message, r[other] from server */
  //     const r = res.data
  //     return console.log(`Funnel Test=${JSON.stringify(r)}`)
  //   },
  // },
}
</script>
