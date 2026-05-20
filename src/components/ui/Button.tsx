import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        bg-simpson-orange 
        hover:bg-simpson-orange/90 
        text-white 
        rounded-md 
        h-11 
        px-6 
        font-semibold 
        text-medium 
        cursor-pointer 
        transition-all 
        duration-200 
        shadow-md 
        active:scale-[0.98]
        disabled:opacity-50 
        disabled:cursor-not-allowed 
        disabled:active:scale-100
        flex 
        items-center 
        justify-center
        ${className}
      `.trim()}
    >
      {children}
    </button>
  );
}
