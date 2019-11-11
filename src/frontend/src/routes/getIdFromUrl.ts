export function getIdFromUrl(location: Location): string {
    console.log(location);
    let parts = location.pathname.split('/');
    return parts[parts.length - 1];
}