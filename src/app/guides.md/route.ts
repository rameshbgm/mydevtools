import { guidesMarkdown, publicTextResponse } from "@/lib/public-discovery";
export const dynamic = "force-static";
export function GET() { return publicTextResponse(guidesMarkdown(), true); }
