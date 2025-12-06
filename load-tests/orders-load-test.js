import http from 'k6/http';
import { sleep, check } from 'k6';

// Detect environment and construct appropriate URL
function getApiUrl() {
  // Check if running in Codespaces
  const codespaceName = __ENV.CODESPACE_NAME;
  const githubCodespacesPortForwardingDomain = __ENV.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN;
  
  if (codespaceName && githubCodespacesPortForwardingDomain) {
    // Codespaces environment
    return `https://${codespaceName}-8080.${githubCodespacesPortForwardingDomain}`;
  }
  
  // Allow manual override via environment variable
  if (__ENV.API_GATEWAY_URL) {
    return __ENV.API_GATEWAY_URL;
  }
  
  // Default to docker-compose network (for local development)
  return 'http://api-gateway:8080';
}

const API_GATEWAY_URL = getApiUrl();

console.log(`Using API Gateway URL: ${API_GATEWAY_URL}`);

export let options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '60s', target: 50 },
    { duration: '30s', target: 0 }
  ],
};

export default function () {
  const payload = JSON.stringify({
    productId: 1,
    quantity: 1
  });

  const params = {
    headers: { 
      'Content-Type': 'application/json'
    }
  };

  const res = http.post(`${API_GATEWAY_URL}/orders`, payload, params);
  
  check(res, { 
    'status 200 or 201': (r) => r.status === 200 || r.status === 201,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'no server errors': (r) => r.status < 500
  });
  
  if (res.status !== 200 && res.status !== 201) {
    console.log(`Error: ${res.status} - ${res.body}`);
  }
  
  sleep(1);
}