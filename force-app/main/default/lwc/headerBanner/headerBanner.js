import { LightningElement } from 'lwc';
import LOGOImg from '@salesforce/resourceUrl/UCSPortalLogo';
import RatingImg from '@salesforce/resourceUrl/UCSPortalRating';
import PhoneIcon from '@salesforce/resourceUrl/UCSPortalPhoneIcon';

export default class HeaderBanner extends LightningElement {
    UCSLogoImg = LOGOImg;
    UCSRating = RatingImg;
    UCSPhoneIcon = PhoneIcon;
}