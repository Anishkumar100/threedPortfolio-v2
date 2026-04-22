import { v2 as cloudinary } from 'cloudinary';
import logger from './logger.js';

console.log(`Cloud Name Check: ->${process.env.CLOUDINARY_CLOUD_NAME}<-`);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim()
});
export const uploadToCloudinary = async (fileBuffer, options = {}) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'portfolio',
          resource_type: 'auto',
          transformation: options.transformation || undefined,
          ...options,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(fileBuffer);
    });

    logger.info(`Cloudinary upload: ${result.public_id} → ${result.secure_url}`);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (err) {
    logger.error(`Cloudinary upload failed: ${err.message}`);
    throw err;
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    logger.info(`Cloudinary delete: ${publicId}`);
  } catch (err) {
    logger.error(`Cloudinary delete failed: ${err.message}`);
  }
};

export default cloudinary;
