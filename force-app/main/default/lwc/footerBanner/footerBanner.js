import { LightningElement } from 'lwc';
import GOOGLEImg from '@salesforce/resourceUrl/UCSPortalGoogleIcon';
import IncImg from '@salesforce/resourceUrl/UCSPortalIncIcon';
import BBBIcon from '@salesforce/resourceUrl/UCSPortalBBBIcon';

export default class FooterBanner extends LightningElement {
    UCSGOOGLEImg = GOOGLEImg;
    UCSIncImg = IncImg;
    UCSBBBImg = BBBIcon;
}