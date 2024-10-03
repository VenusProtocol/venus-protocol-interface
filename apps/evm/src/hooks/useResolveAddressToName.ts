import { useEffect, useState, useCallback } from "react";
import { createWeb3Name } from "@web3-name-sdk/core";

const CACHE_KEY = "web3NameCache";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours cache expiry
const NEGATIVE_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes negative cache expiry
const REQUEST_INTERVAL = 1000; // 1 second between requests

let lastRequestTime = 0;
// Load cache from localStorage, initialize as empty object if not exists
const cache: Record<string, { value: string | null; timestamp: number }> =
  JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");

const useResolveAddressToName = (address: `0x${string}` | null) => {
  const [name, setName] = useState<string | null>(null);
  const web3name = createWeb3Name();

  const resolveAddress = useCallback(async (addr: `0x${string}`) => {
    const now = Date.now();
    const cachedItem = cache[addr];

    // Check if cache is valid
    if (cachedItem) {
      const expiryTime = cachedItem.value
        ? CACHE_EXPIRY
        : NEGATIVE_CACHE_EXPIRY;
      if (now - cachedItem.timestamp < expiryTime) {
        return cachedItem.value;
      }
    }

    // Implement request interval limit
    if (now - lastRequestTime < REQUEST_INTERVAL) {
      await new Promise((resolve) =>
        setTimeout(resolve, REQUEST_INTERVAL - (now - lastRequestTime))
      );
    }

    lastRequestTime = Date.now();
    try {
      const result = await web3name.getDomainName({
        address: addr,
        queryTldList: ["bnb"],
      });
      // Update cache
      cache[addr] = { value: result, timestamp: now };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      return result;
    } catch (err) {
      console.error("Error resolving address:", err);
      // Update cache with null value in case of error
      cache[addr] = { value: null, timestamp: now };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      return null;
    }
  }, []);

  useEffect(() => {
    if (address) {
      resolveAddress(address).then(setName);
    } else {
      setName(null);
    }
  }, [address, resolveAddress]);

  return name;
};

export default useResolveAddressToName;
