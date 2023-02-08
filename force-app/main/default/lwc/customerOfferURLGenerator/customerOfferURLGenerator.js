import { LightningElement, api } from 'lwc';
import generateURL from '@salesforce/apex/customerOfferPageController.generateURL';

export default class CuustomerOfferURLGenerator extends LightningElement
{
	@api recordId;
	urlParam;
	prefix = 'https://fundio--banjaxed.sandbox.my.site.com/offersOpp/s/';	//https://fundio--banjaxed.sandbox.my.site.com/offers/

	connectedCallback()
	{
		console.log('Current Record:', this.recordId);
	}

	handleClick()
	{
		generateURL({opportunityID: this.recordId
		}).then(response => {
			this.urlParam = this.prefix + "?c__OpportunityIdentifier=" + encodeURIComponent(response); 
			}).catch(err => {
				console.error(err)
				})
	}
}