import React, {useEffect,useState} from 'react';
function App() {

  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((res) =>res.json())
    .then((data)=>{
      setUser(data);
      setLoading(false);
    })
    .catch((error)=>{
      console.error("error",error);
      setLoading(false);
    })
  },[]);

  return (
    <div className="App">
      {loading?(
        <div>Loading....</div>
      ):(
        <ul>
          {user.map((item)=>(
            <li key={item.id}>
              <strong>{item.name} = {item.email}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
