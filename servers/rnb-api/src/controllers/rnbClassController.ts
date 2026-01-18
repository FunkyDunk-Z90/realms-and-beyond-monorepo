// src/controllers/RnBClass.controller.ts

import { NextFunction, Request, Response } from 'express'
import { RnBClassModel } from '../models/rnbClass' // <-- adjust path/name if needed

import {
    createOne,
    getAll,
    getOne,
    updateOne,
    updateMany,
    deleteOne,
} from '../utils/crudOps'

// If you have a specific interface for the class doc, you can import it too and
// ensure it has `toClient()` defined in the schema methods.
// import { IDnDClass } from '../models/dndClass.model'

// ---------- Standard CRUD Handlers ----------

// POST /api/classes
export const createRnBClass = createOne(RnBClassModel)

// GET /api/classes
export const getAllRnBClasses = getAll(RnBClassModel)

// GET /api/classes/:id
export const getRnBClass = getOne(RnBClassModel)

// PATCH /api/classes/:id
export const updateRnBClass = updateOne(RnBClassModel)

// PATCH /api/classes (bulk update)
// body: { updates: [{ id: string, fields: Record<string, any> }, ...] }
export const updateManyRnBClasses = updateMany(RnBClassModel)

// DELETE /api/classes/:id
export const deleteRnBClass = deleteOne(RnBClassModel)

// ---------- Optional: Custom Controller Example ----------

// GET /api/classes/identifier/:identifier
export const getRnBClassByIdentifier = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { identifier } = req.params

        const doc = await RnBClassModel.findOne({ identifier }).select(
            '-password'
        )

        if (!doc) {
            return next()
        }

        res.status(200).json({
            status: 'success',
            doc: doc.toClient(),
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}
