import { Component, OnInit } from "@angular/core";
import { LoadingController, NavController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../api.service";
import { Settings } from "./../../data/settings";
import { NavigationExtras } from "@angular/router";
import { Platform } from "@ionic/angular";
@Component({
  selector: "app-orders",
  templateUrl: "./orders.page.html",
  styleUrls: ["./orders.page.scss"],
})
export class OrdersPage implements OnInit {
  filter: any = {};
  orders: any;
  hasMoreItems: boolean = true;
  constructor(
    public api: ApiService,
    public settings: Settings,
    public router: Router,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public platform: Platform
  ) {
    this.filter.page = 1;
    this.filter.customer = this.settings.customer.id;
  }
  ngOnInit() {
    if (this.settings.customer) this.getOrders();
  }
  async getOrders() {
    console.log("------??");

    // this.loader = true;
    if (this.platform.is("hybrid")) {
      this.api.getItemIonic("orders", this.filter).then(
        (res) => {
          this.orders = res;
          // this.loader = false;
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.api.getItem("orders", this.filter).subscribe(
        (res) => {
          this.orders = res;
          // this.loader = false;
        },
        (err) => {
          console.log(err);
        }
      );
    }
    // await this.api.postItem("orders", this.filter).subscribe(
    //   (res) => {
    //     this.orders = res;
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }
  async loadData(event) {
    this.filter.page = this.filter.page + 1;
    await this.api.postItem("orders", this.filter).subscribe(
      (res) => {
        this.orders.push.apply(this.orders, res);
        event.target.complete();
        if (!res) this.hasMoreItems = false;
      },
      (err) => {
        event.target.complete();
      }
    );
    console.log("Done");
  }
  getDetail(order) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        order: order,
      },
    };
    this.navCtrl.navigateForward(
      "/tabs/account/orders/order/" + order.id,
      navigationExtras
    );
  }
}
