import { project } from './project.repository';
import { account } from './account.repository';
import { product } from './product.repository';
import { resource } from './resource.repository';
import { experiment } from './experiment.repository';
import { template } from './template.repository';
import { admin } from './admin.repository';

export const api = Object.freeze({
    project,
    account,
    product,
    resource,
    experiment,
    template,
    admin
});