let net = 'wss://s.altnet.rippletest.net:51233';
console.log(net);

let my_wallet;

 /* TODO:Connect and return client
 * Connect to a server(=node) and return client
 * hint: check the 'connect' resource
 */
async function xrplConnect()
{
 
}

/*
* is being called when "Create Account" is clicked
*/
async function getCampusAccount()
{    
  //TODO:create a new connected client by using xrplConnect()

  // Start button spinner
  buttonSpin('account-create', 'on'); 

  /*TODO:create and fund a wallet on the testnet and print out credentials and balance
  * hint: check 'fundWallet' resource; fundWallet() is a client method
  */

  // Stop button spinner
  buttonSpin('account-create', 'off');   
  // Reveal the hidden fields
  revealFields('collapseCreate');      

  //TODO: Fill in and remove comments
  document.getElementById('classicAddress').value = '';
  document.getElementById('publicKey').value = '';
  document.getElementById('privateKey').value = '';
  document.getElementById('seed').value = '';

  /*TODO: Disconnect the client
  * hint: check 'disconnect' resource; disconnect() is a client method
  */
}

/*
* TODO: check your wallet details in Bithomp-Explorer 
*/

async function mintNFT()
{
  //TODO:create a new connected client by using xrplConnect()

  // Start button spinner
  buttonSpin('mint-nft', 'on');   

  // Get the IPFS hash
  let nftURIField = document.getElementById('nftTokenURL');
  if ( nftURIField.value.length == 0 ) {
    // Use this image as the default
    nftURIField.value = 'ipfs://QmXSidVfGe24KazE9nWQHm3Y51g82jXnKajcEYdFLCpaCS';
  }        

  // Get the transfer fee/royalty 0-50%; 1000 = 1%
  let transferFeeField = document.getElementById('transferFee');    
  if ( transferFeeField.value.length == 0 ) {
    transferFeeField.value = 0;
  }

  /*TODO: create a Transaction blob(= transaction object) for minting a token
  * hint: check the 'NFTokenMint' resource
  */
  
  /*TODO: Send transaction and get the transaction results
   * hint: use 'submitAndWait' resource
  */

  /*TODO: Query the NFTs for the account
  * hint: use the resource 'AccountNFTsRequest'
  */
   
  // Stop button spinner
  buttonSpin('mint-nft', 'off');    
  // Reveal the hidden fields
  revealFields('collapseNFTokenID');    

  //TODO: Console log the NFTs for the account
  
  //TODO: Fill in these fields with the results
  document.getElementById('nftTokenID').value = '';
  document.getElementById('sellNFTokenID').value = '';
  
  /*TODO: Disconnect the client
  * hint: check 'disconnect' resource; disconnect() is a client method
  */
}        

/*
* TODO: lets go to bithomp to check our account for the NFT
*/

async function createSellOffer() {
  //TODO: const client = await xrplConnect();      
  let tokenID = document.getElementById('sellNFTokenID').value;
  
  // Start button spinner
  buttonSpin('create-sell-offer', 'on');     
  
  // Get the amount of the sell offer
  let offerAmountField = document.getElementById('offerAmount');    
  if ( offerAmountField.value.length == 0 ) {
    offerAmountField.value = 50000000;
  }                

  //TODO: Transaction blob for creating a sell offer

  //TODO: Send transaction and get the transaction results

  // Stop button spinner
  buttonSpin('create-sell-offer', 'off');    
  // Reveal the hidden fields
  revealFields('collapseNFTOfferIndex');       

  //TODO: Get the sell offeres for the account
  //TODO: Catch the case if there are no sell offers

  //TODO: Console log the sell offers for the account

  //TODO: Fill in the field with the offer index         

  //TODO: Disconnect
}

async function acceptSellOffer() {
  //TODO: const client = await xrplConnect();   

  // Start button spinner
  buttonSpin('accept-sell-offer', 'on'); 
  
  // Check the offer index field
  let acceptIndex = document.getElementById('acceptIndex');    
  if ( acceptIndex.value.length == 0 ) {
    alert("You must enter an NFT Offer Index");
    buttonSpin('accept-sell-offer', 'off');
    return;
  }                

  //TODO: Transaction blob for accepting an offer
  
  //TODO: Send transaction and get the transaction results
  //TODO: Get the NFTs for the account
  
  // Stop button spinner  
  buttonSpin('accept-sell-offer', 'off');           
  
  //TODO: Console log the transaction result
  //TODO: Console log the balance changes

  //TODO: Disconnect
}

function buttonSpin(button, flag) {
  // Start spinner
  if ( flag == 'on' ) {          
    document.getElementById(button + '-button-text').style.display = 'none';
    document.getElementById(button + '-spinner').style.display = 'inline';
    document.getElementById(button + '-button').disabled = true;  
  }

  // Stop spinner
  if ( flag == 'off' ) {
    document.getElementById(button + '-spinner').style.display = 'none';
    document.getElementById(button + '-button-text').style.display = 'inline'; 
    document.getElementById(button + '-button').disabled = false;            
  }  
}

function revealFields(collapseID) {
  // Show the fileds that will be populated
  let myCollapse = document.getElementById(collapseID);
  let bsCollapse = new bootstrap.Collapse(myCollapse, {
    toggle: false
  });
  bsCollapse.show();      
}