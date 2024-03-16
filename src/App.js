import { useEffect, useState } from "react";
import { ConnectWallet, useConnectWallet } from "@newm.io/cardano-dapp-wallet-connector";
import { generateSignedDataChallenge, answerSignedDataChallenge, getQRCode } from './api';
import './App.css';
import { wait } from "@testing-library/user-event/dist/utils";


function App() {
  const { wallet } = useConnectWallet();
  const [isHardwareWallet, setIsHarwareWallet] = useState(false)
  const [address, setAddress] = useState(null)
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
      const addresses = await wallet.getRewardAddresses()
      setAddress(addresses[0])
    } catch (error) {
      console.error(error)
      alert(`Failed getting Wallet Address: ${error}`);
    }
  }

  const handleDisconnect = () => {
    setAddress(null)
    setQrCodeUrl(null)
    setQrCodeLabel(null)
  }

  const handleConnectFromMobile = async () => {
    if (isHardwareWallet) {
      alert('Not supported yet!!')
      return
    }
    try {
      const challenge = await generateSignedDataChallenge(address);
      const result = await wallet.signData(address, challenge.payload)
      const connection = await answerSignedDataChallenge(challenge.challengeId, result.signature)
      const image = await getQRCode(connection.connectionId)
      setQrCodeUrl(URL.createObjectURL(image))
      setQrCodeLabel(`newm-${connection.connectionId}`)
    } catch (error) {
      console.error(error)
      alert(`Connection export failed: ${error}`);
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <div>
          <ConnectWallet />
        </div>
        {address && !qrCodeUrl && (
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
