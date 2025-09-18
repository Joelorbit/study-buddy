
import React from 'react';

interface IconProps {
    className?: string;
}

const FlameIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14.5 5 16.5 8 16.5 10c0-1.995.18-2.633.5-3.5 1.183-3.129 4.157-3.129 4.157 0 .229.602.327 1.22.327 1.842 0 3.121-2.483 5.603-5.603 5.603-1.258 0-2.427-.41-3.343-1.157z" />
  </svg>
);

export default FlameIcon;
