import { action, observable } from 'mobx';

import { BelsimError } from 'models';

export class ErrorStore {
    @observable public errors: BelsimError[];

    public constructor() {
        this.init();
    }

    @action
    public init(): void {
        this.errors = new Array<BelsimError>();
    }

    @action
    public addError(message: string) {
        this.errors.push({
            errorId: this.generateId(),
            message: message
        });
    }

    @action
    public closeError(errorId: string) {
        this.errors = this.errors.filter(e => e.errorId !== errorId);
    }

    private generateId(): string {
        return Math.random().toString(16).slice(2);
    }
}