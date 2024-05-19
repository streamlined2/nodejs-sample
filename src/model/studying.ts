import { Period } from './period';

enum EducationType { School, College, University, Academy };
enum Degree { Graduate, Bachelor, Master, Doctor };

export class Studying extends Period {
    constructor(
        personId: number,
        start: Date,
        finish: Date = new Date(Date.UTC(9999, 1, 1)),
        remark: string = "",
        private educationType: EducationType,
        private educationalFacility: string,
        private degree?: Degree
    ) {
        super(personId, start, finish, remark);
        this.educationType = educationType;
        this.educationalFacility = educationalFacility;
        this.degree = degree;
    }

    public getEducationType(): EducationType {
        return this.educationType;
    }

    public getEducationalFacility(): string {
        return this.educationalFacility;
    }

    public getDegree(): Degree | undefined {
        return this.degree;
    }
}
