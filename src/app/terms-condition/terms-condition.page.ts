import { Component, OnInit } from "@angular/core";
import { LoadingController, NavController } from "@ionic/angular";

@Component({
  selector: "app-terms-condition",
  templateUrl: "./terms-condition.page.html",
  styleUrls: ["./terms-condition.page.scss"],
})
export class TermsConditionPage implements OnInit {
  constructor(public navCtrl: NavController) {}

  ngOnInit() {}

  close_() {
    this.navCtrl.navigateForward("/tabs/account");
  }
}
