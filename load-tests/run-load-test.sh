#!/bin/bash
set -e

echo "🚀 Starting Load Test..."

# Detect the project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." 2>/dev/null && pwd || pwd )"

# Find the load test script
SCRIPT_FILE="orders-load-test.js"
SCRIPT_PATH=""

# Check multiple possible locations
if [ -f "$SCRIPT_DIR/$SCRIPT_FILE" ]; then
    SCRIPT_PATH="$SCRIPT_DIR/$SCRIPT_FILE"
elif [ -f "$PROJECT_ROOT/load-tests/$SCRIPT_FILE" ]; then
    SCRIPT_PATH="$PROJECT_ROOT/load-tests/$SCRIPT_FILE"
elif [ -f "$SCRIPT_FILE" ]; then
    SCRIPT_PATH="$SCRIPT_FILE"
elif [ -f "load-tests/$SCRIPT_FILE" ]; then
    SCRIPT_PATH="load-tests/$SCRIPT_FILE"
else
    echo "❌ Error: Cannot find $SCRIPT_FILE"
    echo "   Searched in:"
    echo "   - $SCRIPT_DIR"
    echo "   - $PROJECT_ROOT/load-tests"
    echo "   - $(pwd)"
    echo "   - $(pwd)/load-tests"
    exit 1
fi

echo "📁 Using script: $SCRIPT_PATH"

# Check if running in Codespaces
if [ -n "$CODESPACE_NAME" ]; then
    echo "📦 Detected GitHub Codespaces environment"
    echo "   Codespace: $CODESPACE_NAME"
    
    # Construct the API Gateway URL
    API_URL="https://${CODESPACE_NAME}-8080.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    echo "   API Gateway URL: $API_URL"
    
    # Test if the API is reachable
    echo "🔍 Testing API connectivity..."
    if curl -sf "${API_URL}/actuator/prometheus" > /dev/null; then
        echo "✅ API is reachable"
    else
        echo "❌ Warning: API might not be reachable at $API_URL"
        echo "   Make sure:"
        echo "   1. Services are running (docker compose up -d)"
        echo "   2. Port 8080 is forwarded in Codespaces"
        echo ""
        read -p "Continue anyway? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    # Export for k6
    export CODESPACE_NAME
    export GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN
else
    echo "💻 Local environment detected"
    echo "   Using docker-compose network: http://api-gateway:8080"
    
    # Check if running inside Docker network
    if ! docker network ls | grep -q "backend"; then
        echo "⚠️  Warning: Docker network 'backend' not found"
        echo "   Make sure services are running: docker compose up -d"
    fi
fi

# Install k6 if not present
if ! command -v k6 &> /dev/null; then
    echo "📥 k6 not found. Installing..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo gpg -k
        sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
        echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
        sudo apt-get update
        sudo apt-get install k6 -y
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install k6
    else
        echo "❌ Unsupported OS. Please install k6 manually: https://k6.io/docs/getting-started/installation"
        exit 1
    fi
fi

# Run the load test
echo ""
echo "🏃 Running k6 load test..."
echo "   Working directory: $(pwd)"
echo "   Script path: $SCRIPT_PATH"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

k6 run "$SCRIPT_PATH"

echo ""
echo "✅ Load test complete!"