import { Timetable } from "@/models/timetable";
import { ModelInterceptorContract } from "cast-response";

export class TimetableInterceptor implements ModelInterceptorContract<Timetable> {
  send(model: Partial<Timetable>): Partial<Timetable> {
    return model;
  }

  receive(model: Timetable): Timetable {
    return model;
  }
}
