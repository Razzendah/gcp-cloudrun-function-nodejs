#!/bin/bash

# Local Development and Testing Script

echo "🚀 Starting local Cloud Function development server..."
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Run tests first
echo "🧪 Running tests..."
npm test

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Tests passed! Starting local server..."
    echo ""
    echo "📡 Your function will be available at:"
    echo "   🌐 http://localhost:8080"
    echo ""
    echo "🔗 Test these endpoints:"
    echo "   Health: http://localhost:8080"
    echo "   Hello:  http://localhost:8080/api/hello?name=YourName"
    echo "   Data:   http://localhost:8080/api/data (POST)"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "================================================"
    echo ""
    
    # Start the development server
    npm run dev
else
    echo ""
    echo "❌ Tests failed! Please fix the issues before running locally."
    exit 1
fi
