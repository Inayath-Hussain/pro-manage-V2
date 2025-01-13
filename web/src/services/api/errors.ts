export class NetworkError {
    message: string;

    constructor() {
        this.message = "Check your network and try again"
    }
}


export class UnauthorizedError {
    message: string;

    constructor() {
        this.message = "Please Login or register"
    }
}