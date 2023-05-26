import {AnswerValidity} from "../enums/AnswerValidity";

export interface Answer{
  id?: number;
  answerBody: string;
  answerValidity: AnswerValidity;
}
