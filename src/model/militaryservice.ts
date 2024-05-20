import { Period } from './period';

enum Rank { Private, Sergeant, Corporal, Lieutenant, Major, Colonel, General };

export class MilitaryService extends Period {
    constructor(
        personId: number,
        start: Date,
        finish: Date = new Date(Date.UTC(9999, 1, 1)),
        remark: string = "",
        private rank: Rank,
        private decorations: string[]
    ) {
        super(personId, start, finish, remark);
        this.rank = rank;
        this.decorations = decorations;
    }

    public getRank(): Rank {
        return this.rank;
    }

    public getDecorations(): string[] {
        return [...this.decorations];
    }
}
