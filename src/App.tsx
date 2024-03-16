import React, { useState, useEffect } from 'react';

import { get } from 'aws-amplify/api';

import './App.css';

interface Coin {
  name: string;
  symbol: string;
  price_usd: string;
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
  }
  
  useEffect(() => {
    fetchCoins()
  }, [])

  return (
    <div className="App">
      {
        coins.map((coin, index) => (
          <div key={index}>
            <h2>{coin.name} - {coin.symbol}</h2>
            <h5>${coin.price_usd}</h5>
          </div>
        ))
      }
    </div>
  );
}

export default App;
