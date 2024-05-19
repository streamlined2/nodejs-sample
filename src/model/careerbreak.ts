import { Period } from "./period";

export class CareerBreak extends Period {
    constructor(
        personId: number,
        start: Date,
        finish: Date = new Date(Date.UTC(9999, 1, 1)),
        remark: string = "",
        private travels: string[]
    ) {
        super(personId, start, finish, remark);
        this.travels = travels;
    }

    public getTravels(): string[] {
        return [...this.travels];
    }
}