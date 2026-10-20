import { llmsIndex, publicTextResponse } from "@/lib/public-discovery";
export const dynamic = "force-static";
export function GET() { return publicTextResponse(llmsIndex()); }
