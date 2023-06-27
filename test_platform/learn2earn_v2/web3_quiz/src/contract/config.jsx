import BloctoSDK from "@blocto/sdk";
const chainId= "0x13881"; // (required) chainId to be used
const rpc="https://rpc-mumbai.maticvigil.com/"; // (required for Ethereum) JSON RPC endpoint
const bloctoSDK = new BloctoSDK({
    ethereum: {
      chainId: "0x13881", // (required) chainId to be used
      rpc: "http://localhost:8545/" // (required for Ethereum) JSON RPC endpoint
    }
  });


const quiz_address="0x2dB485bAb9e0732858b4937a9355f1eBcDeD3351";
const token_address="0xE5ffF15fE09612862BBDcCbd744435419FEaed22";

export {chainId,rpc,bloctoSDK,quiz_address,token_address };
