export interface MockToken {
    text: string;
    id: number;
    type: 'word' | 'subword' | 'special' | 'punctuation';
}

/** Simple mock tokenizer that splits text into token-like chunks with fake IDs */
export function mockTokenize(text: string): MockToken[] {
    const tokens: MockToken[] = [];
    const words = text.split(/(\s+|[,."'!?;:—–\-()[\]{}])/);
    let idCounter = 1000;

    for (const w of words) {
        if (!w || w.trim() === '') continue;

        if (/^[,."'!?;:—–\-()[\]{}]$/.test(w)) {
            tokens.push({ text: w, id: idCounter++, type: 'punctuation' });
        } else if (w.length > 6) {
            // Split long words into subwords
            const mid = Math.ceil(w.length / 2);
            tokens.push({ text: w.slice(0, mid), id: idCounter++, type: 'subword' });
            tokens.push({ text: w.slice(mid), id: idCounter++, type: 'subword' });
        } else {
            tokens.push({ text: w, id: idCounter++, type: 'word' });
        }
    }

    return tokens;
}
