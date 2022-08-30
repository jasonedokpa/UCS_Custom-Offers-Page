import { LightningElement, api } from 'lwc';

export default class OfferTypeSection extends LightningElement 
{
	@api offerList = [{Id: "null", "McaApp__Term_Months__c": "[Term_In_Months]", "Closing_Documents__c": ""}];
	@api groupName = "[DEAL TYPE]";
}
