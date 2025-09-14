import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  isOpen,
  onClose,
  initialIndex = 0
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape') onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Image Counter */}
        <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Main Image */}
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[currentIndex]}
            alt={`画像 ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </motion.div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-2 bg-black bg-opacity-50 p-2 rounded-lg">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                  }}
                  className={`w-12 h-12 rounded overflow-hidden border-2 transition-colors ${
                    index === currentIndex
                      ? 'border-white'
                      : 'border-transparent opacity-60 hover:opacity-80'
                  }`}
                >
                  <img
                    src={image}
                    alt={`サムネイル ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};