import PeriodModel from 'src/model/period';
import { Period } from 'src/model/period';
import { MissingPersonIdError } from 'src/system/missingPersonIdError';
import { InvalidDataError } from 'src/system/invalidDataError';
import { minDate, PeriodSaveDto, remarkMinLength } from 'src/dto/period/periodSaveDto';
import log4js from 'log4js';
import httpStatus from 'http-status';
import { getConsulValueByKey } from 'src/app';
import { PeriodDto } from 'src/dto/period/periodDto';
import { PeriodQueryDto } from 'src/dto/period/periodQueryDto';
import { PeriodCountRequestDto } from 'src/dto/period/periodCountRequestDto';

const defaultPersonEndpoint = 'http://localhost:8080/api/person/';
const firstCount = 0;
const numberOfCounts = 1000;

export const getCountsForPersonIds = async (requestDto: PeriodCountRequestDto): Promise<Record<string, number>> => {
    let personIdCounts = {};
    const query = await PeriodModel.aggregate().
        match({ personId: { $in: requestDto.personIds } }).
        group({ _id: "$personId", count: { $count: {} } }).
        sort({ "_id": 1 }
        ).skip(firstCount).limit(numberOfCounts);
    query.
        reduce((_, { _id, count }) => {
            personIdCounts = {
                ...personIdCounts,
                [_id]: count
            };
        }, {}
        );
    return personIdCounts as Record<string, number>;
};

export const getPeriodsForPersonSortedByTimeDesc = async (queryDto: PeriodQueryDto): Promise<PeriodDto[]> => {
    const periodList = await PeriodModel
        .find({ personId: queryDto.personId })
        .sort({ start: -1 })
        .skip(queryDto?.from)
        .limit(queryDto?.size);
    return periodList.map(period => toPeriodDto(period));
};

export const toPeriodDto = (period: Period) => ({
    personId: period.personId,
    periodType: period.periodType,
    start: period.start,
    finish: period.finish,
    remark: period.remark
});

export const savePeriod = async (
    dto: PeriodSaveDto): Promise<string> => {
    await validatePeriod(dto);
    const document = await new PeriodModel(
        {
            personId: dto.personId,
            periodType: dto.periodType,
            start: dto.start,
            finish: dto.finish,
            remark: dto.remark
        }).save();
    return document._id;
};

const validatePeriod = async (dto: PeriodSaveDto): Promise<void> => {
    if (!isPersonIdValid(dto)) {
        throw new InvalidDataError(`Person id should be valid positive number`);
    }
    if (!isPeriodTypeValid(dto)) {
        throw new InvalidDataError(`Period type should be Studying, MilitaryService, Working, Entrepreneurship, CareerBreak`);
    }
    if (!isStartValid(dto)) {
        throw new InvalidDataError(`Period start date should be greater ${minDate}`);
    }
    if (!isFinishValid(dto)) {
        throw new InvalidDataError(`Period finish date should be greater than start date ${dto.start}`);
    }
    if (!isRemarkValid(dto)) {
        throw new InvalidDataError(`Remark should not be empty string data and at least of ${remarkMinLength} characters`);
    }
    const isPresent = await personIsPresent(dto);
    if (!isPresent) {
        throw new MissingPersonIdError(`No person present with id ${dto.personId}`);
    }
};

const isPersonIdValid = (dto: PeriodSaveDto): boolean => {
    return dto.personId !== undefined && typeof dto.personId === "number";
}

const isPeriodTypeValid = (dto: PeriodSaveDto): boolean => {
    return dto.periodType !== undefined && typeof dto.periodType === "string";
}

const isStartValid = (dto: PeriodSaveDto): boolean => {
    if (dto.start === undefined) {
        return false;
    }
    return dto.start.getTime() > minDate.getTime();
}

const isFinishValid = (dto: PeriodSaveDto): boolean => {
    if (dto.finish === undefined || dto.start === undefined) {
        return false;
    }
    return dto.finish.getTime() > dto.start.getTime();
}

const isRemarkValid = (dto: PeriodSaveDto): boolean => {
    return dto.remark === undefined || (dto.remark.trim().length >= remarkMinLength);
}

const personIsPresent = async (dto: PeriodSaveDto): Promise<boolean> => {
    try {
        const personFetchEndpoint: string = await getConsulValueByKey('endpoint.person', defaultPersonEndpoint);
        const response = await fetch(personFetchEndpoint + dto.personId);
        return response.status == httpStatus.OK;
    } catch (error) {
        log4js.getLogger().error('Error while checking if person exists', error);
        return false;
    }
}
