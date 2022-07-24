import { useState } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import * as abi from "./abi.json";

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
  const contract_address = "0xDfBbb5C231215A269d3549dc89f9Ef521b0A18fD";
  //const send_to = "0xeA483f962A12Fc5676318802e6dbdDa8fEd84f48";
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

export default function PayAndMint() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);

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
}
