import { Component, OnInit } from "@angular/core";
import { LoadingController, NavController } from "@ionic/angular";
import { ApiService } from "../api.service";
import { Settings } from "../data/settings";
import { Product } from "../data/product";

import {
  InAppBrowser,
  InAppBrowserOptions,
} from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: "app-my-enquiries",
  templateUrl: "./my-enquiries.page.html",
  styleUrls: ["./my-enquiries.page.scss"],
})
export class Myenquiries implements OnInit {
  dataOn = false;
  tickets_data: any;
  singleView = false;
  message = "";
  enquiry: any;
  singleViewData: any;
  inquery_id: any;
  product_id: any;
  enqId: any;
  options: InAppBrowserOptions = {
    location: "yes", //Or 'no'
    hidden: "no", //Or  'yes'
    clearcache: "yes",
    clearsessioncache: "yes",
    zoom: "yes", //Android only ,shows browser zoom controls
    hardwareback: "yes",
    mediaPlaybackRequiresUserAction: "no",
    shouldPauseOnSuspend: "no", //Android only
    closebuttoncaption: "Close", //iOS only
    disallowoverscroll: "no", //iOS only
    toolbar: "yes", //iOS only
    enableViewportScale: "no", //iOS only
    allowInlineMediaPlayback: "no", //iOS only
    presentationstyle: "pagesheet", //iOS only
    fullscreen: "yes", //Windows only
  };

  constructor(
    public settings: Settings,
    public api: ApiService,
    public navCtrl: NavController,
    public product: Product,
    public loadingController: LoadingController,
    private theInAppBrowser: InAppBrowser
  ) {}

  ionViewDidEnter() {
    this.getData_();
  }

  ngOnInit() {}

  goTo() {
    this.openWithInAppBrowser("https://opyix.com/contact");
  }

  async getData_() {
    this.message = "";
    // console.log("vendors");
    let Loading_ = await this.loadingController.create({
      message: "Please wait...",
      translucent: true,
      cssClass: "custom-class custom-loading",
    });
    await Loading_.present();
    let data = {
      customer_id: parseInt(this.settings.customer.id),
    };
    this.api.postItemNew("get_inquiries", data).subscribe(
      (res) => {
        Loading_.dismiss();

        if (res["status"] == false) {
          this.message = res["message"];
          return;
        }

        this.tickets_data = [];
        this.tickets_data = res["inquiries"];
        console.log(JSON.stringify(res));

        this.dataOn = true;
      },
      (err) => {
        this.dataOn = false;
        Loading_.dismiss();
        console.log(err);
      }
    );
  }
  public openWithInAppBrowser(url: string) {
    let target = "_blank";
    this.theInAppBrowser.create(url, target, this.options);
  }

  close_() {
    this.navCtrl.navigateForward("/tabs/account");
  }

  ViewDetails(n) {
    this.singleViewData = [];
    this.singleView = true;
    this.singleViewData.push(n);

    this.inquery_id = n.id;
    this.product_id = n.product_id;

    // this.enqId = n.replies[0].enquiry_id;

    // console.log(this.enqId);

    console.log(JSON.stringify(this.singleViewData));
    console.log(JSON.stringify(this.inquery_id));
  }

  bckNow() {
    this.singleView = false;
    this.getData_();
  }

  async sendNewReply() {
    console.log("NNN");

    this.message = "";
    // console.log("vendors");
    let Loading_ = await this.loadingController.create({
      message: "Please wait...",
      translucent: true,
      cssClass: "custom-class custom-loading",
    });

    await Loading_.present();
    let data = {
      enquiry_id: this.inquery_id,
      enquiry: JSON.stringify(this.enquiry),
      product_id: parseInt(this.product_id),

      reply_by: parseInt(this.settings.customer.id),

      customer_id: parseInt(this.settings.customer.id),
    };
    this.api.postItemNew("add_product_enquiry", data).subscribe(
      (res) => {
        Loading_.dismiss();

        if (res["status"] == false) {
          this.message = res["message"];
          return;
        }

        this.tickets_data = [];
        this.tickets_data = res["inquiries"];
        console.log(JSON.stringify(res));

        this.dataOn = true;
      },
      (err) => {
        this.dataOn = false;
        Loading_.dismiss();
        console.log(err);
      }
    );
  }
}
