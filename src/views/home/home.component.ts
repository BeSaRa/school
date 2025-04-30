import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss",
})
export class HomeComponent {}

export default HomeComponent;
