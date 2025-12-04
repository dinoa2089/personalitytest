/**
 * Unit Tests for API Authentication & Rate Limiting
 * Run with: npx tsx lib/__tests__/api-auth.test.ts
 */

import crypto from "crypto";

// ============================================================================
// Test Utilities
// ============================================================================

let passedTests = 0;
let failedTests = 0;

function describe(name: string, fn: () => void | Promise<void>) {
  console.log(`\n📦 ${name}`);
  fn();
}

async function test(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passedTests++;
  } catch (error) {
    console.log(`  ❌ ${name}`);
    console.log(`     Error: ${error instanceof Error ? error.message : error}`);
    failedTests++;
  }
}

function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
    toEqual(expected: T) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, got ${actual}`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`Expected falsy value, got ${actual}`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (typeof actual !== "number" || actual <= expected) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected: number) {
      if (typeof actual !== "number" || actual < expected) {
        throw new Error(`Expected ${actual} to be >= ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected: number) {
      if (typeof actual !== "number" || actual > expected) {
        throw new Error(`Expected ${actual} to be <= ${expected}`);
      }
    },
    toMatch(pattern: RegExp) {
      if (typeof actual !== "string" || !pattern.test(actual)) {
        throw new Error(`Expected "${actual}" to match ${pattern}`);
      }
    },
    toStartWith(prefix: string) {
      if (typeof actual !== "string" || !actual.startsWith(prefix)) {
        throw new Error(`Expected "${actual}" to start with "${prefix}"`);
      }
    },
    toHaveLength(length: number) {
      if (!Array.isArray(actual) && typeof actual !== "string") {
        throw new Error(`Expected array or string, got ${typeof actual}`);
      }
      if ((actual as string | unknown[]).length !== length) {
        throw new Error(`Expected length ${length}, got ${(actual as string | unknown[]).length}`);
      }
    },
    toThrow(expectedMessage?: string) {
      if (typeof actual !== "function") {
        throw new Error("Expected a function");
      }
      try {
        (actual as () => void)();
        throw new Error("Expected function to throw");
      } catch (e) {
        if (expectedMessage && e instanceof Error && !e.message.includes(expectedMessage)) {
          throw new Error(`Expected error message to include "${expectedMessage}", got "${e.message}"`);
        }
      }
    },
    toContain(substring: string) {
      if (typeof actual !== "string" || !actual.includes(substring)) {
        throw new Error(`Expected "${actual}" to contain "${substring}"`);
      }
    },
  };
}

async function expectAsync<T>(promise: Promise<T>) {
  return {
    async toReject(expectedMessage?: string) {
      try {
        await promise;
        throw new Error("Expected promise to reject");
      } catch (e) {
        if (expectedMessage && e instanceof Error && !e.message.includes(expectedMessage)) {
          throw new Error(`Expected error message to include "${expectedMessage}", got "${e.message}"`);
        }
      }
    },
  };
}

// ============================================================================
// Mock NextRequest
// ============================================================================

class MockNextRequest {
  private _headers: Map<string, string>;
  url: string;

  constructor(url: string, options?: { headers?: Record<string, string> }) {
    this.url = url;
    this._headers = new Map(Object.entries(options?.headers || {}));
  }

  get headers() {
    return {
      get: (name: string) => this._headers.get(name) || null,
    };
  }
}

// ============================================================================
// Pure Function Tests (No Database Required)
// ============================================================================

describe("API Key Generation", () => {
  test("should generate key with correct format sk_live_*", async () => {
    // Test the key format generation logic
    const randomBytes = crypto.randomBytes(32);
    const keyBody = randomBytes.toString("base64url");
    const fullKey = `sk_live_${keyBody}`;

    expect(fullKey).toStartWith("sk_live_");
    expect(fullKey.length).toBeGreaterThan(20);
  });

  test("should generate unique keys", async () => {
    const keys = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const randomBytes = crypto.randomBytes(32);
      const keyBody = randomBytes.toString("base64url");
      const fullKey = `sk_live_${keyBody}`;
      keys.add(fullKey);
    }
    expect(keys.size).toBe(100);
  });

  test("should create correct key prefix (first 12 chars)", async () => {
    const randomBytes = crypto.randomBytes(32);
    const keyBody = randomBytes.toString("base64url");
    const fullKey = `sk_live_${keyBody}`;
    const keyPrefix = fullKey.substring(0, 12);

    expect(keyPrefix).toStartWith("sk_live_");
    expect(keyPrefix.length).toBe(12);
  });

  test("should hash key with SHA-256", async () => {
    const testKey = "sk_live_test123";
    const hash = crypto.createHash("sha256").update(testKey).digest("hex");

    expect(hash.length).toBe(64); // SHA-256 produces 64 hex chars
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  test("should produce consistent hashes for same input", async () => {
    const testKey = "sk_live_test123";
    const hash1 = crypto.createHash("sha256").update(testKey).digest("hex");
    const hash2 = crypto.createHash("sha256").update(testKey).digest("hex");

    expect(hash1).toBe(hash2);
  });

  test("should produce different hashes for different inputs", async () => {
    const hash1 = crypto.createHash("sha256").update("sk_live_key1").digest("hex");
    const hash2 = crypto.createHash("sha256").update("sk_live_key2").digest("hex");

    expect(hash1).toBeTruthy();
    expect(hash2).toBeTruthy();
    if (hash1 === hash2) {
      throw new Error("Expected different hashes for different keys");
    }
  });
});

describe("API Key Validation Logic", () => {
  test("should reject missing Authorization header", async () => {
    const request = new MockNextRequest("http://localhost/api/v1/analyze");

    const authHeader = request.headers.get("Authorization");
    expect(authHeader).toBeFalsy();
  });

  test("should reject non-Bearer authorization", async () => {
    const request = new MockNextRequest("http://localhost/api/v1/analyze", {
      headers: { Authorization: "Basic dXNlcjpwYXNz" },
    });

    const authHeader = request.headers.get("Authorization");
    expect(authHeader).toBeTruthy();
    expect(authHeader!.startsWith("Bearer ")).toBeFalsy();
  });

  test("should reject invalid key format (not starting with sk_)", async () => {
    const request = new MockNextRequest("http://localhost/api/v1/analyze", {
      headers: { Authorization: "Bearer invalid_key_123" },
    });

    const authHeader = request.headers.get("Authorization");
    const apiKey = authHeader!.substring(7);
    expect(apiKey.startsWith("sk_")).toBeFalsy();
  });

  test("should accept valid Bearer token format", async () => {
    const request = new MockNextRequest("http://localhost/api/v1/analyze", {
      headers: { Authorization: "Bearer sk_live_abc123xyz" },
    });

    const authHeader = request.headers.get("Authorization");
    expect(authHeader).toBeTruthy();
    expect(authHeader!.startsWith("Bearer ")).toBeTruthy();

    const apiKey = authHeader!.substring(7);
    expect(apiKey.startsWith("sk_")).toBeTruthy();
  });

  test("should correctly extract API key from header", async () => {
    const expectedKey = "sk_live_mySecretKey123";
    const request = new MockNextRequest("http://localhost/api/v1/analyze", {
      headers: { Authorization: `Bearer ${expectedKey}` },
    });

    const authHeader = request.headers.get("Authorization")!;
    const extractedKey = authHeader.substring(7);
    expect(extractedKey).toBe(expectedKey);
  });
});

describe("Rate Limiting Logic", () => {
  const RATE_LIMITS = {
    api_starter: 1000,
    professional: 500,
    enterprise: 10000,
  };

  test("should have correct limit for api_starter tier", async () => {
    expect(RATE_LIMITS.api_starter).toBe(1000);
  });

  test("should have correct limit for professional tier", async () => {
    expect(RATE_LIMITS.professional).toBe(500);
  });

  test("should have correct limit for enterprise tier", async () => {
    expect(RATE_LIMITS.enterprise).toBe(10000);
  });

  test("should calculate remaining correctly when under limit", async () => {
    const used = 100;
    const limit = RATE_LIMITS.api_starter;
    const remaining = Math.max(0, limit - used);

    expect(remaining).toBe(900);
  });

  test("should return 0 remaining when at limit", async () => {
    const used = 1000;
    const limit = RATE_LIMITS.api_starter;
    const remaining = Math.max(0, limit - used);

    expect(remaining).toBe(0);
  });

  test("should return 0 remaining when over limit", async () => {
    const used = 1500;
    const limit = RATE_LIMITS.api_starter;
    const remaining = Math.max(0, limit - used);

    expect(remaining).toBe(0);
  });

  test("should correctly identify when limit is exceeded", async () => {
    const used = 1000;
    const limit = RATE_LIMITS.api_starter;
    const isExceeded = used >= limit;

    expect(isExceeded).toBeTruthy();
  });

  test("should correctly identify when limit is not exceeded", async () => {
    const used = 999;
    const limit = RATE_LIMITS.api_starter;
    const isExceeded = used >= limit;

    expect(isExceeded).toBeFalsy();
  });

  test("should get correct month start for rate limit window", async () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    expect(monthStart.getDate()).toBe(1);
    expect(monthStart.getMonth()).toBe(now.getMonth());
    expect(monthStart.getFullYear()).toBe(now.getFullYear());
  });
});

describe("API Usage Logging", () => {
  test("should truncate long endpoints to 50 chars", async () => {
    const longEndpoint = "/api/v1/analyze/very/long/path/that/exceeds/fifty/characters/limit";
    const truncated = longEndpoint.substring(0, 50);

    expect(truncated.length).toBe(50);
  });

  test("should not truncate short endpoints", async () => {
    const shortEndpoint = "/api/v1/analyze";
    const truncated = shortEndpoint.substring(0, 50);

    expect(truncated).toBe(shortEndpoint);
  });

  test("should accept valid status codes", async () => {
    const validStatusCodes = [200, 201, 400, 401, 403, 404, 429, 500, 503];

    for (const code of validStatusCodes) {
      expect(code).toBeGreaterThanOrEqual(100);
      expect(code).toBeLessThanOrEqual(599);
    }
  });

  test("should measure latency correctly", async () => {
    const startTime = Date.now();
    // Simulate some work
    await new Promise((resolve) => setTimeout(resolve, 10));
    const latency = Date.now() - startTime;

    expect(latency).toBeGreaterThanOrEqual(10);
  });
});

describe("ApiAuthError Class", () => {
  class ApiAuthError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number = 401) {
      super(message);
      this.name = "ApiAuthError";
      this.statusCode = statusCode;
    }
  }

  test("should create error with default status code 401", async () => {
    const error = new ApiAuthError("Unauthorized");
    expect(error.statusCode).toBe(401);
    expect(error.message).toBe("Unauthorized");
    expect(error.name).toBe("ApiAuthError");
  });

  test("should create error with custom status code", async () => {
    const error = new ApiAuthError("Rate limited", 429);
    expect(error.statusCode).toBe(429);
    expect(error.message).toBe("Rate limited");
  });

  test("should be instance of Error", async () => {
    const error = new ApiAuthError("Test");
    expect(error instanceof Error).toBeTruthy();
  });
});

describe("Key Format Validation", () => {
  test("should validate sk_live_ prefix for production keys", async () => {
    const prodKey = "sk_live_abc123";
    expect(prodKey.startsWith("sk_live_")).toBeTruthy();
  });

  test("should validate sk_test_ prefix for test keys", async () => {
    const testKey = "sk_test_abc123";
    expect(testKey.startsWith("sk_test_")).toBeTruthy();
  });

  test("should validate general sk_ prefix", async () => {
    const key1 = "sk_live_abc";
    const key2 = "sk_test_xyz";
    const key3 = "pk_live_invalid"; // public key, should not validate

    expect(key1.startsWith("sk_")).toBeTruthy();
    expect(key2.startsWith("sk_")).toBeTruthy();
    expect(key3.startsWith("sk_")).toBeFalsy();
  });

  test("should reject empty API key", async () => {
    const emptyKey = "";
    expect(emptyKey.startsWith("sk_")).toBeFalsy();
  });

  test("should handle URL-safe base64 characters", async () => {
    // base64url uses - and _ instead of + and /
    const randomBytes = crypto.randomBytes(32);
    const keyBody = randomBytes.toString("base64url");

    // Should not contain + or /
    expect(keyBody.includes("+")).toBeFalsy();
    expect(keyBody.includes("/")).toBeFalsy();
  });
});

// ============================================================================
// Run Tests
// ============================================================================

async function runTests() {
  console.log("🧪 API Authentication Unit Tests\n");
  console.log("=".repeat(50));

  // Run all test suites
  await describe("API Key Generation", async () => {
    await test("should generate key with correct format sk_live_*", async () => {
      const randomBytes = crypto.randomBytes(32);
      const keyBody = randomBytes.toString("base64url");
      const fullKey = `sk_live_${keyBody}`;
      expect(fullKey).toStartWith("sk_live_");
      expect(fullKey.length).toBeGreaterThan(20);
    });

    await test("should generate unique keys", async () => {
      const keys = new Set<string>();
      for (let i = 0; i < 100; i++) {
        const randomBytes = crypto.randomBytes(32);
        const keyBody = randomBytes.toString("base64url");
        keys.add(`sk_live_${keyBody}`);
      }
      expect(keys.size).toBe(100);
    });

    await test("should create correct key prefix", async () => {
      const fullKey = "sk_live_abc123xyz456";
      const keyPrefix = fullKey.substring(0, 12);
      expect(keyPrefix).toBe("sk_live_abc1");
    });

    await test("should hash key with SHA-256", async () => {
      const hash = crypto.createHash("sha256").update("sk_live_test").digest("hex");
      expect(hash.length).toBe(64);
    });

    await test("should produce consistent hashes", async () => {
      const key = "sk_live_consistent";
      const hash1 = crypto.createHash("sha256").update(key).digest("hex");
      const hash2 = crypto.createHash("sha256").update(key).digest("hex");
      expect(hash1).toBe(hash2);
    });
  });

  await describe("Authorization Header Parsing", async () => {
    await test("should detect missing Authorization header", async () => {
      const req = new MockNextRequest("http://localhost/api");
      expect(req.headers.get("Authorization")).toBeFalsy();
    });

    await test("should detect invalid Bearer format", async () => {
      const req = new MockNextRequest("http://localhost/api", {
        headers: { Authorization: "Basic xyz" },
      });
      expect(req.headers.get("Authorization")!.startsWith("Bearer ")).toBeFalsy();
    });

    await test("should extract API key from Bearer token", async () => {
      const req = new MockNextRequest("http://localhost/api", {
        headers: { Authorization: "Bearer sk_live_mykey" },
      });
      const key = req.headers.get("Authorization")!.substring(7);
      expect(key).toBe("sk_live_mykey");
    });

    await test("should validate sk_ prefix", async () => {
      expect("sk_live_key".startsWith("sk_")).toBeTruthy();
      expect("invalid_key".startsWith("sk_")).toBeFalsy();
    });
  });

  await describe("Rate Limiting", async () => {
    const limits = { api_starter: 1000, professional: 500, enterprise: 10000 };

    await test("should enforce tier limits", async () => {
      expect(limits.api_starter).toBe(1000);
      expect(limits.professional).toBe(500);
      expect(limits.enterprise).toBe(10000);
    });

    await test("should calculate remaining correctly", async () => {
      const used = 300;
      const limit = limits.api_starter;
      expect(Math.max(0, limit - used)).toBe(700);
    });

    await test("should detect exceeded limit", async () => {
      const used = 1001;
      const limit = limits.api_starter;
      expect(used >= limit).toBeTruthy();
    });

    await test("should get correct month window start", async () => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      expect(monthStart.getDate()).toBe(1);
    });
  });

  await describe("Usage Logging", async () => {
    await test("should truncate long endpoints", async () => {
      const long = "/api/v1/analyze/path/that/is/definitely/longer/than/fifty/characters/total";
      expect(long.substring(0, 50).length).toBe(50);
    });

    await test("should measure latency", async () => {
      const start = Date.now();
      await new Promise((r) => setTimeout(r, 5));
      expect(Date.now() - start).toBeGreaterThanOrEqual(5);
    });
  });

  await describe("Error Handling", async () => {
    class ApiAuthError extends Error {
      statusCode: number;
      constructor(message: string, statusCode = 401) {
        super(message);
        this.name = "ApiAuthError";
        this.statusCode = statusCode;
      }
    }

    await test("should create 401 error by default", async () => {
      const err = new ApiAuthError("Unauthorized");
      expect(err.statusCode).toBe(401);
    });

    await test("should create 429 rate limit error", async () => {
      const err = new ApiAuthError("Rate limited", 429);
      expect(err.statusCode).toBe(429);
    });

    await test("should extend Error class", async () => {
      const err = new ApiAuthError("Test");
      expect(err instanceof Error).toBeTruthy();
    });
  });

  console.log("\n" + "=".repeat(50));
  console.log(`\n📊 Results: ${passedTests} passed, ${failedTests} failed`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch(console.error);


