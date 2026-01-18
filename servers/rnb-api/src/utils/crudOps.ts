import { Model, Document } from 'mongoose'
import { Request, Response, NextFunction } from 'express'

// Utils
import AppError from './appError'

interface I_BaseDoc extends Document {
    toClient(): void
}

//----------Create One----------

export const createOne =
    <T extends I_BaseDoc>(Model: Model<T>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const doc = await Model.create(req.body)

            if (!doc) {
                return next(new AppError('No document created', 404))
            }

            res.status(201).json({
                status: 'success',
                doc,
            })
        } catch (error) {
            console.error(error)

            return next(new AppError('Could Not create document', 404))
        }
    }

// ----------Get All----------

export const getAll =
    <T extends I_BaseDoc>(Model: Model<T>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const docs = await Model.find().select('-password')

            if (!docs || docs.length === 0) {
                return next()
            }

            const transformedDocs = docs.map((doc) => doc.toClient())

            res.status(200).json({
                status: 'success',
                results: transformedDocs.length,
                docs: transformedDocs,
            })
        } catch (error) {
            console.error(error)
            return next()
        }
    }

//----------Get One------------

export const getOne =
    <T extends I_BaseDoc>(Model: Model<T>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const doc = await Model.findById(req.params.id).select('-password')

            if (!doc) {
                return next()
            }

            res.status(200).json({
                status: 'success',
                doc: doc.toClient(),
            })
        } catch (error) {
            console.error(error)
            return next()
        }
    }

//----------Update One----------

export const updateOne =
    <T extends I_BaseDoc>(Model: Model<T>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Get document
            const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: false,
            }).select('-password')

            if (!doc) {
                return next(new AppError('No Document found with that ID', 404))
            }

            await doc.save()

            res.status(200).json({
                status: 'success',
                doc: doc.toClient(),
            })
        } catch (error) {
            console.error(error)
            return next()
        }
    }

//----------Update Many---------

export const updateMany =
    <T extends I_BaseDoc>(Model: Model<T>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updates = req.body.updates // Assuming updates are sent as an array of objects

            if (!Array.isArray(updates) || updates.length === 0) {
                return next(new AppError('No updates provided', 400))
            }

            const bulkOps = updates.map((update) => ({
                updateOne: {
                    filter: { _id: update.id }, // The ID of the document to update
                    update: { $set: update.fields }, // The fields to update
                },
            }))

            const bulkWriteResult = await Model.bulkWrite(bulkOps)

            // Check if any documents were actually updated
            if (bulkWriteResult.modifiedCount === 0) {
                return next(new AppError('No documents were updated', 400))
            }

            // Collect the IDs of the updated documents
            const updatedIds = updates.map((update) => update.id)

            // Retrieve the updated documents
            const docs = await Model.find({ _id: { $in: updatedIds } })

            if (!docs || docs.length === 0) {
                return next()
            }

            res.status(200).json({
                status: 'success',
                results: docs.length,
                docs,
            })
        } catch (error) {
            console.error(error)
            return next(new AppError('Could not update documents', 500))
        }
    }

//----------Delete One----------

export const deleteOne =
    <T extends Document>(Model: Model<T>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const docToDelete = await Model.findById(req.params.id)

            if (!docToDelete) {
                return next()
            }

            const doc = await Model.findByIdAndDelete(docToDelete._id)

            if (!doc) {
                return next()
            }

            res.status(204).json({
                status: 'success',
                doc: null,
            })
        } catch (error) {
            console.error(error)
            return next()
        }
    }
