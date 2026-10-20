import { releaseMarkdown, publicTextResponse } from "@/lib/public-discovery";
export const dynamic = "force-static";
export function GET() { return publicTextResponse(releaseMarkdown(), true); }
