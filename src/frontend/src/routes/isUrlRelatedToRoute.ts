export function isUrlRelatedToRoute(url: string, route: { path: string }) {
    let urlSections = url.split('/');
    let routePathSections = route.path.split('/');

    if (urlSections.length !== routePathSections.length) {
        return false;
    }

    for (let sectionIndex = 0; sectionIndex < routePathSections.length; sectionIndex++) {
        if (routePathSections[sectionIndex].startsWith(':')) {
            continue;
        }
        if (urlSections[sectionIndex] !== routePathSections[sectionIndex]) {
            return false;
        }
    }
    return true;
}