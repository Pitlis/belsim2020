import axios from 'axios';
import { api } from 'configuration/repository.config.json';

export const http = axios.create({
    baseURL: api,
    headers: {
        'Content-Type': 'application/json',
    },
    transformRequest: (data) => JSON.stringify(data),
});
