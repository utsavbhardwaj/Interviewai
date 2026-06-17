import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

let redisClient: Redis | null = null;
const isRedisConfigured = !!REDIS_URL;

// Simple in-memory fallback cache structure
interface CacheEntry {
  value: string;
  expiresAt: number;
}
const localCache = new Map<string, CacheEntry>();

if (isRedisConfigured) {
  try {
    console.log(`[Redis] Connecting to Redis at ${REDIS_URL}...`);
    redisClient = new Redis(REDIS_URL);
    redisClient.on("error", (err) => {
      console.error("[Redis] Connection error:", err);
    });
    redisClient.on("connect", () => {
      console.log("[Redis] Connected successfully.");
    });
  } catch (error) {
    console.error("[Redis] Failed to initialize client:", error);
  }
} else {
  console.log("[Redis] No REDIS_URL configured. Using in-memory fallback cache.");
}

/**
 * Retrieves cached content by key. Falls back to memory cache if Redis is not configured or fails.
 */
export async function getCache(key: string): Promise<string | null> {
  if (redisClient) {
    try {
      return await redisClient.get(key);
    } catch (err) {
      console.error(`[Redis] Get failed for key ${key}:`, err);
    }
  }

  // Local Map Fallback
  const entry = localCache.get(key);
  if (entry) {
    if (Date.now() < entry.expiresAt) {
      return entry.value;
    }
    localCache.delete(key);
  }
  return null;
}

/**
 * Sets cache content by key with a time-to-live (TTL) duration in seconds.
 */
export async function setCache(key: string, value: string, ttlSeconds: number): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.set(key, value, "EX", ttlSeconds);
      return;
    } catch (err) {
      console.error(`[Redis] Set failed for key ${key}:`, err);
    }
  }

  // Local Map Fallback
  localCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}
