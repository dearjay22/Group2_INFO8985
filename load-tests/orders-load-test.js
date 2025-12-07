import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

// Custom metric for failed requests
export let failedRequests = new Counter('failed_requests');

export let options = {
  stages: [
    { duration: '30s', target: 20 },   // ramp up to 20 VUs
    { duration: '2m', target: 100 },   // sustain 100 VUs
    { duration: '30s', target: 0 }     // ramp down
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],   // <5% requests fail
    'failed_requests': ['count<50'],  // optional custom threshold
  },
};

// Array of example product IDs for random orders
const productIds = [1, 2, 3, 4, 5];

export default function () {
  // --- Order Service: create random order ---
  const orderPayload = {
    productId: productIds[Math.floor(Math.random() * productIds.length)],
    quantity: Math.floor(Math.random() * 5) + 1, // 1-5 quantity
  };
  const orderRes = http.post('http://order-service:8082/orders', JSON.stringify(orderPayload), {
    headers: { 'Content-Type': 'application/json' }
  });
  check(orderRes, { 'order status 200': (r) => r.status === 200 });
  if (orderRes.status !== 200) failedRequests.add(1);

  // --- Product Service: fetch product list ---
  const productsRes = http.get('http://product-service:8081/products');
  check(productsRes, { 'products status 200': (r) => r.status === 200 });
  if (productsRes.status !== 200) failedRequests.add(1);

  // --- API Gateway: fetch orders (all) ---
  const gatewayRes = http.get('http://api-gateway:8080/orders');
  check(gatewayRes, { 'gateway orders status 200': (r) => r.status === 200 });
  if (gatewayRes.status !== 200) failedRequests.add(1);

  // --- Sleep to simulate user think time ---
  sleep(Math.random() * 2); // random 0-2 seconds
}
