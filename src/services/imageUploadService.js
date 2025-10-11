/**
 * Image Upload Service
 * Handles image uploads to Firebase Storage
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../firebase";

/**
 * Upload image to Firebase Storage
 * @param {File} file - Image file from input
 * @param {string} folder - Folder path (e.g., 'banners', 'menuItems')
 * @param {string} clientId - Store ID
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export const uploadImage = async (file, folder, clientId) => {
  try {
    // Validate file
    if (!file) {
      throw new Error("No file provided");
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("Image size must be less than 5MB");
    }

    // Create unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const filePath = `${clientId}/${folder}/${fileName}`;

    // Create storage reference
    const storageRef = ref(storage, filePath);

    // Set metadata with CORS-friendly headers
    const metadata = {
      contentType: file.type,
      cacheControl: "public, max-age=31536000", // 1 year cache
      customMetadata: {
        uploadedBy: "manager-dashboard",
        clientId: clientId,
      },
    };

    // Upload file
    console.log(`📤 Uploading image to: ${filePath}`);
    const snapshot = await uploadBytes(storageRef, file, metadata);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log(`✅ Image uploaded successfully: ${downloadURL}`);

    return downloadURL;
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    throw error;
  }
};

/**
 * Delete image from Firebase Storage
 * @param {string} imageUrl - Full download URL of the image
 */
export const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Skip if it's not a Firebase Storage URL
    if (!imageUrl.includes("firebasestorage.googleapis.com")) {
      console.log("Not a Firebase Storage URL, skipping deletion");
      return;
    }

    // Extract path from URL
    // URL format: https://firebasestorage.googleapis.com/v0/b/bucket/o/path?alt=media&token=...
    const decodedUrl = decodeURIComponent(imageUrl);
    const pathMatch = decodedUrl.match(/o\/(.*?)\?/);

    if (!pathMatch) {
      console.warn("Could not extract path from URL");
      return;
    }

    const path = pathMatch[1];
    const storageRef = ref(storage, path);

    await deleteObject(storageRef);
    console.log(`✅ Image deleted successfully: ${path}`);
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    // Don't throw error - deletion failures shouldn't block other operations
  }
};

/**
 * Compress and resize image before upload (optional utility)
 * @param {File} file - Original image file
 * @param {number} maxWidth - Maximum width (default 1200)
 * @param {number} maxHeight - Maximum height (default 1200)
 * @param {number} quality - Image quality 0-1 (default 0.8)
 * @returns {Promise<Blob>} - Compressed image blob
 */
export const compressImage = (
  file,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          file.type,
          quality
        );
      };

      img.onerror = (error) => reject(error);
    };

    reader.onerror = (error) => reject(error);
  });
};
