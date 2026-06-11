import { cn } from '@/utils/format';
import { Upload, X, File, Image, FileText } from 'lucide-react';
import type { ChangeEvent, ReactNode } from 'react';
import { useState, useRef } from 'react';

interface UploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  value?: File[];
  onChange?: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  disabled?: boolean;
  className?: string;
  listType?: 'text' | 'picture';
  children?: ReactNode;
}

export function UploadComponent({
  accept,
  multiple = false,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  value = [],
  onChange,
  onUpload,
  disabled = false,
  className,
  listType = 'text',
  children
}: UploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize) {
        alert(`文件 ${file.name} 超过最大限制 ${maxSize / 1024 / 1024}MB`);
        return false;
      }
      return true;
    });

    const totalFiles = [...value, ...validFiles];
    if (totalFiles.length > maxFiles) {
      alert(`最多上传 ${maxFiles} 个文件`);
      return;
    }

    onChange?.(totalFiles);
    
    if (onUpload) {
      setUploading(true);
      onUpload(validFiles).finally(() => setUploading(false));
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const getFileIcon = (file: File): ReactNode => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-20 h-20 text-blue-500" />;
    }
    if (file.type.includes('pdf') || file.type.includes('document')) {
      return <FileText className="w-20 h-20 text-red-500" />;
    }
    return <File className="w-20 h-20 text-gray-500" />;
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'border-2 border-dashed rounded-12 p-32 text-center cursor-pointer',
          'transition-all duration-200',
          dragActive ? 'border-[#38B2AC] bg-[#38B2AC]/5' : 'border-gray-200 hover:border-[#38B2AC]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
        
        {children || (
          <div className="flex flex-col items-center gap-12">
            <Upload className={cn(
              'w-40 h-40',
              dragActive ? 'text-[#38B2AC]' : 'text-gray-400'
            )} />
            <div className="text-sm text-gray-600">
              <span className="text-[#38B2AC] font-medium">点击上传</span>
              <span className="text-gray-400"> 或拖拽文件到此区域</span>
            </div>
            <div className="text-xs text-gray-400">
              支持 {accept || '所有格式'}，最大 {maxSize / 1024 / 1024}MB
            </div>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="mt-16 space-y-8">
          {value.map((file, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center gap-12 p-12 rounded-8',
                'bg-gray-50 border border-gray-100'
              )}
            >
              {listType === 'picture' && file.type.startsWith('image/') ? (
                <div className="w-48 h-48 rounded-4 overflow-hidden bg-gray-100">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                getFileIcon(file)
              )}
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-700 truncate">
                  {file.name}
                </div>
                <div className="text-xs text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
              
              <button
                className="p-8 rounded-full hover:bg-gray-200 transition-colors"
                onClick={() => handleRemove(index)}
                disabled={uploading}
              >
                <X className="w-16 h-16 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}