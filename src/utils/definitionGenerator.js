export const generateDefinition = (blocks) => {
    if (!blocks || blocks.length === 0) return null;

    const meanings = blocks.map(b => b.meaning);
    const types = blocks.map(b => b.type);
    const text = blocks.map(b => b.text).join('');

    // Simple template logic based on block count and types
    const coreMeaning = meanings.join(' ').toLowerCase();

    const templates = [
        `The study or practice of ${coreMeaning}.`,
        `A condition characterized by ${coreMeaning}.`,
        `A device designed to manipulate ${coreMeaning}.`,
        `The theoretical concept of ${coreMeaning}.`,
        `Relating to ${coreMeaning}.`
    ];

    // If we have a 'suffix' like -ology, try to be smart
    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock && lastBlock.type === 'suffix') {
        if (lastBlock.text === 'ology') return `The comprehensive scientific study of ${meanings.slice(0, -1).join(' ')}.`;
        if (lastBlock.text === 'ism') return `A belief system centering on ${meanings.slice(0, -1).join(' ')}.`;
        if (lastBlock.text === 'ify') return `To transform something into ${meanings.slice(0, -1).join(' ')}.`;
        if (lastBlock.text === 'mancer') return `A person who uses magic related to ${meanings.slice(0, -1).join(' ')}.`;
    }

    // Random fallback
    const randomIndex = Math.floor(Math.random() * templates.length);
    return templates[randomIndex];
};
