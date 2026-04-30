"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Button, Card, App, Upload, Spin } from "antd";
import { ApiOutlined, UploadOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
    ssr: false,
    loading: () => (
        <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
            <Spin size="large" />
        </div>
    ),
});

const SAMPLE_SPEC = `{
  "openapi": "3.0.0",
  "info": {
    "title": "mydevtools API",
    "version": "1.0.0",
    "description": "Sample API showing endpoints, schemas, and request/response examples"
  },
  "servers": [{ "url": "https://api.example.com/v1", "description": "Production" }],
  "tags": [
    { "name": "Users", "description": "User management" },
    { "name": "Posts", "description": "Blog post operations" }
  ],
  "paths": {
    "/users": {
      "get": {
        "tags": ["Users"],
        "summary": "List all users",
        "parameters": [
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 20 } },
          { "name": "offset", "in": "query", "schema": { "type": "integer", "default": 0 } }
        ],
        "responses": {
          "200": {
            "description": "A list of users",
            "content": { "application/json": { "schema": { "type": "array", "items": { "$ref": "#/components/schemas/User" } } } }
          }
        }
      },
      "post": {
        "tags": ["Users"],
        "summary": "Create a user",
        "requestBody": {
          "required": true,
          "content": { "application/json": { "schema": { "$ref": "#/components/schemas/UserInput" } } }
        },
        "responses": {
          "201": { "description": "Created", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/User" } } } },
          "400": { "description": "Validation error" }
        }
      }
    },
    "/users/{id}": {
      "get": {
        "tags": ["Users"],
        "summary": "Get a user by ID",
        "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }],
        "responses": {
          "200": { "description": "User found", "content": { "application/json": { "schema": { "$ref": "#/components/schemas/User" } } } },
          "404": { "description": "Not found" }
        }
      },
      "delete": {
        "tags": ["Users"],
        "summary": "Delete a user",
        "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }],
        "responses": { "204": { "description": "Deleted" }, "404": { "description": "Not found" } }
      }
    },
    "/posts": {
      "get": {
        "tags": ["Posts"],
        "summary": "List posts",
        "responses": { "200": { "description": "OK", "content": { "application/json": { "schema": { "type": "array", "items": { "$ref": "#/components/schemas/Post" } } } } } }
      }
    }
  },
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "example": "u_123" },
          "name": { "type": "string", "example": "Jane Doe" },
          "email": { "type": "string", "format": "email", "example": "jane@example.com" },
          "role": { "type": "string", "enum": ["admin", "user", "guest"], "example": "user" },
          "createdAt": { "type": "string", "format": "date-time" }
        },
        "required": ["id", "name", "email"]
      },
      "UserInput": {
        "type": "object",
        "properties": {
          "name": { "type": "string", "example": "Jane Doe" },
          "email": { "type": "string", "format": "email", "example": "jane@example.com" },
          "role": { "type": "string", "enum": ["admin", "user", "guest"] }
        },
        "required": ["name", "email"]
      },
      "Post": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "title": { "type": "string", "example": "Hello World" },
          "body": { "type": "string" },
          "authorId": { "type": "string" },
          "publishedAt": { "type": "string", "format": "date-time" }
        }
      }
    }
  }
}`;

function SwaggerViewer({ spec, onBack }: { spec: string; onBack: () => void }) {
    // Parse the spec once; pass the parsed object directly to swagger-ui-react.
    // Using `spec` (not `url`) prop keeps everything offline — no fetch.
    const parsedSpec = useMemo(() => {
        try {
            return JSON.parse(spec);
        } catch {
            return null;
        }
    }, [spec]);

    return (
        <>
            <Button style={{ marginBottom: 16 }} onClick={onBack}>← Back to Editor</Button>
            <Card styles={{ body: { padding: 0, overflow: "hidden", borderRadius: 8 } }}>
                <div style={{ padding: 8 }}>
                    {parsedSpec ? (
                        <SwaggerUI
                            spec={parsedSpec}
                            tryItOutEnabled
                            displayRequestDuration
                            defaultModelsExpandDepth={2}
                            defaultModelExpandDepth={2}
                            docExpansion="list"
                            filter
                            deepLinking
                            supportedSubmitMethods={["get", "post", "put", "delete", "patch", "head", "options", "trace"]}
                        />
                    ) : (
                        <div style={{ padding: 40, textAlign: "center" }}>Invalid spec</div>
                    )}
                </div>
            </Card>
        </>
    );
}

export default function SwaggerPage() {
  const { message } = App.useApp();
  const [spec, setSpec] = useState(SAMPLE_SPEC);
  const [mode, setMode] = useState<"edit" | "view">("edit");

  const handleView = () => {
    try {
      JSON.parse(spec);
      setMode("view");
    } catch {
      message.error("Invalid JSON/OpenAPI spec");
    }
  };

  return (
    <ToolPageLayout
      title="Swagger / OpenAPI Viewer"
      description="Paste or upload an OpenAPI spec and get interactive docs"
      icon={<ApiOutlined style={{ fontSize: 24, color: "#52c41a" }} />}
      color="#52c41a"
      learnMore={{
        whatIs: "An interactive documentation viewer for OpenAPI (Swagger) specifications. It renders API docs from JSON/YAML specs, letting you explore endpoints, schemas, and even try API calls.",
        whyUse: "OpenAPI specs define REST APIs in a standard format. This viewer transforms raw specs into beautiful, interactive documentation that developers can use to understand and test APIs.",
        howToUse: [
          "Paste your OpenAPI spec (JSON or YAML) in the editor",
          "Or upload a spec file from your computer",
          "Click 'Render Docs' to generate interactive documentation",
          "Explore endpoints, try out API calls, and view schemas"
        ],
        tips: [
          "Supports both OpenAPI 3.x and Swagger 2.0 formats",
          "You can load remote specs via URL",
          "Authentication can be configured for live API testing",
          "Schemas and models are rendered with type information"
        ],
        useCases: [
          "Viewing API documentation from spec files",
          "Testing API endpoints interactively",
          "Sharing API documentation with team members",
          "Validating OpenAPI spec structure"
        ]
      }}
    >
      {mode === "edit" ? (
        <>
          <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
            <Button type="primary" onClick={handleView}>Render Docs</Button>
            <Upload
              accept=".json,.yaml,.yml"
              showUploadList={false}
              beforeUpload={async (file) => {
                const text = await file.text();
                setSpec(text);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Spec</Button>
            </Upload>
          </div>
          <Card size="small" title="OpenAPI / Swagger Spec (JSON)" styles={{ body: { padding: 0 } }}>
            <CodeEditor value={spec} onChange={setSpec} language="json" height="550px" />
          </Card>
        </>
      ) : (
        <SwaggerViewer spec={spec} onBack={() => setMode("edit")} />
      )}
    </ToolPageLayout>
  );
}
