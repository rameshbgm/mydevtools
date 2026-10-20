"use client";
import { useSyncExternalStore } from "react";
const subscribe = () => () => {};
const clientSnapshot = () => window.location.protocol === "mydevtools:" && window.location.hostname === "app";
const serverSnapshot = () => false;
/** Display-only detection. Native authorization stays in the desktop main process. */
export function useDesktopRuntime(): boolean { return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot); }
