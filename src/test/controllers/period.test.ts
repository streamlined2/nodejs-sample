import bodyParser from 'body-parser';
import express from 'express';
import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import routers from 'src/routers';
import PeriodModel, { Period } from 'src/model/period';
import { ObjectId } from 'mongodb';
import httpStatus from 'http-status';
import mongoSetup from '../mongoSetup';
import * as periodService from 'src/services/period';
import { consulServer } from 'src/app';
import { defaultPersonEndpoint } from 'src/services/period';

const { expect } = chai;

chai.use(chaiHttp);
chai.should();

const sandbox = sinon.createSandbox();

const app = express();

app.use(bodyParser.json({ limit: '1mb' }));
app.use('/', routers);

const personId1 = 1, personId2 = 2, personId3 = 3;

const periods: Array<Period> = [
    new PeriodModel({
        personId: personId1,
        periodType: "Studying",
        start: "2000-01-01",
        finish: "2010-01-01",
        remark: "elementary school"
    }),
    new PeriodModel({
        personId: personId2,
        periodType: "Studying",
        start: "2000-01-01",
        finish: "2010-01-01",
        remark: "elementary school"
    }),
    new PeriodModel({
        personId: personId3,
        periodType: "Studying",
        start: "2010-01-02",
        finish: "2014-01-01",
        remark: "high school"
    }),
    new PeriodModel({
        personId: personId3,
        periodType: "Studying",
        start: "2000-01-01",
        finish: "2010-01-01",
        remark: "elementary school"
    }),
    new PeriodModel({
        personId: personId1,
        periodType: "MilitaryService",
        start: "2014-01-02",
        finish: "2016-01-01",
        remark: "private"
    }),
    new PeriodModel({
        personId: personId1,
        periodType: "Working",
        start: "2016-01-02",
        finish: "2019-01-02",
        remark: "janitor"
    }),
    new PeriodModel({
        personId: personId3,
        periodType: "Studying",
        start: "2000-01-01",
        finish: "2010-01-01",
        remark: "elementary school"
    }),
    new PeriodModel({
        personId: personId1,
        periodType: "CareerBreak",
        start: "2019-01-02",
        finish: "2020-01-02",
        remark: "leave"
    }),
    new PeriodModel({
        personId: personId2,
        periodType: "Studying",
        start: "2000-01-01",
        finish: "2010-01-01",
        remark: "elementary school"
    }),
    new PeriodModel({
        personId: personId1,
        periodType: "Entrepreneurship",
        start: "2020-01-02",
        finish: "2030-01-02",
        remark: "self-employed"
    })
];

describe('Period controller', () => {

    before(async () => {
        await mongoSetup;

        periods.forEach(async period => { await period.save(); })
    });

    after(async () => {
        periods.forEach(async period => period.deleteOne());
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should list periods for given person id sorted by start date in descending order', (done) => {
        const resultingPeriods = [
            periods[9],
            periods[7],
            periods[5],
            periods[4],
            periods[0],
        ].map(periodService.toPeriodDtoDateAsString);

        chai.request(app)
            .get('/api/period/' + personId1)
            .end((_, response) => {
                response.should.have.status(httpStatus.OK);
                expect(response.body).to.eql(resultingPeriods);

                done();
            });
    },
    );

    it('should fetch counts for every passed person id', (done) => {
        const personIds = [personId1, personId2, personId3];
        const resultingQuery =
        {
            '1': 5,
            '2': 2,
            '3': 3
        };

        chai.request(app)
            .post('/api/period/_counts')
            .send({ personIds })
            .end((_, response) => {
                response.should.have.status(httpStatus.OK);
                expect(response.body).to.eql(resultingQuery);

                done();
            });
    },
    );

    it('should save new period', (done) => {
        const personId = 1;
        const periodIdAfterSave = new ObjectId();
        const period = {
            _id: new ObjectId(),
            personId: personId,
            periodType: "Studying",
            start: new Date("2000-01-01"),
            finish: new Date("2010-01-01"),
            remark: "elementary school"
        };

        sandbox.stub(global, 'fetch').resolves(mockAPIResponse());
        sandbox.stub(consulServer.kv, 'get').resolves(defaultPersonEndpoint);
        sandbox.stub(PeriodModel.prototype, 'save').returns({
            ...period,
            _id: periodIdAfterSave,
        });

        chai.request(app)
            .post('/api/period')
            .send({ ...period })
            .end((_, response) => {
                response.should.have.status(httpStatus.CREATED);
                expect(response.body._id).to.equal(periodIdAfterSave.toString());

                done();
            });
    },
    );

    const mockAPIResponse = (body = {}) => {
        return new Response(
            JSON.stringify(body),
            {
                status: httpStatus.OK,
                headers: { 'Content-type': 'application/json' }
            }
        );
    };

});
