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
  selector: "app-tickets",
  templateUrl: "./tickets.page.html",
  styleUrls: ["./tickets.page.scss"],
})
export class TicketsPage implements OnInit {
  dataOn = false;
  tickets_data: any;
  singleView = false;
  message = "";
  enquiry: any;
  singleViewData: any;
  inquery_id: any;
  product_id: any;

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
    this.getTickets_();
  }

  ngOnInit() {}

  goTo() {
    this.openWithInAppBrowser("https://opyix.com/contact");
  }

  async getTickets_() {
    console.log(this.settings.vendor);

    console.log("vendors");
    let Loading_ = await this.loadingController.create({
      message: "Please wait...",
      translucent: true,
      cssClass: "custom-class custom-loading",
    });
    await Loading_.present();

    if (this.settings.vendor == true) {
      var data = {
        // customer_id: parseInt(this.settings.customer.id),
        vendor_id: parseInt(this.settings.customer.id),
      };

      this.api.postItemNew("get_support_tickets", data).subscribe(
        (res) => {
          Loading_.dismiss();

          this.tickets_data = [];
          this.tickets_data = res["tickets"];
          console.log(JSON.stringify(this.tickets_data));
          this.dataOn = true;
        },
        (err) => {
          this.dataOn = false;
          Loading_.dismiss();
          console.log(err);
        }
      );
    } else {
      var data2 = {
        // customer_id: parseInt(this.settings.customer.id),
        customer_id: parseInt(this.settings.customer.id),
      };

      this.api.postItemNew("get_support_tickets", data2).subscribe(
        (res) => {
          Loading_.dismiss();

          this.tickets_data = [];
          this.tickets_data = res["tickets"];
          console.log(JSON.stringify(this.tickets_data));
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

    this.inquery_id = n.inquery_id;
    this.product_id = n.product_id;
    console.log(JSON.stringify(this.singleViewData));
    console.log(JSON.stringify(this.inquery_id));
  }

  bckNow() {
    this.singleView = false;
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
      query: JSON.stringify(this.enquiry),
      support_id: 8,
      reply_by: parseInt(this.settings.customer.id),
    };
    this.api.postItemNew("create_support_ticket", data).subscribe(
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
