import React, { useState, useEffect } from 'react';

import { get } from 'aws-amplify/api';

import './App.css';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  nameid: string;
  rank: number;
  price_usd: string;
  percent_change_24h: string;
  percent_change_1h: string;
  percent_change_7d: string;
  price_btc: string;
  market_cap_usd: string;
  volume24: number;
  volume24a: number;
  csupply: string;
  tsupply: string;
  msupply: string;
}

interface Info {
  coins_num: number;
  time: number;
}

interface CoinsResponse {
  data: Coin[];
  info: Info;
}

// Return true if the response is a valid CoinsResponse (TypeScript stuff)
const isValidCoinsResponse = (jsonResponse: any): jsonResponse is CoinsResponse => {
  return jsonResponse && jsonResponse.data && Array.isArray(jsonResponse.data);
}

const App = () => {
  const [coins, updateCoins] = useState<Coin[]>([]);

  const fetchCoins = async () => {
    const restOperation = await get({
      apiName: "cryptoapi",
      path: "/coins"
    });
  
    const { body } = await restOperation.response;
    const jsonResponse = await body.json();
  
    if (isValidCoinsResponse(jsonResponse)) {
      updateCoins(jsonResponse.data);
    } else {
      console.error("Unexpected response:", jsonResponse);
    }
  }
  
  useEffect(() => {
    fetchCoins()
  }, [])

  return (
    <div className="App">
      {
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
