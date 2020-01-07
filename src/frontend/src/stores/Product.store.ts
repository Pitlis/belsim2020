import { action, observable, runInAction } from 'mobx';

import { Product } from 'models';
import { api } from 'repositories';
import { FormGroup, AbstractControls, FormControl, notEmptyOrSpaces, ValidationEvent, ValidationEventTypes } from '@quantumart/mobx-form-validation-kit';
import { stores } from 'stores';

interface IProductNameEditor extends AbstractControls {
    name: FormControl<string>;
}
export class ProductStore {
    @observable public allProducts: Product[];

    @observable public productNameEditorForm: FormGroup<IProductNameEditor>;
    @observable public productNameEditorSelectedProduct: Product;

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
            let products = await api.product.getProjectProducts(projectId);

            runInAction(() => {
                this.allProducts = products.sort((p1, p2) => p1.name.localeCompare(p2.name));
            });
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка загрузка списка продуктов. Попробуйте обновить страницу.');
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
            await api.product.createProduct(this.productNameEditorSelectedProduct.name, this.projectId);

            runInAction(() => {
                this.loadProducts(this.projectId);
                this.productNameEditorSelectedProduct = new Product();
                this.productNameEditorForm.controls.name.value = '';
                this.productNameEditorForm.controls.name.setTouched(false);
            });
        } catch (err) {
            stores.ErrorStore.addError('Ошибка создания продукта. Попробуйте снова');
        }
    }

    @action
    public async deleteProductFromProject(): Promise<void> {
        try {
            await api.product.deleteProduct(this.productNameEditorSelectedProduct.rkProductId);

            runInAction(() => {
                this.loadProducts(this.projectId);
                this.productNameEditorSelectedProduct = new Product();
            });
        } catch (err) {
            console.log(err);
            stores.ErrorStore.addError('Ошибка удаления продукта. Возможно этот продукт уже используется в моделях данных - тогда сначала удалите оттуда.');
        }
    }

    public getProductName(productId: string) {
        let product = this.allProducts.find(p => p.rkProductId === productId);
        return product ? product.name : '[не найдено]';
    }


    // Helpers
    private async validateNameDublicates(control: FormControl): Promise<ValidationEvent[]> {
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