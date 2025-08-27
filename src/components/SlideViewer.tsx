import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  Calendar,
  Tag,
  ImageOff,
} from 'lucide-react';

interface ImprovementEntry {
  dateTime: string;
  controlNumber: string;
  category: string;
  entryTitle: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  improvement: string;
  improvementEffect: string;
}

interface SlideViewerProps {
  entries: ImprovementEntry[];
  idNumber: string;
  month: string;
  onComplete: () => void;
  onBack: () => void;
}

// Function to convert Google Drive URLs to direct image URLs
const convertGoogleDriveUrl = (url: string): string => {
  if (!url) return url;

  // Check if it's a Google Drive URL
  if (url.includes('drive.google.com')) {
    // Extract file ID from various Google Drive URL formats
    let fileId = '';

    // Format: https://drive.google.com/file/d/FILE_ID/view?usp=drivesdk
    const viewMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\/view/);
    if (viewMatch) {
      fileId = viewMatch[1];
    }

    // Format: https://drive.google.com/open?id=FILE_ID
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (openMatch) {
      fileId = openMatch[1];
    }

    // If we found a file ID, convert to direct image URL
    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
    }
  }

  return url;
};

// Image component with error handling
const ImageWithFallback = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Convert Google Drive URL to direct image URL
  const convertedSrc = convertGoogleDriveUrl(src);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (imageError || !src) {
    return (
      <div
        className={`${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}
      >
        <div className="text-center text-gray-500">
          <ImageOff className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm">Image not available</p>
          {src && (
            <div className="text-xs text-gray-400 mt-1 px-2">
              <p className="mb-1">Original: {src.substring(0, 40)}...</p>
              <p>Converted: {convertedSrc.substring(0, 40)}...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {imageLoading && (
        <div
          className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}
        >
          <div className="text-gray-500">Loading...</div>
        </div>
      )}
      <img
        src={convertedSrc}
        alt={alt}
        className={`${className} ${
          imageLoading ? 'opacity-0 absolute' : 'opacity-100'
        } transition-opacity duration-300`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default function SlideViewer({
  entries,
  idNumber,
  month,
  onComplete,
  onBack,
}: SlideViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);



  const handleNext = () => {
    if (currentSlide < entries.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onComplete();
  };

  const currentEntry = entries[currentSlide];
  const progress = ((currentSlide + 1) / entries.length) * 100;

  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Saving Progress...
          </h2>
          <p className="text-gray-600">Recording your completion timestamp</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full animate-pulse"
              style={{ width: '70%' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentEntry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No entries found
          </h2>
          <p className="text-gray-600">Please check your data source</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">Back</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">ID:</span>
                <span>{idNumber}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{month}</span>
              </span>
            </div>
          </div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium">
            {currentSlide + 1} / {entries.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-6xl mx-auto mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Slide Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
            <div className="flex items-center space-x-2 text-blue-100 text-xs sm:text-sm mb-2 flex-wrap">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{currentEntry.dateTime}</span>
              <span className="mx-1 sm:mx-2">•</span>
              <span className="break-all">{currentEntry.controlNumber}</span>
              <span className="mx-1 sm:mx-2">•</span>
              <span>{currentEntry.category}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              {currentEntry.entryTitle}
            </h1>
            <p className="text-blue-100 leading-relaxed text-sm sm:text-base">
              {currentEntry.description}
            </p>
          </div>

          {/* Images Section */}
          <div className="p-4 sm:p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Before Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Before</span>
                </h3>
                <div className="relative group">
                  <ImageWithFallback
                    src={currentEntry.beforeImage}
                    alt="Before improvement"
                    className="w-full h-48 sm:h-64 lg:h-72 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
                </div>
              </div>

              {/* After Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>After</span>
                </h3>
                <div className="relative group">
                  <ImageWithFallback
                    src={currentEntry.afterImage}
                    alt="After improvement"
                    className="w-full h-48 sm:h-64 lg:h-72 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Improvement Details */}
            <div className="mt-6 sm:mt-8 space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">
                  Improvement Actions
                </h3>
                <p className="text-orange-700 leading-relaxed text-sm sm:text-base">
                  {currentEntry.improvement}
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  Results & Impact
                </h3>
                <p className="text-green-700 leading-relaxed text-sm sm:text-base">
                  {currentEntry.improvementEffect}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-gray-50 p-4 sm:p-6">
            {/* Mobile Navigation */}
            <div className="flex justify-between items-center sm:hidden">
              <button
                onClick={handlePrevious}
                disabled={currentSlide === 0}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentSlide === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Prev</span>
              </button>

              <div className="text-center">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {currentSlide + 1} / {entries.length}
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
              >
                <span className="text-sm">
                  {currentSlide === entries.length - 1 ? 'Done' : 'Next'}
                </span>
                {currentSlide === entries.length - 1 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentSlide === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-shrink-0 ${
                  currentSlide === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center justify-center flex-1 px-4">
                {/* Always show counter and progress bar for consistency */}
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
                    {currentSlide + 1} of {entries.length}
                  </span>
                  <div className="w-32 sm:w-40 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 hover:shadow-md transition-all duration-200 transform hover:scale-105 flex-shrink-0"
              >
                <span>
                  {currentSlide === entries.length - 1 ? 'Complete' : 'Next'}
                </span>
                {currentSlide === entries.length - 1 ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
