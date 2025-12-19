import React, { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    closestCenter,
} from '@dnd-kit/core';
import {
    arrayMove,
} from '@dnd-kit/sortable';
import { BlockPanel } from './components/BlockPanel';
import { WordBuilder } from './components/WordBuilder';
import { Block } from './components/Block';
import { TrashCan } from './components/TrashCan';
import { BLOCKS } from './data/blocks';

function App() {
    const [activeId, setActiveId] = useState(null);
    const [activeDragItem, setActiveDragItem] = useState(null);
    const [wordBlocks, setWordBlocks] = useState([]);

    // Mutable blocks state for custom blocks
    const [availableBlocks, setAvailableBlocks] = useState(BLOCKS);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);

        const builderItem = wordBlocks.find(b => b.uniqueId === active.id);
        if (builderItem) {
            setActiveDragItem(builderItem);
            return;
        }

        let panelItem = null;
        for (const cat of Object.values(availableBlocks)) {
            const found = cat.find(b => b.id === active.id);
            if (found) {
                panelItem = found;
                break;
            }
        }
        setActiveDragItem(panelItem);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        setActiveId(null);
        setActiveDragItem(null);

        if (!over) return;

        const isOverBuilder = over.id === 'word-builder-zone' || wordBlocks.some(b => b.uniqueId === over.id);

        // Deletion Logic
        if (over.id === 'trash-can') {
            if (wordBlocks.find(b => b.uniqueId === active.id)) {
                setWordBlocks((items) => items.filter(b => b.uniqueId !== active.id));
            }
            return;
        }

        if (isOverBuilder) {
            const isNewItem = !wordBlocks.find(b => b.uniqueId === active.id);

            if (isNewItem) {
                let blockData = null;
                for (const cat of Object.values(availableBlocks)) {
                    const found = cat.find(b => b.id === active.id);
                    if (found) {
                        blockData = found;
                        break;
                    }
                }

                if (blockData) {
                    const newBlock = {
                        ...blockData,
                        uniqueId: `${blockData.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    };

                    if (over.id === 'word-builder-zone') {
                        setWordBlocks((items) => [...items, newBlock]);
                    } else {
                        const overIndex = wordBlocks.findIndex(b => b.uniqueId === over.id);
                        setWordBlocks((items) => {
                            const newItems = [...items];
                            newItems.splice(overIndex, 0, newBlock);
                            return newItems;
                        });
                    }
                }
            } else {
                if (active.id !== over.id) {
                    setWordBlocks((items) => {
                        const oldIndex = items.findIndex(b => b.uniqueId === active.id);
                        const newIndex = items.findIndex(b => b.uniqueId === over.id);
                        return arrayMove(items, oldIndex, newIndex);
                    });
                }
            }
        }
    };

    const handleClear = () => setWordBlocks([]);

    const handleRandomize = () => {
        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const p = pick(availableBlocks.prefixes);
        const r = pick(availableBlocks.roots);
        const s = pick(availableBlocks.suffixes);

        const createInstance = (b) => ({
            ...b,
            uniqueId: `${b.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        });

        setWordBlocks([
            createInstance(p),
            createInstance(r),
            createInstance(s)
        ]);
    };

    const handleAddBlock = (newBlock) => {
        const categoryMap = {
            prefix: 'prefixes',
            root: 'roots',
            suffix: 'suffixes',
            chaos: 'chaos',
            connector: 'connectors'
        };
        const catKey = categoryMap[newBlock.type];
        if (!catKey) return;

        const blockWithId = {
            ...newBlock,
            id: `custom-${Date.now()}`
        };

        setAvailableBlocks(prev => ({
            ...prev,
            [catKey]: [...prev[catKey], blockWithId]
        }));
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
                {/* Header / Toolbar */}
                <div style={{
                    padding: '10px 20px',
                    borderBottom: '1px solid #ddd',
                    backgroundColor: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 10,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <h1 style={{ margin: 0, fontSize: '1.2rem', color: '#da291c', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        🧱 Word Lego
                    </h1>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleRandomize}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#0055bf',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 0 #003380',
                                transition: 'transform 0.1s',
                            }}
                            onMouseDown={e => e.currentTarget.style.transform = 'translateY(2px)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Randomize
                        </button>
                        <button
                            onClick={handleClear}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#fff',
                                color: '#333',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    <BlockPanel blocks={availableBlocks} onAddBlock={handleAddBlock} />
                    <WordBuilder blocks={wordBlocks} />
                </div>

                {/* Render Trash Can */}
                <TrashCan />
            </div>

            <DragOverlay>
                {activeDragItem ? (
                    <Block
                        text={activeDragItem.text}
                        type={activeDragItem.type}
                        style={{
                            transform: 'scale(1.05)',
                            cursor: 'grabbing',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                        }}
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

export default App;
