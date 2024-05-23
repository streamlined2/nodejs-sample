export class PeriodQueryDto {
    public personId: number;
    public from: number = 0;
    public size: number = 10;

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