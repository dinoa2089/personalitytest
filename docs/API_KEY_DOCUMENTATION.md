# API Key Documentation

## Overview

The Personality Intelligence API uses API keys for authentication and rate limiting. This document describes the key format, usage, and best practices.

---

## API Key Format

### Structure

```
pi_live_<random_base64url_string>
```

**Components:**
- `pi_` - Personality Intelligence key prefix (distinguishes from public keys)
- `live_` - Environment indicator (`live` for production, `test` for testing)
- `<random_base64url_string>` - 32 bytes of cryptographically secure random data, base64url encoded

### Examples

```
pi_live_dGhpcyBpcyBhIHNhbXBsZSBrZXkgZm9yIGRvY3VtZW50YXRpb24
pi_test_YW5vdGhlciBleGFtcGxlIGtleSBmb3IgdGVzdGluZw
```

### Key Prefix

For display purposes, only the first 12 characters are shown:
```
pi_live_XXXX****
```

---

## API Tiers & Rate Limits

| Tier | Monthly Limit | Use Case |
|------|---------------|----------|
| `api_starter` | 1,000 requests | Individual developers, prototyping |
| `professional` | 500 requests | Small teams, moderate usage |
| `enterprise` | 10,000 requests | Large organizations, high volume |

Rate limits reset on the 1st of each month at 00:00 UTC.

---

## Authentication

### Making Requests

Include your API key in the `Authorization` header using the Bearer scheme:

```bash
curl -X GET "https://api.example.com/api/v1/analyze" \
  -H "Authorization: Bearer pi_live_your_api_key_here" \
  -H "Content-Type: application/json"
```

### JavaScript/TypeScript Example

```typescript
const response = await fetch('https://api.example.com/api/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ data: 'your data' }),
});
```

### Response Headers

Successful requests include rate limit information in response headers:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Your monthly request limit |
| `X-RateLimit-Remaining` | Requests remaining this month |

---

## API Key Management

### Creating a Key

**Endpoint:** `POST /api/v1/keys`

**Authentication:** Requires Clerk session (not API key)

**Request:**
```json
{
  "tier": "api_starter"
}
```

**Response:**
```json
{
  "success": true,
  "apiKey": "pi_live_...",
  "keyPrefix": "pi_live_XXXX",
  "keyId": "uuid-of-key",
  "message": "Store this API key securely - it will only be shown once!"
}
```

> ⚠️ **Important:** The full API key is only returned once. Store it securely immediately.

### Listing Keys

**Endpoint:** `GET /api/v1/keys`

**Authentication:** Requires Clerk session

**Response:**
```json
{
  "keys": [
    {
      "id": "uuid",
      "key_prefix": "pi_live_XXXX",
      "tier": "api_starter",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "last_used_at": "2024-01-15T12:30:00Z"
    }
  ],
  "stats": {
    "totalThisMonth": 150,
    "totalToday": 25,
    "avgLatencyMs": 120,
    "errorRate": 2,
    "byEndpoint": {
      "/api/v1/analyze": 100,
      "/api/v1/person": 50
    }
  }
}
```

### Revoking a Key

**Endpoint:** `DELETE /api/v1/keys?keyId=<uuid>`

**Authentication:** Requires Clerk session

**Response:**
```json
{
  "success": true,
  "message": "API key revoked"
}
```

### Permanently Deleting a Key

**Endpoint:** `DELETE /api/v1/keys?keyId=<uuid>&permanent=true`

**Authentication:** Requires Clerk session

---

## Error Responses

### 401 Unauthorized

**Missing Authorization Header:**
```json
{
  "error": "Missing Authorization header",
  "code": "UNAUTHORIZED"
}
```

**Invalid Format:**
```json
{
  "error": "Invalid Authorization format. Use: Bearer <api_key>",
  "code": "UNAUTHORIZED"
}
```

**Invalid Key:**
```json
{
  "error": "Invalid API key",
  "code": "UNAUTHORIZED"
}
```

**Deactivated Key:**
```json
{
  "error": "API key has been deactivated",
  "code": "UNAUTHORIZED"
}
```

### 429 Rate Limited

```json
{
  "error": "Rate limit exceeded. Used 1000/1000 requests this month.",
  "code": "RATE_LIMITED"
}
```

### 500 Server Error

```json
{
  "error": "Internal server error",
  "code": "SERVER_ERROR"
}
```

---

## Security Best Practices

### Do

✅ Store API keys in environment variables or secure vaults  
✅ Use HTTPS for all API requests  
✅ Rotate keys periodically  
✅ Use separate keys for development and production  
✅ Revoke keys immediately if compromised  
✅ Monitor usage for anomalies  

### Don't

❌ Commit API keys to version control  
❌ Share keys in plaintext (email, chat, etc.)  
❌ Expose keys in client-side code  
❌ Log full API keys  
❌ Use production keys for testing  

### Environment Variables

```bash
# .env.local (never commit this file!)
PERSONALITY_API_KEY=pi_live_your_key_here
```

```typescript
// Access in code
const apiKey = process.env.PERSONALITY_API_KEY;
```

---

## Database Schema

### `api_keys` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to users |
| `key_hash` | VARCHAR(64) | SHA-256 hash of the key |
| `key_prefix` | VARCHAR(20) | Display prefix (pi_live_XXXX) |
| `tier` | VARCHAR(20) | api_starter, professional, enterprise |
| `is_active` | BOOLEAN | Whether key is active |
| `created_at` | TIMESTAMP | Creation time |
| `last_used_at` | TIMESTAMP | Last usage time |

### `api_usage_logs` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `api_key_id` | UUID | Foreign key to api_keys |
| `endpoint` | VARCHAR(50) | API endpoint called |
| `status_code` | INTEGER | HTTP response code |
| `latency_ms` | INTEGER | Request latency in ms |
| `created_at` | TIMESTAMP | Request timestamp |

---

## API Endpoints

| Method | Endpoint | Auth Type | Description |
|--------|----------|-----------|-------------|
| POST | `/api/v1/analyze` | API Key | Analyze personality data |
| GET | `/api/v1/analyze` | API Key | Get endpoint info |
| GET | `/api/v1/keys` | Clerk Session | List your API keys |
| POST | `/api/v1/keys` | Clerk Session | Create new API key |
| DELETE | `/api/v1/keys` | Clerk Session | Revoke/delete API key |

---

## Code Examples

### Node.js

```javascript
const fetch = require('node-fetch');

async function analyzePersonality(data) {
  const response = await fetch('https://api.example.com/api/v1/analyze', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}
```

### Python

```python
import requests
import os

def analyze_personality(data):
    response = requests.post(
        'https://api.example.com/api/v1/analyze',
        headers={
            'Authorization': f'Bearer {os.environ["API_KEY"]}',
            'Content-Type': 'application/json',
        },
        json=data,
    )
    response.raise_for_status()
    return response.json()
```

### cURL

```bash
curl -X POST "https://api.example.com/api/v1/analyze" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "Sample text for analysis"}'
```

---

## Troubleshooting

### "Missing Authorization header"

Ensure you're including the `Authorization` header:
```bash
-H "Authorization: Bearer pi_live_..."
```

### "Invalid API key format"

Check that your key starts with `pi_` prefix.

### "Invalid API key"

The key may have been deleted or never existed. Generate a new key.

### "API key has been deactivated"

The key was revoked. Generate a new key or contact support.

### "Rate limit exceeded"

Wait until the start of next month, or upgrade your tier.

---

## Support

For API issues or questions:
- Check the [API Status Page](#)
- Review [Common Issues](#troubleshooting)
- Contact support at api-support@example.com

