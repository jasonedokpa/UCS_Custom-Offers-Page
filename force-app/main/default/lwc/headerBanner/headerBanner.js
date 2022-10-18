import { LightningElement } from 'lwc';
import LOGOImg from '@salesforce/resourceUrl/UCSPortalLogo';
import RatingImg from '@salesforce/resourceUrl/UCSPortalRating';
import PhoneIcon from '@salesforce/resourceUrl/UCSPortalPhoneIcon';
// import backgroundUrl from '@salesforce/resourceUrl/UCSDesktopBG';
// import backgroundUrlMob from '@salesforce/resourceUrl/UCSMobileBG';

export default class HeaderBanner extends LightningElement {
    UCSLogoImg = LOGOImg;
    UCSRating = RatingImg;
    UCSPhoneIcon = PhoneIcon;

    // get backgroundStyle() {
    //     return `height:50rem;background-image:url(${backgroundUrl})`;
    // }
}