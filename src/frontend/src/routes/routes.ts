export const routes = {
    login: { path: '/', exact: true },
    projects: { path: '/projects', exact: true },
    baseProjectUrl: { path: '/project' },
    projectDetails: { path: '/project/:projectId', exact: true },
    projectProductsAndResources: { path: '/project/:projectId/products-and-resources', exact: true },
    experimentResults: { path: '/project/:projectId/experiment-results/:experimentId', exact: true },
    template: { path: '/project/:projectId/template/:templateId', exact: true },
};