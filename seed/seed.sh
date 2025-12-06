#!/usr/bin/env sh
set -eu

# Config - internal Docker hostnames & ports
PRODUCT_URL="http://product-service:8081/products/bulk"
ORDER_URL="http://order-service:8082/orders/bulk"
PRODUCTS_FILE="/data/products.json"
ORDERS_FILE="/data/orders.json"

wait_for() {
  url="$1"
  tries=0
  max=60
  until [ "$tries" -ge "$max" ]; do
    if curl -sSf "$url" >/dev/null 2>&1; then
      echo "OK: $url"
      return 0
    fi
    tries=$((tries+1))
    echo "Waiting for $url ... ($tries/$max)"
    sleep 2
  done
  echo "Timeout waiting for $url" >&2
  return 1
}

echo "⏳ Waiting for services to become healthy..."
# use actuator health endpoints
wait_for "http://product-service:8081/actuator/health" || true
wait_for "http://order-service:8082/actuator/health" || true

echo "🌱 Seeding products..."
if [ -f "$PRODUCTS_FILE" ]; then
  # If the endpoint accepts array payload
  if curl -sS -X POST -H "Content-Type: application/json" --data @"$PRODUCTS_FILE" "$PRODUCT_URL"; then
    echo "✅ Products seeded (array payload)"
  else
    echo "Products seeding via array failed; attempting per-item..."
    # fallback: send each item separately
    if command -v jq >/dev/null 2>&1; then
      jq -c '.[]' "$PRODUCTS_FILE" | while read -r item; do
        curl -sS -X POST -H "Content-Type: application/json" --data "$item" "http://product-service:8081/products" || echo "single product post failed"
      done
      echo "✅ Products seeded (per-item)"
    else
      echo "jq not available; can't do per-item fallback"
    fi
  fi
else
  echo "Products file not found at $PRODUCTS_FILE"
fi

echo "🌱 Seeding orders..."
if [ -f "$ORDERS_FILE" ]; then
  if curl -sS -X POST -H "Content-Type: application/json" --data @"$ORDERS_FILE" "$ORDER_URL"; then
    echo "✅ Orders seeded (array payload)"
  else
    echo "Orders seeding via array failed; attempting per-item..."
    if command -v jq >/dev/null 2>&1; then
      jq -c '.[]' "$ORDERS_FILE" | while read -r item; do
        curl -sS -X POST -H "Content-Type: application/json" --data "$item" "http://order-service:8082/orders" || echo "single order post failed"
      done
      echo "✅ Orders seeded (per-item)"
    else
      echo "jq not available; can't do per-item fallback"
    fi
  fi
else
  echo "Orders file not found at $ORDERS_FILE"
fi

echo "🎉 Seeding complete!"
