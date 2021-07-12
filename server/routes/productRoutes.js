import { Router } from 'express'
import { create, read, update, del } from '../controllers/productController'
import { authorize } from '../authorization/authorize'

const productRoutes = Router()

productRoutes.post('/server/products/create', authorize, create)
productRoutes.get('/server/products/read', authorize, read)
productRoutes.put('/server/products/update', authorize, update)
productRoutes.delete('/server/products/delete/:id', authorize, del)

export { productRoutes }
