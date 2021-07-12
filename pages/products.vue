<template>
  <v-container class="bg_white_geometric" fluid>
    <PageTitle title="PRODUCTS"></PageTitle>
    <v-container class="pt-6">
      <v-data-table
        :headers="headers"
        :items="products"
        sort-by="product_name"
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
            <v-toolbar-title class="text-h5">Products List</v-toolbar-title>
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
                  Add Product
                </v-btn>
              </template>

              <v-form ref="form" lazy-validation>
                <v-card>
                  <v-card-title>
                    <span v-if="input.id === null" class="text-h5"
                      >Add New Product</span
                    >
                    <span v-else class="text-h5">Edit Product</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" class="pt-0">
                          <v-text-field
                            v-model="input.product_name"
                            class="custom-input-default"
                            label="product_name"
                            :rules="rules.product_name"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.clickfunnels_id"
                            class="custom-input-default"
                            label="clickfunnels_id"
                            :rules="rules.clickfunnels_id"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.sendy_id"
                            class="custom-input-default"
                            label="sendy_id"
                            :rules="rules.sendy_id"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.aliexpress_id"
                            class="custom-input-default"
                            label="aliexpress_id"
                            :rules="rules.aliexpress_id"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.aliexpress_color"
                            class="custom-input-default"
                            label="aliexpress_color"
                            :rules="rules.aliexpress_color"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.aliexpress_url"
                            class="custom-input-default"
                            label="aliexpress_url"
                            :rules="rules.aliexpress_url"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.quantity"
                            class="custom-input-default"
                            label="quantity"
                            :rules="rules.quantity"
                          ></v-text-field>
                          <v-text-field
                            v-model="input.description"
                            class="custom-input-default"
                            label="description"
                            :rules="rules.description"
                          ></v-text-field>
                          <v-select
                            v-model="input.status"
                            label="status"
                            :items="statusOptions"
                          ></v-select>
                          <v-text-field
                            v-model="input.created_at"
                            class="custom-input-default"
                            label="created_at"
                            :rules="rules.created_at"
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
                    <v-btn color="blue darken-1" text @click="saveProduct">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>

            <v-dialog v-model="deleteDialog" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Delete This Product?</v-card-title
                >
                <v-card-text class="body-1">
                  Product: &nbsp;{{ input.product_name }}<br />
                  Clickfunnels ID: &nbsp;{{ input.clickfunnels_id }}<br />
                  Sendy ID: &nbsp;{{ input.sendy_id }}<br />
                </v-card-text>
                <v-card-actions class="text-right pb-3">
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDeleteDialog"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteProductOK"
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
        v-show="!products.length"
        text
        dismissible
        type="info"
        class="mx-auto mt-6"
      >
        There are no Products.
      </v-alert>
    </v-container>
  </v-container>
</template>

<script>
import { schema } from '~/validation/schemas/productSchema'
import { validate, joiResponse } from '~/validation/JoiValidate'
import Try from '~/helpers/tryCatch.js'

export default {
  middleware: 'authorize',

  /** Get all products */
  async asyncData({ $axios }) {
    /** Get the product data from db */
    const [err, res] = await Try($axios.get('/server/products/read'))

    /** Error: Axios */
    if (err || !res.data)
      return {
        errors: {
          other: `Error while retrieving products. Please try again later.`,
        },
      }

    /** @var {Object} r - r.status, r.message, r[other] from server */
    const r = res.data

    /** Error: server */
    if (r.status === 'error') return { errors: { other: r.message } }

    /** Success. Return product data */
    if (r.status === 'success') return { products: r.data }
  },

  data() {
    const inputInit = {
      id: null,
      product_name: '',
      clickfunnels_id: 0,
      sendy_id: '',
      aliexpress_id: 0,
      aliexpress_color: '',
      aliexpress_url: '',
      quantity: 0,
      description: '',
      status: '',
      created_at: '',
    }
    return {
      editDialog: false,
      deleteDialog: false,
      headers: [
        { text: 'Name', value: 'product_name', align: 'start' },
        { text: 'Clickfunnels ID', value: 'clickfunnels_id' },
        { text: 'Sendy ID', value: 'sendy_id' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],

      input: inputInit,
      inputDefault: inputInit,
      products: [],

      errors: {
        id: '',
        product_name: '',
        clickfunnels_id: '',
        sendy_id: '',
        aliexpress_id: 0,
        aliexpress_color: '',
        aliexpress_url: '',
        quantity: '',
        description: '',
        status: '',
        created_at: '',
        other: '',
      },
      rules: {
        id: [() => this.errors.id === '' || this.errors.id],
        product_name: [
          () => this.errors.product_name === '' || this.errors.product_name,
        ],
        clickfunnels_id: [
          () =>
            this.errors.clickfunnels_id === '' || this.errors.clickfunnels_id,
        ],
        sendy_id: [() => this.errors.sendy_id === '' || this.errors.sendy_id],
        aliexpress_id: [
          () => this.errors.aliexpress_id === '' || this.errors.aliexpress_id,
        ],
        aliexpress_color: [
          () =>
            this.errors.aliexpress_color === '' || this.errors.aliexpress_color,
        ],
        aliexpress_url: [
          () => this.errors.aliexpress_url === '' || this.errors.aliexpress_url,
        ],
        quantity: [() => this.errors.quantity === '' || this.errors.quantity],
        description: [
          () => this.errors.description === '' || this.errors.description,
        ],
        status: [() => this.errors.status === '' || this.errors.status],
        created_at: [
          () => this.errors.created_at === '' || this.errors.created_at,
        ],
        other: [() => this.errors.other === '' || this.errors.other],
      },
      statusOptions: ['active', 'unavailable'],
    }
  },

  head: {
    title: 'Products | Your Website',
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

    async deleteProductOK() {
      const r = await this.deleteProduct()
      if (r === 'success') {
        this.closeDeleteDialog()
        /** Refresh the asyncData from the server (the list of products) */
        this.$nuxt.refresh()
      }
    },

    async saveProduct() {
      const r =
        this.input.id === null
          ? await this.createProduct()
          : await this.updateProduct()
      if (r === 'success') {
        this.closeEditDialog()
        /** Refresh the asyncData from the server (the list of products) */
        this.$nuxt.refresh()
      }
    },

    /** Create product -- submit form */
    async createProduct() {
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

      /** --- Server-side: Create product */

      this.input.name = `${this.input.first_name} ${this.input.last_name}`

      /** Create the product in db */
      const [err, res] = await Try(
        this.$axios.post('/server/products/create', this.input, {
          headers: { Authorization: this.$store.state.login.token },
        })
      )

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = `Error while creating the product record. 
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

    /** Update product -- submit form */
    async updateProduct() {
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

      /** --- Server-side: Update product */

      this.input.name = `${this.input.first_name} ${this.input.last_name}`

      /** Update the product in db */
      const [err, res] = await Try(
        this.$axios.put('/server/products/update', this.input, {
          headers: { Authorization: this.$store.state.login.token },
        })
      )

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = `Error while updating the product record. 
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

    /** Delete product */
    async deleteProduct() {
      /** Delete the product in db */
      const [err, res] = await Try(
        this.$axios.delete(`/server/products/delete/${this.input.id}`, {
          headers: { Authorization: this.$store.state.login.token },
        })
      )

      /** Error: Axios */
      if (err || !res.data)
        return (this.errors.other = `Error while deleting the product record. 
        Please try again later.`)

      /** @var {Object} r - r.status, r.message, r[other] from server */
      const r = res.data

      if (r.status === 'error') {
        r.name in this.input
          ? (this.errors[r.name] = r.message)
          : (this.errors.other = r.message)
      }

      /** Success */
      console.log('# products=', this.products.length)
      if (this.products.length < 2) window.location.reload()

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
