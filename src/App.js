import { useEffect, useState } from "react";
import { ConnectWallet, useConnectWallet, signWalletTransaction } from "@newm.io/cardano-dapp-wallet-connector";
import { generateChallenge, answerChallenge, getQRCode } from "./api";
import { encodeAddress } from "./utils";
import "./App.css";


function App() {
  const { wallet } = useConnectWallet();
  const [isHardwareWallet, setIsHarwareWallet] = useState(false)
  const [stakeAddress, setStakeAddress] = useState(null)
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [qrCodeLabel, setQrCodeLabel] = useState(null);


  useEffect(() => {
    if (wallet) {
      handleConnect()
    } else {
      handleDisconnect()
    }
  }, [wallet])


  const handleConnect = async () => {
    try {
      const adresses = await wallet.getRewardAddresses()
      setStakeAddress(encodeAddress(adresses[0]))
    } catch (error) {
      console.error(error)
      alert(`Failed getting Stake Address: ${error}`);
    }
  };

  const handleDisconnect = () => {
    setStakeAddress(null)
    setQrCodeUrl(null)
    setQrCodeLabel(null)
  };

  const handleConnectFromMobile = async () => {
    try {
      let connection
      if (isHardwareWallet) {
        const changeAddress = encodeAddress(await wallet.getChangeAddress())
        const utxos = await wallet.getUtxos("1a001e8480")
        const challenge = await generateChallenge("SignedTransaction", stakeAddress, changeAddress, utxos);
        const answer = await signWalletTransaction(wallet, challenge.payload)
        connection = await answerChallenge(challenge.challengeId, answer)
      } else {
        const challenge = await generateChallenge("SignedData", stakeAddress);
        const answer = await wallet.signData(stakeAddress, challenge.payload)
        connection = await answerChallenge(challenge.challengeId, answer.signature, answer.key)
      }
      const image = await getQRCode(connection.connectionId)
      setQrCodeUrl(URL.createObjectURL(image))
      setQrCodeLabel(`newm-${connection.connectionId}`)
    } catch (error) {
      console.error(error)
      alert(`Failed preparing to connect from mobile: ${error}`);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <div>
          <ConnectWallet />
        </div>
        {stakeAddress && (
          <p>{stakeAddress}</p>
        )}
        {stakeAddress && !qrCodeUrl && (
          <>
            <div>
              <button className="App-button" onClick={handleConnectFromMobile}>Connect from Mobile App</button>
            </div>
            <div>
              <input type="checkbox" className="App-checkbox" checked={isHardwareWallet} onChange={() => setIsHarwareWallet(!isHardwareWallet)} />
              <label className="App-label">Hardware Wallet</label>
            </div>
          </>
        )}
        {qrCodeUrl && (
          <div>
            <img className="App-image" src={qrCodeUrl} />
          </div>
        )}
        {qrCodeLabel && (
          <p>
            {qrCodeLabel}
          </p>
        )}
      </header >
    </div >
  );
}

export default App;
