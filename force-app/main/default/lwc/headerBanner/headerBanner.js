import { LightningElement, wire, api } from 'lwc';
import LOGOImg from '@salesforce/resourceUrl/UCSPortalLogo';
import RatingImg from '@salesforce/resourceUrl/UCSPortalRating';
import PhoneIcon from '@salesforce/resourceUrl/UCSPortalPhoneIcon';

import { CurrentPageReference } from 'lightning/navigation';
import getIDFromURL from '@salesforce/apex/customerOfferPageController.getIDFromURL';
import { getRecord } from 'lightning/uiRecordApi';

import NAME_FIELD from '@salesforce/schema/Opportunity.Account.Name';
//import OWNER_FIELD from '@salesforce/schema/Opportunity.McaApp__Owner_1__r.Name';
import ADDRESS_FIELD from '@salesforce/schema/Opportunity.Account.BillingAddress';
import PHONE_FIELD from '@salesforce/schema/Opportunity.Account.Phone';
//import EMAIL_FIELD from '@salesforce/schema/Opportunity.Account.McaApp__Email__c';

export default class HeaderBanner extends LightningElement {

    UCSLogoImg = LOGOImg;
    UCSRating = RatingImg;
    UCSPhoneIcon = PhoneIcon;

    encryptedID;
	decryptedID;
	pageIsExpired = false;

    // const FIELDS = [
    //     'Opportunity.Account.Name',
    //     'Opportunity.McaApp__Owner_1__r.Name',
    //     'Opportunity.Account.BillingAddress',
    //     'Opportunity.Account.Phone',
    //     'Opportunity.Account.McaApp__Email__c',
    // ];

	@wire(CurrentPageReference)
	getStateParameters(currentPageReference)
	{
		if (currentPageReference.state.c__OpportunityIdentifier)
		{
			this.encryptedID = currentPageReference.state.c__OpportunityIdentifier;
			console.log(this.encryptedID);
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
			console.log(this.decryptedID);
			this.pageIsExpired = (result.data === 'expired' ? true : false);
		}
		
		if (result.error)
			console.error(result.error);
	}

    //@wire (accDetails, { OpportunityID: '$decryptedID', fields: FIELDS})
    // accountDetails(result)
	// {
	// 	if (result.data)
	// 		{
	// 			this.allOffers = result.data
	// 			console.log('result.data ', result.data)
	// 			this.allOfferGroups = Object.entries(this.groupByOffer(result.data)).map(([key, value]) => ({ key, value }))
	// 			console.log('this.allOfferGroups ', this.allOfferGroups)
	// 		}
	// 	if (result.error)
	// 		console.error(result.error);
	// }  

	//NAME_FIELD,OWNER_FIELD,ADDRESS_FIELD,PHONE_FIELD,EMAIL_FIEL
    @wire(getRecord, { recordId: '$decryptedID', fields: [NAME_FIELD] })
    Opportunity;

    get name() {
        // return this.opportunity.data.fields.Account.Name.value;
		return getFieldValue(this.Opportunity.data, NAME_FIELD);
    }

    // get owner() {
    //     //return this.opportunity.data.fields.McaApp__Owner_1__r.Name.value;
	// 	return getFieldValue(this.Opportunity.data, OWNER_FIELD);
    // }

    get address() {
        //return this.opportunity.data.fields.Account.BillingAddress.value;
		return getFieldValue(this.Opportunity.data, ADDRESS_FIELD);
    }

    get phone() {
        //return this.opportunity.data.fields.Account.Phone.value;
		return getFieldValue(this.Opportunity.data, PHONE_FIELD);
    }

    get email() {
        //return this.opportunity.data.fields.Account.McaApp__Email__c.value;
		return getFieldValue(this.Opportunity.data, EMAIL_FIELD);
    }
}