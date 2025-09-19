'use client';

import { Question } from '@/types/question';
import QuestionCard from './QuestionCard';
import { useState, useMemo } from 'react';

interface QuestionGridProps {
  questions: Question[];
}

const ITEMS_PER_PAGE = 12;

export default function QuestionGrid({ questions }: QuestionGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'media' | 'text'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = useMemo(() => {
    let filtered = questions;

    // Apply media filter
    if (filter === 'media') {
      filtered = filtered.filter(q => 
        q.mediaContent || q.imageUrl || q.videoUrl || q.gifUrl
      );
    } else if (filter === 'text') {
      filtered = filtered.filter(q => 
        !q.mediaContent && !q.imageUrl && !q.videoUrl && !q.gifUrl
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(q =>
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.correctAnswer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [questions, filter, searchTerm]);

  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Stats Bar */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-medium">
          Celkem otázek: {filteredQuestions.length}
        </div>
        <div className="bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-medium">
          {filter === 'all' && 'Všechny otázky'}
          {filter === 'media' && 'Otázky s médii'}
          {filter === 'text' && 'Textové otázky'}
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Hledat v otázkách..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-3 mb-8">
        <button
          onClick={() => {
            setFilter('all');
            setCurrentPage(1);
          }}
          className={`px-5 py-2 rounded-full border-2 font-medium text-sm transition-colors ${
            filter === 'all'
              ? 'bg-orange-500 text-white border-orange-500'
              : 'bg-white text-gray-600 border-gray-300 hover:border-orange-500 hover:text-orange-500'
          }`}
        >
          Všechny
        </button>
        <button
          onClick={() => {
            setFilter('media');
            setCurrentPage(1);
          }}
          className={`px-5 py-2 rounded-full border-2 font-medium text-sm transition-colors ${
            filter === 'media'
              ? 'bg-orange-500 text-white border-orange-500'
              : 'bg-white text-gray-600 border-gray-300 hover:border-orange-500 hover:text-orange-500'
          }`}
        >
          S médii
        </button>
        <button
          onClick={() => {
            setFilter('text');
            setCurrentPage(1);
          }}
          className={`px-5 py-2 rounded-full border-2 font-medium text-sm transition-colors ${
            filter === 'text'
              ? 'bg-orange-500 text-white border-orange-500'
              : 'bg-white text-gray-600 border-gray-300 hover:border-orange-500 hover:text-orange-500'
          }`}
        >
          Pouze text
        </button>
      </div>

      {/* Question Grid */}
      {paginatedQuestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {paginatedQuestions.map((question, index) => (
            <QuestionCard
              key={question.id || startIndex + index}
              question={question}
              index={startIndex + index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Žádné otázky k zobrazení</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            ←
          </button>
          
          <div className="flex gap-1">
            {[...Array(Math.min(totalPages, 7))].map((_, idx) => {
              let pageNum;
              if (totalPages <= 7) {
                pageNum = idx + 1;
              } else if (currentPage <= 4) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + idx;
              } else {
                pageNum = currentPage - 3 + idx;
              }

              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === pageNum
                      ? 'bg-orange-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}