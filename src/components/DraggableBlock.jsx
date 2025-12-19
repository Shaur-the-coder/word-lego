import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Block } from './Block';

export const DraggableBlock = ({ id, text, type }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: { text, type, origin: 'panel' },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <Block text={text} type={type} />
        </div>
    );
};
