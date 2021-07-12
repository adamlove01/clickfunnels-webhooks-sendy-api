/** Migrations for funnels table */
exports.up = function (knex) {
  return knex.schema.createTable('purchases', (table) => {
    table.increments('id')
    table.integer('purchase_id')

    table.integer('product_id')
    table.string('product_name')
    table.integer('quantity')
    table.integer('cents')
    table.string('currency_iso')
    table.boolean('bump')
    table.string('billing_integration')

    table.integer('contact_id')
    table.string('ip')
    table.integer('funnel_id')
    table.integer('funnel_step_id')

    table.string('first_name')
    table.string('last_name')
    table.string('name')

    table.string('shipping_address')
    table.string('shipping_city')
    table.string('shipping_country')
    table.string('shipping_state')
    table.string('shipping_zip')
    table.string('vat_number')

    table.string('email').notNullable()
    table.string('phone')

    table.string('status')
    table.string('event')

    table.string('promo_code')
    table.string('optin')

    table.timestamp('created_at')
    table.timestamp('updated_at')
    table.timestamp('received_at').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('purchases')
}
