import React, { useState, useEffect } from 'react';
import { ethers, Contract } from 'ethers';
import axios from 'axios';
import UniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json';
import toast from 'react-hot-toast';

import { FACTORY_ABI, FACTORY_ADDRESS } from './constants';
import {} from '../utils/shortaddress';

export const CONTEXT = React.createContext();

export const CONTEXT_Provider = ({ children }) => {
  const DAPP_NAME = 'WebAI';
  const [loader, setLoader] = useState(false);

  // NOTIFICATION
  const notifyError = (msg) => toast.error(msg, { duration: 4000 });
  const notifySuccess = (msg) => toast.success(msg, { duration: 4000 });

  // Get pool address
  const GET_POOL_ADDRESS = async (liquidity, selectedNetwork) => {
    try {
      setLoader(true);
      // Provider
      const PROVIDER = new ethers.providers.JsonRpcProvider(
        selectedNetwork.rpcUrl
      );
      const factoryContract = new ethers.Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        PROVIDER
      );

      const poolAddress = await factoryContract.functions.getPool(
        liquidity.token_A,
        liquidity.token_B,
        Number(liquidity.fee)
      );

      const poolHistory = {
        token_A: liquidity.token_A,
        token_B: liquidity.token_B,
        fee: liquidity.fee,
        network: selectedNetwork.name,
        poolAddress: poolAddress,
      };

      let poolArray = [];
      const poolLists = localStorage.getItem('poolHistory');
      if (poolLists) {
        poolArray = JSON.parse(localStorage.getItem('poolHistory'));
        poolArray.push(poolHistory);
        localStorage.setItem('poolHistory', JSON.stringify(poolArray));
      } else {
        poolArray.push(poolHistory);
        localStorage.setItem('poolHistory', JSON.stringify(poolArray));
      }

      setLoader(false);
      notifySuccess('Successfully Completed');
      return poolAddress;
    } catch (error) {
      setLoader(false);
      notifyError('Error');
    }
  };

  // GET POOL DETAILS

  return (
    <CONTEXT.Provider value={{ DAPP_NAME, GET_POOL_ADDRESS }}>
      {children}
    </CONTEXT.Provider>
  );
};
