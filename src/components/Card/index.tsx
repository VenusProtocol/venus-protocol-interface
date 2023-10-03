/** @jsxImportSource @emotion/react */
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={twMerge('w-full rounded-2xl bg-cards p-6', className)}>{children}</div>
);
