import {LightningElement,api,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadFiles from '@salesforce/apex/FileUploaderClass.uploadFiles'
import deleteFiles from '@salesforce/apex/FileUploaderClass.deleteFiles'
import { loadStyle } from 'lightning/platformResourceLoader';
import fileSelectorStyle from '@salesforce/resourceUrl/fileSelectorStyle';
import FORM_FACTOR from '@salesforce/client/formFactor'
const MAX_FILE_SIZE = 2097152;

export default class CustomFileUpload extends LightningElement {
    @api recordId;
    @track filesData = [];
    @track filesData1=[];
    showFileNames=false;
    @api mobileRender;
    showSpinner = false;
    
    handleFileUploaded(event) {
        if (event.target.files.length > 0) {
            for(var i=0; i< event.target.files.length; i++){
                if (event.target.files[i].size > MAX_FILE_SIZE) {
                    this.showToast('Error!', 'error', 'File size exceeded the upload size limit.');
                    return;
                }
                let file = event.target.files[i];
                let reader = new FileReader();
                reader.onload = e => {
                    var fileContents = reader.result.split(',')[1]
                    this.filesData.push({'fileName':file.name, 'fileContent':fileContents});
                };
                reader.readAsDataURL(file);
            }
        }
    }
    connectedCallback()
    {
        Promise.all([
            loadStyle(this, fileSelectorStyle)
        ]);
        this.mobileRender = (FORM_FACTOR === 'Small' || FORM_FACTOR === 'Medium');
        console.log('21');
    }
    renderedCallback()
    {
        if(this.mobileRender==true){
            console.log('12');
            this.template.querySelector('div.uploadbutton').classList.add('slds-text-align_center');
        }
    }
    uploadFiles()
    {
        if(this.filesData === [] || this.filesData.length === 0) {
            this.showToast('Error', 'error', 'Please select files first'); return;
        }
        this.showSpinner = true;
        uploadFiles({
            recordId : this.recordId,
            filedata : JSON.stringify(this.filesData)
        })
        .then(result => {
            console.log(result);
            if(result && result === 'success') {
                this.filesData = [];
                this.showToast('Success', 'success', 'Files Uploaded successfully.');
            } else {
                this.showToast('Error', 'error', result);
            }
        }).catch(error => {
            if(error && error.body && error.body.message) {
                this.showToast('Error', 'error', error.body.message);
            }
        }).finally(() => this.showSpinner = false );
    }
 
    removeReceiptImage(event) {
        var index = event.currentTarget.dataset.id;
        console.log(event.currentTarget.dataset.item);
        deleteFiles({sdocumentId : event.currentTarget.dataset.item}).then(result => {
            console.log(result);
            if(result && result === 'success') {
                this.filesData1.splice(index, 1);
            } else {
                this.showToast('Error', 'error', result);
            }
        }).catch(error => {
            if(error && error.body && error.body.message) {
                this.showToast('Error', 'error', error.body.message);
            }
        })
    }
 
    showToast(title, variant, message) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                variant: variant,
                message: message,
            })
        );
    }

    get acceptedFormats() {
        return ['.xlsx, .xls, .csv, .png, .doc, .docx, .pdf'];
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        console.log(event.detail.files);
        // Get the list of uploaded files
        for(var i=0; i< uploadedFiles.length; i++){
            this.showFileNames = true;
            let fileDetails = {};
            console.log('uploadedFiles[0].name',uploadedFiles[i].name);
            fileDetails.Name = uploadedFiles[i].name;
            console.log('uploadedFiles[0].documentId',uploadedFiles[i].documentId);
            fileDetails.documentId = uploadedFiles[i].documentId;
            fileDetails.Number = i;
            this.filesData1[i] = fileDetails;
        }
        
        console.log('filesData1 ', this.filesData1);
    }
}