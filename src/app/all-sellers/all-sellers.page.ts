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
  constructor(
    public settings: Settings,
    public api: ApiService,
    public navCtrl: NavController,
    public product: Product
  ) {}

  ngOnInit() {
    this.getVendors_();
  }

  close_() {
    this.navCtrl.navigateForward("/tabs/account");
  }

  getVendors_() {
    console.log("vendors");

    this.api.postItem_Custom("premium_vendors").subscribe(
      (res) => {
        this.all_vendors_ = [];
        this.all_vendors_.push(res);

        // this.all_vendors_ = this.all_vendors_.json();
        // this.all_vendors_ = Array.of(this.all_vendors_);

        // console.log(JSON.stringify(this.all_vendors_));

        Object.keys(this.all_vendors_).forEach((key) => {
          this.ven_data = [];
          this.ven_data.push(this.all_vendors_[key]);
          console.log(this.ven_data["0"]["9"]["products"]); //value
          this.prod_data = this.ven_data["0"]["9"]["products"];
          this.ven_datas = [];
          this.ven_datas.push(this.ven_data["0"]["9"]["store_info"]);
          console.log(key); //key
        });
        let cno = this.all_vendors_.sort((a, b) => 0 - (a > b ? -1 : 1));

        console.log(cno);

        var products_rr = this.all_vendors_.map((o) => {
          return {
            store_info: o.store_info,
            products: o.products,
          };
        });

        console.log(products_rr);

        // this.data.updateCart(this.cart.cart_contents);
        // this.data.cartNonce = this.cart.cart_nonce;
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
}
