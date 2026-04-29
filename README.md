# DevTools Hub — Personal Developer Tools Portal

A stunning, all-in-one developer tools portal built with **Next.js 16**, **React 19**, **Ant Design 5**, **Monaco Editor**, and **Framer Motion**.

> Stop context-switching between online tools. Format, diff, decode, generate — all from your private portal.

## 🛠️ 18 Tools Included

**Formatters** — JSON, XML, SQL | **Diff Tools** — JSON Diff, XML Diff, Text Diff | **API** — Swagger/OpenAPI Viewer | **Encoders** — Base64, JWT, URL | **Generators** — Hash (MD5/SHA), UUID | **Converters** — Timestamp, Color, Number Base | **Viewers** — Markdown Preview, Regex Tester | **AI** — RAG Document Q&A

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔮 Adding New Tools

1. Add to `src/lib/tools-registry.ts`
2. Create `src/app/tools/[your-id]/page.tsx`
3. Done — sidebar and dashboard update automatically!
