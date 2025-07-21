import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { ContactInterceptor } from "@/model-interceptors/contact-interceptor";
import { ContactService } from "@/services/contact.service";
import { InterceptModel } from "cast-response";
type ContactType = "email" | "mobile" | "phone" | "website";

const { send, receive } = new ContactInterceptor();
@InterceptModel({ send, receive })
export class Contact extends BaseCrudModel<Contact, ContactService> {
  override $$__service_name__$$ = "ContactService";
  contact!: string;
  type!: ContactType;
  created_by!: number;
}
