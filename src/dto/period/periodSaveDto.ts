import { PeriodType } from "src/model/period";

export const minDate: Date = new Date(Date.UTC(1970, 1, 1));
export const remarkMinLength = 5;

export class PeriodSaveDto {
    private personId: number;
    private periodType: PeriodType;
    private start: Date;
    private finish?: Date;
    private remark?: string;

    constructor(
        dto: PeriodSaveDto
    ) {
        this.personId = dto.personId;
        this.periodType = dto.periodType;
        this.start = new Date(dto.start);
        this.finish = (dto.finish === undefined) ? new Date(9999, 1, 1) : new Date(dto.finish);
        this.remark = dto.remark;
    }

    public getPersonId(): number | undefined {
        return this.personId;
    }

    public getPeriodType(): PeriodType {
        return this.periodType;
    }

    public getStart(): Date {
        return this.start;
    }

    public getFinish(): Date | undefined {
        return this.finish;
    }

    public getRemark(): String | undefined {
        return this.remark;
    }

    public isValid(): boolean {
        return (
            this.isPersonIdValid() &&
            this.isPeriodTypeValid() &&
            this.isStartValid() &&
            this.isFinishValid() &&
            this.isRemarkValid()
        );
    }

    public isPersonIdValid() {
        return this.personId !== undefined && typeof this.personId === "number";
    }

    public isPeriodTypeValid() {
        return this.periodType !== undefined && typeof this.periodType === "string";
    }

    public isStartValid(): boolean {
        if (this.start === undefined) {
            return false;
        }
        return this.start.getTime() > minDate.getTime();
    }

    public isFinishValid(): boolean {
        if (this.finish === undefined || this.start === undefined) {
            return false;
        }
        return this.finish.getTime() > this.start.getTime();
    }

    public isRemarkValid() {
        return this.remark === undefined || (this.remark.trim().length >= remarkMinLength);
    }
}
