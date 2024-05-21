import log4js from 'log4js';
import { Request, Response } from 'express';
import { minDate, PeriodSaveDto, remarkMinLength } from 'src/dto/period/periodSaveDto';
import { savePeriod as savePeriodApi } from 'src/services/period';
import httpStatus from 'http-status';
import { InternalError } from 'src/system/internalError';
import { MissingPersonIdError } from 'src/system/missingPersonIdError';
import { InvalidDataError } from 'src/system/invalidDataError';

export const savePeriod = async (request: Request, response: Response) => {
    try {
        const dto = new PeriodSaveDto(request.body);
        checkInputData(dto);
        const id = await savePeriodApi(dto);
        response.status(httpStatus.CREATED).send({ id });
    } catch (error) {
        const { message, status } = new InternalError(error);
        log4js.getLogger().error('Cannot save period', error);
        response.status(status).send({ message });
    }
};

const checkInputData = (dto: PeriodSaveDto) => {
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
    if (!checkIfPersonIdPresent(dto)) {
        throw new MissingPersonIdError(`No person present with id ${dto.getPersonId()}`);
    }
}

const checkIfPersonIdPresent = (dto: PeriodSaveDto): boolean => {
    //TODO check if dto.periodId is valid and present by fetching data from another microservice
    return dto.getPersonId() !== undefined;
}