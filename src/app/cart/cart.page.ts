import { Component, OnInit } from "@angular/core";
import {
  LoadingController,
  NavController,
  AlertController,
  ToastController,
} from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../api.service";
import { Config } from "../config";
import { Data } from "../data";
import { Settings } from "../data/settings";
import { HttpParams } from "@angular/common/http";
import { Product } from "../data/product";
import { Platform } from "@ionic/angular";
// import { Storage } from "@ionic/storage-angular";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-cart",
  templateUrl: "cart.page.html",
  styleUrls: ["cart.page.scss"],
})
export class CartPage {
  coupon: any;
  cart: any = {};
  couponMessage: any;
  status: any;
  loginForm: any = {};
  errors: any;
  LocalCart = false;
  Localcartdata: any;
  constructor(
    private alertCtrl: AlertController,
    public toastController: ToastController,
    public config: Config,
    public api: ApiService,
    public data: Data,
    public router: Router,
    public settings: Settings,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public productData: Product,
    public platform: Platform,
    public storage: Storage
  ) {}
  ngOnInit() {}
  ionViewDidEnter() {
    this.getCart();
  }
  generateArray(obj) {
    return Object.keys(obj).map((key) => {
      return obj[key];
    });
  }

  async getCart() {
    // await this.api.postItem('cart').subscribe(res => {
    //     this.cart = res;
    //     console.log(this.cart);
    //     this.data.updateCart(this.cart.cart_contents);
    // }, err => {
    //     console.log(err);
    // });

    // let StoredData = JSON.parse(
    //   this.storage.get("CartVal")["__zone_symbol__value"]
    // );
    // console.log("======>>>>>>" + StoredData);

    // this.cart = this.api.cartData;
    console.log("======>>>>>>" + JSON.stringify(this.api.cartData));
    // return;

    // if (this.platform.is("hybrid")) {
    //   this.api.postItemIonic("cart", {}).then(
    //     (res) => {
    //       this.cart = res;
    //       console.log(this.cart);
    //       this.data.updateCart(this.cart.cart_contents);
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
    // } else {

    if (this.settings.customer.id) {
      this.LocalCart = false;

      console.log("GET CART--->");

      let data = {
        user_id: parseInt(this.settings.customer.id),
        coupan_code: "test",
      };
      // get_cart_items
      this.api.postItemNew("get_cart_items", data).subscribe(
        (res) => {
          this.cart = res;
          console.log(this.cart);
          // --- V CODE
          let amm = this.generateArray(this.cart.cart_contents);
          console.log(amm);
          console.log(JSON.stringify(amm));
          // for (var key in this.cart.cart_contents) {
          //   // skip loop if the property is from prototype
          //   if (!this.cart.cart_contents.hasOwnProperty(key)) continue;

          //   var obj = this.cart.cart_contents[key];
          //   for (var prop in obj) {
          //     // skip loop if the property is from prototype
          //     if (!obj.hasOwnProperty(prop)) continue;

          //     // your code
          //     console.log("V CODE" + obj);

          //     // alert(prop + " = " + obj[prop]);
          //   }
          // }

          const map = (obj, fun) =>
            Object.entries(obj).reduce(
              (prev, [key, value]) => ({
                ...prev,
                [key]: fun(key, value),
              }),
              {}
            );

          const myFruits = map(this.cart.cart_contents, (_, o) => {
            return {
              product_id: o.product_id,
              quantity: o.quantity,
              variation_id: o.variation_id,
            };
          });

          console.log("myFruitsmyFruits" + JSON.stringify(myFruits));

          console.log("myFruitsmyFruits" + JSON.stringify(myFruits["unique"]));
          // {"dd458505749b2941217ddd59394240e8":{"product_id":"568","quantity":1,"variation_id":"556"},"a7d8ae4569120b5bec12e7b6e9648b86":{"product_id":"1176","quantity":2,"variation_id":"1192"}}

          this.data.updateCart(this.cart.cart_contents);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.LocalCart = true;
      let da;
      let da2;

      let CartItem = JSON.parse(
        this.storageGet("cartItem")["__zone_symbol__value"]
      );

      // da2 = localStorage.getItem("cartItem");

      console.log(JSON.stringify(CartItem));
      // console.log(JSON.stringify(da2));
      this.Localcartdata = CartItem;
      // this.login();
    }
  }
  checkout() {
    if (this.settings.customer.id) {
      this.navCtrl.navigateForward("/tabs/cart/address");
    } else this.login();
  }

  async storageGet(get) {
    let val2 = localStorage.getItem(get);
    this.storage.get(get).then((val) => {
      let val2 = val;
      return val2;
    });
    return val2;
  }

  getProduct(id) {
    this.productData.product = {};
    this.navCtrl.navigateForward(this.router.url + "/product/" + id);
  }
  async deleteItem(itemKey, qty) {
    console.log(itemKey);
    // console.log(itm);

    let data = {
      user_id: JSON.parse(this.settings.customer.id),
      cart_item_key: itemKey,
      action: "remove",
    };
    var params = new HttpParams();
    params = params.set("user_id", this.settings.customer.id);
    params = params.set("cart_item_key", itemKey);
    params = params.set("action", "remove");

    // params = params.set("_wpnonce", this.cart.cart_nonce);
    // params = params.set(
    //   "_wp_http_referer",
    //   this.config.url + "/wp-admin/admin-ajax.php?action=mstoreapp-cart"
    // );
    params = params.set("update_cart", "Update Cart");

    console.log(itemKey);

    console.log("PARAMS ------");

    this.api.postItemNew("_remove_cart_item", data).subscribe(
      (res) => {
        console.log(JSON.stringify(res));

        this.getCart();
        // this.cart = res;
        // console.log(this.cart);
        // this.data.updateCart(this.cart.cartContents);
      },
      (err) => {
        console.log(err);
      }
    );

    // await this.api.postItem("remove_cart_item&item_key=" + itemKey).subscribe(
    //   (res) => {
    //     this.cart = res;
    //     this.data.updateCart(this.cart.cart_contents);
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }
  async submitCoupon(coupon) {
    await this.api
      .postItem("apply_coupon", {
        coupon_code: coupon,
      })
      .subscribe(
        (res) => {
          this.couponMessage = res;
          if (this.couponMessage != null && this.couponMessage.notice) {
            this.presentToast(this.couponMessage.notice);
          }
          this.getCart();
        },
        (err) => {
          console.log(err);
        }
      );
  }
  async removeCoupon(coupon) {
    await this.api
      .postItem("remove_coupon", {
        coupon: coupon,
      })
      .subscribe(
        (res) => {
          this.getCart();
        },
        (err) => {
          console.log(err);
        }
      );
  }

  async addToCart(id, key) {
    if (
      this.data.cartItem[key].quantity != undefined &&
      this.data.cartItem[key].quantity == 0
    ) {
      this.data.cartItem[key].quantity = 0;
    } else {
      this.data.cartItem[key].quantity += 1;
    }
    if (this.data.cart[id] != undefined && this.data.cart[id] == 0) {
      this.data.cart[id] = 0;
    } else {
      this.data.cart[id] += 1;
    }

    var params = new HttpParams();
    params = params.set(
      "cart[" + key + "][qty]",
      this.data.cartItem[key].quantity
    );
    params = params.set("_wpnonce", this.cart.cart_nonce);
    params = params.set(
      "_wp_http_referer",
      this.config.url + "/wp-admin/admin-ajax.php?action=mstoreapp-cart"
    );
    params = params.set("update_cart", "Update Cart");

    let data = {
      user_id: parseInt(this.settings.customer.id),
      product_id: id,
      quantity: 1,
    };

    this.api.postItemNew("_add_to_cart", data).subscribe(
      (res) => {
        this.getCart();
      },
      (err) => {
        console.log(err);
        // this.disableButton = false;
      }
    );

    // await this.api.updateCart("/cart/", params).subscribe(
    //   (res) => {
    //     console.log(res);
    //     this.cart = res;
    //     this.data.updateCart(this.cart.cart_contents);
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }

  async deleteFromCart(id, key) {
    console.log(id);
    console.log(key);
    if (
      this.data.cartItem[key].quantity != undefined &&
      this.data.cartItem[key].quantity == 0
    ) {
      this.data.cartItem[key].quantity = 0;
    } else {
      this.data.cartItem[key].quantity -= 1;
    }
    if (this.data.cart[id] != undefined && this.data.cart[id] == 0) {
      this.data.cart[id] = 0;
    } else {
      this.data.cart[id] -= 1;
    }

    var params = new HttpParams();
    params = params.set("user_id", this.settings.customer.id);
    params = params.set("cart_item_key", key);
    params = params.set("action", "remove");
    params = params.set(
      "cart[" + key + "][qty]",
      this.data.cartItem[key].quantity
    );
    // params = params.set("_wpnonce", this.cart.cart_nonce);
    // params = params.set(
    //   "_wp_http_referer",
    //   this.config.url + "/wp-admin/admin-ajax.php?action=mstoreapp-cart"
    // );
    params = params.set("update_cart", "Update Cart");

    console.log(key);

    console.log("PARAMS ------");

    this.api.postItemNew("_remove_cart_item", params).subscribe(
      (res) => {
        console.log(JSON.stringify(res));

        this.getCart();
        // this.cart = res;
        // console.log(this.cart);
        // this.data.updateCart(this.cart.cartContents);
      },
      (err) => {
        console.log(err);
      }
    );

    // await this.api.updateCart("/cart/", params).subscribe(
    //   (res) => {
    //     console.log(res);
    //     this.cart = res;
    //     this.data.updateCart(this.cart.cart_contents);
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
  }
  //----------Rewrad-----------------//
  redeem() {
    // wc_points_rewards_apply_discount_amount:
    // wc_points_rewards_apply_discount: Apply Discount
    this.api.postItem("ajax_maybe_apply_discount").subscribe((res) => {
      console.log(res);
      this.getCart();
    });
  }

  async login() {
    let alert = await this.alertCtrl.create({
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
          text: "Cancel",
          role: "cancel",
          handler: (data) => {
            console.log("Confirm Cancel:");
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

          this.getCart();
          // this.navCtrl.navigateForward("/tabs/cart/address");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  async inValidUsername() {
    const alert = await this.alertCtrl.create({
      header: "Warning",
      message: "Invalid Username or Password",
      buttons: ["OK"],
    });
    await alert.present();
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: "top",
    });
    toast.present();
  }

  addToCart2(n) {
    console.log(n);
    // console.log(JSON.stringify(n));

    // this.selectAdons();
    // this.setVariations2();

    // console.log(this.options);

    let CartItem = JSON.parse(
      this.storageGet("cartItem")["__zone_symbol__value"]
    );

    if (CartItem != undefined) {
      const total = CartItem.cart_contents.reduce(
        (sum, item) => sum + item.price,
        0
      );

      console.log(total);
      console.log(total + n.price);

      console.log(CartItem);
      console.log(CartItem.cart_contents);
      CartItem.cart_contents.push({
        product_id: n.product_id,
        variation_id: n.variation_id,
        variation: n.variation,
        quantity: 1,
        name: n.name,
        thumb: n.thumb,
        price: n.price,
        tax_price: n.tax_price,
      });

      CartItem.cart_totals = {
        subtotal: total + n.price,
        subtotal_tax: total + n.price,
        total: total + n.price,
        total_tax: n.tax_price,
      };

      console.log(CartItem);

      this.storage.remove("cartItem");
      localStorage.removeItem("cartItem");
      this.storage.set("cartItem", CartItem);
      localStorage.setItem("cartItem", JSON.stringify(CartItem));

      let CartItem2 = JSON.parse(
        this.storageGet("cartItem")["__zone_symbol__value"]
      );

      // da2 = localStorage.getItem("cartItem");

      console.log(JSON.stringify(CartItem2));
      // console.log(JSON.stringify(da2));
      this.Localcartdata = CartItem2;
    } else {
      let data = {
        cart_contents: [
          {
            product_id: n.product_id,
            variation_id: n.variation_id,
            variation: n.variation,
            quantity: 1,
            name: n.name,
            thumb: n.thumb,
            price: n.price,
            tax_price: n.tax_price,
          },
        ],

        cart_totals: {
          subtotal: n.tax_price,
          subtotal_tax: n.tax_price,
          total: n.price,
          total_tax: n.tax_price,
        },
      };

      console.log(data);

      this.storage.remove("cartItem");
      localStorage.removeItem("cartItem");
      this.storage.set("cartItem", data);
      localStorage.setItem("cartItem", JSON.stringify(data));

      let CartItem2 = JSON.parse(
        this.storageGet("cartItem")["__zone_symbol__value"]
      );

      // da2 = localStorage.getItem("cartItem");

      console.log(JSON.stringify(CartItem2));
      // console.log(JSON.stringify(da2));
      this.Localcartdata = CartItem2;
    }
    this.presentToast("Added to cart");
    // this.login2();
  }

  deleteFromCart2(product_id) {
    console.log(product_id.product_id);

    let CartItem2 = JSON.parse(
      this.storageGet("cartItem")["__zone_symbol__value"]
    );

    console.log(CartItem2.cart_contents);
    let dmm = CartItem2.cart_contents.filter(
      (item) => parseInt(item.product_id) !== parseInt(product_id.product_id)
    );

    console.log(this.Localcartdata.cart_contents);
    console.log(dmm);
    this.Localcartdata.cart_contents = dmm;

    CartItem2.cart_contents = dmm;

    // CartItem.cart_totals = {
    //   subtotal: total + n.price,
    //   subtotal_tax: total + n.price,
    //   total: total + n.price,
    //   total_tax: n.tax_price,
    // };

    console.log(CartItem2);

    this.storage.remove("cartItem");
    localStorage.removeItem("cartItem");
    this.storage.set("cartItem", CartItem2);
    localStorage.setItem("cartItem", JSON.stringify(CartItem2));
  }
}
