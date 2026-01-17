import React from 'react';

const Card = ({ 
  children, 
  className = '',
  hover = false,
  padding = true,
  ...props 
}) => {
  return (
    <div
      className={`
        bg-white border rounded-xl
        ${padding ? 'p-6' : ''}
        ${hover ? 'hover:shadow-lg transition-shadow' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold ${className}`}>{children}</h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-gray-600 ${className}`}>{children}</p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 ${className}`}>{children}</div>
);

export default Card;