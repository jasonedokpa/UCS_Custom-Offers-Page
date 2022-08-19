import { LightningElement, track, wire } from 'lwc';
import getOffers from '@salesforce/apex/customerOpportunity.getOffers';

export default class MainPage extends LightningElement
{
	@track allOffers = []

	@wire (getOffers)
	offersList(result){
		this.allOffers = result.data
		console.log(result.data)
	}
}