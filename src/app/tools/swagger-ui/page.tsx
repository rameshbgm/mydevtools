"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button, Card, App, Upload } from "antd";
import { ApiOutlined, UploadOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { CodeEditor } from "@/components/CodeEditor";

const SAMPLE_SPEC = `{
  "openapi": "3.0.0",
  "info": {
    "title": "DevTools Hub API",
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [srcdoc, setSrcdoc] = useState("");

  useEffect(() => {
    let encodedSpec: string;
    try {
      encodedSpec = JSON.stringify(JSON.parse(spec));
    } catch {
      encodedSpec = "{}";
    }

    // Use srcdoc + base href so all unpkg asset paths resolve correctly.
    // StandaloneLayout is omitted intentionally — BaseLayout renders all
    // endpoints, schemas, "Try it out" and the full request/response cycle
    // without needing the standalone preset's extra chrome.
    setSrcdoc(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <base href="https://unpkg.com/swagger-ui-dist@5.17.14/" />
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #fafafa; font-family: sans-serif; }
    .swagger-ui .topbar { display: none !important; }
    .swagger-ui .information-container { padding: 20px 20px 0; }
    .swagger-ui .wrapper { padding: 0 20px 20px; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js" crossorigin></script>
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      var spec = ${encodedSpec};
      SwaggerUIBundle({
        spec: spec,
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
        plugins: [SwaggerUIBundle.plugins.DownloadUrl],
        layout: 'BaseLayout',
        tryItOutEnabled: true,
        displayRequestDuration: true,
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        docExpansion: 'list',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        deepLinking: true,
        supportedSubmitMethods: ['get','post','put','delete','patch','head','options','trace'],
      });
    });
  </script>
</body>
</html>`);
  }, [spec]);

  return (
    <>
      <Button style={{ marginBottom: 16 }} onClick={onBack}>← Back to Editor</Button>
      <Card styles={{ body: { padding: 0, overflow: "hidden", borderRadius: 8 } }}>
        <iframe
          ref={iframeRef}
          srcDoc={srcdoc}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
          style={{ width: "100%", height: 780, border: "none", borderRadius: 8, display: "block" }}
          title="Swagger UI"
        />
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
