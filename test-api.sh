#!/bin/bash

# Test script for CareX API endpoints
echo "🧪 Testing CareX API endpoints..."
echo

BASE_URL="http://localhost:5000/api"

# Test 1: Health check
echo "1. Testing health endpoint..."
response=$(curl -s "$BASE_URL/health")
echo "Response: $response"
echo

# Test 2: Register a test user
echo "2. Testing user registration..."
register_response=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testpass123",
    "profile": {
      "age": 25,
      "gender": "male",
      "height": 175,
      "weight": 70,
      "activityLevel": "moderate",
      "goal": "maintain"
    }
  }')
echo "Response: $register_response"
echo

# Extract token from response (if successful)
token=$(echo $register_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$token" ]; then
  echo "✅ Registration successful! Token: ${token:0:20}..."
  echo
  
  # Test 3: Get user profile
  echo "3. Testing get user profile..."
  profile_response=$(curl -s "$BASE_URL/user/profile" \
    -H "Authorization: Bearer $token")
  echo "Response: $profile_response"
  echo
  
  # Test 4: Search foods
  echo "4. Testing food search..."
  search_response=$(curl -s "$BASE_URL/foods/search?q=apple" \
    -H "Authorization: Bearer $token")
  echo "Response: $search_response"
  echo
  
  # Test 5: Get food categories
  echo "5. Testing food categories..."
  categories_response=$(curl -s "$BASE_URL/foods/meta/categories" \
    -H "Authorization: Bearer $token")
  echo "Response: $categories_response"
  echo
  
else
  echo "❌ Registration failed or user already exists"
  echo
  
  # Try to login instead
  echo "6. Testing user login..."
  login_response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "testpass123"
    }')
  echo "Response: $login_response"
  echo
  
  token=$(echo $login_response | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  
  if [ -n "$token" ]; then
    echo "✅ Login successful! Token: ${token:0:20}..."
    echo
  else
    echo "❌ Login failed"
    exit 1
  fi
fi

echo "🎉 API testing completed!"
