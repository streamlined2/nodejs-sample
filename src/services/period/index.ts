import PeriodModel from 'src/model/period';
import { PeriodSaveDto } from 'src/dto/period/periodSaveDto';

export const savePeriod = async (
    dto: PeriodSaveDto): Promise<string> => {
    const document = await new PeriodModel(
        {
            personId: dto.getPersonId(),
            periodType: dto.getPeriodType(),
            start: dto.getStart(),
            finish: dto.getFinish(),
            remark: dto.getRemark()
        }).save();
    return document._id;
};