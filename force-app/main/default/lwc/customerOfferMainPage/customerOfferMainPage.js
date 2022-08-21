import { LightningElement, track, wire } from 'lwc';
import getOffers from '@salesforce/apex/customerOfferPageController.getOffers';

export default class MainPage extends LightningElement
{
	
	@track allOffers = []
	allOffersGrouped = []

	@wire (getOffers)
	offersList(result){
		if (result.data)
			{
				this.allOffers = result.data
				console.log(result.data)
				this.allOffersGrouped = Object.entries(this.groupByOffer(result.data)).map(([key, value]) => ({ key, value }))
				console.log(this.allOffersGrouped)
			}
	}

	groupByOffer(offersArray)
	{
		let  returnObject = {}

		for (const offer of offersArray)
		{
			if (!(offer.McaApp__Deal_Type__c in returnObject))
				returnObject[offer.McaApp__Deal_Type__c] = []
			returnObject[offer.McaApp__Deal_Type__c].push(offer)
		}

		return returnObject
	}
}
