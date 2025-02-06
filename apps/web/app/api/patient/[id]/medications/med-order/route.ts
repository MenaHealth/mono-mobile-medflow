// app/api/patient/[id]/medications/med-order/route.ts
import { type NextRequest, NextResponse } from "next/server"
import MedOrder, { type IMedOrder, type IMedication } from "../../../../../../models/medOrder"
import Patient, { type IPatient } from "../../../../../../models/patient"
import dbConnect from "../../../../../../utils/database"
import { Types } from "mongoose"
import { v4 as uuidv4 } from "uuid"

async function fetchMedOrders(medOrderIds: string[]): Promise<IMedOrder[]> {
    const validIds = medOrderIds.filter((id) => Types.ObjectId.isValid(id))
    return MedOrder.find({
        _id: { $in: validIds.map((id) => new Types.ObjectId(id)) },
    }).lean()
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect()
    const patientId = params.id

    try {
        const patient = (await Patient.findById(patientId).lean()) as IPatient | null

        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 })
        }

        const medOrderIds = patient.medOrders || []

        // Ensure medOrderIds are valid ObjectIds
        const validMedOrderIds = medOrderIds.filter((id) => Types.ObjectId.isValid(id))

        const medOrders = await MedOrder.find({
            _id: { $in: validMedOrderIds.map((id) => new Types.ObjectId(id)) },
        }).lean()

        // Ensure all dates are serialized properly
        const serializedMedOrders = medOrders.map((order: IMedOrder) => ({
            ...order,
            _id: order._id.toString(),
            orderDate: new Date(order.orderDate).toISOString(),
            medications: order.medications.map((med) => ({
                ...med,
                _id: med._id.toString(),
            })),
        }))

        return NextResponse.json(serializedMedOrders)
    } catch (error) {
        console.error("Failed to fetch med orders:", error)
        return NextResponse.json({ error: "Failed to fetch med orders" }, { status: 500 })
    }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    console.log("POST request received with params:", params)

    await dbConnect()
    const patientIdString = params.id

    console.log("Received patient ID (string):", patientIdString)

    if (!Types.ObjectId.isValid(patientIdString)) {
        console.error("Invalid patient ID format:", patientIdString)
        return NextResponse.json({ error: "Invalid patient ID format" }, { status: 400 })
    }

    const patientId = new Types.ObjectId(patientIdString)

    console.log("Converted patient ID to ObjectId:", patientId)

    let requestData
    try {
        requestData = await request.json()
        console.log("Request body received:", requestData)
    } catch (error) {
        console.error("Failed to parse request body:", error)
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    try {
        const patient = await Patient.findById(patientId)
        if (!patient) {
            console.error("Patient not found for ID:", patientId)
            return NextResponse.json({ error: "Patient not found" }, { status: 404 })
        }

        console.log("Patient found:", patient)

        const {
            doctorSpecialty,
            prescribingDr,
            drEmail,
            drId,
            patientName,
            patientPhone,
            patientCity,
            patientCountry,
            orderDate,
            validated,
            medications,
        } = requestData

        console.log("Validating request data...")
        const isValid =
            [doctorSpecialty, prescribingDr, drEmail, drId, patientName, patientPhone, patientCity, patientCountry].every(
                (field) => typeof field === "string",
            ) &&
            Array.isArray(medications) &&
            medications.every((med) =>
                ["diagnosis", "medication", "dosage", "frequency", "quantity"].every((prop) => typeof med[prop] === "string"),
            )

        if (!isValid) {
            console.error("Invalid med order data:", requestData)
            return NextResponse.json({ error: "Invalid med order data" }, { status: 400 })
        }

        console.log("Request data is valid.")

        const newMedOrder = new MedOrder({
            doctorSpecialty,
            prescribingDr,
            drEmail,
            drId,
            patientName,
            patientPhone,
            patientCity,
            patientCountry,
            patientId,
            orderDate: orderDate || new Date(),
            validated: validated || false,
            medications: medications.map((med) => ({ ...med, _id: uuidv4() })),
        })

        console.log("Saving new med order...")
        const savedMedOrder = await newMedOrder.save()
        console.log("Med order saved successfully:", savedMedOrder)

        // Update patient's medOrders array
        if (!patient.medOrders) {
            patient.medOrders = []
        }
        patient.medOrders.push(savedMedOrder._id)
        await patient.save()
        console.log("Patient medOrders updated:", patient.medOrders)

        // Serialize the saved med order
        const serializedMedOrder = {
            ...savedMedOrder.toObject(),
            _id: savedMedOrder._id.toString(),
            patientId: savedMedOrder.patientId.toString(),
            orderDate: savedMedOrder.orderDate.toISOString(),
            medications: savedMedOrder.medications.map((med: IMedication) => ({
                ...med,
                _id: med._id,
            })),
        }

        console.log("Returning response:", serializedMedOrder)
        return NextResponse.json(serializedMedOrder, { status: 201 })
    } catch (error) {
        console.error("Failed to add med order:", error)
        return NextResponse.json({ error: "Failed to add med order" }, { status: 500 })
    }
}