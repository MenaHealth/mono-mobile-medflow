import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || ""

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable")
}

if (process.env.NODE_ENV === "development") {
    // In development mode, use a new client for each request
    clientPromise = new Promise((resolve, reject) => {
        MongoClient.connect(uri)
            .then((client) => {
                resolve(client)
            })
            .catch(reject)
    })
} else {
    // In production mode, use a single client
    client = new MongoClient(uri)
    clientPromise = client.connect()
}

export const connectToDatabase = async (uri: string) => {
    try {
        const client = await clientPromise
        const db = client.db()
        return { client, db }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
        throw error
    }
}

