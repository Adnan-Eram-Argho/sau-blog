export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message ?? "Upload failed");
  return data.secure_url as string;
}

export function getPublicIdFromUrl(url: string): string {
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  const nameWithoutExt = filename.split(".")[0];

  if (folder && folder !== "upload" && !folder.startsWith("v")) {
    return `${folder}/${nameWithoutExt}`;
  }
  return nameWithoutExt;
}