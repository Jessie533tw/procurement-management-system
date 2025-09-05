import React, { useCallback, useState } from 'react';
import { Upload, X, File, Image, FileText, Download } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadProgress?: number;
  status: 'uploading' | 'completed' | 'error';
}

interface FileUploadProps {
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  onFilesChange?: (files: FileItem[]) => void;
  existingFiles?: FileItem[];
  disabled?: boolean;
  multiple?: boolean;
  label?: string;
  helperText?: string;
}

export function FileUpload({
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  onFilesChange,
  existingFiles = [],
  disabled = false,
  multiple = true,
  label,
  helperText,
}: FileUploadProps) {
  const [files, setFiles] = useState<FileItem[]>(existingFiles);
  const [isDragOver, setIsDragOver] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={20} className="text-blue-500" />;
    if (type.includes('pdf')) return <FileText size={20} className="text-red-500" />;
    if (type.includes('word') || type.includes('document')) return <FileText size={20} className="text-blue-600" />;
    if (type.includes('sheet') || type.includes('excel')) return <FileText size={20} className="text-green-600" />;
    return <File size={20} className="text-gray-500" />;
  };

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || disabled) return;

    const newFiles: FileItem[] = [];
    const currentFileCount = files.length;

    Array.from(selectedFiles).forEach((file, index) => {
      // Check file count limit
      if (currentFileCount + newFiles.length >= maxFiles) return;

      // Check file size
      if (file.size > maxSize) {
        alert(`檔案 "${file.name}" 超過大小限制 (${formatFileSize(maxSize)})`);
        return;
      }

      // Check file type
      const isTypeAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        return file.type.match(type.replace('*', '.*'));
      });

      if (!isTypeAccepted) {
        alert(`檔案類型不支援: ${file.name}`);
        return;
      }

      // Create file item
      const fileItem: FileItem = {
        id: `${Date.now()}-${index}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        status: 'uploading',
      };

      newFiles.push(fileItem);

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setFiles(prevFiles => {
          const updatedFiles = prevFiles.map(f => {
            if (f.id === fileItem.id) {
              const progress = f.uploadProgress! + Math.random() * 30;
              if (progress >= 100) {
                clearInterval(uploadInterval);
                return {
                  ...f,
                  uploadProgress: 100,
                  status: 'completed' as const,
                  url: URL.createObjectURL(file),
                };
              }
              return { ...f, uploadProgress: progress };
            }
            return f;
          });
          
          onFilesChange?.(updatedFiles);
          return updatedFiles;
        });
      }, 200);
    });

    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    }
  }, [files, maxFiles, maxSize, acceptedTypes, disabled, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const downloadFile = (file: FileItem) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400 cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => {
          if (!disabled) {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = multiple;
            input.accept = acceptedTypes.join(',');
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              handleFileSelect(target.files);
            };
            input.click();
          }
        }}
      >
        <Upload className={`mx-auto h-12 w-12 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
        <div className="mt-4">
          <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
            {isDragOver ? '放開以上傳檔案' : '點擊上傳或拖放檔案到這裡'}
          </p>
          {!disabled && (
            <p className="text-xs text-gray-500 mt-1">
              支援格式: {acceptedTypes.join(', ')} | 最大檔案: {formatFileSize(maxSize)} | 最多 {maxFiles} 個檔案
            </p>
          )}
        </div>
      </div>

      {helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            已上傳檔案 ({files.length}/{maxFiles})
          </h4>
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Upload Progress */}
                {file.status === 'uploading' && (
                  <div className="w-20">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">
                        {Math.round(file.uploadProgress || 0)}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Status Indicator */}
                {file.status === 'completed' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    完成
                  </span>
                )}

                {file.status === 'error' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    錯誤
                  </span>
                )}

                {/* Action Buttons */}
                <div className="flex items-center space-x-1">
                  {file.status === 'completed' && file.url && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFile(file);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="下載檔案"
                    >
                      <Download size={14} />
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(file.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="刪除檔案"
                    disabled={disabled}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}