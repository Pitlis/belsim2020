import { http } from './http';
import { AuthUser } from 'models/AuthUser';

export const account = Object.freeze({
    async refreshSession(): Promise<void> {
        return http.get('/account/refresh-session');
    },
    async getRoles(): Promise<string[]> {
        return http.get('/account/get-roles')
            .then(response => response.data);;
    },
    async login(authUser: AuthUser): Promise<void> {
        return http.post('/account/login', authUser)
            .then(response => response.data);
    },
    async logout(): Promise<void> {
        return http.post('/account/logout');
    }
});