import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import setChosenOffer from '@salesforce/apex/customerOfferPageController.setChosenOffer';
import unSetChosenOffer from '@salesforce/apex/customerOfferPageController.removeChosenOffer';


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
	termInMonths;
	pmtSchedule;
	paymentAmt;
	prepayOptions;
	closingDocumentsRequired;

	selectOffer;
	unselectOffer;
	Page=[];

	connectedCallback()
	{
		if (this.offerObject)
		{
			console.log('this.offerObject ', this.offerObject);

			this.opportunityID = this.offerObject.McaApp__Opportunity__c;
			this.minFundingAmt = this.offerObject.Min_Funding_Amount__c;
			this.maxFundingAmt = this.offerObject.Max_Funding_Amount__c;
			this.minFundingAmtLabel = this.offerObject.Min_Funding_Amount__c ? this.offerObject.Min_Funding_Amount__c.toLocaleString("en-US") : undefined;
			this.maxFundingAmtLabel = this.offerObject.Max_Funding_Amount__c ? this.offerObject.Max_Funding_Amount__c.toLocaleString("en-US") : undefined;
			this.fundingAmt = this.offerObject.McaApp__Amount__c;
			this.fundingAmtLabel = this.fundingAmt ? this.fundingAmt.toLocaleString("en-US") : undefined;
			this.paybackAmt = this.offerObject.McaApp__Payback_Amt__c ? this.offerObject.McaApp__Payback_Amt__c.toLocaleString("en-US") : undefined;
			this.termInMonths = this.offerObject.McaApp__Term_Months__c;
			this.pmtSchedule = this.offerObject.McaApp__PMT_Schedule__c;
			this.paymentAmt = this.offerObject.McaApp__Payment_Amt__c ? this.offerObject.McaApp__Payment_Amt__c.toLocaleString("en-US") : undefined;
			this.closingDocumentsRequired = this.picklistToArray(this.offerObject.Closing_Documents__c);

			if(this.offerObject.Offer_Selected__c === 'uncheck'){
				this.selectOffer = false;
				this.unselectOffer = true;
			}
			else if(this.offerObject.Offer_Selected__c === 'hide'){
				this.selectOffer = false;
				this.unselectOffer = false;
			}
			else if(this.offerObject.Offer_Selected__c === 'show'){
				this.selectOffer = true;
				this.unselectOffer = false;
			}

		}

	}
	
	changeFundingAmt(event)
	{
		this.fundingAmt = event.target.value;
		this.fundingAmtLabel = parseInt(this.fundingAmt, 10).toLocaleString("en-US");
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
		setChosenOffer({OfferID: this.offerObject.Id, newFundingAmount: this.fundingAmt
		}).then(response => {
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
		unSetChosenOffer({OfferID: this.offerObject.Id
		}).then(response => {
			console.log(response);
			window.location.reload();
			}).catch(err => {
				console.error(err)
				})
		
	}	
}