import { parseDocument } from "yaml";

/** Keep YAML scalar tokens instead of rounding them through JavaScript Number. */
export function parseYamlForFormatting(source: string) {
    const document = parseDocument(source, {
        intAsBigInt: true,
        customTags: (tags) => tags.map((tag) => {
            if (typeof tag === "string" || tag.collection || !["tag:yaml.org,2002:int", "tag:yaml.org,2002:float"].includes(tag.tag)) return tag;
            return { ...tag, stringify: (node, context, onComment, onChompKeep) => node.source ?? tag.stringify!(node, context, onComment, onChompKeep) };
        }),
    });
    if (document.errors.length) throw document.errors[0];
    // Retain the previous parser's unresolved-alias and expansion limits. The
    // JavaScript result is discarded; serialization uses the original AST.
    document.toJS({ maxAliasCount: 100 });
    return document;
}
