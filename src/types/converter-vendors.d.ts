declare module "@mixmark-io/domino" {
    export function createDocument(html?: string, force?: boolean): Document;
}
declare module "turndown-plugin-gfm" {
    import type TurndownService from "turndown";
    export const gfm: TurndownService.Plugin;
}
