// apps/web/app/api/patient/[id]/triage/route.ts
import dbConnect from "@/utils/database";
import Patient from "@/models/patient";
import { ObjectId } from "mongodb";

export async function PATCH(req, { params }) {
    const { id } = params;
    const { specialty, triagedBy } = await req.json();

    await dbConnect();

    // Validate patient ID
    if (!ObjectId.isValid(id)) {
        return new Response(JSON.stringify({ message: "Invalid patient ID format." }), { status: 400 });
    }

    try {
        // Find the patient by ID and update specialty and triagedBy
        const patient = await Patient.findByIdAndUpdate(
            id,
            {
                $set: { specialty, triagedBy },
                updatedAt: new Date(),
            },
            { new: true, runValidators: true }
        );

        if (!patient) {
            return new Response(JSON.stringify({ message: "Patient not found." }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Patient specialty updated successfully!", patient }), { status: 200 });
    } catch (error) {
        console.error("Error updating patient:", error);
        return new Response(JSON.stringify({ message: "Failed to update patient.", error: error.message }), { status: 500 });
    }
}