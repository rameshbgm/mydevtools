/** Standard JMESPath evaluation; parseJson preserves the caller's numeric policy in literals. */
export function search(data: unknown, expression: string, parseJson?: (source: string) => unknown): unknown;
