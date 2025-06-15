import { animate, style, transition, trigger } from "@angular/animations";

export const navbarAnimations = [
  trigger("floatIn", [transition(":enter", [style({ opacity: 0, transform: "translateY(20px)" }), animate("0.3s ease-out", style({ opacity: 1, transform: "translateY(0)" }))])]),
  trigger("expandCollapse", [
    transition(":enter", [style({ opacity: 0, transform: "scale(0.95)" }), animate("0.2s ease-out", style({ opacity: 1, transform: "scale(1)" }))]),
    transition(":leave", [style({ opacity: 1, transform: "scale(1)" }), animate("0.2s ease-in", style({ opacity: 0, transform: "scale(0.95)" }))]),
  ]),
];
