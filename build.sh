#!/bin/bash

# Split Flap Display - Build Script
echo "🔧 Building Split Flap Display Component..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -f split-flap-digit.min.js split-flap-digit.min.js.map

# Build minified version
echo "⚡ Minifying JavaScript..."
npm run build

# Check if build was successful
if [ -f "split-flap-digit.min.js" ]; then
    # Get file sizes
    ORIGINAL_SIZE=$(wc -c < split-flap-digit.js | tr -d ' ')
    MINIFIED_SIZE=$(wc -c < split-flap-digit.min.js | tr -d ' ')
    REDUCTION=$(echo "scale=1; (($ORIGINAL_SIZE - $MINIFIED_SIZE) * 100) / $ORIGINAL_SIZE" | bc)
    
    echo "✅ Build completed successfully!"
    echo "📊 File sizes:"
    echo "   Original:  ${ORIGINAL_SIZE} bytes"
    echo "   Minified:  ${MINIFIED_SIZE} bytes"
    echo "   Reduction: ${REDUCTION}%"
    echo ""
    echo "🚀 Use split-flap-digit.min.js for production"
else
    echo "❌ Build failed!"
    exit 1
fi