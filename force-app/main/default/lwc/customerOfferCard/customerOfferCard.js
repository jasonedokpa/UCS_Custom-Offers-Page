import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import setChosenOffer from '@salesforce/apex/customerOfferPageController.setChosenOffer';
import unSetChosenOffer from '@salesforce/apex/customerOfferPageController.removeChosenOffer';
import mobileTemplate from './mobileTemplate.html'
import desktopTemplate from './customerOfferCard.html'


export default class CustomerOfferCard extends LightningElement
{
	@api offerObject = {"Id": "null", "McaApp__Term_Months__c": "[Term_In_Months]", "Closing_Documents__c": ""};

	@track isShowModal = false;

	opportunityID;
	minFundingAmt;
	minFundingAmtLabel;
	maxFundingAmt;
	maxFundingAmtLabel;
	fundingAmt;
	fundingAmtLabel;
	paybackAmt;
	paybackAmtLabel;
	termInMonths;
	pmtSchedule;
	paymentAmt;
	paymentAmtLabel;
	prepayOptions;
	closingDocuments;
	Rate;
	NumofPayment;
	selectOffer;
	currentlySelectingOffer;
	unselectOffer;
	currentlyDeselectingOffer;
	hideSelectOffer;
	documentsExist;
	isCashAdvance;
	isEquipmentFincancing;

	@api mobileRender;

	render()
	{
		//console.log('Mobile render from customerOfferCard: ' + (this.mobileRender == true));

		if (this.mobileRender == true)
			return mobileTemplate
		return desktopTemplate
	}

	connectedCallback()
	{
		//ALERT!
		//PLEASE DO NOT add .toLocalString() where not appropriate.
		//Read up on JavaScript documentation if confused about what a method does.
		if (this.offerObject)
		{
			this.opportunityID = this.offerObject.McaApp__Opportunity__c;
			this.minFundingAmt = this.offerObject.Min_Funding_Amount__c;
			this.minFundingAmtLabel = this.offerObject.Min_Funding_Amount__c ? this.offerObject.Min_Funding_Amount__c.toLocaleString("en-US") : undefined;
			this.maxFundingAmt = this.offerObject.Max_Funding_Amount__c;
			this.maxFundingAmtLabel = this.offerObject.Max_Funding_Amount__c ? this.offerObject.Max_Funding_Amount__c.toLocaleString("en-US") : undefined;
			this.fundingAmt = this.offerObject.McaApp__Amount__c;
			this.fundingAmtLabel = this.fundingAmt ? this.fundingAmt.toLocaleString("en-US") : undefined;
			this.paybackAmt = this.offerObject.McaApp__Payback_Amt__c;
			this.paybackAmtLabel = this.paybackAmt ? parseInt(this.paybackAmt).toLocaleString("en-US") : undefined;
			this.termInMonths = this.offerObject.McaApp__Term_Months__c;
			this.pmtSchedule = this.offerObject.McaApp__PMT_Schedule__c;
			this.paymentAmt = parseFloat(Number(this.offerObject.McaApp__Payment_Amt__c).toFixed(2));
			this.prepayOptions = this.offerObject.Prepay_Discounts__c ? this.offerObject.Prepay_Discounts__c : 'None';
			this.paymentAmtLabel = this.paymentAmt ? this.paymentAmt.toLocaleString("en-US", { style: "currency", currency: "USD" }) : undefined;
			this.closingDocuments = this.offerObject.Closing_Documents__c ? this.picklistToArray( this.offerObject.Closing_Documents__c) : '';
			this.documentsExist = !!this.closingDocuments;
			this.Rate = this.offerObject.McaApp__Rate__c ? this.offerObject.McaApp__Rate__c: undefined;
			this.NumofPayment = this.offerObject.of_Payments__c ? this.offerObject.of_Payments__c : undefined;
			this.isCashAdvance = this.offerObject.McaApp__Deal_Type__c === "Cash Advance";
			this.isEquipmentFincancing = this.offerObject.McaApp__Deal_Type__c === "Equipment Financing";

			if(this.offerObject.Offer_Selected__c === 'uncheck')
			{
				this.selectOffer = false;
				this.unselectOffer = true;
			}
			else if(this.offerObject.Offer_Selected__c === 'hide')
			{
				this.selectOffer = false;
				this.unselectOffer = false;
			}
			else if(this.offerObject.Offer_Selected__c === 'show')
			{
				this.selectOffer = true;
				this.unselectOffer = false;
			}

			this.hideSelectOffer = (this.offerObject.Offer_Selected__c === 'hide');

		}

	}
	
	changeFundingAmt(event)
	{
		this.fundingAmt = event.target.value;
		this.fundingAmtLabel = parseInt(this.fundingAmt).toLocaleString("en-US");
		this.paybackAmt = Number((this.fundingAmt * this.Rate).toFixed(2));
		this.paybackAmtLabel = parseInt(this.paybackAmt).toLocaleString("en-US");
		this.paymentAmt = parseFloat((this.paybackAmt / this.NumofPayment).toFixed(2));
		this.paymentAmtLabel = this.paymentAmt.toLocaleString("en-US", { style: "currency", currency: "USD" });
	}

	showModalBox()
	{
		this.isShowModal = true;
		console.log(this.opportunityID);
	}

	hideModalBox()
	{
		this.isShowModal = false;
	}

	picklistToArray(picklistString)
	{
		return picklistString.split(";");
	}

	get acceptedFormats() 
	{
		return ['.pdf', '.docx', '.png'];
	}

	handleUploadFinished(event)
	{
		// Get the number of uploaded files
		const uploadedFiles = event.detail.files.length;
		// Create and dispatch a ShowToastEvent event with title, message and variant
		const evt = new ShowToastEvent({
		title: 'SUCCESS',
		message: uploadedFiles + ' File(s) uploaded successfully',
		variant: 'success',
		});
		this.dispatchEvent(evt);  
    }

	selectThisOffer()
	{
		console.log("CLICKED ON:", this.offerObject.Name + " offer");
		console.log("Funding Amount:", this.fundingAmt);
		this.currentlySelectingOffer = true;
		setChosenOffer({OfferID: this.offerObject.Id, newFundingAmount: this.fundingAmt, newPaymentAmount: this.paymentAmt
		}).then(response => {
			this.currentlySelectingOffer = false;
			this.hideModalBox();
			console.log(response);
			window.location.reload();
			}).catch(err => {
				console.error(err)
				})
		
	}

	deSelectThisOffer()
	{
		console.log("CLICKED ON:", this.offerObject.Name + " offer");
		console.log("Funding Amount:", this.fundingAmt);
		this.currentlyDeselectingOffer = true;
		unSetChosenOffer({OfferID: this.offerObject.Id
		}).then(response => {
			this.currentlyDeselectingOffer = false;
			console.log(response);
			window.location.reload();
			}).catch(err => {
				console.error(err)
				})
		
	}
}