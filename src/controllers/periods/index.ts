import log4js from 'log4js';
import { Request, Response } from 'express';
import { PeriodSaveDto } from 'src/dto/period/periodSaveDto';
import { savePeriod as savePeriodApi, getPeriodsForPersonSortedByTimeDesc as getPeriodsForPersonSortedByTimeDescApi } from 'src/services/period';
import httpStatus from 'http-status';
import { InternalError } from 'src/system/internalError';
import { PeriodQueryDto } from 'src/dto/period/periodQueryDto';

export const savePeriod = async (request: Request, response: Response) => {
    try {
        const dto = new PeriodSaveDto(request.body);
        const id = await savePeriodApi(dto);
        response.status(httpStatus.CREATED).send({ id });
    } catch (error) {
        const { message, status } = new InternalError(error);
        log4js.getLogger().error('Cannot save period', error);
        response.status(status).send({ message });
    }
};

export const getPeriodsForPersonSortedByTimeDesc = async (request: Request, response: Response) => {
    try {
        const queryDto = createPeriodQueryDto(request);
        const periodList = await getPeriodsForPersonSortedByTimeDescApi(queryDto);
        response.send({ periodList });
    } catch (error) {
        const { message, status } = new InternalError(error);
        log4js.getLogger().error(`Cannot retrieve list of periods for person id ${request.params.personId}`, error);
        response.status(status).send({ message });
    }
};

const createPeriodQueryDto = (request: Request): PeriodQueryDto => {
    return new PeriodQueryDto(
        Number(request.params.personId),
        Number(request.query.from),
        Number(request.query.size))
};