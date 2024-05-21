import PeriodModel from 'src/model/period';
import { MissingPersonIdError } from 'src/system/missingPersonIdError';
import { InvalidDataError } from 'src/system/invalidDataError';
import { minDate, PeriodSaveDto, remarkMinLength } from 'src/dto/period/periodSaveDto';
import log4js from 'log4js';
import httpStatus from 'http-status';

const personFetchEndpoint: string = 'http://localhost:8080/api/person/';

export const savePeriod = async (
    dto: PeriodSaveDto): Promise<string> => {
    await checkInputData(dto);
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

const checkInputData = async (dto: PeriodSaveDto): Promise<void> => {
    if (!dto.isPersonIdValid()) {
        throw new InvalidDataError(`Person id should be valid positive number`);
    }
    if (!dto.isPeriodTypeValid()) {
        throw new InvalidDataError(`Period type should be Studying, MilitaryService, Working, Entrepreneurship, CareerBreak`);
    }
    if (!dto.isStartValid()) {
        throw new InvalidDataError(`Period start date should be greater ${minDate}`);
    }
    if (!dto.isFinishValid()) {
        throw new InvalidDataError(`Period finish date should be greater than start date ${dto.getStart()}`);
    }
    if (!dto.isRemarkValid()) {
        throw new InvalidDataError(`Remark should not be empty string data and at least of ${remarkMinLength} characters`);
    }
    const isPresent = await personIsPresent(dto);
    if (!isPresent) {
        throw new MissingPersonIdError(`No person present with id ${dto.getPersonId()}`);
    }
}

const personIsPresent = async (dto: PeriodSaveDto): Promise<boolean> => {
    try {
        const response = await fetch(personFetchEndpoint + dto.getPersonId());
        return response.status == httpStatus.OK;
    } catch (error) {
        log4js.getLogger().error('Error while checking if person exists', error);
        return false;
    }
}
