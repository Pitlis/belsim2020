import { action, observable } from 'mobx';

import { Product } from 'models';
// import { api } from 'repositories';


export class ProductStore {
    @observable public allProducts: Product[];

    public constructor() {
        this.init();
    }

    @action
    public init(): void {
        this.allProducts = new Array<Product>();
    }

    @action
    public async loadProducts(projectId: string): Promise<void> {
        await Promise.resolve();
    }
}