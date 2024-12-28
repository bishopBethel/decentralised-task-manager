import React from "react";

export function Card({ className, ...props }) {
  return (
    <div
      className={`rounded-lg border border-gray-700 bg-gray-800 text-gray-100 ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={`p-4 border-b border-gray-700 ${className}`} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={`p-4 ${className}`} {...props} />;
}