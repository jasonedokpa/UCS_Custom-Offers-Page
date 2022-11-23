import { LightningElement,wire,api } from 'lwc';
import GOOGLEImg from '@salesforce/resourceUrl/UCSPortalGoogleIcon';
import IncImg from '@salesforce/resourceUrl/UCSPortalIncIcon';
import BBBIcon from '@salesforce/resourceUrl/UCSPortalBBBIcon';
import getIDFromURL from '@salesforce/apex/customerOfferPageController.getIDFromURL';
import { CurrentPageReference } from 'lightning/navigation';
export default class FooterBanner extends LightningElement {
    UCSGOOGLEImg = GOOGLEImg;
    UCSIncImg = IncImg;
    UCSBBBImg = BBBIcon;

	encryptedID;
    @api decryptedID;
    pageIsExpired = false;

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
}