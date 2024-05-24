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
        match({ personId: { $in: requestDto.getPersonIds() } }).
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
        .skip(queryDto.from)
        .limit(queryDto.size)
        .sort({ start: -1 });
    return periodList.map(period => toPeriodDto(period));
};

const toPeriodDto = (period: Period) => ({
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
            personId: dto.getPersonId(),
            periodType: dto.getPeriodType(),
            start: dto.getStart(),
            finish: dto.getFinish(),
            remark: dto.getRemark()
        }).save();
    return document._id;
};

const validatePeriod = async (dto: PeriodSaveDto): Promise<void> => {
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
        const personFetchEndpoint: string = await getConsulValueByKey('endpoint.person', defaultPersonEndpoint);
        const response = await fetch(personFetchEndpoint + dto.getPersonId());
        return response.status == httpStatus.OK;
    } catch (error) {
        log4js.getLogger().error('Error while checking if person exists', error);
        return false;
    }
}
