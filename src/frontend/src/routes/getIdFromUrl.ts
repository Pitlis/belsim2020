export function getProjectIdFromUrl(location: Location): string {
    let parts = location.pathname.split('/');
    let projectPartIndex = parts.findIndex(p => p == 'project');
    return parts[projectPartIndex + 1];
}

export function getExperimentIdFromUrl(location: Location): string {
    let parts = location.pathname.split('/');
    let projectPartIndex = parts.findIndex(p => p == 'experiment-results');
    return parts[projectPartIndex + 1];
}

export function getTemplateIdFromUrl(location: Location): string {
    let parts = location.pathname.split('/');
    let projectPartIndex = parts.findIndex(p => p == 'template');
    return parts[projectPartIndex + 1];
}