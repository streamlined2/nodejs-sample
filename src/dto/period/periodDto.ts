import { PeriodType } from "src/model/period";

export class PeriodDto {
    personId: number;
    periodType: PeriodType;
    start: Date;
    finish?: Date;
    remark?: string;

    constructor(
        personId: number,
        periodType: PeriodType,
        start: Date,
        finish?: Date,
        remark?: string
    ) {
        this.personId = personId;
        this.periodType = periodType;
        this.start = start;
        this.finish = finish;
        this.remark = remark;
    }
};
