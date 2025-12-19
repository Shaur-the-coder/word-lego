import React, { useState, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableBlock } from './SortableBlock';
import { generateDefinition } from '../utils/definitionGenerator';

export const WordBuilder = ({ blocks }) => {
    const { setNodeRef } = useDroppable({
        id: 'word-builder-zone',
    });

    const [isHovered, setHover] = useState(false);
    const definition = useMemo(() => generateDefinition(blocks), [blocks]);

    return (
        <div style={{
            flex: 1,
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, #f0f4f8 0%, #dbe2e8 100%)'
        }}>
            <h1 style={{ marginBottom: '40px', color: '#333' }}>
                Word Builder
            </h1>

            <div
                ref={setNodeRef}
                style={{
                    minHeight: '120px',
                    minWidth: '500px',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '16px',
                    border: '3px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    gap: '10px',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease'
                }}
            >
                <SortableContext
                    items={blocks.map(b => b.uniqueId)}
                    strategy={horizontalListSortingStrategy}
                >
                    {blocks.length === 0 ? (
                        <span style={{ color: '#aaa', fontSize: '1.2rem', userSelect: 'none' }}>
                            Drag blocks here to build a word
                        </span>
                    ) : (
                        blocks.map((block) => (
                            <SortableBlock
                                key={block.uniqueId}
                                id={block.uniqueId}
                                text={block.text}
                                type={block.type}
                            />
                        ))
                    )}
                </SortableContext>
            </div>

            {/* Word Display & Definition Tooltip */}
            <div
                style={{ position: 'relative', marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <h2 style={{
                    fontSize: '3rem',
                    color: '#222',
                    margin: 0,
                    cursor: 'help',
                    borderBottom: '2px dotted #aaa'
                }}>
                    {blocks.length > 0 ? blocks.map((b, i) => i === 0 ? b.text : b.text.toLowerCase()).join('') : '...'}
                </h2>

                {blocks.length > 0 && isHovered && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginTop: '15px',
                        backgroundColor: '#333',
                        color: '#fff',
                        padding: '15px',
                        borderRadius: '8px',
                        width: '300px',
                        textAlign: 'center',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        zIndex: 100,
                        pointerEvents: 'none'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-6px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderBottom: '6px solid #333'
                        }} />
                        <em style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', opacity: 0.8 }}>Definition:</em>
                        {definition}
                    </div>
                )}
            </div>
        </div>
    );
};
