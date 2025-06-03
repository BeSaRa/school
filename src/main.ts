import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { LocalService } from "./services/local.service";

bootstrapApplication(AppComponent, appConfig)
  .then((appRef) => {
    const injector = appRef.injector;
    const localService = injector.get(LocalService);
    return localService.loadTranslations();
  })
  .catch((err) => console.error(err));
