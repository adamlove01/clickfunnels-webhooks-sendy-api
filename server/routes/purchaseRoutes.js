import { Router } from 'express'
import { create, read, update, del } from '../controllers/purchaseController'
import { authorize } from '../authorization/authorize'

const purchaseRoutes = Router()

purchaseRoutes.post('/server/purchases/create', authorize, create)
purchaseRoutes.get('/server/purchases/read', authorize, read)
purchaseRoutes.put('/server/purchases/update', authorize, update)
purchaseRoutes.delete('/server/purchases/delete/:id', authorize, del)

export { purchaseRoutes }
