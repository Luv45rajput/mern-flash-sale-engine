// Local In-Memory Cache Mock (Bypasses Upstash network blocks entirely)
const cache = new Map();

const redisClient = {
  set: async (key, value) => { cache.set(key, String(value)); return "OK"; },
  get: async (key) => cache.get(key) || null,
  decrBy: async (key, val) => {
    let current = parseInt(cache.get(key) || "0", 10);
    current -= val;
    cache.set(key, String(current));
    return current;
  },
  incrBy: async (key, val) => {
    let current = parseInt(cache.get(key) || "0", 10);
    current += val;
    cache.set(key, String(current));
    return current;
  }
};

console.log('Using Local In-Memory Cache Mock');
module.exports = redisClient;