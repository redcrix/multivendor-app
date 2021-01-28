import { Component, OnInit } from "@angular/core";
import { LoadingController, NavController } from "@ionic/angular";
import { ApiService } from "../api.service";
import { Settings } from "../data/settings";
import { Product } from "../data/product";

@Component({
  selector: "app-all-sellers",
  templateUrl: "./all-sellers.html",
  styleUrls: ["./all-sellers.page.scss"],
})
export class AllSellersPage implements OnInit {
  all_vendors_: any;
  ven_data: any;
  ven_datas: any;
  prod_data: any;
  dataOn = false;
  proShow = false;
  // pro_data: any;
  pro_dataD: any;
  store_name: any;
  constructor(
    public settings: Settings,
    public api: ApiService,
    public navCtrl: NavController,
    public product: Product,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.getVendors_();
  }

  close_() {
    this.navCtrl.navigateForward("/tabs/account");
  }

  async getVendors_() {
    console.log("vendors");
    let Loading_ = await this.loadingController.create({
      message: "Please wait...",
      translucent: true,
      cssClass: "custom-class custom-loading",
    });
    await Loading_.present();
    this.api.postItem_Custom("premium_vendors").subscribe(
      (res) => {
        Loading_.dismiss();
        this.all_vendors_ = [];
        this.all_vendors_ = res;
        this.dataOn = true;
        // this.all_vendors_ = this.all_vendors_.json();
        // this.all_vendors_ = Array.of(this.all_vendors_);

        // console.log(JSON.stringify(this.all_vendors_));

        // Object.keys(this.all_vendors_).forEach((key) => {
        //   this.ven_data = [];
        //   this.ven_data.push(this.all_vendors_[key]);
        //   console.log(this.ven_data["0"]["9"]["products"]); //value
        //   this.prod_data = this.ven_data["0"]["9"]["products"];
        //   this.ven_datas = [];
        //   this.ven_datas.push(this.ven_data["0"]["9"]["store_info"]);
        //   console.log(key); //key
        // });
        // let cno = this.all_vendors_.sort((a, b) => 0 - (a > b ? -1 : 1));

        // console.log(cno);

        // var products_rr = this.all_vendors_.map((o) => {
        //   return {
        //     store_info: o.store_info,
        //     products: o.products,
        //   };
        // });

        // console.log(products_rr);

        // this.data.updateCart(this.cart.cart_contents);
        // this.data.cartNonce = this.cart.cart_nonce;
      },
      (err) => {
        Loading_.dismiss();
        console.log(err);
      }
    );
  }

  getProduct(item) {
    // console.log(JSON.stringify(item));

    // this.product.product = item;
    this.navCtrl.navigateRoot("/tabs/home/product/" + item.id);
  }

  viewPros(p, name_store) {
    console.log(name_store);

    if (p["id"] != "undefined") {
      this.proShow = true;
      console.log(JSON.stringify(p));
      this.pro_dataD = p;
      this.store_name = name_store;
    } else {
      this.proShow = false;
    }
  }

  backNow() {
    this.proShow = false;
  }
}
