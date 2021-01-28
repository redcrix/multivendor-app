import { Component, OnInit } from "@angular/core";
import { LoadingController, NavController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../api.service";
import { Settings } from "./../../data/settings";
import { ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-order",
  templateUrl: "./order.page.html",
  styleUrls: ["./order.page.scss"],
})
export class OrderPage implements OnInit {
  id: any;
  order: any;
  refundKeys: any = {};
  refund: any = {};
  showRefund: boolean = false;
  disableRefundButton: boolean = false;
  refundResponse: any = {};
  lan: any = {};
  starRating = 5;
  add_comment: any;
  constructor(
    public translate: TranslateService,
    public api: ApiService,
    public settings: Settings,
    public toastController: ToastController,
    public router: Router,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public route: ActivatedRoute
  ) {}
  async refundKey() {
    await this.api.postItem("woo_refund_key").subscribe(
      (res) => {
        this.refundKeys = res;
        console.log(this.refundKeys);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  ngOnInit() {
    this.translate
      .get(["Refund request submitted!", "Unable to submit the refund request"])
      .subscribe((translations) => {
        this.lan.refund = translations["Refund request submitted!"];
        this.lan.unable = translations["Unable to submit the refund request"];
      });
    this.id = this.route.snapshot.paramMap.get("id");
    this.route.queryParams.subscribe((params) => {
      this.order = params["order"];
    });
    this.refundKey();
  }

  showField() {
    this.showRefund = !this.showRefund;
  }

  async requestRefund() {
    this.disableRefundButton = true;
    this.refund.ywcars_form_order_id = this.id;
    this.refund.ywcars_form_whole_order = "1";
    this.refund.ywcars_form_product_id = "";

    this.refund.ywcars_form_line_total = this.order.total;
    this.refund.ywcars_form_reason = this.refund.ywcars_form_reason;
    this.refund.action = "ywcars_submit_request";
    this.refund.security = this.refundKeys.ywcars_submit_request;

    await this.api.postItem("woo_refund_key", this.refund).subscribe(
      (res) => {
        this.refundResponse = res;
        this.disableRefundButton = false;
        if (this.refundResponse.success) this.presentToast(this.lan.refund);
        else this.presentToast(this.lan.unable);
      },
      (err) => {
        console.log(err);
        this.disableRefundButton = false;
      }
    );
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  contactSeller() {
    console.log(JSON.stringify(this.order));
    alert(JSON.stringify(this.order));
    this.settings.customer.new_pro_id = "";
    this.settings.customer.new_pro_id = this.order.id;
    console.log(this.settings.customer.new_pro_id);
    this.navCtrl.navigateForward("tabs/support");
  }

  logRatingChange(rating) {
    console.log("changed rating: ", rating);
    // do your stuff
  }

  Add_review() {
    console.log(this.settings.customer.id);

    if (this.settings.customer.id == undefined) {
      this.presentToast("Login to send an enquiry");
      return;
    }

    let data = {
      note: this.add_comment,
      user_id: parseInt(this.settings.customer.id),
      rating: this.starRating,
      product_id: this.order.id,
    };
    this.api.postItemNew("add_product_review", data).subscribe(
      (res) => {
        this.presentToast(res["message"]);
        console.log(JSON.stringify(res));
      },
      (err) => {
        console.log(err);
      }
    );
  }
  onRateChange(event) {
    console.log("Your rate:", event);
  }

  goToReviewsPage(n) {
    console.log(JSON.stringify(n));

    this.navCtrl.navigateForward("/tabs/home/product/" + n.id + "review/");
  }
}
