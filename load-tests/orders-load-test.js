import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '60s', target: 50 },
    { duration: '30s', target: 0 }
  ],
};

export default function () {
  const res = http.post('http://api-gateway:8080/orders', JSON.stringify({productId:1,quantity:1}), {
    headers: { 'Content-Type': 'application/json' }
  });
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}
