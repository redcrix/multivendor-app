import { Component } from "@angular/core";
import { LoadingController, NavController } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../api.service";
import { Data } from "../data";
import { Settings } from "../data/settings";

@Component({
  selector: "app-categories",
  templateUrl: "categories.page.html",
  styleUrls: ["categories.page.scss"],
})
export class CategoriesPage {
  AucProducts_ = false;
  AllProducts_ = true;
  AllCat_: any;

  constructor(
    public api: ApiService,
    public data: Data,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public router: Router,
    public settings: Settings,
    public route: ActivatedRoute
  ) {}
  getProducts(id) {
    this.navCtrl.navigateForward("/tabs/categories/products/" + id);
  }
  subCategories(id) {
    return this.data.categories.filter((item) => item.parent == id);
  }
  showSubCategory(i) {
    let intial = this.data.mainCategories[i].show;
    this.data.mainCategories.forEach((item) => (item.show = false));
    this.data.mainCategories[i].show = !intial;
    if (
      this.data.categories.filter(
        (item) => item.parent == this.data.mainCategories[i].id
      ).length == 0
    ) {
      this.getProducts(this.data.mainCategories[i].id);
    }
  }

  FilterByAuction() {
    this.AucProducts_ = true;
    this.AllProducts_ = false;
    this.sortBy();
  }

  FilterByAll() {
    this.AllProducts_ = true;
    this.AucProducts_ = false;
    this.sortBy();
  }

  FilterByAll_() {
    this.AllProducts_ = false;
    this.AucProducts_ = true;
    this.sortBy();
  }

  FilterByAuction_() {
    this.AllProducts_ = true;
    this.AucProducts_ = false;
    this.sortBy();
  }

  sortBy() {
    if (this.AucProducts_ === true) {
      //   this.AllCat_ = this.data.categories;
      //   this.data.categories = this.AllCat_;
      var nn = "yes";
    }
    if (this.AucProducts_ === false) {
      var nn = "no";
      this.AllCat_ = this.data.categories;
      this.data.categories = this.AllCat_;
    }
    if (nn == "yes") {
      this.AllCat_ = this.data.categories;

      let an = this.AllCat_;
      let newPro2 = an.filter((data) => data.name === "Auction");
      this.data.categories = newPro2;
    }
  }
}
