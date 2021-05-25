import { Component } from "@angular/core";
import { Data } from "../data";
import { Settings } from "../data/settings";
// import { CountdownTimerModule } from "angular-countdown-timer";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
  // providers: [CountdownTimerModule],
})
export class TabsPage {
  constructor(public data: Data, public settings: Settings) {}
}
