import { LightningElement, track, wire } from 'lwc';
import getOffers from '@salesforce/apex/customerOpportunity.getOffers';

export default class MainPage extends LightningElement
{
	
	@track allOffers = []

	@wire (getOffers)
	offersList(result){
		this.allOffers = result.data
		console.log('HELLO RESULTS:', result.data)
	}

	renderedCallback()
	{
		console.log('RENDERED CALLBACK: ')
		console.log(this.groupByOffer(this.allOffers))	
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
