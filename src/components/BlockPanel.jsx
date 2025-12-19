import React, { useState } from 'react';
import { DraggableBlock } from './DraggableBlock';

export const BlockPanel = ({ blocks, onAddBlock }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newBlock, setNewBlock] = useState({ text: '', type: 'prefix', meaning: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newBlock.text || !newBlock.meaning) return;
        onAddBlock(newBlock);
        setNewBlock({ text: '', type: 'prefix', meaning: '' });
        setIsAdding(false);
    };

    // Filter blocks based on search term
    const filteredBlocks = Object.entries(blocks).reduce((acc, [category, items]) => {
        const filteredItems = items.filter(block =>
            block.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
            block.meaning.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredItems.length > 0) {
            acc[category] = filteredItems;
        }
        return acc;
    }, {});

    return (
        <div style={{
            width: '300px',
            borderRight: '1px solid #ddd',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            boxSizing: 'border-box'
        }}>
            {/* Search Bar */}
            <div style={{ padding: '15px 20px 5px', backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
                <input
                    type="text"
                    placeholder="Search blocks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        border: '1px solid #ccc',
                        outline: 'none',
                        fontSize: '0.9rem',
                        backgroundColor: '#f0f2f5',
                        boxSizing: 'border-box' // Fix for "too much to the right"
                    }}
                />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                <h2 style={{ marginTop: 0, color: '#333', fontSize: '1.2rem' }}>Blocks</h2>

                {Object.keys(filteredBlocks).length === 0 ? (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>No blocks found.</p>
                ) : (
                    Object.entries(filteredBlocks).map(([category, items]) => (
                        <div key={category} style={{ marginBottom: '20px' }}>
                            <h3 style={{
                                textTransform: 'capitalize',
                                margin: '0 0 10px 0',
                                fontSize: '0.9rem',
                                color: '#666',
                                borderBottom: '1px solid #eee',
                                paddingBottom: '5px'
                            }}>
                                {category}
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {items.map(block => (
                                    <DraggableBlock
                                        key={block.id}
                                        id={block.id}
                                        text={block.text}
                                        type={block.type}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Block Section */}
            <div style={{
                padding: '15px',
                borderTop: '1px solid #ddd',
                backgroundColor: '#fff'
            }}>
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            backgroundColor: '#eee',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            color: '#555',
                            fontWeight: '500'
                        }}
                    >
                        + Add Custom Block
                    </button>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>New Block</h4>
                        <input
                            placeholder="Text (e.g. Mega)"
                            value={newBlock.text}
                            onChange={e => setNewBlock({ ...newBlock, text: e.target.value })}
                            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                        <input
                            placeholder="Meaning"
                            value={newBlock.meaning}
                            onChange={e => setNewBlock({ ...newBlock, meaning: e.target.value })}
                            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                        <select
                            value={newBlock.type}
                            onChange={e => setNewBlock({ ...newBlock, type: e.target.value })}
                            style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="prefix">Prefix</option>
                            <option value="root">Root</option>
                            <option value="suffix">Suffix</option>
                            <option value="chaos">Chaos</option>
                            <option value="connector">Connector</option>
                        </select>
                        <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                            <button
                                type="submit"
                                style={{ flex: 1, padding: '6px', backgroundColor: '#237841', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                style={{ flex: 1, padding: '6px', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
