export class PeriodCountRequestDto {
    personIds: number[];

    constructor(data: PeriodCountRequestDto) {
        this.personIds = data.personIds;
    }

}