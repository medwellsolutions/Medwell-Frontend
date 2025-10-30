import React from "react";

const MediaViewer = ({ fileUrl, contentType }) => {
  if (!fileUrl) {
    return (
      <div className="text-center text-gray-500 p-4 border border-dashed rounded-xl">
        No file selected
      </div>
    );
  }

  const isImage = contentType?.startsWith("image/");
  const isVideo = contentType?.startsWith("video/");
  const isPdf = contentType === "application/pdf";

  return (
    <div className="w-full max-w-2xl mx-auto mt-5 bg-base-100 p-4 rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold mb-3 text-base-content">File Preview</h2>

      {isImage && (
        <img
          src={fileUrl}
          alt="Uploaded media"
          className="max-h-[500px] w-full object-contain rounded-lg border border-base-300"
        />
      )}

      {isVideo && (
        <video
          controls
          src={fileUrl}
          className="max-h-[500px] w-full rounded-lg border border-base-300"
        >
          Your browser does not support video playback.
        </video>
      )}

      {isPdf && (
        <iframe
          src={fileUrl}
          title="PDF Preview"
          className="w-full h-[600px] border border-base-300 rounded-lg"
        ></iframe>
      )}

      {!isImage && !isVideo && !isPdf && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link link-primary"
        >
          Open File
        </a>
      )}
    </div>
  );
};

export default MediaViewer;
