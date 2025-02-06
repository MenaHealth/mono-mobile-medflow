// utils/encryptPhoto.ts
import crypto from 'crypto';

export const encryptPhoto = (file: File, encryptionKey: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const fileContent = Buffer.from(reader.result as ArrayBuffer); // Convert file to Buffer
            const iv = crypto.randomBytes(16); // Generate a random IV
            const key = Buffer.from(encryptionKey, 'hex'); // Convert encryptionKey to Buffer

            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            const encrypted = Buffer.concat([cipher.update(fileContent), cipher.final()]);

            const encryptedBase64 = iv.toString('hex') + ':' + encrypted.toString('hex');
            resolve(encryptedBase64);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};

export const decryptPhoto = async (encryptedBase64: string, encryptionKey: string): Promise<Blob> => {
    try {
        const [ivHex, encryptedHex] = encryptedBase64.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedData = Buffer.from(encryptedHex, 'hex');
        const key = Buffer.from(encryptionKey, 'hex');

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        const decryptedBuffer = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

        return new Blob([decryptedBuffer], { type: 'image/webp' });
    } catch (error) {
        console.error('Error decrypting photo:', error);
        throw error;
    }
};

export const generateEncryptionKey = () => {
    return crypto.randomBytes(32).toString('hex'); // Generate a 256-bit encryption key
};

export const convertToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.src = reader.result as string;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to create canvas context'));
                    return;
                }
                ctx.drawImage(image, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to convert image to WebP'));
                    }
                }, 'image/webp', 0.9);
            };
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

// Function to calculate SHA-256 hash of a File object
export const calculateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};