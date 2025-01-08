// "use client";
// import { useState } from "react";
// import { uploadToS3 } from "@/services/s3";
// import { saveProjectImages } from "@/utils/storage";
// import redis from '@/utils/redisClient';

// export default function ProjectImageUpload({ projectId }) {
//   const [files, setFiles] = useState([]);
//   const [error, setError] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const handleFileChange = (event) => {
//     const selectedFiles = Array.from(event.target.files);
//     setError("");

//     if (selectedFiles.length > 1000) {
//       setError("Maximum 1000 files can be uploaded at once");
//       setFiles([]);
//       return;
//     }

//     const invalidFiles = selectedFiles.filter(
//       (file) => !file.type.startsWith("image/")
//     );
//     if (invalidFiles.length > 0) {
//       setError("Please upload only image files");
//       setFiles([]);
//       return;
//     }

//     setFiles(selectedFiles);
//   };

//   const handleUpload = async () => {
//     if (!files.length) {
//       setError("Please select files first");
//       return;
//     }

//     setUploading(true);
//     setProgress(0);
//     setError("");

//     try {
//       const uploadedImages = [];

//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         const fileName = `${Date.now()}-${file.name}`;

//         const uploadResult = await uploadToS3(file, fileName);

//         if (!uploadResult.success) {
//           throw new Error(uploadResult.error);
//         }

//         // Add to processing queue
//         const queueResponse = await fetch("/api/queue/add", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             filename: uploadResult.key,
//             originalName: file.name,
//             url: uploadResult.url,
//             projectId,
//           }),
//         });

//         if (!queueResponse.ok) {
//           throw new Error("Failed to add to processing queue");
//         }

//         uploadedImages.push({
//           url: uploadResult.url,
//           filename: uploadResult.key,
//           originalName: file.name,
//         });

//         setProgress(((i + 1) / files.length) * 100);
//       }

//       // Save images to project
//       await saveProjectImages(projectId, uploadedImages);

//       setFiles([]);
//     } catch (err) {
//       setError(err.message || "Error uploading files");
//       console.error("Upload error:", err);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center space-x-4">
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={handleFileChange}
//           className="block w-full text-sm text-gray-500
//                         file:mr-4 file:py-2 file:px-4
//                         file:rounded-full file:border-0
//                         file:text-sm file:font-semibold
//                         file:bg-blue-50 file:text-blue-700
//                         hover:file:bg-blue-100"
//         />
//         <button
//           onClick={handleUpload}
//           disabled={!files.length || uploading}
//           className={`px-4 py-2 rounded-lg text-white font-medium
//                         ${
//                           files.length && !uploading
//                             ? "bg-blue-500 hover:bg-blue-600"
//                             : "bg-gray-300 cursor-not-allowed"
//                         }`}
//         >
//           {uploading ? "Uploading..." : "Upload"}
//         </button>
//       </div>

//       {files.length > 0 && (
//         <p className="text-sm text-gray-600">
//           Selected files: {files.length} {files.length === 1 ? "file" : "files"}
//         </p>
//       )}

//       {error && <p className="text-sm text-red-500">{error}</p>}

//       {uploading && (
//         <div className="w-full bg-gray-200 rounded-full h-2.5">
//           <div
//             className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//       )}
//     </div>
//   );
// }







"use client";
import { useState } from "react";
import { uploadToS3 } from "@/services/s3";
import { saveProjectImages } from "@/utils/storage";

export default function ProjectImageUpload({ projectId }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setError("");

    if (selectedFiles.length > 1000) {
      setError("Maximum 1000 files can be uploaded at once");
      setFiles([]);
      return;
    }

    const invalidFiles = selectedFiles.filter(
      (file) => !file.type.startsWith("image/")
    );
    if (invalidFiles.length > 0) {
      setError("Please upload only image files");
      setFiles([]);
      return;
    }

    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (!files.length) {
      setError("Please select files first");
      return;
    }

    setUploading(true);
    setProgress(0);
    setError("");

    try {
      const uploadedImages = [];
      const batchSize = 50; // Process files in batches of 50
      const totalBatches = Math.ceil(files.length / batchSize);

      for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const batchStart = batchIndex * batchSize;
        const batchEnd = Math.min((batchIndex + 1) * batchSize, files.length);
        const currentBatch = files.slice(batchStart, batchEnd);

        // Process each file in the current batch
        const batchPromises = currentBatch.map(async (file, index) => {
          const fileName = `${Date.now()}-${file.name}`;
          
          try {
            // Upload to S3
            const uploadResult = await uploadToS3(file, fileName);
            if (!uploadResult.success) {
              throw new Error(uploadResult.error);
            }

            // Add to Bull queue through API route
            const queueResponse = await fetch("/api/queue/add", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                filename: uploadResult.key,
                originalName: file.name,
                url: uploadResult.url,
                projectId,
              }),
            });

            if (!queueResponse.ok) {
              throw new Error("Failed to add to processing queue");
            }

            const queueData = await queueResponse.json();
            if (!queueData.jobId) {
              throw new Error("No job ID returned from queue");
            }
            
            // Update progress
            const currentProgress = ((batchStart + index + 1) / files.length) * 100;
            setProgress(currentProgress);

            return {
              url: uploadResult.url,
              filename: uploadResult.key,
              originalName: file.name,
              jobId: queueData.jobId
            };
          } catch (error) {
            console.error('Upload error:', error);
            throw error;
          }
        });

        // Wait for current batch to complete
        const batchResults = await Promise.all(batchPromises);
        uploadedImages.push(...batchResults);
      }

      // Save all processed images to project
      await saveProjectImages(projectId, uploadedImages);

      setFiles([]);
      setProgress(100);
    } catch (err) {
      setError(err.message || "Error uploading files");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          disabled={!files.length || uploading}
          className={`px-4 py-2 rounded-lg text-white font-medium
                        ${
                          files.length && !uploading
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {files.length > 0 && (
        <p className="text-sm text-gray-600">
          Selected files: {files.length} {files.length === 1 ? "file" : "files"}
        </p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}



















