export type UploadSignature = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
};

export type CloudinaryUploadResult = {
  secureUrl: string;
  fileName: string;
  fileType: string;
  size: number;
};

const MAX_BYTES = 10_485_760;

export function validateAttachmentFile(file: File): string | null {
  if (file.size > MAX_BYTES) {
    return "File must be 10 MB or smaller.";
  }
  return null;
}

export async function uploadToCloudinary(file: File, signature: UploadSignature): Promise<CloudinaryUploadResult> {
  const validationError = validateAttachmentFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);

  const url = `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`;
  const response = await fetch(url, { method: "POST", body: formData });

  if (!response.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = (await response.json()) as {
    secure_url?: string;
    original_filename?: string;
    bytes?: number;
    format?: string;
  };

  if (!data.secure_url) {
    throw new Error("Cloudinary did not return a file URL");
  }

  return {
    secureUrl: data.secure_url,
    fileName: data.original_filename ?? file.name,
    fileType: (data.format ?? file.type) || "file",
    size: data.bytes ?? file.size,
  };
}
