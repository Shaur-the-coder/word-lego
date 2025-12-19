import React from 'react';

const TYPE_COLORS = {
    prefix: 'var(--lego-red)',
    root: 'var(--lego-yellow)',
    suffix: 'var(--lego-blue)',
    chaos: 'var(--lego-black)',
    connector: '#999999',
};

const TYPE_TEXT_COLORS = {
    prefix: 'white',
    root: 'black',
    suffix: 'white',
    chaos: 'white',
    connector: 'white',
};

export const Block = ({ text, type, style, ...props }) => {
    const backgroundColor = TYPE_COLORS[type] || '#ccc';
    const color = TYPE_TEXT_COLORS[type] || 'black';

    const baseStyle = {
        backgroundColor,
        color,
        padding: '10px 15px',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'grab',
        boxShadow: '0 4px 0 rgba(0,0,0,0.2)', // pseudo-3D lego look
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '5px',
        minWidth: '60px',
        ...style,
    };

    return (
        <div style={baseStyle} {...props}>
            {text}
            {/* Little studs on top could be added with pseudo elements in CSS, 
          but for now simple box shadow is enough */}
        </div>
    );
};
