import React from 'react';

// Enhanced button variants for the new professional theme
const getButtonClasses = (variant = 'default', size = 'default', className = '') => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';
  
  const variantClasses = {
    default: 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg transform hover:scale-105',
    accent: 'bg-accent text-white hover:bg-accent/90 shadow-md hover:shadow-lg transform hover:scale-105',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-md hover:shadow-lg transform hover:scale-105',
    outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white shadow-sm hover:shadow-md',
    ghost: 'text-primary bg-transparent hover:bg-primary/10 hover:text-primary',
    success: 'bg-success text-white hover:bg-success/90 shadow-md hover:shadow-lg transform hover:scale-105',
    warning: 'bg-warning text-white hover:bg-warning/90 shadow-md hover:shadow-lg transform hover:scale-105',
    danger: 'bg-danger text-white hover:bg-danger/90 shadow-md hover:shadow-lg transform hover:scale-105',
    link: 'text-primary underline-offset-4 hover:underline bg-transparent shadow-none hover:shadow-none transform-none',
  };
  
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm rounded-lg',
    default: 'h-11 px-6 text-base rounded-xl',
    lg: 'h-14 px-8 text-lg rounded-xl',
    xl: 'h-16 px-10 text-xl rounded-xl',
    icon: 'h-11 w-11 rounded-xl',
  };
  
  return `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.default} ${className}`.trim();
};

const Button = React.forwardRef(({ 
  className = '', 
  variant = 'default', 
  size = 'default', 
  children, 
  ...props 
}, ref) => {
  return (
    <button
      className={getButtonClasses(variant, size, className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button, getButtonClasses };
