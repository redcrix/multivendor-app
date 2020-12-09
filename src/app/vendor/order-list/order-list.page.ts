import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Settings } from './../../data/settings';
import { NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {
    filter: any = {};
    orders: any = [];
    hasMoreItems: boolean = true;
    loader: boolean = false;

    constructor(public platform: Platform, public api: ApiService, public settings: Settings, public router: Router, public navCtrl: NavController, public route: ActivatedRoute) {
        this.filter.page = 1;
        this.filter.vendorid = this.settings.customer.id;
    }
    ngOnInit() {
        //THIS WORKS FOE WCFM ALSO, DO NOT CHANEG THIS. WCFM API NOT WORKING
        this.getOrders();

        //WCFM DO NOT USE THIS. WCFM API THIS IS NOT WORKING
        //this.getWCFMOrders();
    }
    
    getOrders() {
        this.loader = true;
        if (this.platform.is('hybrid'))
        this.api.getItemIonic('orders', this.filter).then((res) => {
            this.orders = res;
            this.loader = false;
        }, err => {
            console.log(err);
        });
        else {
           this.api.getItem('orders', this.filter).subscribe(res => {
                this.orders = res;
                this.loader = false;
            }, err => {
                console.log(err);
            }); 
        }
    }
    loadData(event) {
        this.filter.page = this.filter.page + 1;
        if (this.platform.is('hybrid'))
        this.api.getItemIonic('orders', this.filter).then((res) => {
            this.orders.push.apply(this.orders, res);
            event.target.complete();
            if (!res) this.hasMoreItems = false;
        }, err => {
            event.target.complete();
        });
        else {
            this.api.getItem('orders', this.filter).subscribe(res => {
                this.orders.push.apply(this.orders, res);
                event.target.complete();
                if (!res) this.hasMoreItems = false;
            }, err => {
                event.target.complete();
            });
        }
    }

    getDetail(order) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                order: order
            }
        };
        this.navCtrl.navigateForward('/tabs/account/vendor-orders/view-order/' + order.id, navigationExtras);
    }
    editOrder(order) {
        this.navCtrl.navigateForward('/tabs/account/vendor-orders/edit-order/' + order.id);
    }

    //WCFM
    /*getWCFMOrders(){
        this.loader = true;
        if (this.platform.is('hybrid'))
        this.api.getWCFMIonic('orders', this.filter).then((res) => {
            this.orders = res;
            this.loader = false;
        }, err => {
            console.log(err);
        });
        else {
            this.api.getWCFM('orders', this.filter).subscribe(res => {
                this.orders = res;
                this.loader = false;
            }, err => {
                console.log(err);
            });
        }
    }
    loadData(event) {
        this.filter.page = this.filter.page + 1;
        if (this.platform.is('hybrid'))
            this.api.getWCFMIonic('orders', this.filter).then((res) => {
                this.orders.push.apply(this.orders, res);
                event.target.complete();
                if (!res) this.hasMoreItems = false;
            }, err => {
                event.target.complete();
            });
        else {
            this.api.getWCFM('orders', this.filter).subscribe(res => {
                this.orders.push.apply(this.orders, res);
                event.target.complete();
                if (!res) this.hasMoreItems = false;
            }, err => {
                event.target.complete();
            });
        }
    }*/
}