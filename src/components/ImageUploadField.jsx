import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Typography,
  IconButton,
  Alert,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";

/**
 * ImageUploadField Component
 * Allows user to either upload an image or paste a URL
 */
const ImageUploadField = ({
  value,
  onChange,
  onUpload,
  label = "Image",
  required = false,
  folder = "images",
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadMode, setUploadMode] = useState("upload"); // "upload" or "url"

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      // Call parent's upload handler
      const downloadURL = await onUpload(file, folder);
      onChange(downloadURL);
    } catch (error) {
      setUploadError(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleClearImage = () => {
    onChange("");
  };

  return (
    <Box>
      {/* Toggle between Upload and URL */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          size="small"
          variant={uploadMode === "upload" ? "contained" : "outlined"}
          onClick={() => setUploadMode("upload")}
          sx={{ textTransform: "none" }}
        >
          Upload Image
        </Button>
        <Button
          size="small"
          variant={uploadMode === "url" ? "contained" : "outlined"}
          onClick={() => setUploadMode("url")}
          sx={{ textTransform: "none" }}
        >
          Use URL
        </Button>
      </Box>

      {/* Upload Mode */}
      {uploadMode === "upload" && (
        <Box>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload-input"
            type="file"
            onChange={handleFileSelect}
            disabled={uploading || disabled}
          />
          <label htmlFor="image-upload-input">
            <Button
              variant="outlined"
              component="span"
              startIcon={
                uploading ? <CircularProgress size={20} /> : <CloudUpload />
              }
              disabled={uploading || disabled}
              fullWidth
              sx={{ textTransform: "none" }}
            >
              {uploading ? "Uploading..." : `Upload ${label}`}
            </Button>
          </label>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.5 }}
          >
            JPG, PNG, GIF, WEBP (Max 5MB)
          </Typography>
        </Box>
      )}

      {/* URL Mode */}
      {uploadMode === "url" && (
        <TextField
          fullWidth
          label={`${label} URL`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          required={required}
          disabled={disabled}
        />
      )}

      {/* Error Message */}
      {uploadError && (
        <Alert
          severity="error"
          sx={{ mt: 1 }}
          onClose={() => setUploadError("")}
        >
          {uploadError}
        </Alert>
      )}

      {/* Image Preview */}
      {value && (
        <Box sx={{ mt: 2, position: "relative" }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1 }}
          >
            Preview:
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: 200,
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              position: "relative",
            }}
          >
            <img
              src={value}
              alt="Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                const parent = e.target.parentElement;
                if (parent && !parent.querySelector(".error-message")) {
                  const errorDiv = document.createElement("div");
                  errorDiv.className = "error-message";
                  errorDiv.style.cssText =
                    "display: flex; align-items: center; justify-content: center; height: 100%; color: #999;";
                  errorDiv.textContent = "❌ Invalid image";
                  parent.appendChild(errorDiv);
                }
              }}
            />
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                bgcolor: "rgba(0,0,0,0.6)",
                color: "white",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
              onClick={handleClearImage}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ImageUploadField;
