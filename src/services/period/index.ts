import PeriodModel from 'src/model/period';
import { PeriodSaveDto } from 'src/dto/period/periodSaveDto';

export const savePeriod = async (
    { personId, start, finish, remark }: PeriodSaveDto): Promise<string> => {
    const document = await new PeriodModel(
        { personId, start, finish, remark }).save();
    return document._id;
};