import mongoose, { Document, Schema } from "mongoose";

export class Period extends Document {
    constructor(
        private personId: number,
        private start: Date,
        private finish: Date = new Date(Date.UTC(9999, 1, 1)),
        private remark: string = ""
    ) {
        super();
        this.personId = personId;
        this.start = start;
        this.finish = finish;
        this.remark = remark;
    }

    public getPersonId(): number {
        return this.personId;
    }

    public getStart(): Date {
        return this.start;
    }

    public getFinish(): Date {
        return this.finish;
    }

    public getRemark(): string {
        return this.remark;
    }
}

const schema = new Schema({
    personId: {
        required: true,
        type: Number
    },
    start: {
        required: true,
        type: Date
    },
    finish: {
        required: false,
        type: Date
    },
    remark: {
        required: false,
        type: String
    }
});

const PeriodModel = mongoose.model<Period>('Period', schema);

export default PeriodModel;