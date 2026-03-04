import React from "react";

const MediaViewer = ({ fileUrl, contentType }) => {
  if (!fileUrl) {
    return (
      <div className="max-w-2xl mx-auto mt-6">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-sm">
          <div className="text-4xl mb-3 opacity-70">📂</div>
          <p className="text-gray-800 font-semibold">No file selected</p>
          <p className="text-xs text-gray-500 mt-1">
            Upload a file to preview it here.
          </p>
        </div>
      </div>
    );
  }

  const isImage = contentType?.startsWith("image/");
  const isVideo = contentType?.startsWith("video/");
  const isPdf = contentType === "application/pdf";

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 bg-white border border-gray-200 p-5 rounded-3xl shadow-sm">
      <h2 className="text-lg font-extrabold mb-4 text-gray-900">
        File Preview
      </h2>

      {/* IMAGE */}
      {isImage && (
        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-[#f8fafc]">
          <img
            src={fileUrl}
            alt="Uploaded media"
            className="max-h-[500px] w-full object-contain"
          />
        </div>
      )}

      {/* VIDEO */}
      {isVideo && (
        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-[#f8fafc]">
          <video controls src={fileUrl} className="max-h-[500px] w-full">
            Your browser does not support video playback.
          </video>
        </div>
      )}

      {/* PDF */}
      {isPdf && (
        <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
          <iframe
            src={fileUrl}
            title="PDF Preview"
            className="w-full h-[600px]"
          />
        </div>
      )}

      {/* OTHER FILE TYPES */}
      {!isImage && !isVideo && !isPdf && (
        <div className="text-center mt-4">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-[#e13429] hover:bg-[#c62d23] text-white font-medium transition shadow-sm"
          >
            Open File
          </a>
        </div>
      )}
    </div>
  );
};

export default MediaViewer;