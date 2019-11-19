import { project } from './project.repository';
import { account } from './account.repository';
import { product } from './product.repository';

export const api = Object.freeze({
    project,
    account,
    product
});