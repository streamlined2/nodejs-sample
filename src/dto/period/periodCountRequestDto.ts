export class PeriodCountRequestDto {
    private personIds: number[];

    constructor(data: PeriodCountRequestDto) {
        this.personIds = data.personIds;
    }

    public getPersonIds(): number[] {
        return [...this.personIds];
    }
}