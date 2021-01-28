import { Component, OnInit, ViewChild } from "@angular/core";
import { LoadingController, NavController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../api.service";
import { Data } from "../data";
import { Settings } from "../data/settings";
import { Product } from "../data/product";

@Component({
  selector: "app-search",
  templateUrl: "search.page.html",
  styleUrls: ["search.page.scss"],
})
export class SearchPage implements OnInit {
  products: any = [];
  tempProducts: any = [];
  filter: any = {};
  hasMoreItems: boolean = true;
  searchInput: any = "";
  loading: boolean = false;
  select_reviews_: any;
  AucProducts_ = false;
  AllProducts_ = true;
  constructor(
    public api: ApiService,
    public data: Data,
    public router: Router,
    public product: Product,
    public settings: Settings,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public route: ActivatedRoute
  ) {
    this.select_reviews_ = "all";
    this.filter.page = 1;
    if (this.settings.colWidthProducts == 4) this.filter.per_page = 15;
    this.filter.status = "publish";
  }
  ngOnInit() {}
  async loadData(event) {
    this.filter.page = this.filter.page + 1;
    this.api.postFlutterItem("products", this.filter).subscribe(
      (res) => {
        this.tempProducts = res;
        this.products.push.apply(this.products, this.tempProducts);
        event.target.complete();
        if (this.tempProducts.length == 0) this.hasMoreItems = false;
      },
      (err) => {
        event.target.complete();
      }
    );
    console.log("Done");
  }
  onInput() {
    this.loading = true;
    this.hasMoreItems = true;
    this.filter.page = 1;
    this.filter.q = this.searchInput;
    if (this.searchInput.length) {
      this.getProducts();
    } else {
      this.products = "";
      this.loading = false;
    }
  }
  async getProducts() {
    this.api.postFlutterItem("products", this.filter).subscribe(
      (res) => {
        this.products = res;
        this.loading = false;

        if (this.select_reviews_ != "all") {
          let newPro = this.products.filter(
            (data) => data.average_rating === this.select_reviews_
          );
          this.products = newPro;
        }

        if (this.AucProducts_ === true) {
          var nn = "yes";
        }
        if (this.AucProducts_ === false) {
          var nn = "no";
        }
        if (nn == "yes") {
          let newPro2 = this.products.filter((data) => data.type === "auction");
          this.products = newPro2;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getProduct(product) {
    this.product.product = product;
    this.navCtrl.navigateForward("/tabs/search/product/" + product.id);
  }

  FilterByAuction() {
    this.AucProducts_ = true;
    this.AllProducts_ = false;
  }

  FilterByAll() {
    this.AllProducts_ = true;
    this.AucProducts_ = false;
  }

  FilterByAll_() {
    this.AllProducts_ = false;
    this.AucProducts_ = true;
  }

  FilterByAuction_() {
    this.AllProducts_ = true;
    this.AucProducts_ = false;
  }
}
