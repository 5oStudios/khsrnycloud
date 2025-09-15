import { useState, useCallback } from "react";
import { Upload, Image, Music } from "lucide-react";

interface FileUploadProps {
  type: "images" | "sounds";
  onFilesUploaded: (files: File[]) => void;
}

const FileUpload = ({ type, onFilesUploaded }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const acceptedTypes = type === "images" ? ".jpg,.jpeg,.png" : ".mp3";
  const icon = type === "images" ? Image : Music;
  const IconComponent = icon;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      if (type === "images") {
        return file.type.startsWith("image/");
      } else {
        return file.type.startsWith("audio/");
      }
    });
    
    if (validFiles.length > 0) {
      onFilesUploaded(validFiles);
    }
  }, [type, onFilesUploaded]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesUploaded(files);
    }
  }, [onFilesUploaded]);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div
        className={`upload-zone rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragOver ? "drag-over" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-input-${type}`)?.click()}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
            <IconComponent className="h-8 w-8 text-neon-purple" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Drop your {type} here
            </h3>
            <p className="text-muted-foreground text-sm">
              or click to browse files
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Supports: {type === "images" ? "JPG, PNG" : "MP3"}
            </p>
          </div>
          
          <Upload className="h-6 w-6 text-neon-cyan opacity-60" />
        </div>
      </div>
      
      <input
        id={`file-input-${type}`}
        type="file"
        accept={acceptedTypes}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;