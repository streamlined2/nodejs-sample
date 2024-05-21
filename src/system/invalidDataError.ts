export class InvalidDataError {
    constructor(private message: string) {
        this.message = message;
    }

    public getMessage(): string {
        return this.message;
    }
}