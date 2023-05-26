import {SkillsMeasured} from "./SkillsMeasured";
import {Answer} from "./Answer";

export interface Question{
  id: number;
  createAt: Date;
  updateAt?: Date;
  questionHeader?: string;
  skillMeasured: SkillsMeasured;
  answers?: Answer[];
}
