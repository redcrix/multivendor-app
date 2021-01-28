import { Component, OnInit } from "@angular/core";
import { LoadingController, NavController } from "@ionic/angular";
import { ApiService } from "../api.service";
import { Settings } from "../data/settings";
import { Product } from "../data/product";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-support",
  templateUrl: "./support.html",
  styleUrls: ["./support.page.scss"],
})
export class SupportPage implements OnInit {
  all_vendors_: any;
  ven_data: any;
  ven_datas: any;
  prod_data: any;
  all_categories: any;
  all_support_priority_types: any;
  valSelCat: any;
  valSel: any;
  objectKeys = Object.keys;
  enquiry_fill: any;
  message: any;
  onlyEnquiry = false;
  constructor(
    public settings: Settings,
    public api: ApiService,
    public navCtrl: NavController,
    public product: Product,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.getCatego_();
    // this.getSupport_priority();
  }

  close_() {
    this.navCtrl.navigateForward("/tabs/account");
  }

  goBack() {
    this.navCtrl.back();
  }

  ionViewDidEnter() {
    console.log(this.settings.customer.new_pro_id);

    if (this.settings.customer.new_pro_id != undefined) {
      this.onlyEnquiry = true;
      console.log("View Enter----------------------------------");
    }
  }

  getCatego_() {
    console.log("vendors");

    this.all_categories = [
      {
        value: "General query",
        id: "1",
      },
      {
        value: "Suggestion",
        id: "2",
      },
      {
        value: "Delivery issue",
        id: "3",
      },
      {
        value: "Damage item received",
        id: "4",
      },
      {
        value: "Wrong item received",
        id: "5",
      },
      {
        value: "Other",
        id: "6",
      },
    ];
    this.all_support_priority_types = [
      {
        value: "Normal",
      },
      {
        value: "Low",
      },
      {
        value: "Medium",
      },
      {
        value: "High",
      },
      {
        value: "Urgent",
      },
      {
        value: "Critical",
      },
    ];
  }

  getSupport_priority() {
    this.api.postItem_Custom("support_categories").subscribe(
      (res) => {
        this.all_support_priority_types = [];
        this.all_support_priority_types.push(res);
        console.log(JSON.stringify(res));
        // this.all_support_priority_types = Object.keys(sup);
        console.log(JSON.stringify(this.all_support_priority_types));
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getProduct(item) {
    console.log(JSON.stringify(item));

    this.product.product = item;
    this.navCtrl.navigateForward("/tabs/home/product/" + item.id);
  }

  sendReq_Enq() {
    console.log(this.settings.customer.id);

    if (this.settings.customer.id == undefined) {
      this.presentToast("Login to send an enquiry");
      return;
    }
    let data = [
      {
        enquiry: this.enquiry_fill,
        product_id: parseInt(this.settings.customer.new_pro_id),
        customer_id: parseInt(this.settings.customer.id),
      },
    ];

    this.api.postItemNew("add_product_enquiry", data).subscribe(
      (res) => {
        this.message = res["message"];
        console.log(JSON.stringify(res));
      },
      (err) => {
        console.log(err);
      }
    );
  }

  sendReq() {
    if (this.settings.customer.id == undefined) {
      this.presentToast("Login to send an enquiry");
      return;
    }

    console.log(this.settings.customer.new_pro_id);

    let data = {
      support_category: parseInt(this.valSelCat),
      support_priority: this.valSel,
      support_product: this.settings.customer.new_pro_id,
      order_id: 1784,
      query: this.enquiry_fill,
      customer_id: this.settings.customer.id,
    };

    this.api.postItemNew("create_support_ticket", data).subscribe(
      (res) => {
        this.message = res["message"];
        console.log(JSON.stringify(res));
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async presentToast(m) {
    const toast = await this.toastController.create({
      message: m,
      duration: 4000,
    });
    toast.present();
  }
}
