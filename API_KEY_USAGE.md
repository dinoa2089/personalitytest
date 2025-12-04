# API Key Authentication Guide

## API Key Format

API keys follow this format:
```
pi_live_<base64url_random_string>
```

Example: `pi_live_abc123xyz789`

## Usage

Include the API key in the `Authorization` header:

```bash
curl -X POST https://yourdomain.com/api/v1/analyze \
  -H "Authorization: Bearer pi_live_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'
```

## Rate Limits

| Tier | Requests/Month |
|------|----------------|
| api_starter | 1,000 |
| professional | 500 |
| enterprise | 10,000 |

## Response Headers

Successful responses include rate limit headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
```

## Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 401 | UNAUTHORIZED | Invalid or missing API key |
| 429 | RATE_LIMITED | Monthly limit exceeded |
| 500 | SERVER_ERROR | Internal server error |

## Managing API Keys

Use the `/api/v1/keys` endpoint (requires Clerk authentication):

### List API Keys
```bash
GET /api/v1/keys
```

Response:
```json
{
  "keys": [
    {
      "id": "uuid",
      "key_prefix": "pi_live_XXXX",
      "tier": "api_starter",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "last_used_at": "2024-01-02T00:00:00Z"
    }
  ],
  "stats": {
    "totalThisMonth": 150,
    "totalToday": 10,
    "avgLatencyMs": 250,
    "errorRate": 2,
    "byEndpoint": {
      "/api/v1/analyze": 150
    }
  }
}
```

### Create API Key
```bash
POST /api/v1/keys
Content-Type: application/json

{
  "tier": "api_starter"
}
```

Response:
```json
{
  "success": true,
  "apiKey": "pi_live_abc123...",
  "keyPrefix": "pi_live_abc1",
  "keyId": "uuid",
  "message": "Store this API key securely - it will only be shown once!"
}
```

⚠️ **Important**: The full API key is only returned once. Store it securely!

### Revoke API Key
```bash
DELETE /api/v1/keys?keyId=<uuid>
```

### Delete API Key Permanently
```bash
DELETE /api/v1/keys?keyId=<uuid>&permanent=true
```

## Security Best Practices

1. **Never expose your API key** in client-side code or public repositories
2. **Rotate keys periodically** - create new keys and revoke old ones
3. **Use environment variables** to store API keys in your applications
4. **Monitor usage** regularly through the dashboard or API
5. **Revoke compromised keys immediately** if you suspect a leak

## Example Implementation

### JavaScript/Node.js
```javascript
const API_KEY = process.env.PERSONALITY_API_KEY;

async function analyzePersonality(data) {
  const response = await fetch('https://yourdomain.com/api/v1/analyze', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PERSONALITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
```

### Python
```python
import os
import requests

API_KEY = os.environ.get('PERSONALITY_API_KEY')

def analyze_personality(data):
    response = requests.post(
        'https://yourdomain.com/api/v1/analyze',
        headers={
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json',
        },
        json=data
    )
    response.raise_for_status()
    return response.json()
```

### cURL
```bash
curl -X POST https://yourdomain.com/api/v1/analyze \
  -H "Authorization: Bearer $PERSONALITY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "linkedin_url": "https://linkedin.com/in/example",
    "include_insights": true
  }'
```

## Troubleshooting

### "Missing Authorization header"
Make sure you're including the `Authorization` header with the `Bearer` prefix.

### "Invalid API key format"
API keys must start with `pi_`. Check that you're using the correct key.

### "Invalid API key"
The key may have been revoked or deleted. Generate a new key.

### "API key has been deactivated"
The key was revoked. Generate a new key or reactivate if possible.

### "Rate limit exceeded"
You've used all your monthly requests. Wait for the next billing cycle or upgrade your plan.

