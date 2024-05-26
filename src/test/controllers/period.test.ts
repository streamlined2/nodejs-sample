import bodyParser from 'body-parser';
import express from 'express';
import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import routers from 'src/routers';
import PeriodModel from 'src/model/period';
import { ObjectId } from 'mongodb';
import httpStatus from 'http-status';

const { expect } = chai;

chai.use(chaiHttp);
chai.should();

const sandbox = sinon.createSandbox();

const app = express();

app.use(bodyParser.json({ limit: '1mb' }));
app.use('/', routers);

describe('Period controller', () => {

    afterEach(() => {
        sandbox.restore();
    });

    it('should list periods for given person with id 1 sorted by start date in descending order', (done) => {
        const personId = 1;
        const periods = [
            {
                _id: new ObjectId().toString(),
                personId: personId,
                periodType: "Studying",
                start: "2000-01-01",
                finish: "2010-01-01",
                remark: "elementary school"
            },
            {
                _id: new ObjectId().toString(),
                personId: 2,
                periodType: "Studying",
                start: "2000-01-01",
                finish: "2010-01-01",
                remark: "elementary school"
            },
            {
                _id: new ObjectId().toString(),
                personId: personId,
                periodType: "Studying",
                start: "2010-01-02",
                finish: "2014-01-01",
                remark: "high school"
            },
            {
                _id: new ObjectId().toString(),
                personId: 3,
                periodType: "Studying",
                start: "2000-01-01",
                finish: "2010-01-01",
                remark: "elementary school"
            },
            {
                _id: new ObjectId().toString(),
                personId: personId,
                periodType: "MilitaryService",
                start: "2014-01-02",
                finish: "2016-01-01",
                remark: "private"
            },
            {
                _id: new ObjectId().toString(),
                personId: personId,
                periodType: "Working",
                start: "2016-01-02",
                finish: "2019-01-02",
                remark: "janitor"
            },
            {
                _id: new ObjectId().toString(),
                personId: 4,
                periodType: "Studying",
                start: "2000-01-01",
                finish: "2010-01-01",
                remark: "elementary school"
            },
            {
                _id: new ObjectId().toString(),
                personId: personId,
                periodType: "CareerBreak",
                start: "2019-01-02",
                finish: "2020-01-02",
                remark: "leave"
            },
            {
                _id: new ObjectId().toString(),
                personId: 5,
                periodType: "Studying",
                start: "2000-01-01",
                finish: "2010-01-01",
                remark: "elementary school"
            },
            {
                _id: new ObjectId().toString(),
                personId: personId,
                periodType: "Entrepreneurship",
                start: "2020-01-02",
                finish: "2030-01-02",
                remark: "self-employed"
            }
        ];

        const resultingPeriods = [
            {
                _id: new ObjectId().toString(),
                personId: personId,
                periodType: "Entrepreneurship",
                start: "2020-01-02",
                finish: "2030-01-02",
                remark: "self-employed"
            },
            {
                _id: new ObjectId().toString(),
                personId: personId,
                periodType: "CareerBreak",
                start: "2019-01-02",
                finish: "2020-01-02",
                remark: "leave"
            },
            {
                _id: new ObjectId().toString(),
                personId: personId,
                periodType: "Working",
                start: "2016-01-02",
                finish: "2019-01-02",
                remark: "janitor"
            },
            {
                _id: new ObjectId().toString(),
                personId: personId,
                periodType: "MilitaryService",
                start: "2014-01-02",
                finish: "2016-01-01",
                remark: "private"
            },
            {
                _id: new ObjectId().toString(),
                personId: personId,
                periodType: "Studying",
                start: "2010-01-02",
                finish: "2014-01-01",
                remark: "high school"
            },
            {
                _id: new ObjectId().toString(),
                personId: personId,
                periodType: "Studying",
                start: "2000-01-01",
                finish: "2010-01-01",
                remark: "elementary school"
            }
        ];

        sandbox.stub(
            PeriodModel,
            'find',
        ).resolves(periods);

        chai.request(app)
            .get('/api/period/' + personId)
            .end((_, response) => {
                expect(response.body).to.deep.equal(resultingPeriods);
                response.should.have.status(httpStatus.OK);

                done();
            });
    },
    );

    it('should save new period', (done) => {
        const periodId = 1;
        const periodIdAfterSave = new ObjectId();
        const period = {
            personId: periodId,
            periodType: "Studying",
            start: "2000-01-01",
            finish: "2010-01-01",
            remark: "elementary school"
        };

        const saveOneStub = sandbox.stub(
            PeriodModel.prototype,
            'save',
        );
        saveOneStub.resolves({
            ...period,
            _id: periodIdAfterSave,
        });

        chai.request(app)
            .post('/api/period')
            .send({ body: { ...period } })
            .end((_, response) => {
                response.should.have.status(httpStatus.CREATED);
                expect(response.body.id).to.equal(periodIdAfterSave.toString());

                done();
            });
    },
    );
});
