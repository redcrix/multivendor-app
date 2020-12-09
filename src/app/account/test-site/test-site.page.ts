import { Component, OnInit } from '@angular/core';
import { HomePage} from '../../home/home.page';
import { ApiService } from '../../api.service';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { Config } from '../../config';
import { Settings } from './../../data/settings';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-test-site',
  templateUrl: './test-site.page.html',
  styleUrls: ['./test-site.page.scss'],
})
export class TestSitePage implements OnInit {
	form: any;
	errors: any;
	status: any = {};
	disableSubmit: boolean = false;
	constructor(public navCtrl: NavController, public home: HomePage, private fb: FormBuilder, public config: Config, public api: ApiService, public settings: Settings) { 
		this.form = this.fb.group({
	        url: ['', Validators.required],
	        consumerKey: ['', ''],
	        consumerSecret: ['', ''],
	      });
	}
	ngOnInit() {}
	onSubmit() {
		console.log(this.form.value);
		this.config.url = this.form.value.url;
		this.config.consumerKey = this.form.value.consumerKey;
		this.config.consumerSecret = this.form.value.consumerSecret;
		this.home.getBlocks();
      	this.navCtrl.pop();
	}

}
