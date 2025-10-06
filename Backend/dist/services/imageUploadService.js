"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = uploadImage;
exports.uploadMultipleImages = uploadMultipleImages;
exports.deleteImage = deleteImage;
const storage_1 = require("@google-cloud/storage");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
// Initialize Google Cloud Storage
const storage = new storage_1.Storage({
    keyFilename: path_1.default.join(process.cwd(), "credentials.json"),
});
const bucketName = "wholesale-product-images"; // Replace with your actual bucket name
const bucket = storage.bucket(bucketName);
async function uploadImage(file) {
    const fileName = `${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`;
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
async function uploadMultipleImages(files) {
    const uploadPromises = files.map(file => uploadImage(file));
    return Promise.all(uploadPromises);
}
async function deleteImage(imageUrl) {
    const fileName = imageUrl.split('/').pop();
    if (fileName) {
        await bucket.file(fileName).delete();
    }
}
