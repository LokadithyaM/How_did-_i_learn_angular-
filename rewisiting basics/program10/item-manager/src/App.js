import React, {useState} from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  
  const handleAddItem = () => {
    if(newItem.trim()===''){
      alert('please enter a valid item');
      return;
    }else if(items.includes(newItem)){
      alert('Item already exists');
      return;
    }

    setItems([...items,newItem]);
    setNewItem('');
  }

  const removeItem = (index) => {
    setItems(items.filter((_,i) => i!== index));
  }

  return (
    <div className="App">
      <h1>Item Manager</h1>
      <input type="text" value={newItem} onChange = {(e) => setNewItem(e.target.value)} placeholder='Enter new tiem'></input>
      <button onClick={handleAddItem}>submit</button>

      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}{' '}
            <button onClick={() => removeItem(index)}>Remove</button>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;
