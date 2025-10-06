import { Storage } from "@google-cloud/storage";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(process.cwd(), "credentials.json"),
});

const bucketName = "wholesale-product-images"; // Replace with your actual bucket name
const bucket = storage.bucket(bucketName);

export async function uploadImage(file: Express.Multer.File): Promise<string> {
  const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
  const fileUpload = bucket.file(fileName);

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
    public: true, // Make the file publicly accessible
  });

  return new Promise((resolve, reject) => {
    stream.on("error", (err) => {
      reject(err);
    });

    stream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      resolve(publicUrl);
    });

    stream.end(file.buffer);
  });
}

export async function uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadImage(file));
  return Promise.all(uploadPromises);
}

export async function deleteImage(imageUrl: string): Promise<void> {
  const fileName = imageUrl.split('/').pop();
  if (fileName) {
    await bucket.file(fileName).delete();
  }
}
