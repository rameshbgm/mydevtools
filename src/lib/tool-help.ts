/** Curated help for pages that do not provide their own learnMore prop. */
export interface ToolHelp { howToUse: string[]; tips?: string[] }
export const TOOL_HELP: Record<string, ToolHelp> = {
    "saved-workflows": {
        howToUse: ["Choose and order the operations, enter input, then run the workflow to inspect each step.", "Name and save the workflow for this project. Include an input fixture only when you intend to retain it."],
        tips: ["Fixture redaction is a best effort. Review exported data and comparison fixtures before sharing."],
    },
    "tool-workbench": {
        howToUse: ["Find a tool and open it in a tab. Switch tabs to keep independent inputs available.", "Reorder tabs with the arrow controls or drag them. The saved tab list reopens after reload; unsaved inputs do not."],
    },
    "whois-rdap": {
        howToUse: ["Enter a domain, IP address or IP prefix and choose Look up registration.", "Review the registry, events and nameservers, then inspect or export the raw RDAP response."],
        tips: ["Registry privacy rules may hide contact details. Registration records do not prove website ownership or availability."],
    },
    "credential-vault": {
        howToUse: ["Create or unlock the vault with your passphrase, then add and manage records in this project.", "Export an encrypted backup before clearing browser storage. Keep the passphrase separately; it cannot be recovered."],
    },
    "secure-files": {
        howToUse: ["Create or unlock the vault, then add files to encrypt their contents and metadata on this device.", "Export an encrypted backup before clearing browser storage. Keep the passphrase separately; it cannot be recovered."],
    },
    "sql-client": {
        howToUse: ["Choose SQLite for local file queries, or configure an authenticated localhost runtime for a remote database.", "Browse tables, inspect columns, enter SQL and parameters, then run the query. Enable writes only when required."],
        tips: ["SQLite changes affect the temporary copy. Download the updated database to keep them."],
    },
    "redis-browser": {
        howToUse: ["Configure the connection and localhost runtime access, then scan keys using a narrow pattern.", "Inspect a key or enter a JSON array of command arguments. Enable mutations only when you intend to change data."],
        tips: ["SCAN can return empty or duplicate batches as keys change. Continue with the cursor or refine the pattern."],
    },
    "json-schema-generator": {
        howToUse: ["Paste representative JSON and infer a schema, then review the inferred types and required fields.", "Choose a target language and generate models. Review generated code before using it in your application."],
        tips: ["Samples describe observed values; they cannot establish every valid shape your production data may contain."],
    },
    "project-workspaces": {
        howToUse: ["Create up to ten workspaces including Personal. Each workspace keeps its own saved tool data.", "Switch using the workspace tabs. Double-click a custom name to rename it; closing its tab requires confirmation before permanent deletion."],
        tips: ["Save unfinished work before switching. Workspace changes reload tools and lock vaults."],
    },
    "trace-context-inspector": {
        howToUse: ["Paste traceparent and optional tracestate headers to inspect their fields and validation results.", "Generate a new traceparent when you need public example identifiers for a debugging request."],
    },
    "webhook-signature-debugger": {
        howToUse: ["Choose the webhook provider and enter the exact raw request body, signature header and signing secret.", "Verify the signature and review the result. Whitespace or reformatting changes the signed bytes."],
        tips: ["Signature verification does not by itself establish event freshness or prevent replay."],
    },
    "har-log-redactor": {
        howToUse: ["Paste HAR, JSON or log text, then configure any additional sensitive field names.", "Run redaction and inspect the full result before copying or sharing it."],
        tips: ["Redaction is a best effort. Secrets in unusual fields or free text may require manual removal."],
    },
    "user-agent-parser": {
        howToUse: ["Paste a User-Agent string and optional Client Hints, or load your browser's reported values.", "Inspect the parsed browser, operating system, device and engine fields alongside the original values."],
        tips: ["Reported identifiers can be reduced, missing or spoofed. They are not proof of a device's identity."],
    },
    "gitignore-generator": {
        howToUse: ["Select templates for your stack, editor and operating system, then add custom ignore patterns.", "Review the combined result and copy or download it as .gitignore."],
        tips: ["Ignore rules do not remove files already tracked by Git, and they do not protect secrets already committed."],
    },
    "resource-bookmarks": {
        howToUse: ["Add a resource name and URL, then organize links with folders and tags.", "Search the saved links or export a backup. Bookmarks belong to the current project."],
    },
    "totp-generator": {
        howToUse: ["Enter a Base32 secret, then select the algorithm, digits and time step.", "Generate the code and check the remaining validity time. Use public test secrets when experimenting."],
        tips: ["Authenticator codes depend on the secret and clock. Keep real secrets private and check device time when codes disagree."],
    },
    "code-snippets": {
        howToUse: ["Name a snippet, select its language and enter code and tags before saving.", "Search saved snippets, format or copy code, and export a backup for the current project."],
    },
    "keycode-inspector": {
        howToUse: ["Focus the capture area and press a key to inspect key, code, location and modifiers.", "Review event history and copy or export the captured fields for debugging."],
        tips: ["Browser and operating-system shortcuts may intercept a key before the page receives it."],
    },
    "css-generators": {
        howToUse: ["Choose a CSS builder and adjust its controls while checking the live preview.", "Copy the generated CSS and test it with your own layout, content and browser targets."],
    },
    "timezone-planner": {
        howToUse: ["Choose a meeting date and time, then add the IANA timezones you want to compare.", "Review local dates, UTC offsets and working-hour overlap before copying the schedule."],
        tips: ["Daylight-saving transitions can create missing or repeated local times. Review the selected date and offset."],
    },
    "unit-converter": {
        howToUse: ["Select the quantity category, source unit and destination unit, then enter a value.", "Review the converted value and unit definitions before copying the result."],
        tips: ["Check the displayed precision and whether a temperature conversion represents an absolute value or a difference."],
    },
};
