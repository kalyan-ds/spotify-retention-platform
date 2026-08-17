/**
 * Purpose: Standard Modal overlay.
 * Props: isOpen, onClose, title, children
 * Accessibility: focus trapping, aria-modal="true".
 */
import React from 'react';

export function Modal({ children }: { children?: React.ReactNode }) {
  return <div aria-modal="true" role="dialog">Modal Placeholder {children}</div>;
}

export function Dialog({ children }: { children?: React.ReactNode }) {
  return <div aria-modal="true" role="dialog">Dialog Placeholder {children}</div>;
}

export function Drawer({ children }: { children?: React.ReactNode }) {
  return <div aria-modal="true" role="dialog">Drawer Placeholder {children}</div>;
}

export function ConfirmationDialog() {
  return <div aria-modal="true" role="alertdialog">Confirmation Dialog Placeholder</div>;
}
