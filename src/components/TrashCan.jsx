import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export const TrashCan = () => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'trash-can',
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: isOver ? '#ffcccc' : '#fff',
                border: '3px solid #da291c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'all 0.2s ease',
                transform: isOver ? 'scale(1.1)' : 'scale(1)',
                zIndex: 100,
            }}
            title="Drag here to delete"
        >
            🗑️
        </div>
    );
};
