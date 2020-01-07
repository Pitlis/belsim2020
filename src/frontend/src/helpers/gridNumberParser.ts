export function wholeNumberValueParser(params: { newValue: string, oldValue: string }): number {
    let number = Number(params.newValue);
    return isNaN(number) || number < 0 ? Number(params.oldValue) : Math.trunc(number);
}

export function currencyValueParser(params: { newValue: string, oldValue: string }): number {
    let number = Number(params.newValue);
    return isNaN(number) || number < 0 ? Number(params.oldValue) : toCurrency(number);
}

export function coeffValueParser(params: { newValue: string, oldValue: string }): number {
    let number = Number(params.newValue);
    return isNaN(number) || number < 0 ? Number(params.oldValue) : Number(Number(number).toFixed(4));
}

export function toCurrency(val: number): number {
    return Number(Number(val).toFixed(2));
}