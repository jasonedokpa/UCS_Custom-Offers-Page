import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import setChosenOffer from '@salesforce/apex/customerOfferPageController.setChosenOffer';

export default class CustomerOfferCard extends LightningElement 
{
	@api offerObject = {"Id": "null", "McaApp__Term_Months__c": "[Term_In_Months]", "Closing_Documents__c": ""};

	@track isShowModal = false;

	opportunityID;
	minFundingAmt;
	maxFundingAmt;
	fundingAmt;
	paybackAmt;
	termInMonths;
	pmtSchedule;
	paymentAmt;
	prepayOptions;
	closingDocumentsRequired;

	connectedCallback()
	{
		if (this.offerObject)
		{
			this.opportunityID = this.offerObject.McaApp__Opportunity__c;
			this.minFundingAmt = this.offerObject.Min_Funding_Amount__c;
			this.maxFundingAmt = this.offerObject.Max_Funding_Amount__c;
			this.fundingAmt = this.offerObject.McaApp__Amount__c;
			this.paybackAmt = this.offerObject.McaApp__Payment_Amt__c;
			this.termInMonths = this.offerObject.McaApp__Term_Months__c;
			this.pmtSchedule = this.offerObject.McaApp__PMT_Schedule__c;
			this.paymentAmt = this.offerObject.McaApp__Payment_Amt__c;
			this.closingDocumentsRequired = this.picklistToArray(this.offerObject.Closing_Documents__c);
		}
	}

	changeFundingAmt(event)
	{
		this.fundingAmt = event.target.value;
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
			}).catch(err => {
				console.error(err)
				})
	}
}