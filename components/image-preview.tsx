import React from 'react';

interface ImagePreviewProps {
  imageUrl: string;
}

export default function ImagePreview({ imageUrl }: ImagePreviewProps) {
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-muted/30 shadow-sm">
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      {/* Subtle inner shadow for depth */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/10 pointer-events-none" />
    </div>
  );
}
