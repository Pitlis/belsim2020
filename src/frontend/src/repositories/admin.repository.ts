import { http } from './http';
import { UserProfile } from 'models';

export const admin = Object.freeze({
    async getUsers(): Promise<UserProfile[]> {
        return http.get('/admin/get-users')
            .then(response => response.data);
    },
    async createUser(email: string, name: string, password: string, organization: string, comments: string): Promise<void> {
        return http.post('/admin/create-user', {
            email,
            PublicName: name,
            password,
            organizationName: organization,
            comments
        }).then(response => response.data);
    },
    async changePassword(userId: string, password: string): Promise<void> {
        return http.post('/admin/update-password', {
            userId,
            password
        }).then(response => response.data);
    }
});