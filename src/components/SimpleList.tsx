"use client";

import type { ReactNode } from "react";

// antd v6 deprecates <List>. This is the small subset the tools actually used:
// a vertical stack of rows with a divider between them and an optional
// right-hand slot (List.Item's `extra` / `actions`).
// ponytail: no virtualization, no pagination — the callers render tens of rows,
// not thousands. Add react-window only if a caller starts rendering big lists.

interface SimpleListProps<T> {
    dataSource: T[];
    renderItem: (item: T, index: number) => ReactNode;
    /** Right-aligned slot per row — replaces List.Item `extra` / `actions`. */
    renderExtra?: (item: T, index: number) => ReactNode;
    size?: "small" | "default";
    style?: React.CSSProperties;
    rowKey?: (item: T, index: number) => string | number;
}

export default function SimpleList<T>({
    dataSource,
    renderItem,
    renderExtra,
    size = "default",
    style,
    rowKey,
}: SimpleListProps<T>) {
    const padding = size === "small" ? "8px 0" : "12px 0";

    return (
        <div style={style}>
            {dataSource.map((item, i) => (
                <div
                    key={rowKey ? rowKey(item, i) : i}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                        padding,
                        borderTop: i === 0 ? undefined : "1px solid var(--wb-border, rgba(5, 5, 5, 0.06))",
                    }}
                >
                    <div style={{ minWidth: 0, flex: 1 }}>{renderItem(item, i)}</div>
                    {renderExtra && <div style={{ flexShrink: 0 }}>{renderExtra(item, i)}</div>}
                </div>
            ))}
        </div>
    );
}
