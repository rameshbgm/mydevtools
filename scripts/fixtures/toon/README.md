# Independent TOON decoder vectors

`official-decode.json` contains 35 unchanged strict decoder cases selected from the official `toon-format/spec` MIT-licensed `primitives.json` and `arrays-primitive.json` fixtures, retrieved on 2026-10-21. Source URLs and Git blob hashes are recorded in the JSON. The upstream license is in `LICENSE`.

The three upstream cases requiring `strict: false` are excluded because this implementation does not offer non-strict recovery. These vectors establish only the covered primitive/inline-array behavior; they are not a full TOON conformance claim.

The application supports two-space, comma-delimited primitive/list/flat-tabular arrays, ordinary objects and root primitives. Keyed tables, nested table field groups and alternate delimiters remain unsupported. The codec rejects decimal numeric input that would change in a JavaScript number/string round trip; the converter also rejects precision-sensitive JSON numbers and tells the user to quote them explicitly. Negative zero is rejected at the text conversion boundary.

New root arrays use keyless `[N]:` headers. Earlier app versions used an ambiguous `data[N]:` field. A named `data` field now stays an object by default; the converter's explicit Legacy root array switch recovers an old exported root array. This cannot be inferred safely because a genuine object can contain exactly one `data` array.
