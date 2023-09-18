"use client";

import Image from "next/image";
import { Contract, ethers } from "ethers";
import { SetStateAction, useEffect, useState } from "react";
import contractABI from "../contractABI.json";
import { Button } from "~/components/ui/button";

const contractAddress = "0x1580260Be8Db6da9BFEaEc0a5B205DB7253BF125";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState<Contract | null>(null);
  // state for whether app is minting or not.
  const [isMinting, setIsMinting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false); // Added state for network check

  useEffect(() => {
    async function checkNetwork() {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        setIsCorrectNetwork(chainId === "0x13881"); // Change to the correct chain ID
      }
    }
    //check for initial network
    checkNetwork();

    //Check for network change
    window.ethereum.on(
      "chainChanged",
      (newChainId: string) => {
        setIsCorrectNetwork(newChainId === "0x13881"); // Change to the correct chain ID
      },
      []
    );
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
  }, []);

  useEffect(() => {
    function initNFTContract() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setNFTContract(new Contract(contractAddress, contractABI.abi, signer));
    }
    initNFTContract();
  }, [account]);

  async function connectWallet() {
    window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .then((accounts: SetStateAction<null>[]) => {
        setAccount(accounts[0]);
      })
      .catch((error: any) => {
        alert("Something went wrong");
      });
  }

  async function disconnectWallet() {
    if (window.ethereum) {
      try {
        setAccount(null);
      } catch (error) {
        console.error(
          "An error occurred while disconnecting the wallet:",
          error
        );
      }
    }
  }

  const data = [
    {
      url: "/assets/images/1.png",
      param:
        "handleMint('https://magenta-multiple-leech-484.mypinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/1.png')",
    },
    {
      url: "/assets/images/2.png",
      param:
        "handleMint('https://magenta-multiple-leech-484.mypinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/2.png')",
    },
    {
      url: "/assets/images/3.png",
      param:
        "handleMint('https://magenta-multiple-leech-484.mypinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/3.png')",
    },
    {
      url: "/assets/images/4.png",
      param:
        "handleMint('https://magenta-multiple-leech-484.mypinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/4.png')",
    },
    {
      url: "/assets/images/5.png",
      param:
        "handleMint('https://magenta-multiple-leech-484.mypinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/5.png')",
    },
  ];

  async function withdrawMoney() {
    try {
      const response = await NFTContract?.withdrawMoney();
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    }
  }

  if (!isCorrectNetwork) {
    return (
      <div className="flex min-h-[400px]  text-black flex-col items-center justify-between">
        <br />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          NFT Marketplace
        </h1>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Switch to the Polygon Mumbai Network
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Please switch to the Polygon Mumbai network to use this app.
        </p>
      </div>
    );
  }

  async function handleMint(tokenURI: string) {
    setIsMinting(true);
    try {
      const options = { value: ethers.utils.parseEther("0.01") };
      const response = await NFTContract?.mintNFT(tokenURI, options);
      console.log("Received: ", response);
    } catch (err) {
      alert(err);
    } finally {
      setIsMinting(false);
    }
  }

  if (account === null) {
    return (
      <>
        <div className="flex min-h-[400px]  text-black  flex-col items-center justify-between">
          <br />
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            NFT Marketplace
          </h1>
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Buy an NFT from our marketplace.
          </h2>

          {isWalletInstalled ? (
            <Button
              className="flex gap-1"
              size={"lg"}
              variant="outline"
              onClick={connectWallet}
            >
              Connect Wallet
              <Image
                src={"/assets/metamask.svg"}
                width={30}
                height={30}
                alt={""}
              />
            </Button>
          ) : (
            <p>Install Metamask wallet</p>
          )}
        </div>
      </>
    );
  }

  return (
    <main className="flex  gap-10  flex-col items-center justify-between p-24">
      <div className="flex text-center  flex-col">
        <h1 className="scroll-m-20 text-4xl pb-5 font-extrabold tracking-tight lg:text-5xl">
          NFT Marketplace
        </h1>
        <p className="pb-10">A NFT Marketplace to view and mint your NFT</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {data.map((item, index) => (
            <div
              key={item.param}
              className="flex flex-col items-center justify-center gap-2"
            >
              <Image
                src={item.url}
                key={index}
                className="rounded-md max-w-[200px]"
                alt="images"
                width={250}
                height={250}
              />
              <Button
                variant={"default"}
                onClick={() => {
                  handleMint(item.param);
                }}
              >
                Mint - 0.01 MATIC
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant={"secondary"}
          className="h-[70px] sm:h-11"
          onClick={() => {
            withdrawMoney();
          }}
        >
          Withdraw Money from Contract
        </Button>
        <Button variant={"destructive"} onClick={disconnectWallet}>
          Disconnect Wallet
        </Button>
      </div>
    </main>
  );
}
