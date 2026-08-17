import React from 'react';
import { MotionConfig } from './MotionConfig';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig>
      {children}
    </MotionConfig>
  );
}
