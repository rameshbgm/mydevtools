import { buildSchema, getNamedType, isEnumType, isInputObjectType, isInterfaceType, isListType, isNonNullType, isObjectType, isScalarType, parse, parseValue, print, stripIgnoredCharacters, validate, type GraphQLInputType, type GraphQLSchema, type GraphQLObjectType, type GraphQLInterfaceType } from "graphql";
export type OperationKind = "query" | "mutation" | "subscription";
export function parseBuilderSchema(source: string): GraphQLSchema {
    if (!source.trim() || source.length > 500_000) throw new Error("Enter a GraphQL SDL schema up to 500,000 characters.");
    return buildSchema(source, { maxTokens: 30_000 });
}
export function formatGraphql(source: string, minify: boolean): string {
    if (!source.trim() || source.length > 500_000) throw new Error("Enter a GraphQL document up to 500,000 characters.");
    const document = parse(source, { maxTokens: 30_000 }); return minify ? stripIgnoredCharacters(print(document)) : print(document);
}
export function operationRoot(schema: GraphQLSchema, operation: OperationKind) { return operation === "query" ? schema.getQueryType() : operation === "mutation" ? schema.getMutationType() : schema.getSubscriptionType(); }
export function editableFields(type: unknown): GraphQLObjectType | GraphQLInterfaceType | null { return isObjectType(type) || isInterfaceType(type) ? type : null; }
export function exampleArgument(type: GraphQLInputType, depth = 0): string {
    if (depth > 5) throw new Error("Recursive input type needs a manually entered GraphQL literal.");
    if (isNonNullType(type)) return exampleArgument(type.ofType, depth + 1);
    if (isListType(type)) return `[${exampleArgument(type.ofType, depth + 1)}]`;
    if (isEnumType(type)) return type.getValues()[0]?.name ?? "null";
    if (isInputObjectType(type)) return "{" + Object.values(type.getFields()).filter((field) => isNonNullType(field.type) && field.defaultValue === undefined).map((field) => `${field.name}: ${exampleArgument(field.type, depth + 1)}`).join(", ") + "}";
    if (isScalarType(type)) return type.name === "Int" || type.name === "Float" ? "1" : type.name === "Boolean" ? "true" : type.name === "ID" ? '"example-id"' : '"example"';
    return "null";
}
export function buildVisualOperation(schema: GraphQLSchema, operation: OperationKind, selected: string[], argumentsByPath: Record<string, string>, operationName: string): string {
    if (!/^[_A-Za-z][_0-9A-Za-z]*$/.test(operationName)) throw new Error("Enter a valid GraphQL operation name.");
    if (!selected.length || selected.length > 500 || selected.some((path) => path.split(".").length > 8)) throw new Error("Select 1–500 fields, with a maximum depth of eight.");
    const root = operationRoot(schema, operation); if (!root) throw new Error(`This schema has no ${operation} root.`);
    const paths = new Set(selected);
    for (const path of selected) { const parts = path.split("."); for (let index = 1; index < parts.length; index++) if (!paths.has(parts.slice(0, index).join("."))) throw new Error("Select parent fields before their children."); }
    const selection = (type: GraphQLObjectType | GraphQLInterfaceType | null, parent: string, depth: number): string => {
        if (depth > 8) throw new Error("Maximum selection depth is eight.");
        const fields = type?.getFields() ?? {}, names = selected.filter((path) => path.startsWith(parent ? parent + "." : "") && path.split(".").length === depth).map((path) => path.split(".").at(-1)!);
        if (!names.length) return "__typename";
        return names.map((name) => {
            if (name === "__typename") return name;
            const field = fields[name]; if (!field) throw new Error(`Unknown field ${parent ? parent + "." : ""}${name}.`);
            const path = parent ? `${parent}.${name}` : name;
            const args = field.args.flatMap((argument) => { const raw = argumentsByPath[`${path}:${argument.name}`] ?? ""; if (!raw.trim()) { if (isNonNullType(argument.type) && argument.defaultValue === undefined) throw new Error(`Enter required argument ${path}(${argument.name}: ${argument.type}).`); return []; } if (raw.length > 10_000) throw new Error("Argument limit is 10,000 characters."); const parsed = parseValue(raw, { maxTokens: 1000 }); return [`${argument.name}: ${print(parsed)}`]; });
            const named = getNamedType(field.type), scalar = isScalarType(named) || isEnumType(named);
            return `${name}${args.length ? `(${args.join(", ")})` : ""}${scalar ? "" : ` { ${selection(editableFields(named), path, depth + 1)} }`}`;
        }).join("\n");
    };
    const source = `${operation} ${operationName} { ${selection(root, "", 1)} }`, document = parse(source), errors = validate(schema, document);
    if (errors.length) throw new Error(errors.map((error) => error.message).join("\n")); return print(document);
}
