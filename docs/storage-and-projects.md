# Projects, Memory & Storage

Project Workspaces and Memory & Storage manage data saved by this site in the current browser profile. They do not synchronize devices or create separate user accounts.

## Project lifecycle

The permanent **Personal** project holds older, unprefixed records. Custom projects have their own local-storage namespace, task database and encrypted-vault contexts. Appearance and the last seen release remain shared browser preferences.

- **Create** starts an empty project; **Rename** changes its display name. The global workspace tab bar supports adding and double-click renaming (F2 also starts editing; Enter or blur saves, Escape cancels). Each custom tab has a close × in its top corner. Its warning confirms permanent deletion of that workspace and its saved content, including encrypted vaults. Arrow keys and Home/End move between workspace buttons; activation switches the project. Long tab lists scroll within the bar on narrow screens.
- Up to **10 active workspaces including Personal** are allowed. Deleted workspaces do not consume a slot. Create, Restore and backup imports enforce the limit before saving; older installations above the limit retain every existing workspace, and need to delete workspaces before adding or restoring more.
- **Switch** reloads open tools and locks vaults. Save drafts first.
- **Delete in Manage projects** moves a custom project to **Deleted projects**, removes it from the tab bar and keeps its saved data for **Restore**. Deleting the active project returns to Personal.
- **Delete permanently** is available in Deleted projects. Its confirmation requires the exact project name. It removes that project's local records, task records and encrypted vaults, then removes its catalogue entry. Personal and other projects are protected. The tab-close confirmation queues deletion in one metadata write, reloads open tools, and finishes removal from the fresh workspace. Importing a backup never authorizes an automatic permanent deletion.

Recoverable deletion does not free browser storage. Permanent deletion cannot be undone through the app. If permanent deletion is interrupted, the deleted entry remains available for retry; Restore is disabled because some records may already have been removed. Browser backups, downloaded exports and other tabs' in-memory drafts are outside that operation.

## Inventory coverage

Open **Memory & Storage** from the database icon in the app header. The page lists actual stored entries, including keys not present in the friendly-name catalogue.

| Group | What is visible | Actions |
| --- | --- | --- |
| Local records | Tool records, global preferences, project metadata and unknown keys | View, export, import and confirmed clear |
| Databases | Discovered IndexedDB databases, their object stores and record counts | Browse in pages of 25, export JSON and confirmed store clear |
| Encrypted vaults | Each project's encrypted credential/file vault context | View encrypted envelope, download encrypted backup, open the appropriate tool and confirmed vault clear |
| This tab's session | Temporary session-storage records in the current tab | View, export and confirmed clear |
| Offline caches | Cache names, request counts and cached request URLs/methods | Inspect request inventory, export request list and confirmed cache clear |

Search by tool, key or database and filter by storage type and project, including deleted or unlisted project namespaces. The default view includes every project and shared data. If the browser cannot enumerate databases, known app databases are checked and a warning explains the incomplete discovery. Read failures appear as warnings rather than empty-success claims.

Browser usage and quota are approximate origin-wide estimates. Local record sizes measure UTF-8 values and do not include database/cached-content sizes. Session storage in another tab is separate and cannot be inventoried here. Cached request exports contain request metadata, not a copy of every cached asset body.

Encrypted record names, filenames and secret values remain encrypted in this page. Use Credential Vault or Secure Files with the passphrase to inspect their decrypted contents. Preview text is bounded; exports provide the complete supported record representation. Binary objects in generic database JSON views are represented by type/size and bounded byte previews; use a tool's native export for a full binary backup.

## Backups and import

**Export local/session records** exports the matching local/session rows in the current view. It excludes databases, encrypted vaults and cached assets. **Show sensitive values** controls redaction in previews and JSON exports. Redaction is a best effort; review every export before sharing it. A redacted export may require secrets to be entered again after restoration.

Version 1 storage exports preserve the engine, original key and string value. Filtered custom-project exports carry project metadata so their records remain accessible on another device. Import merges project metadata with existing projects and preserves an incomplete permanent-deletion marker. Legacy exports containing `exportedAt` and recognized tool keys are accepted into the active project.

Import accepts up to 20 MiB, rejects duplicate keys, confirms before overwriting values and reloads the page after success. If a write fails, the importer attempts to restore the previous values and reports whether that rollback succeeded. Close other tool tabs before importing or clearing data.

For complete recovery:

1. Export local/session records for the desired scope.
2. Export task data through **Task Manager** using its native import/export format. Memory's per-store JSON export is an inspection dump, not the Task Manager backup format.
3. Download each required encrypted vault backup. Restore these through **Credential Vault** or **Secure Files** with the original backup passphrase. The backup does not contain its passphrase.
4. Keep these backups outside browser storage. Cache data can be downloaded again when connectivity is available.

The local vault recovery CLI is available with `npm run recover:vault -- --input backup.json --output recovered`. It reads the passphrase from standard input; keep recovered plaintext files private.

## Clearing data

A row's **Clear** action confirms its data scope. Clearing one encrypted vault removes that vault's contents; it does not delete the shared vault database or other projects' vault records. Project catalogue and active-project keys are protected in row actions; manage them through Project Workspaces.

**Clear shown data** affects the current filtered selection, excluding protected project metadata. **Reset all site data** is a separate recovery option and requires typing `CLEAR`. It removes local records, this tab's session, database records, encrypted vaults and offline caches across all projects, then reloads. It stops when inventory warnings prevent a reliable complete scan. Multi-store removal can be interrupted after some entries are removed; errors explain that risk and allow retry. Empty database schemas may remain, and using the app can create new cached assets or default preferences.

Persistent storage may be requested from **Browser storage limits and persistence**. A browser grant reduces eviction risk but does not replace backups.

## Debugging guide examples

Guide links use a public `?example=` identifier bound to the matching tool, so they work on direct navigation, reload and a new tab without session storage. Only bundled public fixtures load. Import runs after default/saved settings initialize; JWT decoded claims follow the current input. Loading a fixture does not send a network request. The CORS guide opens the tester and asks for an endpoint you control.

## Snippet library

Code Snippets stores up to 100 records per project, with a name, language, comma-separated tags and up to 200,000 code characters per record. Search matches names, languages, tags and code. Selecting a saved record opens a read-only syntax-highlighted editor; Edit code enables changes. Save updates that record, and removal has an Undo action while the page remains open. Libraries are unencrypted local records; use the credential vault for secrets.

JSON formatting preserves source numeric spelling, negative zero, escaped strings, duplicate keys and property order. JSON Formatter and the saved workflow's JSON format/minify steps share this token formatter. Its general limits are 2 MiB input, 128 nesting levels and 8 MiB formatted output; snippets additionally keep their 200,000-character limit. Other snippet languages use their named formatters and may normalize source text. Import accepts a version-1 snippets JSON library up to 5 MiB, validates records and assigns fresh identifiers before merging; export writes the current library. Browser upload/download delivery remains unverified because the automation connection did not complete those transfers. Current page-level tests verify exact handler data and preserve concurrent edits and deletions during pending imports; they do not establish browser file delivery.

Snippet controls and recovery messages are translated into the eight supported languages. User names/tags are preserved and code remains LTR. Formatting temporarily disables draft-changing controls. Programmatic editor updates merge only the code field so saved identity, title, language and tags survive record loading and language changes.

## JSON inference and query precision

Schema inference classifies integer versus number from the original decimal token, including long fractions, very large integers and exponents outside the JavaScript Number range. Object-shaped user values cannot impersonate number nodes. Required-field and optional closed-object behavior is unchanged.

JSONPath and JMESPath check input numbers before evaluation. Numbers that would round, overflow, underflow or lose negative zero produce a recovery error. The explicit **Preserve precision-sensitive numbers as text** choice converts only affected numbers into their original token strings. Ordinary values remain numeric; numeric filters and functions receive strings only for the affected values. Use quoted text equality; string sorting is lexical. The source editor remains unchanged. Numeric functions use IEEE 754 arithmetic and can round; this is not an arbitrary-precision query interpreter. JMESPath JSON literals follow the same precision policy as document input. JSONPath numeric expression constants use the engine's normal numeric behavior. Quote large values for text comparisons. See the [JMESPath numeric conversion specification](https://jmespath.org/specification.html#to-number) for implementation-specific floating-point behavior. Saved workflow JSONPath extraction uses the same default input precision check; quoting values preserves them as text.

## Structured conversion and graph numbers

The JSON / YAML / TOML / XML Converter supports all twelve cross-format directions. JSON and YAML support null; TOML and XML mappings reject ambiguous nulls. XML attributes use `@_`, text uses `#text`, and output requires a valid root/name mapping. Comments and source formatting do not survive conversion. Numeric tokens in JSON, YAML and TOML are checked before a rounded value can reach output; quote precision-sensitive numbers or negative zero to preserve them as text. XML text and attributes remain strings. TOML date/time values become ISO text before a native Date could truncate fractional seconds; their fractional precision and offset are retained.

JSON Graph retains source-sensitive numeric tokens as numbers in node summaries, selected JSON, copied output and graph/table exports. Ordinary values use native numbers. CSV consumers can still reinterpret numeric columns; import exact identifiers and high-precision values as text. Graph source, selected paths and machine data stay LTR in Arabic.

The standard JMESPath engine is a licensed vendored fork with Unicode code-point operations and official compliance fixtures. Its provenance, local fixes and reproduction command are in [the engine notice](../third-party/jmespath/README.md).
