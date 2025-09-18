import React from 'react';

interface IconProps {
  className?: string;
}

const BookOpenIcon: React.FC<IconProps> = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    style={{ width: '2.5em', height: '2.5em', display: 'block' }}
  >
    <rect x="4" y="8" width="40" height="32" rx="6" fill="#f5f7fa" stroke="#3b82f6" strokeWidth="2.5" />
    <path d="M24 12v28" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M24 12c-4-2-10-2-14 0v28c4-2 10-2 14 0" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M24 12c4-2 10-2 14 0v28c-4-2-10-2-14 0" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="24" cy="24" r="2.5" fill="#3b82f6" />
  </svg>
);

export default BookOpenIcon;