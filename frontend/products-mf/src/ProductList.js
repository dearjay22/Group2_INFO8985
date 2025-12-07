import React, {useEffect, useState} from "react";

const API_BASE = process.env.REACT_APP_API_BASE || "http://api-gateway:8080";

export default function ProductList(){
  const [products,setProducts] = useState([]);
  useEffect(()=>{
    console.log("Fetching products...");
    const start = performance.now();
    fetch(`${API_BASE}/products`)
      .then(r => r.json())
      .then(data => {
        console.log("Products fetched", {count: data.length});
        console.log("duration", performance.now()-start);
        setProducts(data);
      })
      .catch(e => console.error(e));
  },[]);
  return (
    <div>
      <h2>Products (microfrontend)</h2>
      <ul>{products.map(p => <li key={p.id}>{p.name} - ${p.price} (inventory {p.inventory})</li>)}</ul>
    </div>
  );
}
