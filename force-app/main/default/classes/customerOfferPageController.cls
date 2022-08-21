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
											FROM Opportunity WHERE Id = '0067h00000DXuZVAA1'])
				allOffersOnOpportunity = opportunity.McaApp__Offers__r;
	
		return allOffersOnOpportunity;
	}

	@AuraEnabled(cacheable=true)
	public static void setChosenOffer(Id OfferID)
	{
		Opportunity opportunityToUpdate = new Opportunity();
		opportunityToUpdate.Id = [SELECT McaApp__Offer__c.McaApp__Opportunity__c FROM McaApp__Offer__c WHERE Id = 'a0D7h000007CdwCEAS'][0].Id;
		opportunityToUpdate.McaApp__Chosen_Offer__c = 'a0D7h000007CdwCEAS';
	}
}
