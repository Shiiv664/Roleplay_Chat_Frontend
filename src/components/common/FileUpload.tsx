import { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept: string;
  maxSize: number;
  preview?: boolean;
  disabled?: boolean;
}

const FileUpload = ({ onFileSelect, accept, maxSize, preview = true, disabled = false }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileType = file.type;
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return fileType.match(type.replace('*', '.*'));
    });

    if (!isValidType) {
      return `File type not supported. Accepted types: ${accept}`;
    }

    return null;
  };

  const handleFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSelectedFile(file);
    onFileSelect(file);

    if (preview && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="file-upload">
      <div
        className={`file-upload-area ${
          dragActive ? 'drag-active' : ''
        } ${disabled ? 'disabled' : ''} ${error ? 'error' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={disabled}
        />
        
        {previewUrl ? (
          <div className="file-preview">
            <img src={previewUrl} alt="Preview" className="preview-image" />
            <div className="file-info">
              <span className="file-name">{selectedFile?.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="clear-file-btn"
                disabled={disabled}
              >
                ×
              </button>
            </div>
          </div>
        ) : (
          <div className="file-upload-prompt">
            <div className="upload-icon">📁</div>
            <div className="upload-text">
              <p>Click to select or drag and drop an image</p>
              <p className="upload-hint">
                Supported: JPG, PNG, GIF, WebP (max {Math.round(maxSize / 1024 / 1024)}MB)
              </p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <div className="file-upload-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;