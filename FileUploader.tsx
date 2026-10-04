import React, { useRef, useState } from 'react';
import { Upload, File as FileIcon, X, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { formatFileSize } from '../utils/fileHelpers';

interface FileUploaderProps {
  accept: string;
  acceptLabel: string;
  multiple?: boolean;
  maxSizeMB?: number;
  files: File[];
  onFilesSelected: (files: File[]) => void;
  onRemoveFile?: (index: number) => void;
  onClearAll?: () => void;
  onLoadSample?: () => void;
  sampleLabel?: string;
  helperText?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  acceptLabel,
  multiple = false,
  maxSizeMB = 50,
  files,
  onFilesSelected,
  onRemoveFile,
  onClearAll,
  onLoadSample,
  sampleLabel = 'Load Sample File',
  helperText,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateAndEmit = (incomingList: FileList | null) => {
    if (!incomingList || incomingList.length === 0) return;
    setValidationError(null);

    const maxBytes = maxSizeMB * 1024 * 1024;
    const validFiles: File[] = [];
    const allowedTokens = accept
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    for (let i = 0; i < incomingList.length; i++) {
      const file = incomingList[i];
      if (file.size > maxBytes) {
        setValidationError(
          `File "${file.name}" (${formatFileSize(file.size)}) exceeds the ${maxSizeMB} MB limit.`
        );
        continue;
      }

      const fileNameLower = file.name.toLowerCase();
      const fileTypeLower = (file.type || '').toLowerCase();

      const matchesType =
        allowedTokens.length === 0 ||
        allowedTokens.some((token) => {
          if (token.startsWith('.')) {
            return fileNameLower.endsWith(token);
          }
          if (token.endsWith('/*')) {
            const baseMime = token.replace('/*', '');
            return fileTypeLower.startsWith(baseMime);
          }
          return fileTypeLower === token;
        });

      if (!matchesType) {
        setValidationError(
          `Unsupported file format for "${file.name}". Expected: ${acceptLabel}.`
        );
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      if (multiple) {
        onFilesSelected([...files, ...validFiles]);
      } else {
        onFilesSelected([validFiles[0]]);
      }
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    validateAndEmit(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed p-6 sm:p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-600 bg-blue-50/60'
            : 'border-slate-300 bg-slate-50/70 hover:border-blue-500/80 hover:bg-slate-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => validateAndEmit(e.target.files)}
          className="sr-only"
          id="toolnova-file-input"
        />

        <div className="mx-auto w-12 h-12 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center mb-3">
          <Upload className="w-6 h-6" aria-hidden="true" />
        </div>

        <label
          htmlFor="toolnova-file-input"
          className="block text-base sm:text-lg font-semibold text-slate-900 cursor-pointer"
        >
          {multiple ? 'Drop files here or click to browse' : 'Drop a file here or click to browse'}
        </label>

        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Supported formats: <span className="font-medium text-slate-700">{acceptLabel}</span> · Max size:{' '}
          <span className="font-mono tabular-nums">{maxSizeMB} MB</span>
        </p>

        {helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => inputRef.current?.click()}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            {files.length > 0 && !multiple ? 'Replace File' : multiple ? 'Select Files' : 'Select File'}
          </Button>

          {onLoadSample && (
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setValidationError(null);
                onLoadSample();
              }}
              leftIcon={<Sparkles className="w-4 h-4 text-blue-600" />}
            >
              {sampleLabel}
            </Button>
          )}
        </div>
      </div>

      {validationError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{validationError}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          <div className="px-4 py-2.5 flex items-center justify-between bg-slate-50/80 rounded-t-xl">
            <span className="text-xs font-semibold text-slate-700">
              Selected {files.length === 1 ? 'File' : `Files (${files.length})`}
            </span>
            {onClearAll && files.length > 1 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs font-medium text-red-600 hover:text-red-700 cursor-pointer"
              >
                Remove All
              </button>
            )}
          </div>
          {files.map((file, idx) => (
            <div key={`${file.name}-${idx}`} className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <FileIcon className="w-4 h-4 text-blue-600 shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500 font-mono tabular-nums">
                    {formatFileSize(file.size)} · {file.type || 'Binary File'}
                  </p>
                </div>
              </div>
              {onRemoveFile && (
                <button
                  type="button"
                  onClick={() => onRemoveFile(idx)}
                  aria-label={`Remove ${file.name}`}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
