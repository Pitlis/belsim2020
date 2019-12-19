import { http } from './http';

import { Product } from 'models';

export const product = Object.freeze({
    async getProjectProducts(projectId: string): Promise<Product[]> {
        return http.get('/product/all/' + projectId)
            .then(response => response.data);
    },
    async createProduct(name: string, projectId: string): Promise<void> {
        // return http.post('/account/login', authUser)
        //     .then(response => response.data);
        await Promise.resolve();
        //tempResponse.push({ Name: name, ProductId: ('5e5dfadb-2ab1-466e-9dbc-351a1097fec' + (tempResponse.length + 1).toString()) })
    },
    async deleteProduct(productId: string): Promise<void> {
        // return http.post('/account/login', authUser)
        //     .then(response => response.data);
        await Promise.resolve();
        //tempResponse = tempResponse.filter(t => t.ProductId !== productId);
    },
});