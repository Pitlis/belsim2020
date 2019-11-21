// import { http } from './http';

import { Product } from 'models';

export const product = Object.freeze({
    async getProjectProducts(projectId: string): Promise<Product[]> {
        console.log(tempResponse);
        console.log(projectId);
        return tempResponse;
    },
    async createProduct(name: string, projectId: string): Promise<void> {
        // return http.post('/account/login', authUser)
        //     .then(response => response.data);
        await Promise.resolve();
        tempResponse.push({ Name: name, ProductId: ('5e5dfadb-2ab1-466e-9dbc-351a1097fec' + (tempResponse.length + 1).toString()) })
    },
    async deleteProduct(productId: string): Promise<void> {
        // return http.post('/account/login', authUser)
        //     .then(response => response.data);
        await Promise.resolve();
        tempResponse = tempResponse.filter(t => t.ProductId !== productId);
    },
});

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
        ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecb',
        Name: 'Продукт 3'
    },
    {
        ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecv',
        Name: 'Продукт 4'
    },
    {
        ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecc',
        Name: 'Продукт 5'
    },
    {
        ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecx',
        Name: 'Продукт 6'
    },
    {
        ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecz',
        Name: 'Продукт 7'
    },
    {
        ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecl',
        Name: 'Продукт 8'
    },
    {
        ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097feck',
        Name: 'Продукт 9'
    },
    {
        ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecj',
        Name: 'Продукт 10'
    },
    {
        ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097fech',
        Name: 'Продукт 11'
    },
    {
        ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecg',
        Name: 'Продукт 12'
    },
    {
        ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecf',
        Name: 'Продукт 13'
    },
    {
        ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097fecd',
        Name: 'Продукт 14'
    },
    {
        ProductId: '5e5dfadb-2ab1-466e-9dbc-351a1097feca',
        Name: 'Продукт 15'
    },
];