import { Component, OnInit, ViewChild } from "@angular/core";
import {
  LoadingController,
  NavController,
  Platform,
  ToastController,
} from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../../api.service";
import { CheckoutData } from "../../data/checkout";
import { Settings } from "./../../data/settings";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { OneSignal } from "@ionic-native/onesignal/ngx";
//import { CardIO } from '@ionic-native/card-io/ngx';
//import { Braintree, ApplePayOptions, PaymentUIOptions, PaymentUIResult } from '@ionic-native/braintree/ngx';
declare var Stripe;
@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.page.html",
  styleUrls: ["./checkout.page.scss"],
})
export class CheckoutPage implements OnInit {
  stripe: any;
  card: any;
  cardElement: any;
  stripeStatus: any = {};

  loading: any;
  buttonSubmit: boolean = false;
  PlaceOrder: any; //May not be used

  orderReview: any;
  results: any = {};
  disableButton: boolean = false;
  errorMessage: any;
  orderId: any;
  cardResponse: any = {};
  stripeForm: any = {};
  stripePaymentOnly = true;
  constructor(
    private oneSignal: OneSignal,
    public toastController: ToastController,
    public platform: Platform,
    public api: ApiService,
    public checkoutData: CheckoutData,
    public settings: Settings,
    public router: Router,
    public iab: InAppBrowser,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public route: ActivatedRoute /*, private braintree: Braintree*/
  ) {}
  ngOnInit() {
    this.updateOrder();
  }
  async updateOrder() {
    this.checkoutData.form.security = this.checkoutData.form.nonce.update_order_review_nonce;
    this.checkoutData.form[
      "woocommerce-process-checkout-nonce"
    ] = this.checkoutData.form._wpnonce;
    this.checkoutData.form["wc-ajax"] = "update_order_review";
    this.setOldWooCommerceVersionData();
    await this.api
      .updateOrderReview("update_order_review", this.checkoutData.form)
      .subscribe(
        (res) => {
          this.orderReview = res;
          console.log(
            "TOTAL AMOUNT TOT PAY" +
              JSON.stringify(this.orderReview.totals.total)
          );

          //   alert(JSON.stringify(this.orderReview));
          if (this.orderReview.payment && this.orderReview.payment.paystack) {
            // alert(1);
            this.setupPaystack();
            // this.stripe = Stripe(
            //   this.orderReview.payment.stripe.publishable_key
            // );
            // this.setupStripe();
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
  async updateOrderReview() {
    this.checkoutData.form.shipping_method = [];
    this.orderReview.shipping.forEach((item, index) => {
      this.checkoutData.form["shipping_method[" + index + "]"] =
        item.chosen_method;
    });
    this.checkoutData.form.security = this.checkoutData.form.nonce.update_order_review_nonce;
    this.checkoutData.form[
      "woocommerce-process-checkout-nonce"
    ] = this.checkoutData.form._wpnonce;
    this.checkoutData.form["wc-ajax"] = "update_order_review";
    this.setOldWooCommerceVersionData();
    await this.api
      .updateOrderReview("update_order_review", this.checkoutData.form)
      .subscribe(
        (res) => {
          this.handleData(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  setOldWooCommerceVersionData() {
    this.checkoutData.form.city = this.checkoutData.form.billing_city;
    this.checkoutData.form.postcode = this.checkoutData.form.billing_postcode;
    this.checkoutData.form.country = this.checkoutData.form.billing_country;
    this.checkoutData.form.address = this.checkoutData.form.billing_address_1;
    this.checkoutData.form.address_2 = this.checkoutData.form.billing_address_2;
    this.checkoutData.form.s_city = this.checkoutData.form.shipping_city;
    this.checkoutData.form.s_postcode = this.checkoutData.form.shipping_postcode;
    this.checkoutData.form.s_country = this.checkoutData.form.shipping_country;
    this.checkoutData.form.s_address = this.checkoutData.form.shipping_address_1;
    this.checkoutData.form.s_address_2 = this.checkoutData.form.shipping_address_2;
    this.checkoutData.form.has_full_address = true;
  }
  handleData(results) {
    console.log(results);
    //
  }
  async placeOrder() {
    this.disableButton = true;
    this.errorMessage = undefined;

    // alert(
    //   "this.checkoutData.form" +
    //     this.checkoutData.form +
    //     "==================this.checkoutData.form.payment_method" +
    //     this.checkoutData.form.payment_method
    // );

    /** Comment this if not using OneSignal Push notification ***/
    if (this.platform.is("cordova")) {
      await this.oneSignal.getIds().then((data: any) => {
        this.checkoutData.form.onesignal_user_id = data.userId;
      });
    }

    if (this.checkoutData.form.payment_method == "authnet") {
      this.checkoutData.form["authnet-card-expiry"] =
        this.checkoutData.form.expiryMonth +
        " / " +
        this.checkoutData.form.expiryYear;
    }

    if (this.checkoutData.form.payment_method == "paystack") {
      this.setStripeForm();
      console.log(
        "setStripeForm Get Token and see the form data" +
          JSON.stringify(this.stripeForm)
      );

      console.log(JSON.stringify(this.checkoutData.form.expiryYear));
      console.log(JSON.stringify(this.checkoutData.form.payment_method));
      console.log(JSON.stringify(this.checkoutData.form));
      this.chargePaystackCard();
      //   this.stripePlaceOrder(res);

      //   this.handleStipeToken(res);
      //   await this.api
      //     .getExternalData("https://api.stripe.com/v1/tokens", this.stripeForm)
      //     .subscribe(
      //       (res) => {
      //         this.handleStipeToken(res);
      //       },
      //       (err) => {
      //         if (err.error.error.message)
      //           this.errorMessage = err.error.error.message;
      //         this.disableButton = false;
      //       }
      //     );
    } else {
      /*else if (this.checkoutData.form.payment_method == 'braintree_credit_card'){
            this.brainTreePayment();
        }*/
      await this.api
        .ajaxCall("/checkout?wc-ajax=checkout", this.checkoutData.form)
        .subscribe(
          (res) => {
            this.results = res;
            this.handleOrder();
          },
          (err) => {
            this.disableButton = false;
            console.log(err);
          }
        );
    }
  }
  handleOrder() {
    if (this.results.result == "success") {
      if (
        this.checkoutData.form.payment_method == "paystack" ||
        this.checkoutData.form.payment_method == "wallet" ||
        this.checkoutData.form.payment_method == "paypalpro" ||
        this.checkoutData.form.payment_method == "stripe" ||
        this.checkoutData.form.payment_method == "bacs" ||
        this.checkoutData.form.payment_method == "cheque" ||
        this.checkoutData.form.payment_method == "cod" ||
        this.checkoutData.form.payment_method == "authnet"
      ) {
        // alert('Handling Order');
        this.orderSummary(this.results.redirect);
      } else if (this.checkoutData.form.payment_method == "payuindia") {
        this.handlePayUPayment();
      } else if (this.checkoutData.form.payment_method == "paytm") {
        this.handlePaytmPayment();
      } else if (this.checkoutData.form.payment_method == "paytm-qr") {
        this.handlePaytmQRPayment();
      } else this.handlePayment();
    } else if (this.results.result == "failure") {
      this.disableButton = false;
      this.errorMessage = this.results.messages;
    }
  }
  orderSummary(address) {
    var str = address;
    var pos1 = str.lastIndexOf("-received/");
    var pos2 = str.lastIndexOf("/?key=wc_order");
    var pos3 = pos2 - (pos1 + 10);
    var order_id = str.substr(pos1 + 10, pos3);
    // alert("order_id " + order_id);
    this.navCtrl.navigateRoot("/order-summary/" + order_id);
  }
  handlePayment() {
    var options = "location=no,hidden=yes,toolbar=no,hidespinner=yes";
    let browser = this.iab.create(this.results.redirect, "_blank", options);
    browser.show();
    browser.on("loadstart").subscribe((data) => {
      if (
        data.url.indexOf("/order-received/") != -1 &&
        data.url.indexOf("key=wc_order_") != -1
      ) {
        this.orderSummary(data.url);
        browser.hide();
      } else if (
        data.url.indexOf("cancel_order=true") != -1 ||
        data.url.indexOf("cancelled=1") != -1 ||
        data.url.indexOf("cancelled") != -1
      ) {
        browser.close();
        this.disableButton = false;
      }
    });
    browser.on("exit").subscribe((data) => {
      this.disableButton = false;
    });
  }
  handlePayUPayment() {
    var options = "location=no,hidden=yes,toolbar=no,hidespinner=yes";
    let browser = this.iab.create(this.results.redirect, "_blank", options);
    let str = this.results.redirect;
    var pos1 = str.lastIndexOf("/order-pay/");
    var pos2 = str.lastIndexOf("/?key=wc_order");
    var pos3 = pos2 - (pos1 + 11);
    this.orderId = str.substr(pos1 + 11, pos3);
    var browserActive = false;
    browser.on("loadstart").subscribe((data) => {
      if (data.url.indexOf("payumoney.com/transact") != -1 && !browserActive) {
        browserActive = true;
        browser.show();
      } else if (
        data.url.indexOf("/order-received/") != -1 &&
        data.url.indexOf("key=wc_order_") != -1
      ) {
        if (this.orderId)
          this.navCtrl.navigateRoot("/order-summary/" + this.orderId);
        browser.hide();
      } else if (
        data.url.indexOf("cancel_order=true") != -1 ||
        data.url.indexOf("cancelled=1") != -1 ||
        data.url.indexOf("cancelled") != -1
      ) {
        browser.close();
        this.disableButton = false;
      }
    });
    browser.on("exit").subscribe((data) => {
      this.disableButton = false;
    });
  }
  handlePaytmPayment() {
    var str = this.results.redirect;
    var pos1 = str.lastIndexOf("/order-pay/");
    var pos2 = str.lastIndexOf("/?key=wc_order");
    var pos3 = pos2 - (pos1 + 11);
    this.orderId = str.substr(pos1 + 11, pos3);
    var browserActive = false;
    if (this.results.result == "success") {
      var options = "location=no,hidden=yes,toolbar=yes";
      let browser = this.iab.create(this.results.redirect, "_blank", options);
      browser.on("loadstart").subscribe((data) => {
        if (
          (data.url.indexOf("securegw-stage.paytm.in/theia") != -1 ||
            data.url.indexOf("processTransaction") != -1) &&
          !browserActive
        ) {
          browserActive = true;
          browser.show();
        } else if (data.url.indexOf("type=success") != -1) {
          if (this.orderId)
            this.navCtrl.navigateRoot("/order-summary/" + this.orderId);
          browser.hide();
        } else if (
          data.url.indexOf("type=error") != -1 ||
          data.url.indexOf("Failed") != -1 ||
          data.url.indexOf("cancel_order=true") != -1 ||
          data.url.indexOf("cancelled") != -1
        ) {
          browser.close();
          this.disableButton = false;
        } else if (data.url.indexOf("Thank+you+for+your+order") != -1) {
          browser.close();
          this.disableButton = false;
        }
      });
      browser.on("exit").subscribe((data) => {
        this.disableButton = false;
      });
    } else if (this.results.result == "failure") {
      this.errorMessage = this.results.messages;
      this.disableButton = false;
    }
  }
  handlePaytmQRPayment() {
    var str = this.results.redirect;
    var pos1 = str.lastIndexOf("/order-received/");
    var pos2 = str.lastIndexOf("/?key=wc_order");
    var pos3 = pos2 - (pos1 + 16);
    var order_id = str.substr(pos1 + 16, pos3);
    if (this.results.result == "success") {
      var options = "location=no,hidden=yes,toolbar=yes";
      let browser = this.iab.create(this.results.redirect, "_blank", options);
      browser.on("loadstart").subscribe((data) => {
        browser.show();
        if (data.url.indexOf("/order-received/") == -1) {
          browser.close();
          this.disableButton = false;
          this.navCtrl.navigateRoot("/order-summary/" + this.orderId);
        }
      });
      browser.on("exit").subscribe((data) => {
        this.disableButton = false;
      });
    } else if (this.results.result == "failure") {
      this.errorMessage = this.results.messages;
      this.disableButton = false;
    }
  }
  onChangePayment() {
    this.setupPaystack();
    this.disableButton = false;
    if (
      this.checkoutData.form.payment_method == "paystack" &&
      this.platform.is("cordova")
    ) {
      //    this.enterCard();
      // this.setupStripe();
      //    this.setCardData();
    }
  }
  /*enterCard() {
        this.cardIO.canScan()
        .then(
        (res: boolean) => {
          if(res){
            let options = {
                requireExpiry: true,
                requireCVV: true,
                scanInstructions: "Scan the front of your card",
                scanExpiry: true,
                hideCardIOLogo: true,
                noCamera: true,
            };
            this.cardIO.scan(options)
            .then((data) => {
               this.cardResponse = data;
               this.setCardData();
            }, err => {
               console.log(err);
            });
          }
        }
        );
    }
    */
  setCardData() {
    if (this.checkoutData.form.payment_method == "paystack") {
      this.checkoutData.form[
        "moneris-card-number"
      ] = this.cardResponse.cardNumber;
      this.cardResponse.expiryYear = this.cardResponse.expiryYear.slice(0, 2); //2030
      this.checkoutData.form["moneris-card-expiry"] =
        this.cardResponse.expiryMonth + " / " + this.cardResponse.expiryYear; //;'04 / 30'
      this.checkoutData.form["moneris-card-cvc"] = this.cardResponse.cvv;
    } else if (this.checkoutData.form.payment_method == "paypalpro") {
      this.checkoutData.form[
        "billing_credircard"
      ] = this.cardResponse.cardNumber;
      this.checkoutData.form["billing_cardtype"] = this.cardResponse.cardType;
      this.checkoutData.form[
        "moneris-card-expiry"
      ] = this.cardResponse.expiryYear;
      this.checkoutData.form[
        "billing_expdatemonth"
      ] = this.cardResponse.expiryMonth;
      this.checkoutData.form["billing_ccvnumber"] = this.cardResponse.cvv;
    }
  }
  setStripeForm() {
    // "test_public_key":"pk_test_d8655374baf8af8a15125bc9eb2e4357c963b9f9",
    // "test_secret_key":"sk_test_e1a430b99aeeed3733e73cedbf627f62e4621974",
    // "live_public_key":"",
    // "live_secret_key":"",

    this.stripeForm.key = this.orderReview.payment.paystack.test_public_key;
    // this.stripeForm.payment_user_agent = "stripe.js/6ea8d55";
    this.stripeForm["card[number]"] = this.cardResponse.cardNumber; //'4242424242424242';//this.cardResponse.cardNumber;
    this.stripeForm["card[exp_month]"] = this.cardResponse.expiryMonth; //'04';//this.cardResponse.expiryMonth;
    this.stripeForm["card[exp_year]"] = this.cardResponse.expiryYear; ////this.cardResponse.expiryYear;
    this.stripeForm["card[cvc]"] = this.cardResponse.cvv; //this.cardResponse.cvc;
    this.stripeForm["card[name]"] =
      this.checkoutData.form.billing_first_name +
      this.checkoutData.form.billing_last_name;
    this.stripeForm[
      "card[address_line1]"
    ] = this.checkoutData.form.billing_address_1;
    this.stripeForm[
      "card[address_line2]"
    ] = this.checkoutData.form.billing_address_2;
    this.stripeForm[
      "card[address_state]"
    ] = this.checkoutData.form.billing_state;
    this.stripeForm["card[address_city]"] = this.checkoutData.form.billing_city;
    this.stripeForm[
      "card[address_zip]"
    ] = this.checkoutData.form.billing_postcode;
    this.stripeForm[
      "card[address_country]"
    ] = this.checkoutData.form.billing_country;
    return true;
  }
  handleStipeToken(token) {
    if (token && token.id) {
      var form = { type: "card", token: "", key: "" };
      form.type = "card";
      form.token = token.id;
      form.key = this.orderReview.payment.stripe.publishable_key;
      this.checkoutData.form["wc-stripe-payment-token"] = token.id; //For Existing Cards add api
      this.api
        .getExternalData("https://api.stripe.com/v1/sources", form)
        .subscribe(
          (res) => {
            this.stripePlaceOrder(res);
          },
          (err) => {
            if (err.error.error.message)
              this.errorMessage = err.error.error.message;
            this.disableButton = false;
          }
        );
    } else {
      this.disableButton = false;
      this.errorMessage = "Cannot handle payment, Please check card details";
    }
  }
  stripePlaceOrder(src) {
    console.log(JSON.stringify(src));

    if (src && src.id) {
      this.checkoutData.form["paystack_source"] = src.id;
      this.checkoutData.form["stripe_source"] = src.id;
      this.api
        .ajaxCall("/checkout?wc-ajax=checkout", this.checkoutData.form)
        .subscribe(
          (res) => {
            this.results = res;
            this.handleOrder();
          },
          (err) => {
            this.disableButton = false;
          }
        );
    } else {
      this.disableButton = false;
      this.errorMessage = "Cannot handle payment, Please check card details";
    }
  }
  isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  onUseNewCard() {
    // this.cardElement.mount('#card-element');
    // // var form = document.getElementById('payment-form');
    this.setupPaystack();
  }
  setupPaystack() {
    // var style = {
    //   base: {
    //     color: "#32325d",
    //     fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //     fontSmoothing: "antialiased",
    //     fontSize: "16px",
    //     "::placeholder": {
    //       color: "#aab7c4",
    //     },
    //   },
    //   invalid: {
    //     color: "#fa755a",
    //     iconColor: "#fa755a",
    //   },
    // };
    // var elements = this.stripe.elements();
    // this.cardElement = elements.create("card", {
    //   hidePostalCode: true,
    //   style: style,
    // });
    // this.cardElement.mount("#card-element");

    //this.card.mount('#card-element');
    // var form = document.getElementById("payment-form");
    // form.addEventListener("submit", (event) => {
    //   console.log("loading start");
    //   event.preventDefault();
    // this.stripe.createToken(this.cardElement).then((result) => {
    //   console.log(result.token.id);

    //     this.service.getStripeSource(this.form, result.token)
    //         .then((results) => {
    //         console.log(results)
    //     });

    // });
    var ownerInfo = {
      owner: {
        name:
          this.checkoutData.form.billing_first_name +
          " " +
          this.checkoutData.form.billing_last_name,
        address: {
          line1: this.checkoutData.form.billing_address_1,
          city: this.checkoutData.form.billing_city,
          postal_code: this.checkoutData.form.billing_postcode,
          country: "US",
        },
        email: this.checkoutData.form.billing_email,
      },
    };
    if (!this.checkoutData.form.shipping) {
      this.checkoutData.form.shipping_first_name = this.checkoutData.form.billing_first_name;
      this.checkoutData.form.shipping_last_name = this.checkoutData.form.billing_last_name;
      this.checkoutData.form.shipping_company = this.checkoutData.form.billing_company;
      this.checkoutData.form.shipping_address_1 = this.checkoutData.form.billing_address_1;
      this.checkoutData.form.shipping_address_2 = this.checkoutData.form.billing_address_2;
      this.checkoutData.form.shipping_city = this.checkoutData.form.billing_city;
      this.checkoutData.form.shipping_country = this.checkoutData.form.billing_country;
      this.checkoutData.form.shipping_state = this.checkoutData.form.billing_state;
      this.checkoutData.form.shipping_postcode = this.checkoutData.form.billing_postcode;
    }

    // this.loading = this.loadingController.create({});
    // this.loading.present();
    this.buttonSubmit = true;
    this.PlaceOrder = "Placing Order";
    console.log(
      "While pacing Order --cardElement-- " + JSON.stringify(this.cardElement)
    );
    console.log("Line no 556 " + JSON.stringify(this.checkoutData.form));
    //   this.stripe.createSource(this.cardElement, ownerInfo).then((result) => {
    //     if (result.error) {
    //       this.loading.dismiss();
    //       // Inform the user if there was an error
    //       var errorElement = document.getElementById("card-errors");
    //       errorElement.textContent = result.error.message;
    //     } else {
    //       this.checkoutData.form.stripe_source = result.source.id;
    //       this.stripNewPayment();
    //     }
    //   });

    /*    */
    // });
  }

  chargePaystackCard() {
    // console.log("EMAIL ==========" + this.settings.customer);

    let card = this.stripeForm["card[number]"];

    let month = this.stripeForm["card[exp_month]"];

    let cvc = this.stripeForm["card[cvc]"];

    let year = this.stripeForm["card[exp_year]"];

    let amount = "";

    let email = "";

    //   console.log(card);

    //     console.log(month);

    //       console.log(cvc);

    //         console.log(year);

    //           console.log(amount);

    //             console.log(email);

    // alert("Card Element");

    this.platform.ready().then(() => {
      if (this.platform.is("cordova")) {
        // Now safe to use device APIs

        (<any>window).window.PaystackPlugin.chargeCard(
          (resp) => {
            // loader.dismiss();

            // this.stripePlaceOrder(res);

            //this.pop.showPayMentAlert(“Payment Was Successful”, “We will Now Refund Your Balance”);

            console.log("charge successful: ", resp);
            this.stripePlaceOrder(resp);

            alert("Payment Was Successful");
          },

          (resp) => {
            // loader.dismiss();

            alert("We Encountered An Error While Charging Your Card" + resp);
          },

          {
            cardNumber: card,
            expiryMonth: month,
            expiryYear: year,
            cvc: cvc,
            email: this.settings.customer.billing_email,
            amountInKobo: this.orderReview.totals.total,
          }
        );
      } else {
        alert("Only for mobile versions");
      }
    });
  }
  async onClickStripeSubmit() {
    var ownerInfo = {
      owner: {
        name:
          this.checkoutData.form.billing_first_name +
          " " +
          this.checkoutData.form.billing_last_name,
        address: {
          line1: this.checkoutData.form.billing_address_1,
          city: this.checkoutData.form.billing_city,
          postal_code: this.checkoutData.form.billing_postcode,
          country: "US",
        },
        email: this.checkoutData.form.billing_email,
      },
    };
    if (!this.checkoutData.form.shipping) {
      this.checkoutData.form.shipping_first_name = this.checkoutData.form.billing_first_name;
      this.checkoutData.form.shipping_last_name = this.checkoutData.form.billing_last_name;
      this.checkoutData.form.shipping_company = this.checkoutData.form.billing_company;
      this.checkoutData.form.shipping_address_1 = this.checkoutData.form.billing_address_1;
      this.checkoutData.form.shipping_address_2 = this.checkoutData.form.billing_address_2;
      this.checkoutData.form.shipping_city = this.checkoutData.form.billing_city;
      this.checkoutData.form.shipping_country = this.checkoutData.form.billing_country;
      this.checkoutData.form.shipping_state = this.checkoutData.form.billing_state;
      this.checkoutData.form.shipping_postcode = this.checkoutData.form.billing_postcode;
    }
    this.buttonSubmit = true;
    this.PlaceOrder = "Placing Order";
    this.loading = await this.loadingController.create({
      message: "Loading...",
      translucent: true,
      animated: true,
      backdropDismiss: true,
    });
    await this.loading.present();
    this.stripe.createSource(this.cardElement, ownerInfo).then((result) => {
      if (result.error) {
        this.loading.dismiss();
        // Inform the user if there was an error
        var errorElement = document.getElementById("card-errors");
        errorElement.textContent = result.error.message;
      } else {
        this.checkoutData.form.stripe_source = result.source.id;
        this.stripNewPayment();
      }
    });
  }
  async stripNewPayment() {
    //IF for new Card Payment
    if (this.checkoutData.form.card) {
      this.checkoutData.form["wc-stripe-payment-token"] = "new";
    }

    //For Existing Card
    //if(!form.card)
    //this.checkoutData.form['wc-stripe-payment-token'] = form.payment_token);

    this.api
      .ajaxCall("/checkout?wc-ajax=checkout", this.checkoutData.form)
      .subscribe(
        (res) => {
          this.stripeStatus = res;
          if (this.stripeStatus.result == "success") {
            if (this.stripeStatus.redirect.indexOf("confirm-pi-") != -1) {
              // PI from resuct redirect text
              var clientSecret = this.stripeStatus.redirect.substring(
                this.stripeStatus.redirect.lastIndexOf("confirm-pi-") + 11,
                this.stripeStatus.redirect.lastIndexOf(":%2F")
              );
              //var clientSecret = 'pi_1EqKUlAMZtK61uwq79jdiVMt_secret_DitxeVf8vWt05K6kUS71alvrS';
              this.stripe
                .handleCardPayment(clientSecret, this.cardElement, {
                  payment_method_data: {
                    billing_details: {
                      name:
                        this.checkoutData.form.billing_first_name +
                        " " +
                        this.checkoutData.form.billing_last_name,
                      address: {
                        line1: this.checkoutData.form.billing_address_1,
                        city: this.checkoutData.form.billing_city,
                        postal_code: this.checkoutData.form.billing_postcode,
                        country: "GB",
                      },
                      email: this.checkoutData.form.billing_email,
                    },
                  },
                })
                .then((result) => {
                  this.loading.dismiss();
                  if (result.error) {
                    this.buttonSubmit = false;
                    // Display error.message in your UI.
                  } else {
                    this.buttonSubmit = false;
                    var str = this.stripeStatus.redirect;
                    var pos1 = str.lastIndexOf("received%252F");
                    var pos2 = str.lastIndexOf("%252F%253Fkey");
                    var pos3 = pos2 - (pos1 + 13);
                    var order_id = str.substr(pos1 + 13, pos3);
                    this.api
                      .ajaxCall(
                        "/?wc-ajax=wc_stripe_verify_intent&order=" +
                          order_id +
                          "&nonce=" +
                          this.checkoutData.form.stripe_confirm_pi +
                          "&redirect_to="
                      )
                      .subscribe(
                        (res) => {
                          this.navCtrl.navigateRoot(
                            "/order-summary/" + order_id
                          );
                        },
                        (err) => {}
                      );
                  }
                });
            } else if (
              this.stripeStatus.redirect.indexOf("order-received") != -1 &&
              this.stripeStatus.redirect.indexOf("key=wc_order") != -1
            ) {
              var str = this.stripeStatus.redirect;
              var pos1 = str.lastIndexOf("/order-received/");
              var pos2 = str.lastIndexOf("/?key=wc_order");
              var pos3 = pos2 - (pos1 + 16);
              var order_id = str.substr(pos1 + 16, pos3);
              this.buttonSubmit = false;
              this.loading.dismiss();
              this.navCtrl.navigateRoot("/order-summary/" + order_id);
            }
          } else if (this.stripeStatus.result == "failure") {
            this.presentToast(this.stripeStatus.messages);
            this.buttonSubmit = false;
            this.loading.dismiss();
          }
        },
        (err) => {
          this.disableButton = false;
          console.log(err);
        }
      );
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: "top",
    });
    toast.present();
  }
  brainTreePayment() {
    /*console.log('Braintree payment.......');
        
        const BRAINTREE_TOKEN = 'sandbox_7b74zrbp_zm8j7dwnjqqzzgxn';
        
        const appleOptions: ApplePayOptions = {
          merchantId: 'zm8j7dwnjqqzzgxn',
          currency: 'USD',
          country: 'US'
        }
        const paymentOptions: PaymentUIOptions = {
          amount: '14.99',
          primaryDescription: 'Your product or service (per /item, /month, /week, etc)',
        }
        this.braintree.initialize(BRAINTREE_TOKEN)
          .then(() => this.braintree.setupApplePay(appleOptions))
          .then(() => this.braintree.presentDropInPaymentUI(paymentOptions))
          .then((result: PaymentUIResult) => {
            if (result.userCancelled) {
              console.log("User cancelled payment dialog.");
            } else {
              console.log("User successfully completed payment!");
              console.log("Payment Nonce: " + result.nonce);
              console.log("Payment Result.", result);
            }
          })
          .catch((error: string) => console.error(error));*/
  }
}
