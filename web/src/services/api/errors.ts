export class NetworkError {
    message: string;
    constructor() {
        this.message = "Something went wrong please try again later"
    }
}


export class UnauthorizedError {
    message: string;
    constructor() {
        this.message = "Please Login again"
    }
}


export class UserOfflineError {
    message: string;
    constructor() {
        this.message = "You are offline. Check your network and try again"
    }
}