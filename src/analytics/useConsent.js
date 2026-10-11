import { useSyncExternalStore } from "react";
import { getConsent, subscribeConsent } from "./analytics";

// The visitor's analytics choice: "granted", "denied" or null (not asked yet).
export const useConsent = () => useSyncExternalStore(subscribeConsent, getConsent);
