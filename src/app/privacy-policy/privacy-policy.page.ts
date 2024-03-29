import { Component, OnInit } from "@angular/core";
import { LoadingController, NavController } from "@ionic/angular";

@Component({
  selector: "app-privacy-policy",
  templateUrl: "./privacy-policy.page.html",
  styleUrls: ["./privacy-policy.page.scss"],
})
export class PrivacyPolicyPage implements OnInit {
  constructor(public navCtrl: NavController) {}

  ngOnInit() {}

  close_() {
    this.navCtrl.navigateForward("/tabs/account");
  }
}
