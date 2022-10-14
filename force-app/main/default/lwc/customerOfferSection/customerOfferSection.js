import { LightningElement, api } from 'lwc';
import ICONS from '@salesforce/resourceUrl/UCS_static_images'

export default class OfferTypeSection extends LightningElement 
{
	@api offerList = [{Id: "null", "McaApp__Term_Months__c": "[Term_In_Months]", "Closing_Documents__c": ""}];
	@api groupName = "[DEAL TYPE]";
	@api mobileRender;
	groupIcon;

	connectedCallback()
	{
		console.log('Mobile render from customOfferSection: ' + this.mobileRender);
		
		//choose icon based for deal type group
		switch (this.groupName)
		{
			case 'Asset Based Line':
				this.groupIcon = ICONS + '/icons/Revenue-Based-Business-Loan.png';
				break;

			case 'Bank Loan':
				this.groupIcon = ICONS + '/icons/Revenue-Based-Business-Loan.png';
				break;
				
			case 'Cash Advance':
				this.groupIcon = ICONS + '/icons/Merchant-Cash-Advance.png';
				this.groupName = 'Merchant Cash Advances'
				break;

			case 'Credit Repair':
				this.groupIcon = ICONS + '/icons/Business-Term-Loan.pngg ';
				break;
			
			case 'Equipment Financing':
				this.groupIcon = ICONS + '/icons/Equipment-Financing.png';
				break;

			case 'Factoring':
				this.groupIcon = ICONS + '/icons/Receivables_Invoice-Factoring.png';
				break;
			
			case 'Line of Credit':
				this.groupIcon = ICONS + '/icons/Business-Line-of-Credit.png';
				this.groupName = 'Business Line of Credit'
				break;

			case 'SBA':
				this.groupIcon = ICONS + '/icons/SBA-Loan.png';
				break;

			default:
				this.groupIcon = ICONS + '/icons/SBA-Loan.png';
		}
	}
}