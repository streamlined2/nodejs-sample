import log4js from 'log4js';
import { Request, Response } from 'express';
import { PeriodSaveDto } from 'src/dto/period/periodSaveDto';
import { savePeriod as savePeriodApi } from 'src/services/period';
import httpStatus from 'http-status';
import { InternalError } from 'src/system/internalError';

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
