// src/routes/RnBClass.routes.ts
import { Router } from 'express'
import {
    createRnBClass,
    getAllRnBClasses,
    getRnBClass,
    updateRnBClass,
    updateManyRnBClasses,
    deleteRnBClass,
    getRnBClassByIdentifier,
} from '../controllers/rnbClassController'

const router = Router()

router
    .route('/')
    .get(getAllRnBClasses)
    .post(createRnBClass)
    .patch(updateManyRnBClasses)

router.route('/identifier/:identifier').get(getRnBClassByIdentifier)

router
    .route('/:id')
    .get(getRnBClass)
    .patch(updateRnBClass)
    .delete(deleteRnBClass)

export default router
