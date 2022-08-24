public with sharing class customerOfferPageController
{
	public customerOfferPageController()
	{
		System.debug('New customerOpportunity object created.');
	}

	@AuraEnabled(cacheable=true)
	public static List<McaApp__Offer__c> getOffers(Id OpportunityID)
	{
		List<McaApp__Offer__c> allOffersOnOpportunity = new List<McaApp__Offer__c>();
			for (Opportunity opportunity : [SELECT Id, Name, (SELECT Name, 
											McaApp__Deal_Type__c, McaApp__Term_Months__c, McaApp__PMT_Schedule__c,
											McaApp__Amount__c, McaApp__Payment_Amt__c, McaApp__Commi__c, 
											McaApp__Commi_per__c, McaApp__Rate__c FROM McaApp__Offers__r) 
											FROM Opportunity WHERE Id = '0067h00000DXuZVAA1'])					//TODO: replace this Id with OpportunityID
				allOffersOnOpportunity = opportunity.McaApp__Offers__r;
	
		return allOffersOnOpportunity;
	}

	@AuraEnabled
	public static String setChosenOffer(Id OfferID)
	{
		Opportunity opportunityToUpdate = new Opportunity();
		opportunityToUpdate.Id = [SELECT McaApp__Opportunity__c FROM McaApp__Offer__c WHERE Id = :OfferID][0].McaApp__Opportunity__c;
		System.debug('OPPORTUNITY ID: ' + opportunityToUpdate.Id);
		opportunityToUpdate.McaApp__Chosen_Offer__c = OfferID;
		System.debug('CHOSEN OFFER: ' + opportunityToUpdate.McaApp__Chosen_Offer__c);
		update opportunityToUpdate;
		return 'Offer selected!';
	}

	@AuraEnabled(cacheable=true)
	public static String encryptID(Id cleanID)
	{
		Blob key = EncodingUtil.base64Decode('1izeWt7Vol6MnUR2mws+xw==');
		Blob data = Blob.valueOf(cleanID);
		return EncodingUtil.base64Encode(Crypto.encryptWithManagedIV('AES128', key, data));
	}

	@AuraEnabled(cacheable=true)
	public static String decryptID(Id dirtyID)
	{
		Blob key = EncodingUtil.base64Decode('1izeWt7Vol6MnUR2mws+xw==');
		Blob encrypted = EncodingUtil.base64Decode(dirtyID);
		return Crypto.decryptWithManagedIV('AES128', key, encrypted).toString();
	}
}
