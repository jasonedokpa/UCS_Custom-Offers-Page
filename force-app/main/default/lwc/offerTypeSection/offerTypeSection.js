import { LightningElement, api } from 'lwc';

export default class OfferTypeSection extends LightningElement 
{
	@api offerList = [{Id: "0"}];
	@api groupName = "[DEAL TYPE]";
}