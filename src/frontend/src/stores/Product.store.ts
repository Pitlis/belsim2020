import { action, observable, runInAction } from 'mobx';

import { Product } from 'models';
import { api } from 'repositories';
import { FormGroup, AbstractControls, FormControl, notEmptyOrSpaces, ValidationEvent, ValidationEventTypes } from '@quantumart/mobx-form-validation-kit';

interface IProductNameEditor extends AbstractControls {
    name: FormControl<string>;
}
export class ProductStore {
    @observable public allProducts: Product[];

    @observable public productNameEditorForm: FormGroup<IProductNameEditor>;
    @observable public productNameEditorSelectedProduct: Product;
    @observable public serverErrorMessage: string;

    private projectId: string;

    public constructor() {
        this.init();
    }

    @action
    public init(): void {
        this.allProducts = new Array<Product>();
    }

    @action
    public async loadProducts(projectId: string): Promise<void> {
        this.projectId = projectId;
        try {
            console.log('loadProducts');
            let products = await api.product.getProjectProducts(projectId);
            console.log(products);

            runInAction(() => {
                console.log('!!!');
                console.log(products);
                this.allProducts = products.sort((p1, p2) => p1.name.localeCompare(p2.name));
            });
        } catch (err) {
            runInAction(() => {
                this.serverErrorMessage = err;
            });
        }
    }

    @action
    public initProductNameEditorForm(): void {
        this.productNameEditorSelectedProduct = new Product();
        this.productNameEditorForm = new FormGroup<IProductNameEditor>({
            name: new FormControl(
                this.productNameEditorSelectedProduct.name,
                [
                    notEmptyOrSpaces('NAME_CANNOT_BE_EMPTY'),
                    (control: FormControl) => this.validateNameDublicates(control)
                ],
                v => (this.productNameEditorSelectedProduct.name = v)
            ),
        });
    }

    @action
    public setProductNameEditorSelectedProduct(productId: string | null): void {
        if (productId !== null) {
            let selectedProduct = this.allProducts.find(p => p.rkProductId === productId);
            this.productNameEditorSelectedProduct = !!selectedProduct ? selectedProduct : new Product();
            this.productNameEditorForm.controls.name.value = this.productNameEditorSelectedProduct.name;
        } else {
            this.productNameEditorSelectedProduct = new Product();
        }
    }

    @action
    public async createProductForProject(): Promise<void> {
        try {
            console.log('loadProducts');
            await api.product.createProduct(this.productNameEditorSelectedProduct.name, this.projectId);

            runInAction(() => {
                this.loadProducts(this.projectId);
                this.productNameEditorSelectedProduct = new Product();
                this.productNameEditorForm.controls.name.value = '';
                this.productNameEditorForm.controls.name.setTouched(false);
            });
        } catch (err) {
            runInAction(() => {
                this.serverErrorMessage = err;
            });
        }
    }

    @action
    public async deleteProductFromProject(): Promise<void> {
        try {
            console.log('loadProducts');
            await api.product.deleteProduct(this.productNameEditorSelectedProduct.rkProductId);

            runInAction(() => {
                this.loadProducts(this.projectId);
                this.productNameEditorSelectedProduct = new Product();
            });
        } catch (err) {
            runInAction(() => {
                this.serverErrorMessage = err;
            });
        }
    }


    // Helpers
    private async validateNameDublicates(control: FormControl): Promise<ValidationEvent[]> {
        console.log('validateNameDublicates');
        console.log(this.productNameEditorSelectedProduct.rkProductId);
        if (control.value == null || this.productNameEditorSelectedProduct.rkProductId) {
            return [];
        }
        if (this.allProducts.find(p => p.name.toLowerCase() === control.value.toLowerCase())) {
            return [
                {
                    message: 'NAME_CANNOT_BE_DUBLICATED',
                    type: ValidationEventTypes.Error,
                },
            ];
        }
        return [];
    }
}