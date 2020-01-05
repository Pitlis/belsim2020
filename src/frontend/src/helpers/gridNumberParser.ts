export function wholeNumberValueParser(params: { newValue: string, oldValue: string }): number {
    let number = Number(params.newValue);
    return isNaN(number) || number < 0 ? Number(params.oldValue) : Math.trunc(number);
}