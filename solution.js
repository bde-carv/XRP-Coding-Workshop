let net = 'wss://testnet.xrpl-labs.com';
console.log(net);

let my_wallet; 

/*
* Connect to a server(=node) and return client
*/
async function xrplConnect()
{
  const client = new xrpl.Client(net);
  await client.connect();

  return (client);
}

/*
* called when "Create Account" is clicked
*/
async function getCampusAccount()
{
  //TODO:create a new connected client. hint: use xrplConnect()
  const client = await xrplConnect();

  // Start button spinner
  buttonSpin('account-create', 'on'); 

  /*TODO:create and fund a wallet on the testnet and print out credentials and balance
  * hint: check 'fundWallet' resource; fundWallet() is a client method
  */
	const wallet_obj = await client.fundWallet();
	my_wallet = wallet_obj.wallet;
	console.log('my_wallet is: ' + JSON.stringify(my_wallet));
	console.log(`my_wallet balance is: ${wallet_obj.balance}`);

  // Stop button spinner
  buttonSpin('account-create', 'off');   
  // Reveal the hidden fields
  revealFields('collapseCreate');      

  /*TODO: Fill in the fields with the values obtained from the wallet
  * hint: they are properties of the wallet
  */
  document.getElementById('classicAddress').value = my_wallet.classicAddress;
  document.getElementById('publicKey').value = my_wallet.publicKey;
  document.getElementById('privateKey').value = my_wallet.privateKey;
  document.getElementById('seed').value = my_wallet.seed;

  /*TODO: Disconnect the client
  * hint: check 'disconnect' resource; disconnect() is a client method
  */
  client.disconnect();
}

/*
* TODO: check your wallet details in Bithomp-Explorer 
*/

async function mintNFT()
{
  //TODO:create a new connected client. hint: use xrplConnect()
  const client = await xrplConnect();

  // Start button spinner
  buttonSpin('mint-nft', 'on');   

  // Get the IPFS hash
  let nftURIField = document.getElementById('nftTokenURL');
  if ( nftURIField.value.length == 0 ) {
    // Use this image as the default
    nftURIField.value = 'ipfs://QmXSidVfGe24KazE9nWQHm3Y51g82jXnKajcEYdFLCpaCS'; // link to NFT pic need brave or ipfs gateway to see it i.e ipfs.io
  }        

  // Get the transfer fee/royalty 0-50%; 1000 = 1%
  let transferFeeField = document.getElementById('transferFee');    
  if ( transferFeeField.value.length == 0 ) {
    transferFeeField.value = 0;
  }

  /*TODO: create a Transaction blob(= transaction object) for minting a token
  * hint: check the 'NFTokenMint' resource; URI must be in hex
  */
  const transactionBlob =
  {
	"TransactionType": "NFTokenMint",
	"Account": my_wallet.classicAddress,
	"URI": xrpl.convertStringToHex(nftURIField.value),
	"Flags": 8,
	"TransferFee": parseInt(transferFeeField.value),
	"NFTokenTaxon": 0
  }

   /*TODO: Send the transaction to the ledger and safe the transaction results in a variable
   * hint: check 'submitAndWait' resource; its a client function
  */
  const tx = await client.submitAndWait(transactionBlob, {wallet: my_wallet});

  /*TODO: Query the NFTs for the account
  * hint: use the resource 'AccountNFTsRequest' or ChatGPT
  */
   const nfts_obj = await client.request({
		method: "account_nfts",
		account: my_wallet.classicAddress
   });
 
  // Stop button spinner
  buttonSpin('mint-nft', 'off');    
  // Reveal the hidden fields
  revealFields('collapseNFTokenID');    

  /*TODO: Console log the NFTs for the account
  * hint: use JSON.stringify() to convert an object into a string
  */
  let allNFT = 'this account owns these NFTs: ' + JSON.stringify(nfts_obj, null, 2);
  console.log(allNFT);

  /*TODO: Fill in these fields with the data of the NFT
  * hint: check previous function
  */
  nfts_obj.result.account_nfts.forEach( nft => {
	if ( nft.URI == xrpl.convertStringToHex(nftURIField.value) ) {
		document.getElementById('nftTokenID').value = nft.NFTokenID;
		document.getElementById('sellNFTokenID').value = nft.NFTokenID; // field for the next section: put value as 'nftTokenID'
	}
  });

  /*TODO: Disconnect the client
  * hint: check 'disconnect' resource; disconnect() is a client method
  */
  client.disconnect();
}        

/*
* TODO: lets go to bithomp to chekc our account for the NFT
*/

async function createSellOffer()
{
  //TODO:create a new connected client. hint: use xrplConnect()
  const client = await xrplConnect();

  let tokenID = document.getElementById('sellNFTokenID').value;
  
  // Start button spinner
  buttonSpin('create-sell-offer', 'on');     
  
  // Get the amount of the sell offer; 1million = 1XRP
  let offerAmountField = document.getElementById('offerAmount');    
  if ( offerAmountField.value.length == 0 ) {
    offerAmountField.value = 50000000;
  }                

  /*TODO: Create a Transaction blob for creating a sell offer
  * hint: check 'NFTokenCreateOffer' resource from XRPL.org
  */
  const transactionBlob = {
	"TransactionType": "NFTokenCreateOffer",
	"Account": my_wallet.classicAddress,
	"NFTokenID": tokenID,
	"Amount": offerAmountField.value,
	"Flags": 1
  }

 /*TODO: Send transaction to the ledger and get the transaction results
   * hint: use 'submitAndWait' resource or see above
  */
  const tx = await client.submitAndWait(transactionBlob, {wallet: my_wallet});

  // Stop button spinner
  buttonSpin('create-sell-offer', 'off');    
  // Reveal the hidden fields
  revealFields('collapseNFTOfferIndex');       

  /*TODO: Get the sell offeres for the account
  and catch the case if there are no sell offers
  * hint: check 'NFTSellOffersRequest' or the client.request() above in mintNFT()
  */
  let sellOffers;
  try {
	sellOffers = await client.request({
		method: "nft_sell_offers",
		nft_id: tokenID
	})
  } catch (err) {
	sellOffers = "No sell offers";
  }

  /*TODO: Console log the sell offers for the account
  * hint: use JSON.stringify() to convert an object into a string or check above in mintNFT()
  */
  let printSellOffers = 'sell offers are:' + JSON.stringify(sellOffers, null , 2);
  console.log(printSellOffers);

  /*TODO: Fill in the field with the offer index
  * hint: check how we filled in the fields above in mintNFT()
  */ 
  sellOffers.result.offers.forEach( offer => {
	if ( offer.flags == 1) {
		document.getElementById('nftOfferIndex').value = offer.nft_offer_index;
	}
  });

  /*TODO: Disconnect
  * hint: check our previous functions
  */
  client.disconnect();
}

/* TODO: view the selloffer in Bithomp
*/

// ------ END of Tutorial -------










// UI stuff from hereon --------------------------------------
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