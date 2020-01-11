import { http } from './http';
import { UserProfile, Project } from 'models';

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
        });
    },
    async changePassword(userId: string, password: string): Promise<void> {
        return http.post('/admin/update-password', {
            userId,
            password
        });
    },   
    async getProjects(): Promise<Project[]> {
        return http.get('/project/get-projects')
            .then(response => response.data);
    },
    async createProject(name: string, organization: string, comments: string): Promise<void> {
        return http.post('/project/create', {
            projectName: name,
            organizationName: organization,
            comments
        });
    },
    async deleteProject(projectId: string): Promise<void> {
        return http.post('/project/delete', {
            projectId
        });
    },
    async addUserToProject(projectId: string, userId: string): Promise<void> {
        return http.post('/project/add-user', {
            userId,
            projectId,
            isOwner: false
        });
    },
    async deleteUserFromProject(projectId: string, userId: string): Promise<void> {
        return http.post('/project/delete-user', {
            userId,
            projectId
        });
    }
});