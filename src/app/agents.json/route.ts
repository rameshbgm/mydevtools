import { agentCatalog } from "@/lib/public-discovery";
export const dynamic = "force-static";
export function GET() { return Response.json(agentCatalog(), { headers: { "X-Content-Type-Options": "nosniff", Link: '</llms.txt>; rel="describedby"' } }); }
