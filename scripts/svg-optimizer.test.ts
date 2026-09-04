// Regression tests for the SVG Optimizer's transform pipeline.
//
// Pins the content-corruption bug found in the v1.4 optimizer: number rounding
// and whitespace collapsing were applied to the whole document, so
// `<text>Release 1.4567</text>` rendered as `Release 1.46` and `Hello   World`
// lost its spacing. Element bodies that carry *content* (text/tspan/style/…)
// are now masked before the markup transforms run.
//
// Run with: npx tsx scripts/svg-optimizer.test.ts  (wired as `npm run test:svg`)

import assert from "node:assert";
import { optimizeSvg, type OptimizeOptions } from "../src/app/tools/svg-optimizer/optimize";

const OPTS: OptimizeOptions = {
    stripComments: true,
    stripXmlDeclaration: true,
    stripEditorMetadata: true,
    stripEmptyAttrs: true,
    collapseWhitespace: true,
    roundNumbers: true,
    decimalPlaces: 2,
};

let passed = 0;
function check(name: string, input: string, expected: string) {
    const actual = optimizeSvg(input, OPTS);
    assert.strictEqual(actual, expected, `${name}\n  got:  ${actual}\n  want: ${expected}`);
    passed++;
}

// ── content must survive untouched ──
check(
    "digits in <text> content are not rounded",
    "<svg><text>Release 1.4567 build</text></svg>",
    "<svg><text>Release 1.4567 build</text></svg>",
);
check(
    "whitespace in <text> content is preserved",
    "<svg><text>Hello   World</text></svg>",
    "<svg><text>Hello   World</text></svg>",
);
check(
    "<style> rules are not rewritten",
    "<svg><style>.a{stroke-width:1.23456}</style></svg>",
    "<svg><style>.a{stroke-width:1.23456}</style></svg>",
);
check(
    "<tspan> content is preserved",
    "<svg><text><tspan>a   b</tspan></text></svg>",
    "<svg><text><tspan>a   b</tspan></text></svg>",
);

// ── optimization must still happen on markup ──
check(
    "attribute numbers are still rounded",
    '<svg viewBox="0 0 24.98765 24.98765"><path d="M1.23456 2.5"/></svg>',
    '<svg viewBox="0 0 24.99 24.99"><path d="M1.23 2.5"/></svg>',
);
check("comments are stripped", '<svg><!-- hi --><path d="M0 0"/></svg>', '<svg><path d="M0 0"/></svg>');
check(
    "<metadata> is stripped",
    '<svg><metadata><rdf>junk</rdf></metadata><path d="M0 0"/></svg>',
    '<svg><path d="M0 0"/></svg>',
);
check(
    "editor attributes are stripped",
    '<svg inkscape:version="1.0"><path d="M0 0"/></svg>',
    '<svg><path d="M0 0"/></svg>',
);
check(
    "layout whitespace between elements is collapsed",
    '<svg>\n  <path d="M0 0"/>\n  <path d="M1 1"/>\n</svg>',
    '<svg><path d="M0 0"/><path d="M1 1"/></svg>',
);
check("empty attributes are stripped", '<svg id=""><path d="M0 0"/></svg>', '<svg><path d="M0 0"/></svg>');
check("scripts and event handlers are stripped", '<svg><script>alert(1)</script><path onclick="alert(1)" d="M0 0"/></svg>', '<svg><path d="M0 0"/></svg>');

console.log(`✓ ${passed}/${passed} SVG optimizer assertions passed`);
