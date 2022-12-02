import React, { useState, useEffect } from "react";
import Web3 from "web3";
import SimpleStorage from "./contracts/SimpleStorage.json";
import "./App.css";

const App = () => {
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });
  const [storageValue, setStorageValue] = useState("NULL");

  useEffect(() => {
    const init = async () => {
      try {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:7545"
        );
        const web3 = new Web3(provider);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorage.networks[networkId];
        console.log("Contract Address:", deployedNetwork.address);
        const instance = new web3.eth.Contract(
          SimpleStorage.abi,
          deployedNetwork.address
        );
        setState({ web3, contract: instance });
      } catch (error) {
        alert("Falied to load web3 or contract.");
        console.log(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    async function getValue() {
      const { contract } = state;
      const value = await contract.methods.get().call();
      setStorageValue(value);
    }
    state.contract && getValue();
  }, [state.contract, state]);

  async function setValue() {
    const { contract } = state;
    const input = document.querySelector("#input");
    await contract.methods
      .set(input.value)
      .send({ from: "0x0BA507d1bBb41c24DDF1349435914bD7aD26cCE2" });
    const value = await contract.methods.get().call();
    setStorageValue(value);
  }
  return (
    <div className="App">
      <div>The stored values is: {storageValue}</div>
      <div>
        <input type="text" id="input"></input>
      </div>
      <div>
        <button onClick={setValue}> Click Me</button>
      </div>
    </div>
  );
};
export default App;
