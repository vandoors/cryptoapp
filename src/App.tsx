import React, { useState, useEffect } from 'react';

import { get } from 'aws-amplify/api';

import './App.css';

interface Coin {
  csupply: string;
  id: string;
  market_cap_usd: string;
  msupply: string;
  name: string;
  nameid: string;
  percent_change_1h: string;
  percent_change_7d: string;
  percent_change_24h: string;
  price_btc: string;
  price_usd: string;
  rank: number;
  symbol: string;
  tsupply: string;
  volume24: number;
  volume24a: number;
}

interface CoinsResponse {
  coins: Coin[];
}

// Return true if the response is a valid CoinsResponse (TypeScript stuff)
const isValidCoinsResponse = (jsonResponse: any): jsonResponse is CoinsResponse => {
  return jsonResponse && jsonResponse.coins && Array.isArray(jsonResponse.coins);
}

const App = () => {
  const [coins, updateCoins] = useState<Coin[]>([]);

  const fetchCoins = async () => {
    try {
      const restOperation = await get({
        apiName: "cryptoapi",
        path: "/coins"
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
