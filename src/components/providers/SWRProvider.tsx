"use client";

import { SWRConfig } from "swr";
import { swrConfig } from "@/lib/swr-config";

interface SWRProviderProps {
    children: React.ReactNode;
}

/**
 * SWR Provider component that wraps the app with optimized data fetching configuration
 * 
 * Features:
 * - Automatic caching and revalidation
 * - Optimistic updates support
 * - Error handling and retry logic
 * - Real-time considerations for WebSocket apps
 */
export const SWRProvider: React.FC<SWRProviderProps> = ({ children }) => {
    return (
        <SWRConfig value={swrConfig}>
            {children}
        </SWRConfig>
    );
};
