import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { InterceptModel } from "cast-response";
import { Course } from "./course";
import { Staff } from "./staff";
import { ClassRoom } from "@/types/face-repo.types";
import { TimetableInterceptor } from "@/model-interceptors/Timetable-interceptor";

const { send, receive } = new TimetableInterceptor();

@InterceptModel({ send, receive })
export class Timetable extends BaseCrudModel<Timetable, any> {
  override $$__service_name__$$ = "TimetableService";

  weekDay!: number;
  startTime!: string;
  endTime!: string;
  isSubstituteTeacher!: boolean;
  course!: Course;
  educator!: Staff;
  classroom!: ClassRoom;
}
