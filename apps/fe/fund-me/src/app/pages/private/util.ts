export const calculatePrecision = (value: number): { amount: number, precision: number } => {
    const valueStr = value.toString();
    const decimalIndex = valueStr.indexOf('.');
    let precision = 0;
    let amountStr = valueStr;

    if (decimalIndex !== -1) {
        precision = valueStr.length - decimalIndex - 1;
        amountStr = valueStr.replace('.', '');
    }

    const amount = parseInt(amountStr, 10);
    return { amount, precision };
};

export const convertToFloat = (value: number, precision: number) => {
    const returnValue = value / Math.pow(10, precision || 1);
    return returnValue;
}
