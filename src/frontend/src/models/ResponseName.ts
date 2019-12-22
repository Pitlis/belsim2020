export class ResponseName {
    public originalName: string = '';
    public name: string = '';

    constructor(originalName: string) {
        this.originalName = originalName;
        if (originalName.startsWith('_')) {
            this.name = originalName.slice(1);
        } else {
            this.name = originalName;
        }
    }
}