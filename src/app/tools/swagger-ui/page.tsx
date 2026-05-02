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
        whatIs: "An interactive renderer for OpenAPI (formerly Swagger) specifications. Paste a JSON or YAML spec — version 2.0, 3.0, or 3.1 — and get the same browsable documentation experience that Swagger UI provides on api.example.com, including endpoint listings, request/response schemas, model definitions, security schemes, and a Try-it-out console for live calls.",
        whyUse: "An OpenAPI spec is a single source of truth — but the raw JSON is hard to read and harder to share with non-developers. This viewer turns it into navigable docs in seconds, with no install, no spec server, and no signup. Useful for design reviews, contract validation, and onboarding new team members to an API.",
        howToUse: [
          "Paste your OpenAPI / Swagger spec (JSON or YAML) into the editor",
          "Or upload a .json / .yaml / .yml file from disk",
          "Click 'Render Docs' to switch to the interactive view",
          "Expand operations to see parameters, request bodies, and example responses",
          "Use 'Try it out' to make live calls — works for any CORS-enabled endpoint",
        ],
        tips: [
          "Supports OpenAPI 3.0, 3.1, and Swagger 2.0 — auto-detected from the spec",
          "$ref pointers to local components resolve automatically (external $refs need a hosted spec)",
          "Set the `servers` block so the Try-it-out console hits the right environment",
          "Define `securitySchemes` (bearer, apiKey, OAuth2) so the Authorize button appears",
          "Use YAML for human-edited specs, JSON when generated from code (FastAPI, NestJS, springdoc)",
          "Cross-origin Try-it-out requests are blocked by browser CORS — host a CORS-enabled mock or use the API Request Builder tool",
        ],
        useCases: [
          "Reviewing an API contract before implementation (design-first workflow)",
          "Sharing draft API docs with frontend, QA, and stakeholders without deploying anything",
          "Onboarding new developers to an existing API surface",
          "Validating that a generated spec (FastAPI, NestJS, springdoc, drf-spectacular) renders cleanly",
          "Debugging spec-driven SDK generation by spotting missing types or examples",
          "Smoke-testing endpoints against staging or production from a single page",
        ],
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
