const minDate = new Date(Date.UTC(1970, 1, 1));

export class PeriodSaveDto {
    personId?: number;
    start?: Date;
    finish?: Date;
    remark?: string;

    constructor(data: Partial<PeriodSaveDto>) {
        this.personId = data.personId;
        this.start = data.start;
        this.finish = (data.finish === undefined) ? new Date(9999, 1, 1) : data.finish;
        this.remark = data.remark;
    }

    public getPersonId(): number | undefined {
        return this.personId;
    }

    public isValid(): boolean {
        return (
            this.isPersonIdValid() &&
            this.isStartValid() &&
            this.isFinishValid() &&
            this.isRemarkValid());
    }

    public isPersonIdValid() {
        return this.personId !== undefined;
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
        return true;//TODO add extra checks
    }
}
