import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Config } from '../config';
import { Data } from '../data';
import { Settings } from '../data/settings';
import { HttpParams } from "@angular/common/http";
import { Product } from '../data/product';

@Component({
    selector: 'app-cart',
    templateUrl: 'cart.page.html',
    styleUrls: ['cart.page.scss']
})
export class CartPage {
    coupon: any;
    cart: any = {};
    couponMessage: any;
    status: any;
    loginForm: any = {};
    errors: any;
    constructor(private alertCtrl: AlertController, public toastController: ToastController, public config: Config, public api: ApiService, public data: Data, public router: Router, public settings: Settings, public loadingController: LoadingController, public navCtrl: NavController, public route: ActivatedRoute, public productData: Product) {}
    ngOnInit() {}
    ionViewDidEnter() {
        this.getCart();
    }
    async getCart() {
        await this.api.postItem('cart').subscribe(res => {
            this.cart = res;
            console.log(this.cart);
            
            this.data.updateCart(this.cart.cart_contents);
        }, err => {
            console.log(err);
        });
    }
    checkout() {
        if(this.settings.customer.id) {
            this.navCtrl.navigateForward('/tabs/cart/address');
        }
        else this.login();
    }

    getProduct(id){
        this.productData.product = {};
        this.navCtrl.navigateForward(this.router.url + '/product/' + id);
    }
    async deleteItem(itemKey, qty) {
        await this.api.postItem('remove_cart_item&item_key=' + itemKey).subscribe(res => {
            this.cart = res;
            this.data.updateCart(this.cart.cart_contents);
        }, err => {
            console.log(err);
        });
    }
    async submitCoupon(coupon) {
        await this.api.postItem('apply_coupon', {
            coupon_code: coupon
        }).subscribe(res => {
            this.couponMessage = res;
            if(this.couponMessage != null && this.couponMessage.notice) {
                this.presentToast(this.couponMessage.notice)
            }
            this.getCart();
        }, err => {
            console.log(err);
        });
    }
    async removeCoupon(coupon) {
        await this.api.postItem('remove_coupon', {
            coupon: coupon
        }).subscribe(res => {
            this.getCart();
        }, err => {
            console.log(err);
        });
    }

    async addToCart(id, key){

        if (this.data.cartItem[key].quantity != undefined && this.data.cartItem[key].quantity == 0) {
            this.data.cartItem[key].quantity = 0
        }
        else {
            this.data.cartItem[key].quantity += 1
        };
        if (this.data.cart[id] != undefined && this.data.cart[id] == 0) {
            this.data.cart[id] = 0
        }
        else {
            this.data.cart[id] += 1
        };

        var params = new HttpParams();
        params = params.set('cart[' + key + '][qty]', this.data.cartItem[key].quantity);
        params = params.set('_wpnonce', this.cart.cart_nonce);
        params = params.set('_wp_http_referer', this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-cart');
        params = params.set('update_cart', 'Update Cart');

        await this.api.updateCart('/cart/', params).subscribe(res => {
            console.log(res);
            this.cart = res;
            this.data.updateCart(this.cart.cart_contents);
        }, err => {
            console.log(err);
        });
    }

    async deleteFromCart(id, key){

        if (this.data.cartItem[key].quantity != undefined && this.data.cartItem[key].quantity == 0) {
            this.data.cartItem[key].quantity = 0;
        }
        else {
            this.data.cartItem[key].quantity -= 1;
        };
        if (this.data.cart[id] != undefined && this.data.cart[id] == 0) {
            this.data.cart[id] = 0
        }
        else {
            this.data.cart[id] -= 1
        };

        var params = new HttpParams();
        params = params.set('cart[' + key + '][qty]', this.data.cartItem[key].quantity);
        params = params.set('_wpnonce', this.cart.cart_nonce);
        params = params.set('_wp_http_referer', this.config.url + '/wp-admin/admin-ajax.php?action=mstoreapp-cart');
        params = params.set('update_cart', 'Update Cart');

        await this.api.updateCart('/cart/', params).subscribe(res => {
            console.log(res);
            this.cart = res;
            this.data.updateCart(this.cart.cart_contents);
        }, err => {
            console.log(err);
        });
    }
    //----------Rewrad-----------------//
    redeem(){
       // wc_points_rewards_apply_discount_amount: 
       // wc_points_rewards_apply_discount: Apply Discount
        this.api.postItem('ajax_maybe_apply_discount').subscribe(res =>{
            console.log(res);
            this.getCart();
            })
    }

    async login() {
          let alert = await this.alertCtrl.create({
              header: 'Login and continue',
              inputs: [{
                  name: 'username',
                  placeholder: 'Email/Username',
                  type: 'text'
              },
              {
                  name: 'password',
                  placeholder: 'Password',
                  type: 'text'
              }],
              buttons: [{
                  text: 'Checkout as guest',
                  role: 'cancel',
                  handler: data => {
                    this.navCtrl.navigateForward('/tabs/cart/address');
                  }
              }, {
                  text: 'Login',
                  handler: data => {
                      this.onSubmit(data);
                  }
              }]
          });
          alert.present();
      }
      async onSubmit(userData) {
        this.loginForm.username = userData.username;
        this.loginForm.password = userData.password;
        console.log(this.loginForm);
        await this.api.postItem('login', this.loginForm).subscribe(res => {
            this.status = res;
            if (this.status.errors != undefined) {
                this.errors = this.status.errors;
                this.inValidUsername();
            } else if (this.status.data) {
                this.settings.customer.id = this.status.ID;
                if(this.status.allcaps.dc_vendor || this.status.allcaps.seller || this.status.allcaps.wcfm_vendor){
                    this.settings.vendor = true;
                }
                this.navCtrl.navigateForward('/tabs/cart/address');
            }
        }, err => {
            console.log(err);
        });
    }
    async inValidUsername() {
        const alert = await this.alertCtrl.create({
          header: 'Warning',
          message: 'Invalid Username or Password',
          buttons: ['OK']
        });
        await alert.present();
    }
    async presentToast(message) {
        const toast = await this.toastController.create({
          message: message,
          duration: 2000,
          position: 'top'
        });
        toast.present();
    }
}