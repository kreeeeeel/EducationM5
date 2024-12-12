import React from 'react';

const formatNumber = (num: number): string => {
    if (num < 1000) {
        return num.toString();
    } else if (num < 1_000_000) {
        const truncated = Math.floor(num / 100) / 10;
        return truncated.toString() + 'K';
    } else if (num < 1_000_000_000) {
        const truncated = Math.floor(num / 100_000) / 10;
        return truncated.toString() + 'M';
    } else {
        const truncated = Math.floor(num / 100_000_000) / 10;
        return truncated.toString() + 'B';
    }
};

interface ValueFormatterProps {
    value: number | undefined;
}

const ValueFormatter: React.FC<ValueFormatterProps> = ({ value }) => {
    const formattedValue = value !== undefined ? formatNumber(value) : '—';
    return <span>{formattedValue}</span>;
};

export default ValueFormatter;
