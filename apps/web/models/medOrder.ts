// models/medOrder.ts

import { Schema, type Document, type Model, model, models, type Types } from "mongoose"
import { v4 as uuidv4 } from "uuid"

export interface IMedication {
    _id: string
    diagnosis: string
    medication: string
    dosage: string
    frequency: string
    quantity: string
}

export interface IMedOrder extends Document {
    oid?: string
    doctorSpecialty: string
    prescribingDr: string
    drEmail: string
    drId: string
    orderDate: Date
    patientName: string
    patientPhone: string
    patientCity: string
    patientCountry: string
    patientId: Types.ObjectId
    validated: boolean
    medications: IMedication[]
}

export const medOrderSchema = new Schema<IMedOrder>({
    oid: { type: String },
    doctorSpecialty: { type: String, required: true },
    prescribingDr: { type: String, required: true },
    drEmail: { type: String, required: true },
    drId: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
    patientName: { type: String, required: true },
    patientPhone: { type: String, required: true },
    patientCity: { type: String, required: true },
    patientCountry: { type: String, required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    validated: { type: Boolean, default: false },
    medications: [
        {
            _id: { type: String, default: uuidv4 },
            diagnosis: { type: String, required: true },
            medication: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true },
            quantity: { type: String, required: true },
        },
    ],
})

const MedOrder: Model<IMedOrder> = models.MedOrder || model<IMedOrder>("MedOrder", medOrderSchema)

export default MedOrder

