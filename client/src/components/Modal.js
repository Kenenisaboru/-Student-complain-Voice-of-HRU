import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiOutlineX } from 'react-icons/hi';

const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-xl' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-dark-950/40 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`relative w-full ${maxWidth} bg-white dark:bg-dark-900 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-slide-up-modal`}>
                {/* Header */}
                <div className="px-8 py-6 flex items-center justify-between border-b border-gray-50 dark:border-gray-800">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <HiOutlineX className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-8 py-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-8 py-6 bg-gray-50 dark:bg-dark-950/50 flex flex-wrap items-center justify-end gap-3 border-t border-gray-50 dark:border-gray-800">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
