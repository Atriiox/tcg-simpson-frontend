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
        text-white 
        rounded-md 
        h-11 
        px-6 
        font-semibold 
        text-medium 
        cursor-pointer 
        transition-all 
        duration-300 
        ease-out
        hover:bg-[#df4923]
        shadow-md
        hover:scale-[1.02]         
        active:scale-[0.98]
        disabled:opacity-50 
        disabled:cursor-not-allowed 
        disabled:hover:scale-100
        disabled:hover:bg-simpson-orange
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
