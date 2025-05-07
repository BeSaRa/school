import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { VersionComponent } from "@/components/version/version.component";
import { LoadingComponent } from "@/components/loading/loading.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, VersionComponent, LoadingComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {}
