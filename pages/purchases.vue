<template>
  <v-container class="bg_white_geometric" fluid>
    <PageTitle title="PURCHASES"></PageTitle>
    <v-container class="pt-6">
      <v-data-table
        :headers="headers"
        :items="purchases"
        sort-by="created_at"
        class="elevation-1"
        :footer-props="{
          'items-per-page-options': [10, 50, 100, -1],
          'show-current-page': true,
        }"
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.created_at="{ item }">
          <span>{{ prettyDate(item.created_at) }}</span>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.cents="{ item }">
          <span>{{ `$ ${item.cents / 100} ${item.currency_iso}` }}</span>
        </template>

        <template #top>
          <v-toolbar flat class="pt-3 py-0 mb-8">
            <v-toolbar-title class="text-h5">Purchases List</v-toolbar-title>
            <v-spacer></v-spacer>

            <v-dialog v-model="editDialog" max-width="500px">
              <template #activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="openNewDialog"
                >
                  Add Purchase
                </v-btn>
              </template>

              <v-form ref="form" lazy-validation>
                <v-card>
                  <v-card-title>
                    <span v-if="input.id === null" class="text-h5"
                      >Add New Purchase</span
                    >
                    <span v-else class="text-h5">Edit Purchase</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <h2>Contact Info</h2>
                        </v-col>
                        <v-col cols="12" sm="6" md="6" class="pb-0">
                          <v-text-field
                            v-model="input.first_name"
                            class="custom-input-default"
                            label="first_name"
                            :rules="rules.first_name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6" class="pb-0">
                          <v-text-field
                            v-model="input.last_name"
                            class="custom-input-default"
                            label="last_name"
                            :rules="rules.last_name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pt-0">
                          <v-text-field
                            v-model="input.email"
                            class="custom-input-default"
                            label="email"
                            :rules="rules.email"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.shipping_address"
                            class="custom-input-default"
                            label="shipping_address"
                            :rules="rules.shipping_address"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.shipping_city"
                            class="custom-input-default"
                            label="shipping_city"
                            :rules="rules.shipping_city"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-select
                            v-model="input.shipping_country"
                            label="shipping_country"
                            :items="countryOptions"
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                          <v-select
                            v-model="input.shipping_state"
                            label="shipping_state"
                            :items="stateOptions"
                          ></v-select>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="input.shipping_zip"
                            class="custom-input-default"
                            label="shipping_zip"
                            :rules="rules.shipping_zip"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.vat_number"
                            class="custom-input-default"
                            label="vat_number"
                            :rules="rules.vat_number"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.phone"
                            class="custom-input-default"
                            label="phone"
                            :rules="rules.phone"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.optin"
                            class="custom-input-default"
                            label="optin"
                            :rules="rules.optin"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.contact_id"
                            class="custom-input-default"
                            label="contact_id"
                            :rules="rules.contact_id"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.ip"
                            class="custom-input-default"
                            label="ip"
                            :rules="rules.ip"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" class="pt-0">
                          <h2>Product Info</h2>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="input.product_name"
                            class="custom-input-default"
                            label="product_name"
                            :rules="rules.product_name"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.quantity"
                            class="custom-input-default"
                            label="quantity"
                            :rules="rules.quantity"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.cents"
                            class="custom-input-default"
                            label="cents"
                            :rules="rules.cents"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.currency_iso"
                            class="custom-input-default"
                            label="currency_iso"
                            :rules="rules.currency_iso"
                          ></v-text-field>
                          <v-select
                            v-model="input.bump"
                            label="bump"
                            :items="bumpOptions"
                          ></v-select>
                          <v-text-field
                            v-model="input.purchase_id"
                            class="custom-input-default"
                            label="purchase_id"
                            :rules="rules.purchase_id"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.product_id"
                            class="custom-input-default"
                            label="product_id"
                            :rules="rules.product_id"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.billing_integration"
                            class="custom-input-default"
                            label="billing_integration"
                            :rules="rules.billing_integration"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.promo_code"
                            class="custom-input-default"
                            label="promo_code"
                            :rules="rules.promo_code"
                          ></v-text-field>
                          <v-select
                            v-model="input.status"
                            label="status"
                            :items="statusOptions"
                          ></v-select>
                          <v-text-field
                            v-model="input.event"
                            class="custom-input-default"
                            label="event"
                            :rules="rules.event"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.created_at"
                            class="custom-input-default"
                            label="created_at"
                            :rules="rules.created_at"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" class="pt-0">
                          <h2>Funnel Info</h2>
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="input.funnel_id"
                            class="custom-input-default"
                            label="funnel_id"
                            :rules="rules.funnel_id"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.funnel_step_id"
                            class="custom-input-default"
                            label="funnel_step_id"
                            :rules="rules.funnel_step_id"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeEditDialog">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveUser">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>

            <v-dialog v-model="deleteDialog" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Delete This Purchase?</v-card-title
                >
                <v-card-text class="body-1">
                  Product: &nbsp;{{ input.product_name }}<br />
                  Name: &nbsp;{{ input.name }}<br />
                  Email: &nbsp;{{ input.email }}<br />
                </v-card-text>
                <v-card-actions class="text-right pb-3">
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDeleteDialog"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteUserOK"
                    >OK</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.actions="{ item }">
          <v-icon small class="mr-2" @click="openEditDialog(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="openDeleteDialog(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>

      <v-alert
        v-show="errors.other"
        text
        dismissible
        type="error"
        class="mx-auto mt-6"
      >
        {{ errors.other }}
      </v-alert>
      <v-alert
        v-show="!purchases.length"
        text
        dismissible
        type="info"
        class="mx-auto mt-6"
      >
        There are no Purchases.
      </v-alert>
    </v-container>
  </v-container>
</template>

<script>
import { schema } from '~/validation/schemas/purchaseSchema'
import { validate, joiResponse } from '~/validation/JoiValidate'
import Try from '~/helpers/tryCatch.js'

export default {
  middleware: 'authorize',

  /** Get all purchases */
  async asyncData({ $axios }) {
    /** Get the user data from db */
    const [err, res] = await Try($axios.get('/server/purchases/read'))

    /** Error: Axios */
    if (err || !res.data)
      return {
        errors: {
          other: `Error while retrieving purchases. Please try again later.`,
        },
      }

    /** @var {Object} r - r.status, r.message, r[other] from server */
    const r = res.data

    /** Error: server */
    if (r.status === 'error') return { errors: { other: r.message } }

    /** Success. Return user data */
    if (r.status === 'success') return { purchases: r.data }
  },

  data() {
    const inputInit = {
      id: null,
      contact_id: 0,
      ip: '0.0.0.0',
      funnel_id: 0,
      funnel_step_id: 0,
      first_name: '',
      last_name: '',
      name: '',
      shipping_address: '',
      shipping_city: '',
      shipping_country: '',
      shipping_state: '',
      shipping_zip: '',
      vat_number: '',
      email: '',
      phone: '',
      optin: 'false',
      status: '',
      event: 'paid',
      created_at: '',
      purchase_id: 0,
      product_id: 0,
      product_name: '',
      quantity: 0,
      cents: 0,
      currency_iso: '',
      bump: false,
      billing_integration: '',
      promo_code: '',
    }
    return {
      editDialog: false,
      deleteDialog: false,
      headers: [
        { text: 'Date', value: 'created_at', align: 'start' },
        { text: 'Product', value: 'product_name' },
        { text: 'Price', value: 'cents' },
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      input: inputInit,
      inputDefault: inputInit,
      purchases: [],

      errors: {
        id: '',
        contact_id: '',
        ip: '',
        funnel_id: '',
        funnel_step_id: '',
        first_name: '',
        last_name: '',
        shipping_address: '',
        shipping_city: '',
        shipping_zip: '',
        vat_number: '',
        email: '',
        phone: '',
        optin: '',
        event: '',
        created_at: '',
        purchase_id: '',
        product_id: '',
        product_name: '',
        quantity: '',
        cents: '',
        currency_iso: '',
        billing_integration: '',
        promo_code: '',
        other: '',
      },
      rules: {
        id: [() => this.errors.id === '' || this.errors.id],
        contact_id: [
          () => this.errors.contact_id === '' || this.errors.contact_id,
        ],
        ip: [() => this.errors.ip === '' || this.errors.ip],
        funnel_id: [
          () => this.errors.funnel_id === '' || this.errors.funnel_id,
        ],
        funnel_step_id: [
          () => this.errors.funnel_step_id === '' || this.errors.funnel_step_id,
        ],
        first_name: [
          () => this.errors.first_name === '' || this.errors.first_name,
        ],
        last_name: [
          () => this.errors.last_name === '' || this.errors.last_name,
        ],
        shipping_address: [
          () =>
            this.errors.shipping_address === '' || this.errors.shipping_address,
        ],
        shipping_city: [
          () => this.errors.shipping_city === '' || this.errors.shipping_city,
        ],
        shipping_zip: [
          () => this.errors.shipping_zip === '' || this.errors.shipping_zip,
        ],
        vat_number: [
          () => this.errors.vat_number === '' || this.errors.vat_number,
        ],
        email: [() => this.errors.email === '' || this.errors.email],
        phone: [() => this.errors.phone === '' || this.errors.phone],
        optin: [() => this.errors.optin === '' || this.errors.optin],
        event: [() => this.errors.event === '' || this.errors.event],
        created_at: [
          () => this.errors.created_at === '' || this.errors.created_at,
        ],
        purchase_id: [
          () => this.errors.purchase_id === '' || this.errors.purchase_id,
        ],
        product_id: [
          () => this.errors.product_id === '' || this.errors.product_id,
        ],
        product_name: [
          () => this.errors.product_name === '' || this.errors.product_name,
        ],
        quantity: [() => this.errors.quantity === '' || this.errors.quantity],
        cents: [() => this.errors.cents === '' || this.errors.cents],
        currency_iso: [
          () => this.errors.currency_iso === '' || this.errors.currency_iso,
        ],
        billing_integration: [
          () =>
            this.errors.billing_integration === '' ||
            this.errors.billing_integration,
        ],
        promo_code: [
          () => this.errors.promo_code === '' || this.errors.promo_code,
        ],
        other: [() => this.errors.other === '' || this.errors.other],
      },
      showPassword: false,

      bumpOptions: [true, false],
      statusOptions: ['paid', 'pending'],
      stateOptions: [
        'AL',
        'AK',
        'AZ',
        'AR',
        'CA',
        'CO',
        'CT',
        'DE',
        'DC',
        'FL',
        'GA',
        'HI',
        'ID',
        'IL',
        'IN',
        'IA',
        'KS',
        'KY',
        'LA',
        'ME',
        'MD',
        'MA',
        'MI',
        'MN',
        'MS',
        'MO',
        'MT',
        'NE',
        'NV',
        'NH',
        'NJ',
        'NM',
        'NY',
        'NC',
        'ND',
        'OH',
        'OK',
        'OR',
        'PA',
        'RI',
        'SC',
        'SD',
        'TN',
        'TX',
        'UT',
        'VT',
        'VA',
        'WA',
        'WV',
        'WI',
        'WY',
      ],
      countryOptions: ['US', 'CA', 'UK', 'AU', 'NZ'],
    }
  },

  head: {
    title: 'Purchases | Your Website',
  },

  methods: {
    prettyDate(date) {
      const myDate = new Date(date)
      const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
      }
      return new Intl.DateTimeFormat('en-AU', options).format(myDate)
    },

    openNewDialog() {
      /** Clear all 'errors' values */
      Object.keys(this.errors).forEach((i) => (this.errors[i] = ''))
      this.input = Object.assign({}, this.inputDefault)
      this.editDialog = true
      /** Wait for dialog to fully load and form exists */
      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      })
    },

    openEditDialog(item) {
      /** Clear all 'errors' values */
      Object.keys(this.errors).forEach((i) => (this.errors[i] = ''))
      this.input = Object.assign({}, item)
      this.editDialog = true
      /** Wait for dialog to fully load and form exists */
      this.$nextTick(() => {
        this.$refs.form.resetValidation()
      })
    },

    closeEditDialog() {
      this.editDialog = false
    },

    openDeleteDialog(item) {
      this.input = Object.assign({}, item)
      this.deleteDialog = true
    },

    closeDeleteDialog() {
      this.deleteDialog = false
    },

    async deleteUserOK() {
      const r = await this.deleteUser()
      if (r === 'success') {
        this.closeDeleteDialog()
        /** Refresh the asyncData from the server (the list of purchases) */
        this.$nuxt.refresh()
      }
    },

    async saveUser() {
      const r =
        this.input.id === null
          ? await this.createUser()
          : await this.updateUser()
      if (r === 'success') {
        this.closeEditDialog()
        /** Refresh the asyncData from the server (the list of purchases) */
        this.$nuxt.refresh()
      }
    },

    /** Create User -- submit form */
    async createUser() {
      /** Clear all 'errors' values */
      Object.keys(this.errors).forEach((i) => (this.errors[i] = ''))

      /** --- Client-side: Validate */

      /** Get a comma-separated list of input keys to validate */
      const keys = `${Object.keys(this.input).map((key) => key)}`

      /** Sanitize and validate input */
      /** @var {Array} - [vErr false || {object}, v {object} || false] */
      const [vErr, v] = validate(keys, this.input, schema)

      /** Error: Invalid input */
      if (vErr || !v) return this.showInputErrors(joiResponse(vErr))

      /** Reset the form */
      this.$refs.form.resetValidation()

      /** --- Server-side: Create user */

      this.input.name = `${this.input.first_name} ${this.input.last_name}`

      /** Create the user in db */
      const [err, res] = await Try(
        this.$axios.post('/server/purchases/create', this.input, {
          headers: { Authorization: this.$store.state.login.token },
        })
      )

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = `Error while creating the purchase record. 
        Please try again later.`)

      /** @var {Object} r - r.status, r.message, r[other] from server */
      const r = res.data

      /** Error: Input. Show JoiValidate() server error(s) */
      if (r.status === 'inputError') return this.showInputErrors(r)

      /** Error: server */
      if (r.status === 'error') {
        r.name in this.input
          ? (this.errors[r.name] = r.message)
          : (this.errors.other = r.message)

        /** Trigger error messages under the form inputs */
        return this.$refs.form.validate()
      }

      /** Success */
      return 'success'
    },

    /** Update User -- submit form */
    async updateUser() {
      /** Clear all 'errors' values */
      Object.keys(this.errors).forEach((i) => (this.errors[i] = ''))

      /** --- Client-side: Validate */

      /** Get a comma-separated list of input keys to validate */
      const keys = `${Object.keys(this.input).map((key) => key)}`

      /** Sanitize and validate input */
      /** @var {Array} - [vErr false || {object}, v {object} || false] */
      const [vErr, v] = validate(keys, this.input, schema)

      /** Error: Invalid input */
      if (vErr || !v) return this.showInputErrors(joiResponse(vErr))

      /** Reset the form */
      this.$refs.form.resetValidation()

      /** --- Server-side: Update user */

      this.input.name = `${this.input.first_name} ${this.input.last_name}`

      /** Update the user in db */
      const [err, res] = await Try(
        this.$axios.put('/server/purchases/update', this.input, {
          headers: { Authorization: this.$store.state.login.token },
        })
      )

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = `Error while updating the purchase record. 
        Please try again later.`)

      /** @var {Object} r - r.status, r.message, r[other] from server */
      const r = res.data

      /** Error: Input. Show JoiValidate() server error(s) */
      if (r.status === 'inputError') return this.showInputErrors(r)

      /** Error: server */
      if (r.status === 'error') {
        r.name in this.input
          ? (this.errors[r.name] = r.message)
          : (this.errors.other = r.message)

        /** Trigger error messages under the form inputs */
        return this.$refs.form.validate()
      }

      /** Success */
      return 'success'
    },

    /** Delete User */
    async deleteUser() {
      /** Delete the user in db */
      const [err, res] = await Try(
        this.$axios.delete(`/server/purchases/delete/${this.input.id}`, {
          headers: { Authorization: this.$store.state.login.token },
        })
      )

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = `Error while deleting the purchase record. 
        Please try again later.`)

      /** @var {Object} r - r.status, r.message, r[other] from server */
      const r = res.data

      if (r.status === 'error') {
        r.name in this.input
          ? (this.errors[r.name] = r.message)
          : (this.errors.other = r.message)
      }

      /** Success */
      console.log('# Purchases=', this.purchases.length)
      if (this.purchases.length < 2) window.location.reload()

      return 'success'
    },

    /** Error: Input. Show JoiValidate() error(s) */
    showInputErrors(r) {
      for (let i = 0; i < r.count; i++) {
        r.name[i] in this.input
          ? (this.errors[r.name[i]] = r.message[i])
          : (this.errors.other = r.message[i])
      }
      /** Trigger error messages under the form inputs */
      return this.$refs.form.validate()
    },
  },
}
</script>
