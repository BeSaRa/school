import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { AppComponent } from "./app/app.component";
import { LocalService } from "./services/local.service";
import { ServiceRegistry } from "./services/service-registry";

bootstrapApplication(AppComponent, appConfig)
  .then(async (appRef) => {
    const injector = appRef.injector;
    const localService = injector.get(LocalService);

    ServiceRegistry.set("LocalService", localService);
    await localService.loadTranslations();
  })
  .catch((err) => console.error(err));
