import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Upload, AlertCircle } from 'lucide-react';

interface UploadBoxProps {
  onImageSelect: (imageUrl: string) => void;
}

export default function UploadBox({ onImageSelect }: UploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result);
      setError(null);
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="relative group h-full">
      {/* Ambient glow */}
      <div
        className={`absolute -inset-2 rounded-3xl blur-2xl pointer-events-none transition-all duration-700 ${
          isDragging
            ? 'bg-green-400/40 opacity-100'
            : 'bg-green-600/20 opacity-0 group-hover:opacity-100'
        }`}
      />

      <div
        className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-400 cursor-pointer h-full ${
          isDragging
            ? 'border-green-400 scale-[1.02] shadow-2xl shadow-green-500/40'
            : 'border-green-700/50 hover:border-green-500/70 hover:shadow-xl hover:shadow-green-600/20'
        }`}
        style={{
          background: isDragging
            ? 'linear-gradient(145deg, #052e16 0%, #064e3b 50%, #052e16 100%)'
            : 'linear-gradient(145deg, #031a0f 0%, #042f20 50%, #031a0f 100%)',
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Background dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(74,222,128,0.08) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* Decorative green blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-700/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative h-full flex flex-col items-center justify-center px-8 text-center">
          {/* Icon with animated rings */}
          <div className="mb-8 flex justify-center">
            <div className="relative flex items-center justify-center w-28 h-28">
              {/* Animated outer ring on drag */}
              {isDragging && (
                <span
                  className="absolute inset-0 rounded-full border-2 border-green-400/60"
                  style={{ animation: 'ping 1.2s cubic-bezier(0,0,0.2,1) infinite' }}
                />
              )}
              {/* Static ambient ring */}
              <div
                className={`absolute inset-2 rounded-full border border-green-500/20 transition-all duration-500 ${
                  isDragging ? 'scale-110 border-green-400/40' : 'scale-100'
                }`}
              />
              {/* Icon circle */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDragging
                    ? 'bg-green-500/40 shadow-[0_0_48px_rgba(74,222,128,0.5)]'
                    : 'bg-green-800/60 group-hover:bg-green-700/60 group-hover:shadow-[0_0_32px_rgba(74,222,128,0.25)]'
                }`}
              >
                <Upload
                  className={`transition-all duration-300 ${
                    isDragging
                      ? 'w-9 h-9 text-green-200 translate-y-[-2px]'
                      : 'w-8 h-8 text-green-400 group-hover:text-green-300'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h3
            className={`text-2xl font-bold tracking-tight mb-2 transition-colors duration-200 ${
              isDragging ? 'text-green-200' : 'text-green-100'
            }`}
          >
            {isDragging ? 'Drop your image here!' : 'Upload E-Waste Image'}
          </h3>

          {/* Subtitle */}
          <p className="text-green-400/80 text-base mb-7 leading-relaxed">
            {isDragging
              ? 'Release to start AI classification'
              : 'Drag & drop your image here, or click to browse files'}
          </p>

          {/* CTA pill */}
          <div
            className={`inline-flex items-center gap-2.5 px-7 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 select-none ${
              isDragging
                ? 'bg-green-400 text-green-950 shadow-lg shadow-green-400/40'
                : 'bg-green-700/40 text-green-300 border border-green-600/40 group-hover:bg-green-600/50 group-hover:text-green-200 group-hover:border-green-500/60'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            {isDragging ? 'Almost there!' : 'Choose File'}
          </div>

          {/* Format tags */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {['JPG', 'PNG', 'GIF', 'WebP'].map((fmt) => (
              <span
                key={fmt}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/60 text-green-400/70 border border-green-700/30"
              >
                {fmt}
              </span>
            ))}
            <span className="text-xs text-green-600/50 font-medium">· Max 10 MB</span>
          </div>
        </div>

        {/* Hidden input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Upload image"
        />

        {/* Error banner */}
        {error && (
          <div className="px-6 py-4 flex items-start gap-3 bg-red-950/60 border-t border-red-500/20 animate-slide-in">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300 font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
