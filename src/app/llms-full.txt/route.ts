import { llmsIndex, toolCatalogMarkdown, releaseMarkdown, publicTextResponse } from "@/lib/public-discovery";
export const dynamic = "force-static";
export function GET() { return publicTextResponse([llmsIndex(), toolCatalogMarkdown(), releaseMarkdown()].join("\n\n---\n\n")); }
