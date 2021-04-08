import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  LoadingController,
  NavController,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../api.service";
import { Data } from "../data";
import { Settings } from "../data/settings";
import { Product } from "../data/product";
import { md5 } from "./md5";
import { ReviewPage } from "../review/review.page";
import { AlertController } from "@ionic/angular";
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { Vendor } from "../data/vendor";
import { TranslateService } from "@ngx-translate/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import * as moment from "moment";
import { formatDate } from "@angular/common";
import { InAppBrowserOptions } from "@ionic-native/in-app-browser/ngx";
@Component({
  selector: "app-product",
  templateUrl: "product.page.html",
  styleUrls: ["product.page.scss"],
})
export class ProductPage {
  errors: any;
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

  loginForm: any = {};
  product: any;
  filter: any = {};
  usedVariationAttributes: any = [];
  id: any;
  variations: any = [];
  groupedProducts: any = [];
  relatedProducts: any = {};
  upsellProducts: any = [];
  crossSellProducts: any = [];
  reviews: any = [];
  cart: any = {};
  status: any;
  disableButton: boolean = false;
  quantity: any;
  addons: any; //ADDONS
  addonsList: any = []; //ADDONS
  lan: any = {};
  product_type_auction = false;
  variationId: any;
  numb_inp: any;
  message_bx: any;
  date = new Date();
  add_comment: any;
  starRating = 5;
  NewUser = true;
  fullDescVis = false;
  constructor(
    private theInAppBrowser: InAppBrowser,
    public translate: TranslateService,
    public toastController: ToastController,
    private socialSharing: SocialSharing,
    public modalCtrl: ModalController,
    public api: ApiService,
    public data: Data,
    public productData: Product,
    public settings: Settings,
    public router: Router,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public alertController: AlertController,
    public route: ActivatedRoute,
    public vendor: Vendor,
    public iab: InAppBrowser
  ) {
    // if (this.settings.customer.id == undefined) {
    //   this.NewUser = true;
    // }
    this.filter.page = 1;
    this.quantity = "1";
  }
  getReviewsPage() {
    this.navCtrl.navigateForward(
      this.router.url + "/review/" + this.product.id
    );
  }
  ionViewDidEnter() {
    this.fullDescVis = false;
  }
  getProduct() {
    //     a) Time left
    // b) Auction end Date and time
    // c) Bid amount
    // d) dealer/ vendor name

    this.api.postFlutterItem("product", { product_id: this.id }).subscribe(
      (res) => {
        this.product = res;
        console.log("====" + this.product["auction_end_date"]);
        const date = moment(this.product["auction_end_date"]).format(
          "YYYY-MM-DD"
        );
        console.log(JSON.stringify(date));
        // var sliced = this.product["auction_end_date"].slice(0, 10);
        // console.log("Sliced+" + sliced);
        // 12 - 22 - 2222;

        if (this.product["auction_end_date"] != undefined) {
          let dd =
            this.product["auction_end_date"].slice(6, 10) +
            "-" +
            this.product["auction_end_date"].slice(3, 5) +
            "-" +
            this.product["auction_end_date"].slice(0, 2) +
            "T" +
            this.product["auction_end_date"].slice(11, 19);

          this.date = new Date(dd);
          console.log(dd);

          this.date = new Date(dd);
        }

        let P_type = this.product.type;

        console.log(JSON.stringify(this.product["auction_end_date"]));

        if (P_type == "auction") {
          this.product_type_auction = true;
        }
        this.handleProduct();
      },
      (err) => {
        console.log(err);
      }
    );
  }
  ngOnInit() {
    this.translate
      .get([
        "Oops!",
        "Please Select",
        "Please wait",
        "Options",
        "Option",
        "Select",
        "Item added to cart",
        "Message",
        "Requested quantity not available",
      ])
      .subscribe((translations) => {
        this.lan.oops = translations["Oops!"];
        this.lan.PleaseSelect = translations["Please Select"];
        this.lan.Pleasewait = translations["Please wait"];
        this.lan.options = translations["Options"];
        this.lan.option = translations["Option"];
        this.lan.select = translations["Select"];
        this.lan.addToCart = translations["Item added to cart"];
        this.lan.message = translations["Message"];
        this.lan.lowQuantity = translations["Requested quantity not available"];
      });
    this.product = this.productData.product;

    if (
      this.product["auction_end_date"] != undefined &&
      this.product["auction_end_date"] != false
    ) {
      console.log("====" + this.product["auction_end_date"]);

      // var sliced = this.product["auction_end_date"].slice(0, 10);
      // console.log("Sliced+" + sliced);
      // 12 - 22 - 2222;
      let dd =
        this.product["auction_end_date"].slice(6, 10) +
        "-" +
        this.product["auction_end_date"].slice(3, 5) +
        "-" +
        this.product["auction_end_date"].slice(0, 2) +
        "T" +
        this.product["auction_end_date"].slice(11, 19);

      this.date = new Date(dd);
      console.log(dd);

      this.date = new Date(dd);
    }

    // 124-12-2020 12:01:00

    // const format = "yyyy-MM-dd";
    // const myDate = dd;
    // const locale = "en-US";
    // const formattedDate = formatDate(myDate, format, locale);

    // console.log("formattedDate+" + formattedDate);

    this.id = this.route.snapshot.paramMap.get("id");
    if (this.product.id) this.handleProduct();
    else this.getProduct();
  }
  handleProduct() {
    /* Reward Points */
    if (this.settings.settings.switchRewardPoints && this.product.meta_data)
      this.product.meta_data.forEach((item) => {
        if (item.key == "_wc_points_earned") {
          this.product.showPoints = item.value;
        }
      });

    /* Product Addons */
    if (this.settings.settings.switchAddons === 1) this.getAddons();

    this.usedVariationAttributes = this.product.attributes.filter(function (
      attribute
    ) {
      return attribute.variation == true;
    });

    //if ((this.product.type == 'variable') && this.product.variations.length) this.getVariationProducts();
    if (this.product.type == "grouped" && this.product.grouped_products.length)
      this.getGroupedProducts();
    this.getRelatedProducts();
    this.getReviews();
  }
  getVariationProducts() {
    this.api
      .getItem("products/" + this.product.id + "/variations", { per_page: 100 })
      .subscribe(
        (res) => {
          this.variations = res;
        },
        (err) => {}
      );
  }
  getGroupedProducts() {
    if (this.product.grouped_products.length) {
      var filter = [];
      for (let item in this.product.grouped_products)
        filter["include[" + item + "]"] = this.product.grouped_products[item];
      this.api.getItem("products", filter).subscribe(
        (res) => {
          this.groupedProducts = res;
        },
        (err) => {}
      );
    }
  }
  getRelatedProducts() {
    var filter = [];
    filter["product_id"] = this.product.id;
    this.api.postFlutterItem("product_details", filter).subscribe(
      (res) => {
        this.relatedProducts = res;
      },
      (err) => {}
    );
  }
  getReviews() {
    this.api
      .postFlutterItem("product_reviews", { product_id: this.product.id })
      .subscribe(
        (res) => {
          this.reviews = res;
          for (let item in this.reviews) {
            this.reviews[item].avatar = md5(this.reviews[item].email);
          }
        },
        (err) => {}
      );
  }
  products__data() {
    console.log(JSON.stringify(this.product));
  }
  goToProduct(product) {
    this.productData.product = product;
    var endIndex = this.router.url.lastIndexOf("/");
    var path = this.router.url.substring(0, endIndex);
    this.navCtrl.navigateForward(path + "/" + product.id);
  }
  async addToCart() {
    if (
      this.product.manage_stock &&
      this.product.stock_quantity < this.data.cart[this.product.id]
    ) {
      this.presentAlert(this.lan.message, this.lan.lowQuantity);
    } else if (
      this.selectAdons() &&
      this.setVariations2() &&
      this.setGroupedProducts()
    ) {
      this.options.product_id = this.product.id;
      this.options.quantity = this.quantity;
      this.disableButton = true;
      await this.api.postItem("add_to_cart", this.options).subscribe(
        (res) => {
          this.cart = res;
          console.log(this.cart);

          this.presentToast(this.lan.addToCart);
          this.data.updateCart(this.cart.cart);
          this.disableButton = false;
        },
        (err) => {
          console.log(err);
          this.disableButton = false;
        }
      );
    }
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: "top",
    });
    toast.present();
  }
  setVariations() {
    if (this.variationId) {
      this.options.variation_id = this.variationId;
    }
    this.product.attributes.forEach((item) => {
      if (item.selected) {
        this.options["variation[attribute_pa_" + item.name + "]"] =
          item.selected;
      }
    });
    for (var i = 0; i < this.product.attributes.length; i++) {
      if (
        this.product.attributes[i].variation &&
        this.product.attributes[i].selected == undefined
      ) {
        this.presentAlert(
          this.lan.options,
          this.lan.select +
            " " +
            this.product.attributes[i].name +
            " " +
            this.lan.option
        );
        return false;
      }
    }
    return true;
  }
  setVariations2() {
    var doAdd = true;
    if (
      this.product.type == "variable" &&
      this.product.variationOptions != null
    ) {
      for (var i = 0; i < this.product.variationOptions.length; i++) {
        if (this.product.variationOptions[i].selected != null) {
          this.options[
            "variation[attribute_" +
              this.product.variationOptions[i].attribute +
              "]"
          ] = this.product.variationOptions[i].selected;
        } else if (
          this.product.variationOptions[i].selected == null &&
          this.product.variationOptions[i].options.length != 0
        ) {
          this.presentAlert(
            this.lan.options,
            this.lan.select + " " + this.product.variationOptions[i].name
          );
          doAdd = false;
          break;
        } else if (
          this.product.variationOptions[i].selected == null &&
          this.product.variationOptions[i].options.length == 0
        ) {
          this.product.stock_status = "outofstock";
          doAdd = false;
          break;
        }
      }
      if (this.product.variation_id) {
        this.options["variation_id"] = this.product.variation_id;
      }
    }
    return doAdd;
  }
  chooseVariation2(index, value) {
    this.product.variationOptions[index].selected = value;
    this.product.stock_status = "instock";
    if (
      this.product.variationOptions.every((option) => option.selected != null)
    ) {
      var selectedOptions = [];
      var matchedOptions = [];
      for (var i = 0; i < this.product.variationOptions.length; i++) {
        selectedOptions.push(this.product.variationOptions[i].selected);
      }
      for (var i = 0; i < this.product.availableVariations.length; i++) {
        matchedOptions = [];
        for (
          var j = 0;
          j < this.product.availableVariations[i].option.length;
          j++
        ) {
          if (
            selectedOptions.includes(
              this.product.availableVariations[i].option[j].value
            ) ||
            this.product.availableVariations[i].option[j].value == ""
          ) {
            matchedOptions.push(
              this.product.availableVariations[i].option[j].value
            );
          }
        }
        if (matchedOptions.length == selectedOptions.length) {
          this.product.variation_id = this.product.availableVariations[
            i
          ].variation_id;
          this.product.price = this.product.availableVariations[
            i
          ].display_price;
          this.product.regular_price = this.product.availableVariations[
            i
          ].display_regular_price;
          this.product.formated_price = this.product.availableVariations[
            i
          ].formated_price;
          this.product.formated_sales_price = this.product.availableVariations[
            i
          ].formated_sales_price;
          if (
            this.product.availableVariations[i].display_regular_price !=
            this.product.availableVariations[i].display_price
          )
            this.product.sale_price = this.product.availableVariations[
              i
            ].display_price;
          else this.product.sale_price = null;
          if (!this.product.availableVariations[i].is_in_stock) {
            this.product.stock_status = "outofstock";
          }

          break;
        }
      }
      if (matchedOptions.length != selectedOptions.length) {
        this.product.stock_status = "outofstock";
      }
    }
  }
  chooseVariation(att, value) {
    this.product.attributes.forEach((item) => {
      item.selected = undefined;
    });
    this.product.attributes.forEach((item) => {
      if (item.name == att.name) {
        item.selected = value;
      }
    });
    if (this.usedVariationAttributes.every((a) => a.selected !== undefined))
      this.variations.forEach((variation) => {
        var test = new Array(this.usedVariationAttributes.length);
        test.fill(false);
        this.usedVariationAttributes.forEach((attribute) => {
          if (variation.attributes.length == 0) {
            this.variationId = variation.id;
            this.product.stock_status = variation.stock_status;
            this.product.price = variation.price;
            this.product.sale_price = variation.sale_price;
            this.product.regular_price = variation.regular_price;
            this.product.manage_stock = variation.manage_stock;
            this.product.stock_quantity = variation.stock_quantity;
            //this.product.images[0] = variation.image; /* Uncomment this if you want to use variation images */
          } else {
            variation.attributes.forEach((item, index) => {
              if (
                item.name == attribute.name &&
                item.option == attribute.selected
              ) {
                test[index] = true;
              }
            });
            if (test.every((v) => v == true)) {
              this.variationId = variation.id;
              this.product.stock_status = variation.stock_status;
              this.product.price = variation.price;
              this.product.sale_price = variation.sale_price;
              this.product.regular_price = variation.regular_price;
              this.product.manage_stock = variation.manage_stock;
              this.product.stock_quantity = variation.stock_quantity;
              //this.product.images[0] = variation.image;  /* Uncomment this if you want to use variation images */
              test.fill(false);
            } else if (
              variation.attributes.length != 1 &&
              variation.attributes.length ==
                this.usedVariationAttributes.length &&
              test.some((v) => v == false)
            ) {
              //this.product.stock_status = 'outofstock';
              //this.options.variation_id = variation.id;
            }
          }
        });
      });
  }
  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
  }
  OnDestroy() {
    this.productData.product = {};
  }

  checkout() {
    this.addToCart();
    if (this.settings.customer.id) {
      this.navCtrl.navigateForward("/tabs/cart/address");
    } else this.login();
  }

  async login() {
    let alert = await this.alertController.create({
      header: "Login and continue",
      inputs: [
        {
          name: "username",
          placeholder: "Email/Username",
          type: "text",
        },
        {
          name: "password",
          placeholder: "Password",
          type: "text",
        },
      ],
      buttons: [
        {
          text: "Checkout as guest",
          role: "cancel",
          handler: (data) => {
            this.navCtrl.navigateForward("/tabs/cart/address");
          },
        },
        {
          text: "Login",
          handler: (data) => {
            this.onSubmit(data);
          },
        },
      ],
    });
    alert.present();
  }
  async onSubmit(userData) {
    this.loginForm.username = userData.username;
    this.loginForm.password = userData.password;
    console.log(this.loginForm);
    await this.api.postItem("login", this.loginForm).subscribe(
      (res) => {
        this.status = res;
        if (this.status.errors != undefined) {
          this.errors = this.status.errors;
          this.inValidUsername();
        } else if (this.status.data) {
          this.settings.customer.id = this.status.ID;
          if (
            this.status.allcaps.dc_vendor ||
            this.status.allcaps.seller ||
            this.status.allcaps.wcfm_vendor
          ) {
            this.settings.vendor = true;
          }
          this.navCtrl.navigateForward("/tabs/cart/address");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async inValidUsername() {
    const alert = await this.alertController.create({
      header: "Warning",
      message: "Invalid Username or Password",
      buttons: ["OK"],
    });
    await alert.present();
  }

  share() {
    var options = {
      message: "Check this out!",
      subject: this.product.name,
      files: ["", ""],
      url: this.product.permalink,
      chooserTitle: "Choose an App",
    };

    this.socialSharing.shareWithOptions(options);
  }
  getDetail(id) {
    this.vendor.vendor.id = id;
    var pages = this.router.url.split("/");
    this.navCtrl.navigateForward("/tabs/" + pages[2] + "/vendor-products");
  }
  buyExternalProduct() {
    console.log(this.product);

    let url = "https://opyix.com/product/" + this.product.name;
    this.openWithInAppBrowser(url);

    // var options = "location=no,hidden=yes,toolbar=no,hidespinner=yes";
    // let browser = this.iab.create(this.product.external_url, "_blank", options);
    // browser.show();
  }

  public openWithInAppBrowser(url: string) {
    let target = "_blank";
    this.theInAppBrowser.create(url, target, this.options);
  }

  setGroupedProducts() {
    if (this.product.type == "grouped") {
      this.options["add-to-cart"] = this.product.id;
      this.groupedProducts.forEach((item) => {
        if (item.selected) {
          this.options["quantity[" + item.id + "]"] = item.selected;
        }
      });
      return true;
    } else return true;
  }

  /* PRODUCT ADDONS */
  getAddons() {
    if (this.product.meta_data) {
      for (let item in this.product.meta_data) {
        if (
          this.product.meta_data[item].key == "_product_addons" &&
          this.product.meta_data[item].value.length
        ) {
          this.addonsList.push(...this.product.meta_data[item].value);
        }
      }
    }
    this.getGlobalAddons();
  }
  getGlobalAddons() {
    this.api.getAddonsList("product-add-ons").subscribe((res) => {
      this.handleAddonResults(res);
    });
  }
  handleAddonResults(results) {
    if (results && results.length)
      results.forEach((item) => {
        this.addonsList.push(...item.fields);
      });
  }
  selectAdons() {
    this.options = {};
    let valid = this.validateform();
    if (valid) {
      this.addonsList.forEach((value, i) => {
        value.selectedName = value.name.toLowerCase();
        value.selectedName = value.selectedName.split(" ").join("-");
        value.selectedName = value.selectedName.split(".").join("");
        value.selectedName = value.selectedName.replace(":", "");
        value.options.forEach((option, j) => {
          option.selectedLabel = option.label.toLowerCase();
          option.selectedLabel = option.selectedLabel.split(" ").join("-");
          option.selectedLabel = option.selectedLabel.split(".").join("");
          option.selectedLabel = option.selectedLabel.replace(":", "");
          if (value.selected instanceof Array) {
            if (value.selected.includes(option.label)) {
              this.options[
                "addon-" +
                  this.product.id +
                  "-" +
                  value.selectedName +
                  "-" +
                  i +
                  "[" +
                  j +
                  "]"
              ] = option.selectedLabel;
            }
          } else if (option.label == value.selected && value.type == "select") {
            this.options[
              "addon-" + this.product.id + "-" + value.selectedName + "-" + i
            ] = option.selectedLabel + "-" + (j + 1);
          } else if (
            option.label == value.selected &&
            value.type == "radiobutton"
          ) {
            this.options[
              "addon-" +
                this.product.id +
                "-" +
                value.selectedName +
                "-" +
                i +
                "[" +
                j +
                "]"
            ] = option.selectedLabel;
          } else if (
            value.type === "custom_textarea" &&
            option.input &&
            option.input !== ""
          ) {
            this.options[
              "addon-" +
                this.product.id +
                "-" +
                value.selectedName +
                "-" +
                i +
                "[" +
                option.selectedLabel +
                "]"
            ] = option.input;
          }
        });
        if (value.type == "custom_text") {
          let label = value.name;
          label = label.toLowerCase();
          label = label.split(" ").join("-");
          label = label.split(".").join("");
          label = label.replace(":", "");
          this.options["addon-" + this.product.id + "-" + label + "-" + i] =
            value.input;
        }
      });
    }
    return valid;
  }
  validateform() {
    if (this.addonsList) {
      for (let addon in this.addonsList) {
        for (let item in this.addonsList[addon].fields) {
          if (
            this.addonsList[addon].fields[item].required == 1 &&
            this.addonsList[addon].fields[item].selected == ""
          ) {
            this.presentAlert(
              this.lan.oops,
              this.lan.PleaseSelect +
                " " +
                this.addonsList[addon].fields[item].name
            );
            return false;
          }
        }
        if (this.addonsList[addon].type == "custom_text") {
          if (
            this.addonsList[addon].required == 1 &&
            (!this.addonsList[addon].input ||
              this.addonsList[addon].input == "")
          ) {
            this.presentAlert(
              this.lan.oops,
              this.lan.PleaseSelect + " " + this.addonsList[addon].name
            );
            return false;
          }
        }
      }
      return true;
    }
    return true;
  }

  async bidProduct(id) {
    console.log("Only");
    let Loading_ = await this.loadingController.create({
      message: "Please wait...",
      translucent: true,
      cssClass: "custom-class custom-loading",
    });
    await Loading_.present();
    if (this.settings.customer.id) {
      let data_ = {
        bid: this.numb_inp,
        product_id: id,
        currency: this.settings.currency,
        User_id: parseInt(this.settings.customer.id),
        user_id: parseInt(this.settings.customer.id),
      };

      this.api.postItem_Custom("add_bid", data_).subscribe(
        (res) => {
          // this.product = res;
          Loading_.dismiss();
          this.message_bx = res["message"];
          console.log(this.message_bx);
          if (this.message_bx.length == "You have successfully bid") {
            this.message_bx = res["message"];
            this.presentAlert(this.message_bx, "");
            return;
          } else {
            this.message_bx = res["message"];
            this.presentAlert(this.message_bx, "");
            return;
          }
          if (this.message_bx.length > 9) {
            this.message_bx = res["message"];
          }

          console.log(JSON.stringify(this.product));
          let P_type = this.product.type;

          // console.log(P_type);

          // if (P_type == "auction") {
          //   this.product_type_auction = true;
          // }
        },
        (err) => {
          Loading_.dismiss();
          console.log(err);
          return;
        }
      );
    } else {
      Loading_.dismiss();
      this.presentToast("Login to bid on this product");
      return;
    }
    return;
  }

  bid_on(id) {
    console.log(this.settings);

    if (this.settings.customer.id) {
      let data_ = {
        bid: this.numb_inp,
        product_id: id,
        currency: this.settings.currency,
        User_id: parseInt(this.settings.customer.id),
        user_id: parseInt(this.settings.customer.id),
      };

      this.api.postItem_Custom("add_bid", data_).subscribe(
        (res) => {
          this.product = res;

          this.message_bx = res["message"];
          console.log(this.message_bx);
          if (this.message_bx.length == "You have successfully bid") {
            this.message_bx = res["message"];
            this.presentAlert(this.message_bx, "");
            return;
          } else {
            this.message_bx = res["message"];
            this.presentAlert(this.message_bx, "");
            return;
          }
          if (this.message_bx.length > 9) {
            this.message_bx = res["message"];
          }

          console.log(JSON.stringify(this.product));
          let P_type = this.product.type;

          // console.log(P_type);

          // if (P_type == "auction") {
          //   this.product_type_auction = true;
          // }
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.presentToast("Login to bid on this product");
      return;
    }
  }

  /* PRODUCT ADDONS */

  contactSeller() {
    console.log(JSON.stringify(this.product));

    if (this.settings.customer.id == undefined) {
      this.presentToast("Login to send an enquiry");
      return;
    }
    console.log(this.product.id);
    this.settings.customer.NormalEnquiry = "";
    this.settings.customer.NormalEnquiry = true;
    this.settings.customer.new_pro_id = "";
    this.settings.customer.new_pro_id = this.product.id;
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
      product_id: this.product.id,
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

  goToReviewsPage() {
    this.navCtrl.navigateForward(
      "/tabs/home/product/" + this.product.id + "review/"
    );
  }

  viewMre() {
    console.log("viewmr");

    this.fullDescVis = true;
  }
}
