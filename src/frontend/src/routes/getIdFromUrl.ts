export function getIdFromUrl(location: Location): string {
    let parts = location.pathname.split('/');
    let projectPartIndex = parts.findIndex(p => p == 'project');
    return parts[projectPartIndex + 1];
}