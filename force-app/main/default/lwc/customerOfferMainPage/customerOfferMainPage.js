import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import offers from '@salesforce/apex/customerOfferPageController.getOffers';
import getIDFromURL from '@salesforce/apex/customerOfferPageController.getIDFromURL';
import FORM_FACTOR from '@salesforce/client/formFactor'
import mobileTemple from './mobileTemplate.html'
import desktopTemplate from './customerOfferMainPage.html'


export default class CustomerOfferMainPage extends LightningElement
{
	accordianOpenSection = ['A'];
	encryptedID;
	decryptedID;
	pageIsExpired = false;
	allOffers = [];
	allOfferGroups = [];

	mobileRender;

	render()
	{
		if (this.mobileRender)
			return mobileTemple
		return desktopTemplate
	}

	connectedCallback()
	{
		//Determine if device is mobile
		this.mobileRender = (FORM_FACTOR === 'Small' || FORM_FACTOR === 'Medium');
		//console.log('Mobile render from customOfferMainPage: ' + this.mobileRender);
	}

	renderedCallback()
	{
		//remove the last <hr> element
		var hrNodes = this.template.querySelectorAll("hr");
		//if (!this.mobileRender)
		hrNodes[hrNodes.length - 1].remove();
	}

	@wire(CurrentPageReference)
	getStateParameters(currentPageReference)
	{
		if (currentPageReference.state.c__OpportunityIdentifier)
		{
			this.encryptedID = currentPageReference.state.c__OpportunityIdentifier;
			console.log('Encrypted ID:', this.encryptedID);
		}
		else
			console.log('No url parameter found.')
	}

	@wire (getIDFromURL, { urlParam: '$encryptedID' })
	setOpportunityID(result)
	{
		if(result.data)
		{
			this.decryptedID = result.data;
			console.log('Decrypted ID:', this.decryptedID);
			this.pageIsExpired = (result.data === 'expired');
		}
		
		if (result.error)
			console.error(result.error);
	}

	@wire (offers, { OpportunityID: '$decryptedID' })
	offersList(result)
	{
		if (result.data)
			{
				this.allOffers = result.data
				console.log('All Offers:', result.data)
				this.allOfferGroups = Object.entries(this.groupByOffer(result.data)).map(([key, value]) => ({ key, value }))
				console.log('All Offers Grouped:', this.allOfferGroups)
			}
		if (result.error)
			console.error(result.error);
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