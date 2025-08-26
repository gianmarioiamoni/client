import { SWRConfiguration } from "swr";
import { apiService } from "@/services/api";

/**
 * Default fetcher function for SWR using our API service
 */
export const defaultFetcher = async (url: string) => {
  // Extract endpoint from full URL if needed
  const endpoint = url.replace(
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    ""
  );

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      }${endpoint}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(apiService.getToken() && {
            Authorization: `Bearer ${apiService.getToken()}`,
          }),
        },
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.success ? data.data : data;
  } catch (error) {
    console.error(`SWR fetch failed for ${endpoint}:`, error);
    throw error;
  }
};

/**
 * SWR configuration with optimal settings for real-time apps
 */
export const swrConfig: SWRConfiguration = {
  fetcher: defaultFetcher,

  // Caching strategy
  revalidateOnFocus: true, // Revalidate when window gets focus
  revalidateOnReconnect: true, // Revalidate when connection is restored
  revalidateIfStale: true, // Revalidate if data is stale

  // Performance optimizations
  dedupingInterval: 2000, // Dedupe requests for 2 seconds
  focusThrottleInterval: 5000, // Throttle focus revalidation

  // Error handling
  errorRetryCount: 3, // Retry failed requests 3 times
  errorRetryInterval: 5000, // Wait 5s between retries

  // Real-time considerations
  refreshInterval: 0, // Disable polling (we use WebSockets)
  revalidateOnMount: true, // Always fetch on component mount

  // Optimistic updates
  compare: (a, b) => {
    // Custom comparison for optimistic updates
    return JSON.stringify(a) === JSON.stringify(b);
  },

  // Error handling
  onError: (error, key) => {
    console.error(`SWR Error for ${key}:`, error);

    // Handle auth errors
    if (
      error.message.includes("401") ||
      error.message.includes("Unauthorized")
    ) {
      // Could trigger logout here if needed
      console.warn("Authentication required for:", key);
    }
  },

  onSuccess: (data, key) => {
    // Optional: Log successful requests in development
    if (process.env.NODE_ENV === "development") {
      console.log(`SWR Success for ${key}:`, data);
    }
  },
};
