import { LightningElement, api } from 'lwc';
import setChosenOffer from '@salesforce/apex/customerOfferPageController.setChosenOffer';

export default class CustomerOfferCard extends LightningElement 
{
	@api offerObject = {"Id": "null", "McaApp__Term_Months__c": "[Term_In_Months]"};

	minFundingAmt;
	maxFundingAmt;
	paybackAmt;
	termInMonths;
	pmtSchedule;
	paymentAmt;
	prepayOptions;
	closingDocumentsRequired;

	connectedCallback()
	{
		if (this.offerObject)
		{
			this.paybackAmt = this.offerObject.McaApp__Payment_Amt__c;
			this.termInMonths = this.offerObject.McaApp__Term_Months__c;
			this.pmtSchedule = this.offerObject.McaApp__PMT_Schedule__c;
			this.paymentAmt = this.offerObject.McaApp__Payment_Amt__c;
		}
	}

	handleClick()
	{
		console.log("CLICKED ON:", this.offerObject.Name + " offer");
		setChosenOffer({OfferID: this.offerObject.Id
		}).then(response => {
			console.log(response)
			}).catch(err => {
				console.error(err)
				})
	}
}
