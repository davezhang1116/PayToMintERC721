import { useState } from "react";
import { ethers } from "ethers";
import queryString from "query-string"
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_imageLink",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_ticker",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_timeForEvent",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "checkIn",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "_status",
				"type": "bool"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "_status",
				"type": "bool"
			}
		],
		"name": "payToMint",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawSell",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "attributes",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "seat",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getStatus",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenID",
				"type": "uint256"
			}
		],
		"name": "getTokenDetail",
		"outputs": [
			{
				"internalType": "bool",
				"name": "tokenStatus",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "tokenType",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTokenList",
		"outputs": [
			{
				"internalType": "string",
				"name": "tokenList",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getType",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "imageLink",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "price",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "timeForEvent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "tokenOfOwnerByIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const queryParams = queryString.parse(window.location.search);

const startPayment = async ({ setError, setTxs, seatID, name }) => {
  if (!window.ethereum)
    throw new Error("No crypto wallet found. Please install it.");

  const chainId = 11155111;

  if (window.ethereum.networkVersion !== chainId) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexlify(chainId) }]
      });
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainName: "Sepolia Testnet",
              chainId: ethers.utils.hexlify(chainId),
              nativeCurrency: { name: "SEP", decimals: 18, symbol: "SEP" },
              rpcUrls: ["https://rpc-sepolia.rockx.com/"]
            }
          ]
        });
      }
    }
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  var contract_address;
  if (queryParams.address != ""){
    contract_address = queryParams.address;
  }else{
    contract_address = "0xDfBbb5C231215A269d3549dc89f9Ef521b0A18fD";
  }
  const contractObject = new ethers.Contract(contract_address, abi, signer);

  const price = await contractObject.getPrice();
  const tx = await contractObject.payToMint(seatID, name, false, {
    value: price
  });

  await tx.wait();

  console.log({ seatID, name });
  console.log("tx", tx);
  setTxs([tx]);
};

const checkIn = async ({ setError, setTxs, seatID }) => {
  if (!window.ethereum)
    throw new Error("No crypto wallet found. Please install it.");

  const chainId = 11155111;

  if (window.ethereum.networkVersion !== chainId) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexlify(chainId) }]
      });
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainName: "Sepolia Testnet",
              chainId: ethers.utils.hexlify(chainId),
              nativeCurrency: { name: "SEP", decimals: 18, symbol: "SEP" },
              rpcUrls: ["https://rpc-sepolia.rockx.com/"]
            }
          ]
        });
      }
    }
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  var contract_address;
  if (queryParams.address != ""){
    contract_address = queryParams.address;
  }else{
    contract_address = "0xDfBbb5C231215A269d3549dc89f9Ef521b0A18fD";
  }

  const contractObject = new ethers.Contract(contract_address, abi, signer);
  const tx = await contractObject.checkIn(seatID);
  await tx.wait();
  console.log("tx", tx);
  setTxs([tx]);
}

const getOwnedToken = async ({ setError, setTxs }) => {
  if (!window.ethereum)
    throw new Error("No crypto wallet found. Please install it.");

  const chainId = 11155111;

  if (window.ethereum.networkVersion !== chainId) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ethers.utils.hexlify(chainId) }]
      });
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainName: "Sepolia Testnet",
              chainId: ethers.utils.hexlify(chainId),
              nativeCurrency: { name: "SEP", decimals: 18, symbol: "SEP" },
              rpcUrls: ["https://rpc-sepolia.rockx.com/"]
            }
          ]
        });
      }
    }
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  var contract_address;
  if (queryParams.address != ""){
    contract_address = queryParams.address;
  }else{
    alert("error");
  }
  const contractObject = new ethers.Contract(contract_address, abi, signer);
  var tokens = await contractObject.getTokenList();
  var tokenList = tokens.split(", ");
  tokenList.shift();
  for (let i = 0; i<tokenList.length; i++){
    var newDiv = document.createElement("div");
    var callResult = await contractObject.getTokenDetail(tokenList[i]);
    var status;
    var type;
    var {0: status, 1: type} = callResult;
    if (status == false){
      newDiv.innerHTML += "<p style='white-space: pre;float:left'> Token ID: " + tokenList[i] + "      type: " +type+ "    </p>" + "<a style:'float=right' href=/?address="+contract_address+"&function=2&seatID=" +tokenList[i]+"> Check In </a>";
    }else{
      newDiv.innerHTML += "<p style='white-space: pre;'> Token ID: " + tokenList[i] + "      type: " +type+ "    You have already checked in </p>";
    }
    var currentDiv = document.getElementById("content");
    currentDiv.parentNode.insertBefore(newDiv, currentDiv);
  }
}



export default function App() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);

  if (queryParams.function == 1){

    const handleSubmit = async (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      setError();
      await startPayment({
        setError,
        setTxs,
        seatID: data.get("seatID"),
        name: data.get("name")
      });
    };

    return (
      <form className="m-4" onSubmit={handleSubmit}>
        <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
          <main className="mt-4 p-4">
            <h1 className="text-xl font-semibold text-gray-700 text-center">
              Mint ERC-721 Token
            </h1>

            <div>
              <label id="get-price"></label>
            </div>

            <div className="">
              <div className="my-3">
                <input
                  type="text"
                  name="seatID"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="seatID"
                />
              </div>
              <div className="my-3">
                <input
                  name="name"
                  type="text"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="name"
                />
              </div>
            </div>
          </main>
          <footer className="p-4">
            <button
              type="submit"
              className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
            >
              Pay now
            </button>
            <ErrorMessage message={error} />
            <TxList txs={txs} />
          </footer>
        </div>
      </form>
    );
  }else if (queryParams.function == 2){
    const handleSubmitFunc2 = async (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      setError();
      await checkIn({
        setError,
        setTxs,
        seatID: queryParams.seatID
      });
    };

    return (
      <form className="m-4" onSubmit={handleSubmitFunc2}>
      <button type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
        Connect Wallet And Check In
      </button>
      <ErrorMessage message={error} />
      <TxList txs={txs} />
      </form>
    );
  }
  else if (queryParams.function == 3){
    const handleSubmitFunc3 = async (e) => {
      e.preventDefault();
      const data = new FormData(e.target);
      setError();
      await getOwnedToken({
        setError,
        setTxs
      });
    };
    return(
      <form className="m-4" onSubmit={handleSubmitFunc3}>
      <button type="submit" className="btn btn-primary submit-button focus:ring focus:outline-none w-full">
        Connect Wallet And Check Your Tokens
      </button>
      <br/>
      <br/>
      <br/>

      <ErrorMessage message={error} />
      <TxList txs={txs} />
      <div id="content">
      </div>
      </form>



    );
  }
  else{
    return(
      <p> No Such Function </p>
    );
  }
}
