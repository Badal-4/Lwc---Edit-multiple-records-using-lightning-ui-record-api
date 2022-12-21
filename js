import { LightningElement, api, wire } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class MyLWC extends LightningElement {
  @api recordId;
  @api objectApiName;

  @wire(getAccounts)
  accounts;

  handleSave() {
    // Update the account industry to 'Software'
    const fields = { Industry: 'Software' };

    // Create an array to store the update promises
    const updates = [];

    // Iterate over the accounts and update each one
    this.accounts.data.forEach(account => {
      updates.push(updateRecord({ fields, recordId: account.Id }));
    });

    // Wait for all updates to complete
    Promise.all(updates)
      .then(() => {
        // Refresh the Apex data to reflect the updates
        return refreshApex(this.accounts);
      })
      .catch(error => {
        console.error('Error updating records', error);
      });
  }
}

