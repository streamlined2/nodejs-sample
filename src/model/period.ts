import mongoose, { Document, Schema } from "mongoose";

export type PeriodType =
    "Studying" |
    "MilitaryService" |
    "Working" |
    "Entrepreneurship" |
    "CareerBreak";

export interface Period extends Document {
    personId: number;
    periodType: PeriodType;
    start: Date;
    finish: Date;
    remark: string;
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