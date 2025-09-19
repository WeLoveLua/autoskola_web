'use client';

import { Question } from '@/types/question';
import Image from 'next/image';
import { useState } from 'react';

interface QuestionCardProps {
  question: Question;
  index: number;
}

export default function QuestionCard({ question, index }: QuestionCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const mediaUrl = question.mediaContent || question.videoUrl || question.gifUrl || question.imageUrl;
  const isVideo = mediaUrl && (
    mediaUrl.endsWith('.mp4') || 
    mediaUrl.endsWith('.webm') || 
    mediaUrl.endsWith('.ogg')
  );

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 p-5">
      <div className="absolute top-3 right-3 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
        {question.number || index + 1}
      </div>
      
      <div className="pr-10">
        <p className="text-gray-800 dark:text-gray-200 font-medium text-sm mb-4 leading-relaxed">
          {question.question}
        </p>
      </div>

      {mediaUrl && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 mb-4 min-h-[120px] flex items-center justify-center">
          {isVideo ? (
            <video
              className="max-w-full max-h-48 rounded"
              controls
              muted
              preload="metadata"
            >
              <source src={mediaUrl} />
              Your browser does not support the video tag.
            </video>
          ) : !imageError ? (
            <img
              src={mediaUrl}
              alt="Question media"
              className="max-w-full max-h-48 object-contain rounded"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="text-gray-400 dark:text-gray-500 text-sm">Image could not be loaded</div>
          )}
        </div>
      )}

      {question.options && question.options.length > 0 && (
        <div className="space-y-2 mb-4">
          {question.options.map((option, idx) => (
            <div
              key={idx}
              className={`px-3 py-2 rounded-md text-sm ${
(typeof option === 'string' ? option : option.text) === question.correctAnswer
                  ? 'bg-orange-50 dark:bg-orange-900/30 border border-orange-400 dark:border-orange-600 text-gray-800 dark:text-gray-200 font-medium'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {typeof option === 'string' ? option : option.text}
            </div>
          ))}
        </div>
      )}

      <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-sm font-medium">
          <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs">
            ✓
          </span>
          <span>Správná odpověď: {question.correctAnswer}</span>
        </div>
      </div>
    </div>
  );
}