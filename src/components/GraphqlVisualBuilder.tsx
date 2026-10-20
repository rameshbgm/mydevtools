"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { useState } from "react";
import { getNamedType, isEnumType, isNonNullType, isScalarType, type GraphQLSchema, type GraphQLObjectType, type GraphQLInterfaceType } from "graphql";
import { buildVisualOperation, editableFields, exampleArgument, operationRoot, parseBuilderSchema, type OperationKind } from "@/lib/graphql-builder";
import { copyToClipboard } from "@/lib/clipboard";
export default function GraphqlVisualBuilder({ schemaSource, onUse }: { schemaSource: string; onUse: (value: string) => void }) {
    const { t } = useLanguage();
    const [schema, setSchema] = useState<GraphQLSchema | null>(null), [operation, setOperation] = useState<OperationKind>("query"), [name, setName] = useState("MyOperation");
    const [selected, setSelected] = useState<string[]>([]), [argumentsByPath, setArguments] = useState<Record<string, string>>({}), [output, setOutput] = useState(""), [error, setError] = useState<{ source?: string; detail?: string } | null>(null);
    const choose = (path: string, checked: boolean, type: GraphQLObjectType | GraphQLInterfaceType | null, fieldName: string) => {
        setOutput(""); setError(null);
        if (!checked) { setSelected((current) => current.filter((value) => value !== path && !value.startsWith(path + "."))); return; }
        if (selected.length >= 500) { setError({ source: "Selection limit is 500 fields." }); return; }
        setSelected((current) => [...current, path]);
        const field = type?.getFields()[fieldName]; if (!field) return;
        const defaults: Record<string, string> = {};
        field.args.filter((arg) => isNonNullType(arg.type) && arg.defaultValue === undefined).forEach((arg) => { try { defaults[`${path}:${arg.name}`] = exampleArgument(arg.type); } catch { defaults[`${path}:${arg.name}`] = ""; } });
        setArguments((current) => ({ ...defaults, ...current }));
    };
    const fieldTree = (type: GraphQLObjectType | GraphQLInterfaceType | null, parent: string, depth: number): React.ReactNode => {
        const fields = Object.values(type?.getFields() ?? {}), pathFor = (field: string) => parent ? `${parent}.${field}` : field;
        return <ul className="wb-graphql-fields">{["__typename", ...fields.slice(0, 200).map((field) => field.name)].map((fieldName) => {
            const path = pathFor(fieldName), field = type?.getFields()[fieldName], named = field ? getNamedType(field.type) : null;
            const checked = selected.includes(path), composite = named && !isScalarType(named) && !isEnumType(named);
            return <li key={path}><label className="wb-checkbox"><input dir="ltr" type="checkbox" checked={checked} onChange={(event) => choose(path, event.target.checked, type, fieldName)} /><code dir="ltr">{fieldName}</code>{field && <span dir="ltr"> · {String(field.type)}</span>}</label>{field?.description && <p>{field.description.slice(0, 400)}</p>}
                {checked && field?.args.map((arg) => <label key={arg.name}>{path}({arg.name}: {String(arg.type)}){isNonNullType(arg.type) && arg.defaultValue === undefined ? t(" · required") : t(" · optional")}<input dir="ltr" value={argumentsByPath[`${path}:${arg.name}`] ?? ""} maxLength={10_000} onChange={(event) => { setArguments({ ...argumentsByPath, [`${path}:${arg.name}`]: event.target.value }); setOutput(""); }} placeholder={t("GraphQL literal; leave optional arguments empty")} spellCheck={false} /></label>)}
                {checked && composite && (depth < 8 ? fieldTree(editableFields(named), path, depth + 1) : <p>{t("Depth limit reached. __typename is selected automatically.")}</p>)}
            </li>;
        })}{fields.length > 200 && <li>{t("Showing the first 200 fields at this level. Use the operation editor for additional fields.")}</li>}</ul>;
    };
    return <section className="wb-workbench" style={{ marginTop: 24 }}><h2>{t("Build an operation from your schema")}</h2><p>{t("Load the SDL above, choose fields and enter argument literals. No endpoint is contacted. Object and union selections include __typename when no child fields are chosen.")}</p>
        <button onClick={() => { try { setSchema(parseBuilderSchema(schemaSource)); setSelected([]); setArguments({}); setOutput(""); setError(null); } catch (cause) { setSchema(null); setError({ detail: String(cause) }); } }}>{t("Load current schema into builder")}</button>
        {schema && <><div className="wb-form-grid"><label>{t("Operation")}<select value={operation} onChange={(event) => { setOperation(event.target.value as OperationKind); setSelected([]); setArguments({}); setOutput(""); }}>{(["query", "mutation", "subscription"] as const).filter((kind) => operationRoot(schema, kind)).map((kind) => <option key={kind} value={kind}>{t(kind === "query" ? "Query" : kind === "mutation" ? "Mutation" : "Subscription")}</option>)}</select></label><label>{t("Operation name")}<input dir="ltr" value={name} maxLength={100} onChange={(event) => { setName(event.target.value); setOutput(""); }} /></label></div>
            {operationRoot(schema, operation) ? fieldTree(operationRoot(schema, operation)!, "", 1) : <p>{t("This schema has no {operation} root. Choose an available operation.", { operation })}</p>}
            <button disabled={!selected.length} onClick={() => { try { setOutput(buildVisualOperation(schema, operation, selected, argumentsByPath, name)); setError(null); } catch (cause) { setOutput(""); setError({ detail: String(cause) }); } }}>{t("Generate validated operation")}</button>
        </>}{error && <p role="alert">{error.source ? t(error.source) : error.detail}</p>}{output && <><label>{t("Generated GraphQL")}<textarea dir="ltr" rows={10} readOnly value={output} /></label><div className="wb-workbench-actions"><button onClick={() => onUse(output)}>{t("Use in operation editor")}</button><button onClick={() => void copyToClipboard(output)}>{t("Copy operation")}</button></div></>}
    </section>;
}
