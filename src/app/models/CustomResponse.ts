import {Exam} from "./Exam";

export interface CustomResponse<T>{
  timeStamp? : Date;
  statusCode?: number;
  status?: string;
  reason?: string;
  message?: string;
  developerMessage?: string;
  data?: {exams?: T[], exam?: T, questions?: T[], question?: T, skillsMeasured?: T[], hasId?: T}
}
