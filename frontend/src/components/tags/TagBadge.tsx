'use client';

import Link from 'next/link';
import { Tag } from '@/types/tag';
import { X } from 'lucide-react';

interface TagBadgeProps {
  tag: Tag;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  onRemove?: () => void;
}

export default function TagBadge({
  tag,
  size = 'md',
  clickable = true,
  onRemove
}: TagBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const baseClasses = `inline-flex items-center gap-1 bg-[#222225] text-white rounded-full transition-colors ${sizeClasses[size]}`;
  
  const content = (
    <>
      <span>{tag.name}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className="hover:text-gray-900"
        >
          <X className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
        </button>
      )}
    </>
  );

  if (clickable && !onRemove) {
    return (
      <Link
        href={`/tags/${tag.slug}`}
        className={`${baseClasses} hover:bg-[#2a2a2f]`}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={baseClasses}>
      {content}
    </span>
  );
}