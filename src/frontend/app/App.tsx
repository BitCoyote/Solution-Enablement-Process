import React from 'react';
import logo from './logo.svg';
import Counter from '../features/counter/Counter';
import './App.css';
import { useGetUserQuery } from '../services/usersSlice/usersSlice';
import { useAccount } from '@azure/msal-react';




const App = () => {

  const { data: loggedInUser } = useGetUserQuery('me');
  const account = useAccount();

  return (
    <div className="App">
      <header className="App-header">
        <h3>What's up, {loggedInUser?.displayName}?</h3>
        <h4>
          You have the following roles:{' '}
          {account?.idTokenClaims?.roles?.join(', ')}
        </h4>
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header>
    </div>
  )
}

export default App;
