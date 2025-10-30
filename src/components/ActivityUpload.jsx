import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useParams } from "react-router-dom";

const ActivityUpload = () => {
  const { eventId } = useParams();
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ kind: "", msg: "" });
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const MAX_LEN = 500;

  const onFileSelect = (f) => {
    if (!f) return;
    setFile(f);
    setStatus({ kind: "", msg: "" });
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    onFileSelect(f);
  };

  useEffect(() => {
    // Clean up blob URLs to avoid memory leaks
    return () => {
      if (file && typeof file !== "string") {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !text.trim()) {
      setStatus({ kind: "error", msg: "Please add a caption and choose a file." });
      return;
    }

    try {
      setUploading(true);
      setStatus({ kind: "", msg: "" });

      // 1) Get signed URL
      const { data } = await axios.post(
        `${BASE_URL}/uploads/sign`,
        { fileName: file.name, fileType: file.type },
        { withCredentials: true }
      );
      const { uploadUrl, fileUrl } = data;

      // 2) Upload to S3
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (p) => {
          const pct = Math.round((p.loaded * 100) / (p.total || 1));
          setProgress(pct);
        },
      });

      // 3) Determine media kind
      const kind = file.type.startsWith("image/") ? "image" : "video";

      // 4) Create activity
      const activityPayload = {
        event: eventId,
        type: kind,
        text,
        media: [
          {
            kind,
            url: fileUrl,
            contentType: file.type,
            sizeBytes: file.size,
          },
        ],
        visibility: "public",
        tags: ["upload"],
      };

      await axios.post(`${BASE_URL}/activities`, activityPayload, {
        withCredentials: true,
      });

      setStatus({ kind: "ok", msg: "Upload complete!" });
      setFile(null);
      setText("");
      setProgress(0);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setStatus({
        kind: "error",
        msg: err?.response?.data?.message || "Upload failed. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const isImage = file?.type?.startsWith("image/");
  const isVideo = file?.type?.startsWith("video/");
  const sizeMB = file ? (file.size / 1024 / 1024).toFixed(2) : null;

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6">
      {/* Header */}
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100">
          <svg width="14" height="14" viewBox="0 0 24 24" className="fill-current">
            <path d="M19 3H5a2 2 0 0 0-2 2v12.8A1.2 1.2 0 0 0 4.2 19l3.3-3.3H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
          </svg>
          Event ID: {eventId}
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900">
          Upload Activity
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Share an image or video with a short caption. Files are stored securely on S3.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6">
          {/* Caption */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="caption" className="block text-sm font-medium text-neutral-800">
                Caption / Description
              </label>
              <span className="text-xs text-neutral-500">{text.length}/{MAX_LEN}</span>
            </div>
            <textarea
              id="caption"
              className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write something meaningful about this activity..."
              value={text}
              maxLength={MAX_LEN}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />
          </div>

          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 transition-colors cursor-pointer ${
              dragOver ? "border-indigo-500 bg-indigo-50" : "border-neutral-300 hover:bg-neutral-50"
            }`}
            aria-label="Upload file by clicking or dragging and dropping"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-100">
                <svg width="28" height="28" viewBox="0 0 24 24" className="fill-neutral-500">
                  <path d="M12 16a1 1 0 0 1-1-1V9.41l-1.3 1.3a1 1 0 1 1-1.4-1.42l3-3a1 1 0 0 1 1.4 0l3 3a1 1 0 0 1-1.4 1.42L13 9.4V15a1 1 0 0 1-1 1Z" />
                  <path d="M19 20H5a3 3 0 0 1-3-3v-2a1 1 0 1 1 2 0v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2a1 1 0 1 1 2 0v2a3 3 0 0 1-3 3Z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">
                  {file ? (
                    <>
                      {file.name}{" "}
                      <span className="ml-2 inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 ring-1 ring-neutral-200">
                        {file.type.split("/")[0]} • {sizeMB} MB
                      </span>
                    </>
                  ) : (
                    <>Drag & drop a file here, or <span className="text-indigo-600 underline">browse</span></>
                  )}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Supports images and videos. Large files may take longer depending on your network.
                </p>
              </div>
            </div>

            {/* Hidden input */}
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => onFileSelect(e.target.files?.[0])}
            />

            {/* Inline progress overlay */}
            {uploading && (
              <div className="absolute inset-0 rounded-2xl bg-white/60 backdrop-blur-[1px]">
                <div className="absolute inset-x-0 bottom-0 h-1.5 overflow-hidden rounded-b-2xl">
                  <div
                    className="h-full bg-indigo-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          {file && (
            <div className="overflow-hidden rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between bg-neutral-50 px-4 py-2 text-sm">
                <span className="text-neutral-700">
                  {file.type} • {sizeMB} MB
                </span>
                <button
                  type="button"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => {
                    setFile(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  Remove
                </button>
              </div>
              <div className="p-4">
                {isImage && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="mx-auto max-h-80 rounded-md object-contain"
                  />
                )}
                {isVideo && (
                  <video
                    controls
                    className="mx-auto max-h-80 rounded-md"
                    src={URL.createObjectURL(file)}
                  />
                )}
              </div>
            </div>
          )}

          {/* Submit + status */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              onClick={() => {
                setFile(null);
                setText("");
                setStatus({ kind: "", msg: "" });
                setProgress(0);
                if (inputRef.current) inputRef.current.value = "";
              }}
              disabled={uploading}
            >
              Reset
            </button>

            <button
              type="submit"
              className={`inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60`}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" opacity=".25" />
                    <path d="M4 12a8 8 0 0 1 8-8" stroke="white" strokeWidth="4" fill="none" />
                  </svg>
                  Uploading…
                </>
              ) : (
                "Submit Activity"
              )}
            </button>
          </div>

          {status.msg && (
            <div
              className={`mt-3 rounded-md px-3 py-2 text-sm ${
                status.kind === "ok"
                  ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                  : "bg-red-50 text-red-700 ring-1 ring-red-200"
              }`}
            >
              {status.msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ActivityUpload;
