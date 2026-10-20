# JMESPath engine provenance

`src/lib/vendor/jmespath.mjs` derives from the official JavaScript implementation at [commit f5f85697449b517f3f41969192a1d9367c4a0465](https://github.com/jmespath/jmespath.js/tree/f5f85697449b517f3f41969192a1d9367c4a0465). Copyright 2014 James Saryerwinnie; Apache-2.0. The original license notice is preserved in `LICENSE`, with the full terms in `LICENSE-2.0.txt`; source hashes and fixture provenance are in `source.json`. Public distribution attribution and full license terms are included in `public/licenses/jmespath.txt`.

The local fork supports the complete standard JMESPath grammar and its 26 core functions. It does not add community extensions. The fork fixes upstream defects rather than modifying `node_modules`, so clean installation and browser/desktop builds use the same implementation.

Local modifications:

- ESM export and typed declaration for the search boundary.
- Unicode code-point string length, reversal, lexical sorting and extrema, including expression keys. Sorting is independent of locale. Numeric sorting compares values; expression-key sorting validates every element and remains stable.
- Deep JSON equality for array membership, homogeneous `min_by`/`max_by` keys, correct empty extrema and averages, and string extrema without numeric coercion.
- Numeric-only ordering operators, strict finite JSON `to_number` conversions, finite numeric aggregates, and averages that avoid overflow while preserving subnormal values.
- Argument validation for every variadic argument, parser checks for separators, parentheses, closing quotes, malformed indices/slices and complete literals. Raw strings preserve the official escaping behavior and decode every escaped quote; JSON literals decode every escaped backtick.
- JSON numeric literals use the caller's explicit precision policy, matching document input. Deprecated unquoted backtick literals are rejected, as required by the standard grammar.
- Own-property lookup and safe own-key construction preserve JSON members such as `__proto__`, `constructor` and `hasOwnProperty` without exposing inherited members or mutating prototypes. A WeakSet distinguishes real expression references from user JSON.
- Array extrema and flattening iterate without JavaScript argument-count limits.

`npm run test:jmespath` runs all 851 unmodified fixtures included with the licensed upstream implementation, checks specific error categories, then adds independent Unicode, type, syntax, numeric-policy, safe-key and large-array regressions. It also confirms that JSONPath still works through the shared query helper.

The same test was additionally run against all 892 current official cases from the independent [jmespath.test repository](https://github.com/jmespath/jmespath.test/tree/53abcc37901891cf4308fcd910eab287416c4609). That separate checkout is not required for normal builds. To reproduce with a checkout of that commit:

```
JMESPATH_COMPLIANCE_DIR=/path/to/jmespath.test/tests npm run test:jmespath
```

The specification governing these semantics is [jmespath.org/specification.html](https://jmespath.org/specification.html).
