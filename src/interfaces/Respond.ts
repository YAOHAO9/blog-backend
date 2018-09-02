export enum NotifyType {
    Info = 'info',
    Warning = 'warning',
    Error = 'error',
    Success = 'success',
}
export class Notify {
    public message: string;
    public type: NotifyType;
    public displayTime?: number;
    constructor(message: string, type: NotifyType = NotifyType.Success, displayTime?: number) {
        this.message = message;
        this.type = type;
        this.displayTime = displayTime;
    }
}

export enum ActionType {
    Login = 'Login',
    NotLogin = 'NotLogin',
    Redirect = 'Redirect',
    Navigate = 'Navigate',
}

export class Action {
    public type: ActionType;
    public data: any;
    constructor(type: ActionType, data?: any) {
        this.type = type;
        this.data = data;
    }
}

export class Result {
    public data: any;
    public error: any;
    public notify: Notify;
    public action: Action;
    constructor(data?: any, notify?: Notify, action?: Action) {
        if (data instanceof Error) {
            this.error = {
                message: data.message,
                stack: process.env.NODE_ENV === 'development' ? data.stack : undefined,
                // errors: process.env.NODE_ENV === 'development' ? data.errors : undefined,
            };
            if (notify) {
                this.notify = notify;
            } else {
                this.notify = new Notify(data.message, NotifyType.Error);
            }

        } else {
            this.data = data;
            this.notify = notify;
        }
        this.action = action;
    }

    public addNotify(notify: Notify) {
        this.notify = notify;
        return this;
    }
    public addAction(action: Action) {
        this.action = action;
        return this;
    }

}
