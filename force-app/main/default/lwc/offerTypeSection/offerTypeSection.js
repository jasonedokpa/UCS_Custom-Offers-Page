import { LightningElement, api } from 'lwc';

export default class OfferTypeSection extends LightningElement 
{
	@api offerList = [];
	@api groupName;
}