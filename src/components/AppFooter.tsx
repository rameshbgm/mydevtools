"use client";

/* AppFooter — "Press" colophon. Three columns: imprint, links, statement. */

import { toolsRegistry } from "@/lib/tools-registry";

export default function AppFooter() {
    const year = new Date().getFullYear();
    return (
        <footer className="press-colophon" role="contentinfo">
            <div className="press-colophon__inner">
                <div className="press-colophon__section">
                    <h5>Colophon</h5>
                    <p>
                        Set in IBM Plex Serif, Sans, and Mono. Edition №1, published from a
                        single static bundle. {toolsRegistry.length} tools indexed; everything
                        runs in your browser.
                    </p>
                    <p>
                        © {year} mydevtools — released under the MIT License.
                    </p>
                </div>

                <div className="press-colophon__section">
                    <h5>Workshop</h5>
                    <p>
                        <a href="https://github.com/rameshbgm/mydevtools" target="_blank" rel="noopener noreferrer">
                            GitHub repository
                        </a>
                    </p>
                    <p>
                        <a href="https://github.com/rameshbgm/mydevtools/issues" target="_blank" rel="noopener noreferrer">
                            Report an issue
                        </a>
                    </p>
                    <p>
                        <a href="https://rameshsnotebook.com/" target="_blank" rel="noopener noreferrer">
                            Editor&rsquo;s notebook
                        </a>
                    </p>
                </div>

                <div className="press-colophon__section">
                    <h5>Editorial Note</h5>
                    <p>
                        No telemetry. No third-party requests beyond CDN fonts.
                        Every keystroke stays on your machine.
                    </p>
                    <p>
                        Edited by{" "}
                        <a href="https://www.linkedin.com/in/rameshbgm/" target="_blank" rel="noopener noreferrer">
                            Ramesh Maharaddi
                        </a>
                        .
                    </p>
                </div>
            </div>
        </footer>
    );
}
