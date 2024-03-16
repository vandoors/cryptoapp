import React, { useState, useEffect, useCallback } from 'react';

import { get } from 'aws-amplify/api';

import './css/normalize.css';
import './css/app.css';

interface Coin {
  name: string;
  symbol: string;
  price_usd: string;
}

interface GitHubUserResponse {
  login: string,
  created_at: string
}

interface CoinsResponse {
  coins: Coin[];
}

const isValidGitHubUser = (jsonResponse: any): jsonResponse is GitHubUserResponse => {
  return (
    jsonResponse &&
    jsonResponse.login &&
    jsonResponse.created_at
  );
}

const isValidCoinsResponse = (jsonResponse: any): jsonResponse is CoinsResponse => {
  return (
    jsonResponse &&
    jsonResponse.coins &&
    Array.isArray(jsonResponse.coins)
  );
}

const App = () => {
  const [githubUser, updateGitHubUser] = useState<GitHubUserResponse>();

  const fetchGitHubUserData = async () => {
    try {
      updateLoading(true);
      const GITHUB_USERNAME: string = "vandoors"

      const restOperation = await get({
        apiName: "cryptoapi",
        path: "/gh-user",
        options: {
          queryParams: {
            username: GITHUB_USERNAME
          }
        }
      });
  
      const { body } = await restOperation.response;
      const jsonResponse = await body.json();
  
      if (isValidGitHubUser(jsonResponse)) {
        updateGitHubUser(jsonResponse);
      } else {
        console.error("Unexpected response:", jsonResponse);
      }
    } catch (error) {
      console.error("coinapi:", error);
    }
  };

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
    fetchGitHubUserData();
  }, []);
  
  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  return (
    <div className="App">
      <h1>cryptoapp</h1>
      {
        <p className="subtitle">built by {loading ? <span className="loading">...</span> : (githubUser ? <span title={githubUser.created_at}>{githubUser.login}</span> : <span title='A long time ago...'>ghost</span>)}</p>
      }


      <input onChange={e => updateInputValues('limit', e.target.value)} placeholder="limit" />
      <input placeholder="start" onChange={e => updateInputValues('start', e.target.value)} />

      { loading ? <p className="loading">Loading...</p> :
        coins.length > 0 ? (
          coins.map((coin, index) => (
            <div className="coin" key={index}>
              <h2>{coin.name} <span className="symbol">({coin.symbol})</span></h2>
              <p>${coin.price_usd}</p>
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
