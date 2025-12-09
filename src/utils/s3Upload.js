import axios from "axios";
import { BASE_URL } from "./constants";

export const uploadFileToS3 = async (file, onProgress) => {
  // 1) Request signed URL
  const { data } = await axios.post(
    `${BASE_URL}/uploads/sign`,
    {
      fileName: file.name,
      fileType: file.type,
    },
    { withCredentials: true }
  );

  const { uploadUrl, fileUrl } = data;

  // 2) Upload file directly to S3
  await axios.put(uploadUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: (p) => {
      if (onProgress) {
        const percent = Math.round((p.loaded * 100) / (p.total || 1));
        onProgress(percent);
      }
    },
  });

  // 3) Return final S3 file URL
  return fileUrl;
};
