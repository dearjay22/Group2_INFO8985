import React from "react";

function App() {
  const path = window.location.pathname;

  const getApiUrl = () => {
    // Check if in Codespaces
    if (window.location.hostname.includes('app.github.dev')) {
      // Extract codespace name from current URL
      const match = window.location.hostname.match(/^(.+)-\d+\.app\.github\.dev$/);
      if (match) {
        const codespaceName = match[1];
        // Construct API Gateway URL (port 8080)
        return `https://${codespaceName}-3001.app.github.dev`;
      }
    }
    
  };



  return (
    <div>
      <h1>ObsShop Shell</h1>

      <nav>
        <a href="/">Home</a> | <a href="/products">Products</a>
      </nav>

      <div>
        {path === "/products" ? (
          <iframe
            src= {`${getApiUrl()}`} 
            title="Products Microfrontend"
            style={{ width: "100%", height: "80vh" }}
          />
        ) : (
          <p>Welcome</p>
        )}
      </div>
    </div>
  );
}

export default App;
