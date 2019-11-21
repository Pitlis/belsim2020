import { project } from './project.repository';
import { account } from './account.repository';
import { product } from './product.repository';
import { resource } from './resource.repository';

export const api = Object.freeze({
    project,
    account,
    product,
    resource
});