export function wholeNumberValueParser(params: { newValue: string, oldValue: string }): number {
    let number = Number(params.newValue);
    return isNaN(number) || number < 0 ? Number(params.oldValue) : Math.trunc(number);
}

export function currencyValueParser(params: { newValue: string, oldValue: string }): number {
    let number = Number(params.newValue);
    return isNaN(number) || number < 0 ? Number(params.oldValue) : Number(number.toFixed(2));
}