export class PeriodQueryDto {
    personId: number;
    from: number = 0;
    size: number = 10;

    constructor(personId: number, from?: number, size?: number) {
        this.personId = personId;
        if (from) {
            this.from = from;
        }
        if (size) {
            this.size = size;
        }
    }
}