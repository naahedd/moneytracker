import './App.css';
import { useEffect, useState } from "react";

function App() {
  const [name,setName] = useState('');
  const [datetime,setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState('');

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, [])

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL+'/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
  ev.preventDefault();

  const price = parseFloat(name.split(' ')[0]); 

  fetch(`${process.env.REACT_APP_API_URL}/transaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: name.substring(name.indexOf(' ') + 1).trim(), 
      description,
      datetime,
      price
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(json => {
    setName('');
    setDatetime('');
    setDescription('');
    setTransactions([...transactions, json]); 
  })
  .catch(error => {
    console.error('Failed to add transaction:', error);
  });
}

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];
  return (
    <main>
      <h1>${balance}<span>{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input type="text" 
          value={name} 
          onChange={ev=>setName(ev.target.value)} placeholder={'+200 tv'}/>
          <input value={datetime} 
          onChange={ev=>setDatetime(ev.target.value)}
          type="datetime-local"/>
        </div>
        <div className="description">
          <input value={description} 
          onChange={ev=>setDescription(ev.target.value)}
          type="text" placeholder={'description'}/>
        </div>
        <button type="submit">
          Add New Transaction
        </button>
      </form>
      <div className="transactions">
        {transactions.length > 0 && transactions.map(transaction => (

          <div className="transaction">
          <div className="left">
            <div className="name"> {transaction.name} </div>
            <div className="description">{transaction.description}</div>
          </div>
          <div className="right">
            <div className={"price " +(transaction.price<0?'red':'green')}>{transaction.price}</div>
            <div className="datetime">{transaction.datetime}</div>
          </div>

          </div>
          
        ))}
        
      </div>
    </main>
  );
}

export default App;
