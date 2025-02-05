export const getEnvVariable = (key: string): string => {
    const value = process.env[key]
    if (!value) {
        throw new Error(`Please define the ${key} environment variable`)
    }
    return value
}

export const MONGODB_URI = getEnvVariable("MONGODB_URI")

