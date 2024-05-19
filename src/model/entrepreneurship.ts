import { Period } from './period';

export class Entrepreneurship extends Period {
    constructor(
        personId: number,
        start: Date,
        finish: Date = new Date(Date.UTC(9999, 1, 1)),
        remark: string = "",
        private company: string,
        private founded: Date
    ) {
        super(personId, start, finish, remark);
        this.company = company;
        this.founded = founded;
    }

    public getCompany(): string {
        return this.company;
    }

    public getFounded(): Date {
        return this.founded;
    }
}