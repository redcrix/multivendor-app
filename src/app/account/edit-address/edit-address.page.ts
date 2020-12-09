import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Settings } from './../../data/settings';

@Component({
    selector: 'app-edit-address',
    templateUrl: './edit-address.page.html',
    styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {
    address: any = [];
    countries: any;
    states: any;
    billingStates: any;
    shippingStates: any;
    status: any;
    disableButton: boolean = false;
    accountEdit = true;
    constructor(public api: ApiService, 
        public loadingController: LoadingController, 
        public settings: Settings, public router: Router, public navCtrl: NavController, public route: ActivatedRoute) {}
    ngOnInit() {

        if(localStorage.getItem('accountEdit') === 'true'){
            this.accountEdit = false;
            this.getCustomer();
        }

        this.getCountries();
    }
    async getCountries() {
        await this.api.postItem('countries').subscribe(res => {
            this.countries = res;
            if(this.countries && this.countries.length == 1) {
                this.address['billing_country'] = this.countries[0].value;
                this.address['shipping_country'] = this.countries[0].value;
                this.billingStates = this.countries.find(item => item.value == this.address['billing_country']);
                this.shippingStates = this.countries.find(item => item.value == this.address['billing_country']);
            } else {
                this.billingStates = this.countries.find(item => item.value == this.settings.customer.billing.country);
                this.shippingStates = this.countries.find(item => item.value == this.settings.customer.shipping.country);
            }
        }, err => {
            console.log(err);
        });
    }
    processAddress() {
        for (var key in this.settings.customer.billing) {
            this.address['billing_' + key] = this.settings.customer.billing[key];
        }
        for (var key in this.settings.customer.shipping) {
            this.address['shipping_' + key] = this.settings.customer.shipping[key];
        }
        // const postAddress = {
        //     billing_address: JSON.parse(JSON.stringify(this.settings.customer.billing)),
        //     shipping_address: JSON.parse(JSON.stringify(this.settings.customer.shipping)),
        // };
        this.updateAddress();
    }
    async updateAddress() {
        this.disableButton = true;
        // await this.api.postItem('update-address', this.address).subscribe(res => {
        //     this.status = res;
        //    // this.navCtrl.pop();
        //     this.disableButton = false;
        // }, err => {
        //     this.disableButton = false;
        // });
        //
        for (var key in this.settings.customer) {
            if (key === "billing" || key === "shipping") {
                for (var skey in this.settings.customer[key]) {
                    if (typeof this.settings.customer[key][skey] === "number") {
                        this.settings.customer[key][skey] = this.settings.customer[key][skey].toString();
                    }
                }
            }
        }
        await this.api.WCV2put('customers/' + this.settings.customer.id, this.settings.customer).subscribe(res => {
            this.status = res;
            this.disableButton = false;
        }, err => {
            this.disableButton = false;
        });
    }
    getBillingRegion() {
        this.billingStates = this.countries.find(item => item.value == this.settings.customer.billing.country);
        this.settings.customer.billing.state = '';

    }
    getShippingRegion() {
        this.shippingStates = this.countries.find(item => item.value == this.settings.customer.shipping.country);
        this.settings.customer.shipping.state = '';
    }

    async getCustomer() {
        const loading = await this.loadingController.create({
            message: 'Loading...',
            translucent: true,
            cssClass: 'custom-class custom-loading'
        });
        await loading.present();
        // if (this.platform.is('hybrid'))
        //     await this.api.WCV2getItemIonic('customers/' + this.settings.customer.id).then((res) => {
        //         this.settings.customer = res;
        //         loading.dismiss();
        //     }, err => {
        //         console.log(err);
        //         loading.dismiss();
        //     });
        // else {
       
        await this.api.WCV2getItem('customers/' + this.settings.customer.id).subscribe(res => {
                this.settings.customer = res;
                loading.dismiss();
            }, err => {
                console.log(err);
                loading.dismiss();
            });
        // }
    }
}