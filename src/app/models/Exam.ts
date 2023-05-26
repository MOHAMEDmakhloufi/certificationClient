import {AvailabilityStatus} from "../enums/Availability";
import {SkillsMeasured} from "./SkillsMeasured";
import {Question} from "./Question";

export interface Exam{
    id?: number;
    logoUrl?: string;
    logo?: File;
    certificationName?:string;
    createAt?: Date;
    timeLimit?: number;
    nbQuestion?: number;
    description?: string;
    skillsMeasuredList?: SkillsMeasured[];
    questions?: Question[];
    availability?: AvailabilityStatus;
    showConfirmation?: boolean;
}
