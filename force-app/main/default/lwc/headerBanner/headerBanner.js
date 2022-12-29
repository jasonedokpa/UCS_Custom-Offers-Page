import { LightningElement, wire, api } from 'lwc';
import LOGOImg from '@salesforce/resourceUrl/UCSPortalLogo';
import RatingImg from '@salesforce/resourceUrl/UCSPortalRating';

import { CurrentPageReference } from 'lightning/navigation';
import getIDFromURL from '@salesforce/apex/customerOfferPageController.getIDFromURL';
import accDetails from '@salesforce/apex/customerOfferPageController.getAccountDetails';

// import NAME_FIELD from '@salesforce/schema/Opportunity.Account.Name';
// import OWNER_FIELD from '@salesforce/schema/Opportunity.McaApp__Owner_1__r.Name';
// import ADDRESS_FIELD from '@salesforce/schema/Opportunity.Account.BillingAddress';
// import PHONE_FIELD from '@salesforce/schema/Opportunity.Account.Phone';
// import EMAIL_FIELD from '@salesforce/schema/Opportunity.Account.McaApp__Email__c';

export default class HeaderBanner extends LightningElement {

    UCSLogoImg = LOGOImg;
    UCSRating = RatingImg;

    encryptedID;
	@api decryptedID;
	pageIsExpired = true;

	BusinessName;
	OwnerName;
	BusinessAddress1;
	BusinessAddress2
	PhoneNumber;
	Email;
    //const FIELDS = [NAME_FIELD,OWNER_FIELD,ADDRESS_FIELD,PHONE_FIELD,EMAIL_FIELD];

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
			this.pageIsExpired = (result.data === 'expired');
		}
		
		if (result.error)
			console.error(result.error);
	}


	// @wire(getRecord, { recordId: '$decryptedID', fields: [NAME_FIELD,OWNER_FIELD,ADDRESS_FIELD,PHONE_FIELD,EMAIL_FIELD] })
    // opportunityRecord;

    // get name() {
    //     // return this.opportunity.data.fields.Account.Name.value;
	// 	console.log('Name:'+getFieldValue(this.opportunityRecord.data, NAME_FIELD));
	// 	return getFieldValue(this.opportunityRecord.data, NAME_FIELD);
    // }

    // get owner() {
    //     //return this.opportunity.data.fields.McaApp__Owner_1__r.Name.value;
	// 	return getFieldValue(this.opportunityRecord.data, OWNER_FIELD);
    // }

    // get address() {
    //     //return this.opportunity.data.fields.Account.BillingAddress.value;
	// 	return getFieldValue(this.opportunityRecord.data, ADDRESS_FIELD);
    // }

    // get phone() {
    //     //return this.opportunity.data.fields.Account.Phone.value;
	// 	return getFieldValue(this.opportunityRecord.data, PHONE_FIELD);
    // }

    // get email() {
    //     //return this.opportunity.data.fields.Account.McaApp__Email__c.value;
	// 	return getFieldValue(this.opportunityRecord.data, EMAIL_FIELD);
    // }

    @wire (accDetails, { OpportunityID: '$decryptedID'})
    accountDetails(result)
	{
		if (result.data)
			{
				this.allOffers = result.data
				console.log('Account Details', result.data)
				console.log('Account Name ', this.allOffers[0].Account.Name);
				this.BusinessName=this.allOffers[0].Account.Name;
				this.OwnerName=this.allOffers[0].McaApp__Owner_1__r.Name;
				this.BusinessAddress1=this.allOffers[0].Account.BillingAddress.street;
				this.BusinessAddress2 = this.allOffers[0].Account.BillingAddress.city + ', ' + this.allOffers[0].Account.BillingAddress.state + ' ' + this.allOffers[0].Account.BillingAddress.postalCode;
				this.PhoneNumber=this.allOffers[0].Account.Phone;
				this.Email=this.allOffers[0].Account.McaApp__Email__c;
			}
		if (result.error)
			console.error(result.error);
	}  

	//NAME_FIELD,OWNER_FIELD,ADDRESS_FIELD,PHONE_FIELD,EMAIL_FIEL

}