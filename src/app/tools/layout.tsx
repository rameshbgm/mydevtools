import React from "react";

/** Shared visual frame for every `/tools/*` page (rewritten URLs still mount here). */
export default function ToolsSegmentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="wb-tool-route">
            <div className="wb-tool-route-inner">{children}</div>
        </div>
    );
}
