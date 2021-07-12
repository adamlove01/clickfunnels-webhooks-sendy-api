/** Migrations for users table */
exports.up = function (knex) {
  return knex.schema.createTable('products', (table) => {
    table.increments('id')
    table.string('product_name').notNullable()
    table.integer('clickfunnels_id').notNullable().unique()
    table.string('sendy_id').notNullable()
    table.string('aliexpress_id')
    table.string('aliexpress_color')
    table.string('aliexpress_url')
    table.integer('quantity').notNullable()
    table.string('description')
    table
      .enum('status', ['active', 'unavailable'])
      .notNullable()
      .defaultTo('active')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('products')
}
