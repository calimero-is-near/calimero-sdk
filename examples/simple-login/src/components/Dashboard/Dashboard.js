import React, { useEffect, useState } from "react";
import { CalimeroSdk, WalletConnection } from "calimero-sdk"
import { config } from "../../calimeroConfig";

let walletConnectionObject = undefined;

export default function Dashboard() {
  const [signedIn, setSingnedIn] = useState();
  const getAccountBalance = async () => {
    const account = await walletConnectionObject?.account();
    const balance = await account.getAccountBalance();
    console.log(balance);
  };

  const walletSignIn = async () => {
    await walletConnectionObject?.requestSignIn({});
  };

  useEffect(() => {
    const init = async () => {
      const calimero = await CalimeroSdk.init(config).connect();
      walletConnectionObject = new WalletConnection(calimero, "calimero-simple-login");
      const signedIn = await walletConnectionObject?.isSignedInAsync();
      setSingnedIn(signedIn);
    }
    init()
  }, []);

  const logout = async () => {
    walletConnectionObject?.signOut();
    setSingnedIn(false);
  };

  const App = ({ isSignedIn }) => isSignedIn ? <PrivateComponent /> : <PublicComponent />;

  const PrivateComponent = () => (
    <div>
      <button onClick={() => getAccountBalance()}>Get Balance</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
  
  const PublicComponent = () => (
    <div>
      <button onClick={() => walletSignIn()}>Login with NEAR</button>
    </div>
  );
  return <App isSignedIn={signedIn}/>;
}