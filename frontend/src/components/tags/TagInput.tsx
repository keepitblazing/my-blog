'use client';

import { useState, useEffect, useRef } from 'react';
import { Tag } from '@/types/tag';
import { searchTags, createTag } from '@/lib/api';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
}

export default function TagInput({
  selectedTags,
  onTagsChange,
  placeholder = "태그를 입력하세요"
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 입력값이 변경될 때 태그 검색
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (inputValue.trim()) {
        setIsLoading(true);
        const results = await searchTags(inputValue);
        setSuggestions(results);
        setShowSuggestions(true);
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  // 외부 클릭 시 제안 목록 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTag = async (tag: Tag) => {
    if (!selectedTags.find(t => t.id === tag.id)) {
      onTagsChange([...selectedTags, tag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleCreateTag = async () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !selectedTags.find(t => t.name === trimmedValue)) {
      setIsLoading(true);
      const newTag = await createTag(trimmedValue);
      if (newTag) {
        onTagsChange([...selectedTags, newTag]);
        setInputValue('');
        setShowSuggestions(false);
      }
      setIsLoading(false);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(tag => tag.id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleAddTag(suggestions[0]);
      } else if (inputValue.trim()) {
        handleCreateTag();
      }
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-[#222225] text-white rounded-full"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag.id)}
              className="hover:text-gray-300"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.trim() && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-black text-white border border-[#222225] rounded-md focus:outline-none focus:ring-2 focus:ring-[#222225] placeholder-gray-500"
        />
        
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute top-full mt-1 w-full bg-black text-white border border-[#222225] rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
          >
            {isLoading ? (
              <div className="px-3 py-2 text-gray-400">검색 중...</div>
            ) : (
              <>
                {suggestions.length > 0 ? (
                  suggestions.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      className="w-full px-3 py-2 text-left hover:bg-[#222225] focus:bg-[#222225] focus:outline-none"
                    >
                      {tag.name}
                    </button>
                  ))
                ) : inputValue.trim() ? (
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    className="w-full px-3 py-2 text-left hover:bg-[#222225] focus:bg-[#222225] focus:outline-none flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    &apos;{inputValue}&apos; 태그 생성
                  </button>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}