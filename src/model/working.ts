import { Period } from './period';

export class Working extends Period {
    constructor(
        personId: number,
        start: Date,
        finish: Date = new Date(Date.UTC(9999, 1, 1)),
        remark: string = "",
        private company: string,
        private role: string,
        private accomplishments: string[]
    ) {
        super(personId, start, finish, remark);
        this.company = company;
        this.role = role;
        this.accomplishments = accomplishments;
    }

    public getCompany(): string {
        return this.company;
    }

    public getRole(): string {
        return this.role;
    }

    public getAccomplishments(): string[] {
        return this.accomplishments;
    }
}
