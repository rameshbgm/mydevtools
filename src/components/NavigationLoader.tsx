"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { toolsRegistry } from "@/lib/tools-registry";

const SAFETY_TIMEOUT_MS = 60_000;
const MIN_VISIBLE_MS = 250;

const LOADING_MESSAGES = [
    "Warming up the dev tools…",
    "Polishing pixels…",
    "Compiling awesomeness…",
    "Booting up the lab…",
    "Sharpening the tools…",
    "Brewing a fresh batch of bytes…",
    "Aligning the semicolons…",
    "Refactoring the cosmos…",
    "Indenting the universe…",
    "Spinning up productivity…",
];

function pickMessage(): string {
    return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
}

export default function NavigationLoader() {
    const pathname = usePathname();
    const { darkMode, isNavigating, setNavigating, navTargetId } = useAppStore();
    const [message, setMessage] = useState(LOADING_MESSAGES[0]);

    const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const minVisibleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const shownAtRef = useRef<number>(0);
    const pendingPathRef = useRef<string | null>(null);

    const clearTimers = useCallback(() => {
        if (safetyTimerRef.current) {
            clearTimeout(safetyTimerRef.current);
            safetyTimerRef.current = null;
        }
        if (minVisibleTimerRef.current) {
            clearTimeout(minVisibleTimerRef.current);
            minVisibleTimerRef.current = null;
        }
    }, []);

    const closeLoader = useCallback(() => {
        const elapsed = Date.now() - shownAtRef.current;
        const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
        if (remaining === 0) {
            clearTimers();
            setNavigating(false, null);
            pendingPathRef.current = null;
        } else {
            if (minVisibleTimerRef.current) clearTimeout(minVisibleTimerRef.current);
            minVisibleTimerRef.current = setTimeout(() => {
                clearTimers();
                setNavigating(false, null);
                pendingPathRef.current = null;
            }, remaining);
        }
    }, [clearTimers, setNavigating]);

    useEffect(() => {
        if (isNavigating && !shownAtRef.current) {
            shownAtRef.current = Date.now();
            setMessage(pickMessage());

            if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
            safetyTimerRef.current = setTimeout(() => {
                clearTimers();
                setNavigating(false, null);
                pendingPathRef.current = null;
                shownAtRef.current = 0;
            }, SAFETY_TIMEOUT_MS);
        } else if (!isNavigating) {
            shownAtRef.current = 0;
        }
    }, [isNavigating, clearTimers, setNavigating]);

    useEffect(() => {
        if (isNavigating) {
            closeLoader();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    useEffect(() => {
        return () => {
            clearTimers();
        };
    }, [clearTimers]);

    const targetTool = navTargetId
        ? toolsRegistry.find((t) => t.id === navTargetId)
        : null;
    const ToolIcon = targetTool?.icon;
    const accentColor = targetTool?.color ?? "#0891b2";

    return (
        <AnimatePresence>
            {isNavigating && (
                <motion.div
                    key="nav-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    role="status"
                    aria-live="polite"
                    aria-label="Loading tool"
                    className="wb-navload-backdrop"
                    onClick={(e) => e.stopPropagation()}
                >
                    <motion.div
                        initial={{ scale: 0.92, y: 8 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.96, y: 4 }}
                        transition={{ type: "spring", stiffness: 320, damping: 26 }}
                        className="wb-navload-card"
                    >
                        <div style={{ position: "relative", width: 72, height: 72 }}>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 1.6,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    borderRadius: "50%",
                                    border: `3px solid ${accentColor}33`,
                                    borderTopColor: accentColor,
                                    borderRightColor: accentColor,
                                }}
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.08, 1],
                                }}
                                transition={{
                                    duration: 1.4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                style={{
                                    position: "absolute",
                                    inset: 12,
                                    borderRadius: 14,
                                    background: `${accentColor}1f`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {ToolIcon ? (
                                    <ToolIcon style={{ fontSize: 24, color: accentColor }} />
                                ) : (
                                    <motion.div
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{
                                            duration: 0.9,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        style={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: 5,
                                            background: accentColor,
                                        }}
                                    />
                                )}
                            </motion.div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div className="wb-navload-title">{targetTool ? targetTool.name : "Loading"}</div>
                            <div className="wb-navload-sub">{message}</div>
                        </div>
                        <div
                            style={{
                                width: "100%",
                                height: 3,
                                borderRadius: 999,
                                overflow: "hidden",
                                background: darkMode ? "#262626" : "#e5e5e5",
                            }}
                        >
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                style={{
                                    width: "40%",
                                    height: "100%",
                                    background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                                }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
