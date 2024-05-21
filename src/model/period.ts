import mongoose, { Document, Schema } from "mongoose";

export type PeriodType =
    "Studying" |
    "MilitaryService" |
    "Working" |
    "Entrepreneurship" |
    "CareerBreak";

export class Period extends Document {
    constructor(
        private personId: number,
        private periodType: PeriodType,
        private start: Date,
        private finish: Date = new Date(Date.UTC(9999, 1, 1)),
        private remark: string = ""
    ) {
        super();
        this.personId = personId;
        this.periodType = periodType;
        this.start = start;
        this.finish = finish;
        this.remark = remark;
    }

    public getPersonId(): number {
        return this.personId;
    }

    public getPeriodType(): PeriodType {
        return this.periodType;
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
        type: Number,
        min: 1
    },
    periodType: {
        required: true,
        type: String,
        trim: true,
        enum: {
            values: ["Studying", "MilitaryService", "Working", "Entrepreneurship", "CareerBreak"],
            message: '{VALUE} is incorrect value'
        }
    },
    start: {
        required: true,
        type: Date,
        min: new Date(1970, 1, 1)
    },
    finish: {
        required: false,
        type: Date,
        default: new Date(9999, 1, 1)
    },
    remark: {
        required: false,
        type: String,
        trim: true
    }
}, { toJSON: { getters: true }, toObject: { getters: true } });

const PeriodModel = mongoose.model<Period>('Period', schema);

export default PeriodModel;