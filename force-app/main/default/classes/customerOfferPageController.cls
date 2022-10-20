public without sharing class customerOfferPageController
{
	public customerOfferPageController()
	{
		System.debug('New customerOpportunity object created.');
	}

	@AuraEnabled(cacheable=true)
	public static List<McaApp__Offer__c> getOffers(Id OpportunityID)
	{
		List<McaApp__Offer__c> allOffersOnOpportunity = new List<McaApp__Offer__c>();
		for (Opportunity opportunity : [SELECT Id, Name, (SELECT Name, Closing_Documents__c,
										McaApp__Deal_Type__c, McaApp__Term_Months__c, 
										McaApp__PMT_Schedule__c, McaApp__Amount__c, 
										Min_Funding_Amount__c, Max_Funding_Amount__c, 
										McaApp__Payment_Amt__c, McaApp__Commi__c, 
										McaApp__Opportunity__c, McaApp__Payback_Amt__c,
										McaApp__Commi_per__c, McaApp__Rate__c, Offer_Selected__c FROM McaApp__Offers__r)
										FROM Opportunity WHERE Id = :OpportunityID])					//TODO: replace this Id with OpportunityID
			allOffersOnOpportunity = opportunity.McaApp__Offers__r;
	
		return allOffersOnOpportunity;
	}

	@AuraEnabled
	public static String setChosenOffer(Id OfferID, Decimal newFundingAmount)
	{
		//update "Chosen Offer" on Opportunity 
		Opportunity opportunityToUpdate = new Opportunity();
		opportunityToUpdate.Id = [SELECT McaApp__Opportunity__c FROM McaApp__Offer__c WHERE Id = :OfferID][0].McaApp__Opportunity__c;
		System.debug('OPPORTUNITY ID: ' + opportunityToUpdate.Id);
		
		string opptyExistingOffer = [SELECT Id, McaApp__Chosen_Offer__c,Chosen_Offer_2__c FROM Opportunity where Id =: opportunityToUpdate.Id][0].McaApp__Chosen_Offer__c;
		if(opptyExistingOffer == '' || opptyExistingOffer == null)
			opportunityToUpdate.McaApp__Chosen_Offer__c = OfferID;
		else
			opportunityToUpdate.Chosen_Offer_2__c = OfferID;

		System.debug('CHOSEN OFFER: ' + opportunityToUpdate.McaApp__Chosen_Offer__c);
		update opportunityToUpdate;

		//update "Funding Amount" on Offer
		McaApp__Offer__c offerToUpdate = new McaApp__Offer__c();
		offerToUpdate.Id = OfferID;
		System.debug('OFFER ID: ' + offerToUpdate.Id);
		offerToUpdate.McaApp__Amount__c = newFundingAmount;
		System.debug('FUNDING AMOUNT: ' + newFundingAmount);
		update offerToUpdate;

		return 'Offer selected!';
	}

	@AuraEnabled
	public static String removeChosenOffer(Id OfferID)
	{
		//remove "Chosen Offer" on Opportunity 
		Opportunity opportunityToUpdate = new Opportunity();
		opportunityToUpdate.Id = [SELECT McaApp__Opportunity__c FROM McaApp__Offer__c WHERE Id = :OfferID][0].McaApp__Opportunity__c;
		System.debug('OPPORTUNITY ID: ' + opportunityToUpdate.Id);
		
		Id newOfferId = null;
		Opportunity opptyExistingOffer = new Opportunity();
		opptyExistingOffer = [SELECT Id, McaApp__Chosen_Offer__c,Chosen_Offer_2__c FROM Opportunity where Id =: opportunityToUpdate.Id][0];
		if(opptyExistingOffer.McaApp__Chosen_Offer__c == OfferID)
			opportunityToUpdate.McaApp__Chosen_Offer__c = newOfferId;
		else if(opptyExistingOffer.Chosen_Offer_2__c == OfferID)
			opportunityToUpdate.Chosen_Offer_2__c = newOfferId;

		System.debug('REMOVED OFFER: ' + opportunityToUpdate);
		update opportunityToUpdate;

		//update "Funding Amount" on Offer
		// McaApp__Offer__c offerToUpdate = new McaApp__Offer__c();
		// offerToUpdate.Id = OfferID;
		// System.debug('OFFER ID: ' + offerToUpdate.Id);
		// offerToUpdate.McaApp__Amount__c = 0;
		// update offerToUpdate;

		return 'Offer removed!';
	}

	//Generate a URL with an expiration date
	@AuraEnabled
	public static String generateURL(String opportunityID)
	{
		return encryptID(opportunityID + ';' + System.now().addDays(7));
	}

	//return OpportunityID to Main Page if link is not expired
	@AuraEnabled(cacheable=true)
	public static String getIDFromURL(String urlParam)
	{
		List<String> oppIDwithExpDate = decryptID(urlParam).split(';');
		if (System.now() < Datetime.valueOf(oppIDwithExpDate[1]))
			return oppIDwithExpDate[0];
		else
			return 'expired';
	}

	//obfuscate ID so that customer may not access other records
	public static String encryptID(String cleanID)
	{
		Blob key = EncodingUtil.base64Decode('1izeWt7Vol6MnUR2mws+xw==');
		Blob data = Blob.valueOf(cleanID);
		return EncodingUtil.base64Encode(Crypto.encryptWithManagedIV('AES128', key, data));
	}

	//de-obfuscate ID so that Main Page can get Offer records
	public static String decryptID(String dirtyID)
	{
		Blob key = EncodingUtil.base64Decode('1izeWt7Vol6MnUR2mws+xw==');
		Blob encrypted = EncodingUtil.base64Decode(dirtyID);
		return Crypto.decryptWithManagedIV('AES128', key, encrypted).toString();
	}
	
	//Generate a URL for Opportunity email
	Public class InputWrapper{
        @InvocableVariable public String OpportunityId;
        
        public InputWrapper(){
            this.OpportunityId = OpportunityId;
        }
    }
    
    @InvocableMethod(label='Get Oppty URL')
	public static List<OutputWrapper> generateFlowURL(List<InputWrapper> inputData)
	{
        Id OpportunityId;

		InputWrapper iw = new InputWrapper();
        iw = inputData[0];
        OpportunityId = iw.OpportunityId;
        string OpptyURL = encryptID(opportunityID + ';' + System.now().addDays(7));
        List<OutputWrapper> owList = new List<OutputWrapper>();
        OutputWrapper ow = new OutputWrapper();
       	ow.OutputURL = OpptyURL.replace('+', '%2b');
        owList.add(ow);
        return owList;
	}
    
    public class OutputWrapper{
        @InvocableVariable public String OutputURL;
        
        public OutputWrapper(){
            this.OutputURL = OutputURL;
        }
    }

	//Method to retrieve Customer Details for the header banner
	@AuraEnabled(cacheable=true)
	public static List<Opportunity> getAccountDetails(Id OpportunityID)
	{
		List<Opportunity> customerOpportunity = new List<Opportunity>();
		customerOpportunity = [select id,Account.Name, McaApp__Owner_1__r.Name, Account.BillingAddress, Account.Phone, Account.McaApp__Email__c from Opportunity WHERE Id = :OpportunityID];
		return customerOpportunity;
	}
}