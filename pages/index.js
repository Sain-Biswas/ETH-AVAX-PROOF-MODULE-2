import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [input, setInput] = useState(0);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(input);
      await tx.wait();
      setInput(0);
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(input);
      await tx.wait();
      setInput(0);
      getBalance();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount} style={{paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '.5rem', paddingBottom: '.5rem', color: 'white', fontStyle: 'italic', borderRadius: '1rem', backgroundColor: 'black'}}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '1rem'}}>
        <p style={{padding: 0, margin: 0, fontSize: '1.25rem'}}>Your Account</p>
        <p style={{padding: 0, margin: 0, fontStyle: 'italic'}}>{account}</p>
        <p style={{padding: 0, margin: 0, fontSize: '1.25rem'}}>Your Balance</p>
        <p style={{padding: 0, margin: 0, fontStyle: 'italic'}}>{balance}</p>
        <div style={{width: '50%', margin: 'auto'}}>
          <input type="number" value={input} style={{paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '.5rem', paddingBottom: '.5rem'}}  onChange={(event) => {
            event.preventDefault();
            setInput(event.target.value)
          }}/>
        </div>
        <div style={{margin: 'auto', display: "flex", gap: '1rem'}}>
        <button onClick={deposit} style={{paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '.5rem', paddingBottom: '.5rem', color: 'white', fontStyle: 'italic', borderRadius: '1rem', backgroundColor: 'black'}}>Deposit GO</button>
        <button onClick={withdraw} style={{paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '.5rem', paddingBottom: '.5rem', color: 'white', fontStyle: 'italic', borderRadius: '1rem', backgroundColor: 'black'}}>Withdraw GO</button>
        </div>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main style={{display: 'grid', placeContent: 'center', width: '100%', height: '98vh', textAlign: 'center'}}>
      <div style={{padding: '2rem', border: '1px solid gray', borderRadius: '1rem'}}>
      <p style={{fontSize: '2rem', fontStyle: 'italic'}}>Welcome to the Metacrafters ATM!</p>
      {initUser()}
      </div>
    </main>
  )
}
