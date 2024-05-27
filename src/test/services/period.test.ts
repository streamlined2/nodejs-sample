import chai from 'chai';
import sinon from 'sinon';
import { ObjectId } from 'mongodb';
import mongoSetup from '../mongoSetup';
import PeriodModel, { Period } from 'src/model/period';
import { PeriodSaveDto } from 'src/dto/period/periodSaveDto';
import * as periodService from 'src/services/period';
import httpStatus from 'http-status';
import { defaultPersonEndpoint } from 'src/services/period';
import { consulServer } from 'src/app';

const { expect } = chai;

const sandbox = sinon.createSandbox();

const personId = 1;
const otherPersonId = 2;

const periods: Array<Period> = [
    new PeriodModel(
        {
            _id: new ObjectId(),
            personId: personId,
            periodType: "Studying",
            start: new Date("2012-01-01"),
            finish: new Date("2017-01-01"),
            remark: "elementary school"
        }
    ),
    new PeriodModel(
        {
            _id: new ObjectId(),
            personId: personId,
            periodType: "MilitaryService",
            start: new Date("2017-01-01"),
            finish: new Date("2019-01-01"),
            remark: "private"
        }
    ),
    new PeriodModel(
        {
            _id: new ObjectId(),
            personId: otherPersonId,
            periodType: "Working",
            start: new Date("2010-01-01"),
            finish: new Date("2020-01-01")
        }
    )
];

describe('Period Service', () => {
    before(async () => {
        await mongoSetup;

        periods.forEach(async (period) => await period.save());
    });

    after(async () => {
        periods.forEach(async (period) => await period.deleteOne());
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("savePeriod should create new period and return it's id", (done) => {
        sandbox.stub(global, 'fetch').resolves(mockAPIResponse());
        sandbox.stub(consulServer.kv, 'get').resolves(defaultPersonEndpoint);

        const strayPersonId = 1000;
        const periodDto: PeriodSaveDto = {
            personId: strayPersonId,
            periodType: "MilitaryService",
            start: new Date("2000-01-01"),
            finish: new Date("2010-01-01"),
            remark: "private"
        };
        periodService.savePeriod(periodDto)
            .then(async (id) => {
                const period = await PeriodModel.findById(id);

                expect(period).to.exist;
                expect(period?.personId).to.equal(periodDto.personId);
                expect(period?.periodType).to.equal(periodDto.periodType);
                expect(period?.start).to.eql(periodDto.start);
                expect(period?.finish).to.eql(periodDto.finish);
                expect(period?.remark).to.eql(periodDto.remark);

                period?.deleteOne();

                done();
            })
            .catch((error: Error) => done(error));
    });

    const mockAPIResponse = (body = {}) => {
        return new Response(
            JSON.stringify(body),
            {
                status: httpStatus.OK,
                headers: { 'Content-type': 'application/json' }
            }
        );
    };

    it('getPeriodsForPersonSortedByTimeDesc should provide a list of periods for given personId sorted by start date in descending order', (done) => {
        const resultingPeriods = [periods[1], periods[0]].map(periodService.toPeriodDto);
        periodService.getPeriodsForPersonSortedByTimeDesc({ personId: personId, from: 0, size: 10 })
            .then((periods) => {
                expect(periods).to.eql(resultingPeriods);
                done();
            })
            .catch((error: Error) => done(error));
    });

    it('getCountsForPersonIds should fetch list of counts for every provided personId sorted by person id date in ascending order', (done) => {
        periodService.getCountsForPersonIds({ personIds: [personId, otherPersonId] })
            .then((queryResult) => {
                expect(queryResult).to.eql({ [personId]: 2, [otherPersonId]: 1 });
                done();
            })
            .catch((error: Error) => done(error));
    });

});
