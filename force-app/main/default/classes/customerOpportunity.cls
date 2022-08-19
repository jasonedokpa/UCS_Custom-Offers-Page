public with sharing class customerOpportunity
{
	public customerOpportunity()
	{
		System.debug('New customerOpportunity object created.');
	}

	@AuraEnabled(cacheable=true)
	public static List<McaApp__Offer__c> getOffers(Id OpportunityID)
	{
		List<McaApp__Offer__c> offersList = new List<McaApp__Offer__c>();
			for (Opportunity opportunity : [SELECT Id, Name, (SELECT Name, McaApp__Deal_Type__c, McaApp__Amount__c, McaApp__Payment_Amt__c, McaApp__Commi__c, McaApp__Commi_per__c, McaApp__Rate__c FROM McaApp__Offers__r) FROM Opportunity WHERE Id = '0067h00000DXuZVAA1'])
			{
				offersList = opportunity.McaApp__Offers__r;
			}

		return offersList;
	}

	@AuraEnabled(cacheable=true)
	public static void getOffer(Id OfferID)
	{
		System.debug('filler');
	}

	@AuraEnabled(cacheable=true)
	public static String testJavaScriptImport()
	{
		return 'Hello ';
	}
	
}