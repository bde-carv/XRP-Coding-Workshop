let net = 'wss://testnet.xrpl-labs.com'; // define server. here: testnet server

console.log(net); // to make sure we are on the right net

let my_wallet; // our wallet

/*
* Connect to a server(=node) and return client
* asyn function: is a type of function that can make use of await. it enables asynchronus operations
*/
async function xrplConnect()
{
  /*
  * xrpl is a js file(library) that was imported in line 7 in the .html file
  * client(): creates a new client with a websocket connection to a rippled server(=node)
  */
  const client = new xrpl.Client(net); // capital C is important
  // then wait till client is connected to the server(=node) of the (test)net;
  await client.connect();

  return (client);
}

/*
* is being called when "Create Account" is being clicked
*/
async function getCampusAccount() {
	/* 
	 * client = object;
	 * await: waits for a promise to be returned by an async function i.e resolve or rejection
	 */
  // TODO: create a connected client
  const client = await xrplConnect();

  // Start button spinner
  buttonSpin('account-create', 'on'); 

  //TODO: Fund wallet
  /*
  * fundWallet(): returns object(promise) with the wallet parameters "balance" and "wallet"(class with more wallet parameters i.e the keys);
  * fundWallet() generates credentials and funds a wallet on the testnetwork
  * JSON.stringify(): turns a js object/value into a string;
  */
	const wallet_obj = await client.fundWallet();
	my_wallet = wallet_obj.wallet; // wallet is a class
	console.log('my_wallet is: ' + JSON.stringify(my_wallet));
	console.log(`my_wallet balance is: ${wallet_obj.balance}`);

  // Stop button spinner
  buttonSpin('account-create', 'off');   
  // Reveal the hidden fields
  revealFields('collapseCreate');      

  /*TODO: Fill in and remove comments
  * document: is the whole webpage
  * getElementByID: refers to the respective ID in the .html file
  */
  document.getElementById('classicAddress').value = my_wallet.classicAddress;
  document.getElementById('publicKey').value = my_wallet.publicKey;
  document.getElementById('privateKey').value = my_wallet.privateKey;
  document.getElementById('seed').value = my_wallet.seed;

  //TODO: Disconnect
  client.disconnect(); // disconnect error is known and being fixed for this tutorial by the
}

/* TODO:
* now lets check out our wallet on the bithomp explorer link is on the page
* public key vs r-address: publick key is derived from private key, it is used
* for cryptographic operations e.g verifying transactions. the r-address is derived
* from the public key and serves better humand readability, it is used for sending/
* receiving coins
*/

async function mintNFT()
{
  //TODO: create a connected client
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

  /*TODO: Transaction blob for minting a token
  * creating the NFTmint transaction object
  * transactionBlob = binary representation of a transaction as a string(a transaction can be any action)
  * URI: Uniform Resource Identifier, is a string of characters that identifies a resource on the internet.
  	(a URL is a type of URI)
  */
  const transactionBlob =
  {
	"TransactionType": "NFTokenMint",
	"Account": my_wallet.classicAddress, // the r-address
	"URI": xrpl.convertStringToHex(nftURIField.value),
	"Flags": 8, // makes the NFT transferable
	"TransferFee": parseInt(transferFeeField.value),
	"NFTokenTaxon": 0 // beyond this tutorial; used for setting a shared name and symbol/abbrev. for (all) the NFTs (of a collection)
  }

  /*
  * TODO: Send transaction and get the transaction results
  * submitting the mint transaction to the network
  * submitAndWait(): takes transaction blob string + other options voluntary (e.g wallet);
  * returns a transaction-response-object
  */
  const tx = await client.submitAndWait(transactionBlob, {wallet: my_wallet});

  /*
  * TODO: Query the NFTs for the account
  * querying the NFTs an account has.
  * request() returns an promise object
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
  * stringify(nft, replacer array or function(key, value),spacing)
  * returns an object(Promise) 
  */
  let allNFT = 'this account owns these NFTs: ' + JSON.stringify(nfts, null, 2);
  console.log(allNFT);
  /*TODO: Fill in these fields with the data of the NFT
  * account_nfts is an array
  * nft is the nft at the current nfts position, it is used as input into the arrow function
  */
  nfts_obj.result.account_nfts.forEach( nft => {
	if ( nft.URI == xrpl.convertStringToHex(nftURIField.value) ) {
		document.getElementById('nftTokenID').value = nft.NFTokenID;
		document.getElementById('sellNFTokenID').value = nft.NFTokenID; // for the next section
	}
  });

  //TODO: Disconnect
  client.disconnect();
}        

/*
* TODO: lets go to bithomp to chekc our account for the NFT
*/

async function createSellOffer()
{
  const client = await xrplConnect();      
  let tokenID = document.getElementById('sellNFTokenID').value;
  
  // Start button spinner
  buttonSpin('create-sell-offer', 'on');     
  
  /*Get the amount of the sell offer
  * 1mil drops = 1xrp (for technical and precision purposes)
  */
  let offerAmountField = document.getElementById('offerAmount');    
  if ( offerAmountField.value.length == 0 ) {
    offerAmountField.value = 50000000;
  }                

  //TODO: Transaction blob for creating a sell offer
  const transactionBlob = {
	"TransactionType": "NFTokenCreateOffer",
	"Account": my_wallet.classicAddress,
	"NFTokenID": tokenID,
	"Amount": offerAmountField.value,
	"Flags": 1 // 1 means it is a sell offer
  }
  //TODO: Send transaction and get the transaction results
  const tx = await client.submitAndWait(transactionBlob, {wallet: my_wallet});
  // Stop button spinner
  buttonSpin('create-sell-offer', 'off');    
  // Reveal the hidden fields
  revealFields('collapseNFTOfferIndex');       

  /*
  TODO: Get the sell offers for the account and
  TODO: Catch the case if there are no sell offers */
  let sellOffers;
  try {
	sellOffers = await client.request({
		method: "nft_sell_offers",
		nft_id: tokenID
	})
  } catch (err) {
	sellOffers = "No sell offers";
  }

  //TODO: Console log the sell offers for the account
  let printSellOffers = 'sell offers are:' + JSON.stringify(sellOffers, null , 2);
  console.log(printSellOffers);

  /*
  * TODO: Fill in the field with the offer index (= identifies the offer);
  * forEach: does sth. (e.g function) on each element of an array
  * => is an arrow function: is a shorthand syntax to create a function right here on the spot
  * "offer" is a parameter(= the current element)
  * if the arrow function take more than one parameter they need to be in brackets: (param1, param2,..) => { function body};
  * nftOfferIndex: is the identifier for the offer (not the NFT itself)
  */
  sellOffers.result.offers.forEach( offer => {
	if ( offer.flags == 1) {
		document.getElementById('nftOfferIndex').value = offer.nft_offer_index;
	}
  });
  //TODO: Disconnect
  client.disconnect();
}

// ------ END of Tutorial -------
/*
* actually accept buyoffer(=accept the offer from the buyer)
*/
async function acceptSellOffer()
{
  const client = await xrplConnect();   

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
  const transactionBlob = {
	"TransactionType": "NFTokenAcceptOffer",
	"Account": my_wallet.classicAddress,
	"NFTokenSellOffer": acceptIndex.value
  }
  //TODO: Send transaction and get the transaction results
  const tx = await client.submitAndWait(transactionBlob, {wallet: my_wallet});
  //TODO: Get the NFTs for the account
  const nfts = await client.request({
	method: "account_nfts",
	account: my_wallet.classicAddress
	});
  // Stop button spinner  
  buttonSpin('accept-sell-offer', 'off');           
  
  //TODO: Console log the transaction result
  console.log('result of selling: ' + JSON.stringify(tx.result));
  //TODO: Console log the balance changes
  console.log('Balance changes: ' + JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2));
  let allNFT = 'and now this account owns these NFTs: ' + JSON.stringify(nfts, null, 2);
  console.log(allNFT);
  //TODO: Disconnect
  client.disconnect();
}

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