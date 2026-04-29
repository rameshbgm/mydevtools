"use client";

import { useEffect } from "react";
import { Button, Result } from "antd";
import { ReloadOutlined, HomeOutlined } from "@ant-design/icons";

export default function GlobalError({
    error,
    reset,
}: Readonly<{
    error: Error & { digest?: string };
    reset: () => void;
}>) {
    useEffect(() => {
        if (typeof window !== "undefined") {
            console.error("App error boundary caught:", error);
        }
    }, [error]);

    return (
        <div
            style={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "32px 16px",
            }}
        >
            <Result
                status="error"
                title="Something went wrong"
                subTitle={
                    error.message
                        ? `${error.message.slice(0, 200)}${error.message.length > 200 ? "…" : ""}`
                        : "An unexpected error occurred. You can try again or head back home."
                }
                extra={[
                    <Button key="retry" type="primary" icon={<ReloadOutlined />} onClick={reset}>
                        Try Again
                    </Button>,
                    <Button
                        key="home"
                        icon={<HomeOutlined />}
                        onClick={() => {
                            window.location.href = "/";
                        }}
                    >
                        Go Home
                    </Button>,
                ]}
            />
        </div>
    );
}
