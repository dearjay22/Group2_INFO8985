import React from "react";

function App() {
  const path = window.location.pathname;
  return (
    <div>
      <h1>ObsShop Shell</h1>
      <nav><a href="/">Home</a> | <a href="/products">Products</a></nav>
      <div>
        {path === "/products" ? <iframe src="http://localhost:3001/" style={{width:"100%",height:"80vh"}} /> : <p>Welcome</p>}
      </div>
    </div>
  );
}

export default App;
