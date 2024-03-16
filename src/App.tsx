import React, { useState, useEffect, useCallback } from 'react';

import { get } from 'aws-amplify/api';

import './App.css';

interface Coin {
  id: string;
  name: string;
  nameid: string;
  symbol: string;

  rank: number;
  market_cap_usd: string;
  price_usd: string;
  price_btc: string;

  percent_change_1h: string;
  percent_change_24h: string;
  percent_change_7d: string;

  volume24: number;
  volume24a: number;

  csupply: string;
  msupply: string;
  tsupply: string;
}

interface CoinsResponse {
  coins: Coin[];
}

const isValidCoinsResponse = (jsonResponse: any): jsonResponse is CoinsResponse => {
  return jsonResponse && jsonResponse.coins && Array.isArray(jsonResponse.coins);
}

const App = () => {
  const DEFAULT_LIMIT: number = 5;
  const DEFAULT_START: number = 0;

  const [coins, updateCoins] = useState<Coin[]>([]);
  const [input, updateInput] = useState({ limit: DEFAULT_LIMIT, start: DEFAULT_START });
  const [loading, updateLoading] = useState(true);

  const updateInputValues = (type: string, value: string) => {
    if (!value) {
      return updateInput({ limit: DEFAULT_LIMIT, start: DEFAULT_START });
    } else {
      updateInput({...input, [type]: value });
    }
  };

  const fetchCoins = useCallback(async () => {
    try {
      updateLoading(true);
      const { limit, start } = input;
      const restOperation = await get({
        apiName: "cryptoapi",
        path: "/coins",
        options: {
          queryParams: {
            limit: limit.toString(),
            start: start.toString()
          }
        }
      });
  
      const { body } = await restOperation.response;
      const jsonResponse = await body.json();
  
      if (isValidCoinsResponse(jsonResponse)) {
        updateCoins(jsonResponse.coins);
      } else {
        console.error("Unexpected response:", jsonResponse);
      }
    } catch (error) {
      console.error("coinapi:", error);
    }

    updateLoading(false);
  }, [input]);
  
  useEffect(() => {
    fetchCoins()
  }, [fetchCoins])

  return (
    <div className="App">
      <input onChange={e => updateInputValues('limit', e.target.value)} placeholder="limit" />
      <input placeholder="start" onChange={e => updateInputValues('start', e.target.value)} />
      
      { loading ? <p>Loading...</p> :
        coins.length > 0 ? (
          coins.map((coin, index) => (
            <div key={index}>
              <h2>{coin.name} - {coin.symbol}</h2>
              <h5>${coin.price_usd}</h5>
            </div>
          ))
        ) : (
          <p>No valid coins data available.</p>
        )
      }
  </div>
  );
}

export default App;
