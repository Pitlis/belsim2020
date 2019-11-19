// import { http } from './http';

import { Product } from 'models';

export const product = Object.freeze({
    async getProjectProducts(projectId: string): Promise<Product[]> {
        console.log(projectId);
        let tempResponse: Product[] = [
            {
                ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecd',
                Name: 'Продукт 1'
            },
            {
                ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097fec2',
                Name: 'Продукт 2'
            },
            {
                ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097fec3',
                Name: 'Продукт 3'
            },
        ];
        return tempResponse;
    }
});