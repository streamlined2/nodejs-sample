import { PeriodType } from "src/model/period";

export const minDate: Date = new Date(Date.UTC(1970, 1, 1));
export const remarkMinLength = 5;

export class PeriodSaveDto {
    personId: number;
    periodType: PeriodType;
    start: Date;
    finish?: Date;
    remark?: string;

    constructor(
        dto: PeriodSaveDto
    ) {
        this.personId = dto.personId;
        this.periodType = dto.periodType;
        this.start = new Date(dto.start);
        this.finish = (dto.finish === undefined) ? new Date(9999, 1, 1) : new Date(dto.finish);
        this.remark = dto.remark;
    }

}
