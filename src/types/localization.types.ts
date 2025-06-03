export interface LangKeysContract {
  send: string;
  filter_placeholder: string;
  filter_all: string;
  filter_yes: string;
  filter_no: string;
  no_items_found: string;
  get_started: string;
  edit_item: string;
  edit: string;
  delete: string;
  page: string;
  of: string;
  first_page: string;
  previous_page: string;
  next_page: string;
  last_page: string;
  edit_title: string;
  add_new: string;
  is_required: string;
  cancel: string;
  update: string;
  create: string;
  column_email: string;
  column_full_name: string;
  column_role: string;
  column_status: string;
  column_name: string;
  column_education_level: string;
  column_category: string;
  column_city: string;
  status_active: string;
  status_inactive: string;
  role_student: string;
  role_supervisor: string;
  role_teacher: string;
  role_superuser: string;
  education_level_low: string;
  education_level_higher: string;
  education_level_secondary: string;
  education_level_primary: string;
  action: string;
  users: string;
  no_face_repos_found: string;
  class_title: string;
  students: string;
  no_students_found: string;
  teachers: string;
  no_teachers_found: string;
  id: string;
  full_image_view: string;
  close: string;
  profile: string;
  role: string;
  status: string;
  active: string;
  inactive: string;
  username: string;
  enter_username: string;
  username_required: string;
  username_minlength: string;
  password: string;
  enter_password: string;
  password_required: string;
  password_minlength: string;
  forgot_password: string;
  sign_in: string;
  signing_in: string;
  logo_alt: string;
  loading: string;
}

export type SupportedLanguage = "en" | "ar";

export interface LocalizationEntry {
  ar: string;
  en: string;
}

export interface LocalizationData {
  [key: string]: LocalizationEntry;
}
