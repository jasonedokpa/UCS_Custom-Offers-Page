import { LightningElement } from 'lwc';
import generateURL from '@salesforce/apex/customerOfferPageController.generateURL';

export default class CuustomerOfferURLGenerator extends LightningElement
{
	opportunityID;
	urlParam;

	changeID(event)
	{
		this.opportunityID = event.target.value;
	}

	handleClick()
	{
		console.log("Opportunity ID:", this.opportunityID);
		generateURL({opportunityID: this.opportunityID
		}).then(response => {
			this.urlParam = "http://localhost:3333/preview/c/customerOfferMainPage?c__OpportunityIdentifier=" + response.replaceAll("+", "%2b");
			console.log(this.urlParam);
			}).catch(err => {
				console.error(err)
				})
	}
}