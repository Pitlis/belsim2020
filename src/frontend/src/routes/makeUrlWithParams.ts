import { Dictionary } from 'helpers/dictionary';

export function makeUrlWithParams(url: string, params: Dictionary<string>): string {
    let response = url;

    Object.keys(params).forEach(key => {
        response = response.replace(`:${key}`, params[key]);
    });

    return response;
}