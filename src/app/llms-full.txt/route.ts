import { llmsIndex, toolCatalogMarkdown, guidesMarkdown, releaseMarkdown, publicTextResponse } from "@/lib/public-discovery";
export const dynamic = "force-static";
export function GET() { return publicTextResponse([llmsIndex(), toolCatalogMarkdown(), guidesMarkdown(), releaseMarkdown()].join("\n\n---\n\n")); }
