import { http } from './http';

import { Product } from 'models';

export const product = Object.freeze({
    async getProjectProducts(projectId: string): Promise<Product[]> {
        return http.get('/product/all/' + projectId)
            .then(response => response.data);
    },
    async createProduct(name: string, projectId: string): Promise<void> {
        return http.post('/product/create', {
            name: name,
            projectId: projectId
        }).then(response => response.data);
    },
    async deleteProduct(productId: string): Promise<void> {
        return http.delete('/product/delete/' + productId)
        .then(response => response.data);
    },
});