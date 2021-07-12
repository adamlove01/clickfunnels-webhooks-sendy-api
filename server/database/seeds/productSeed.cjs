exports.seed = function (knex) {
  /** Deletes ALL existing entries */
  return knex('products')
    .del()
    .then(() =>
      knex('products').insert([
        {
          id: 1,
          product_name: '40PC Puzzle x1',
          clickfunnels_id: 3199878,
          sendy_id: '91l4t763Cwhf3wpbDH8HjwhA',
          aliexpress_id: '4001000716708',
          aliexpress_url: 'https://www.aliexpress.com/item/4001000716708.html',
          aliexpress_color: 'Tetris large',
          quantity: 1,
          description: '',
          status: 'active',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: 2,
          product_name: '40PC Puzzle x2',
          clickfunnels_id: 3199902,
          sendy_id: '91l4t763Cwhf3wpbDH8HjwhA',
          aliexpress_id: '4000117615439',
          aliexpress_url: 'https://www.aliexpress.com/item/4000117615439.html',
          aliexpress_color: 'LTetris 1TZ1GGH',
          quantity: 2,
          description: '',
          status: 'active',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: 3,
          product_name: '40PC Puzzle x4',
          clickfunnels_id: 3202617,
          sendy_id: '91l4t763Cwhf3wpbDH8HjwhA',
          aliexpress_id: '4000117615439',
          aliexpress_url: 'https://www.aliexpress.com/item/4000117615439.html',
          aliexpress_color: 'LTetris 1TZ1GGH',
          quantity: 4,
          description: '',
          status: 'active',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: 4,
          product_name: '40PC Puzzle x6',
          clickfunnels_id: 3205008,
          sendy_id: '91l4t763Cwhf3wpbDH8HjwhA',
          aliexpress_id: '4000117615439',
          aliexpress_url: 'https://www.aliexpress.com/item/4000117615439.html',
          aliexpress_color: 'LTetris 1TZ1GGH',
          quantity: 6,
          description: '',
          status: 'active',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: 5,
          product_name: '40PC Puzzle x8',
          clickfunnels_id: 3205011,
          sendy_id: '91l4t763Cwhf3wpbDH8HjwhA',
          aliexpress_id: '4000117615439',
          aliexpress_url: 'https://www.aliexpress.com/item/4000117615439.html',
          aliexpress_color: 'LTetris 1TZ1GGH',
          quantity: 8,
          description: '',
          status: 'active',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: 6,
          product_name: 'Moon Stacking Game',
          clickfunnels_id: 3205239,
          sendy_id: '1pRnC5tqqzHOq763XZh6VIWQ',
          aliexpress_id: '4000183454689',
          aliexpress_url: 'https://www.aliexpress.com/item/4000183454689.html',
          aliexpress_color: '',
          quantity: 1,
          description: '',
          status: 'active',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: 7,
          product_name: 'Stacking Stones',
          clickfunnels_id: 3229762,
          sendy_id: 'XkombSQQg7GMdOcJo1NLAw',
          aliexpress_id: '1005001732360762',
          aliexpress_url:
            'https://www.aliexpress.com/item/1005001732360762.html',
          aliexpress_color: '16Pcs JMCS 1SKBag',
          quantity: 1,
          description: '',
          status: 'active',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: 8,
          product_name: 'Cylinder Puzzle',
          clickfunnels_id: 3307546,
          sendy_id: 'dAJtZyc5huaIC1miG892bR6w',
          aliexpress_id: '1005001361254146',
          aliexpress_url:
            'https://www.aliexpress.com/item/1005001361254146.html',
          aliexpress_color: 'color YuanZhu',
          quantity: 1,
          description: '',
          status: 'active',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: 9,
          product_name: '4-in-1 Sorting Board Set',
          clickfunnels_id: 3231463,
          sendy_id: 'tGaYjwZaJq22lGN276370EIw',
          aliexpress_id: '1005001355908303',
          aliexpress_url:
            'https://www.aliexpress.com/item/1005001355908303.html',
          aliexpress_color: 'Ocean Round Fish',
          quantity: 1,
          description: '',
          status: 'active',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: 10,
          product_name: 'Pattern Blocks Set',
          clickfunnels_id: 3229759,
          sendy_id: '3BgX5oJ86wyf763kjDiM7638rw',
          aliexpress_id: '32960585070',
          aliexpress_url: 'https://www.aliexpress.com/item/32960585070.html',
          aliexpress_color: '',
          quantity: 1,
          description: '',
          status: 'active',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
      ])
    )
}
