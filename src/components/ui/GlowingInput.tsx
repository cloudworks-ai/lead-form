import React from 'react';

type GlowingInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  containerClassName?: string;
};

export default function GlowingInput({ containerClassName, className, ...props }: GlowingInputProps) {
  return (
    <div className={`relative ${containerClassName ?? ''}`}>
      <input
        {...props}
        className={`w-full h-12 rounded-2xl bg-white/10 hover:bg-white/15 text-white placeholder-gray-400 px-4 text-sm md:text-base focus:outline-none transition-colors duration-200 ${className ?? ''}`}
      />
    </div>
  );
}


