import React, { useEffect } from 'react';
import { Box } from '@radix-ui/themes';

export default function RightPanel({ isOpen, onClose, children, width = "600px" }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <Box
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    zIndex: 40,
                }}
                onClick={onClose}
            />

            <Box
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    maxWidth: width,
                    backgroundColor: 'var(--color-panel-solid)',
                    boxShadow: 'var(--shadow-5)',
                    zIndex: 50,
                    overflowY: 'auto',
                    borderLeft: '1px solid var(--gray-5)',
                }}
            >
                {children}
            </Box>
        </>
    );
}
