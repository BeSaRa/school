import { Contact } from "@/models/contact";
import { ModelInterceptorContract } from "cast-response";

export class ContactInterceptor implements ModelInterceptorContract<Contact> {
  send(model: Partial<Contact>): Partial<Contact> {
    return model;
  }

  receive(model: Contact): Contact {
    return model;
  }
}
