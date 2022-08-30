import { LightningElement, wire } from 'lwc';
import offers from '@salesforce/apex/customerOfferPageController.getOffers';

export default class CustomerOfferMainPage extends LightningElement
{
	
	allOffers = [];
	allOfferGroups = [];

	@wire (offers)
	offersList(result){
		if (result.data)
			{
				this.allOffers = result.data
				console.log(result.data)
				this.allOfferGroups = Object.entries(this.groupByOffer(result.data)).map(([key, value]) => ({ key, value }))
				console.log(this.allOfferGroups)
			}
	}

	groupByOffer(offersArray)
	{
		let  returnObject = {};

		for (const offer of offersArray)
		{
			if (!(offer.McaApp__Deal_Type__c in returnObject))
				returnObject[offer.McaApp__Deal_Type__c] = []
			returnObject[offer.McaApp__Deal_Type__c].push(offer)
		}

		return returnObject
	}
}