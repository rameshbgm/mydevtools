import { common,createLowlight } from "lowlight";
import { codeTokensFromTree,plainCodeLines,validateScreenshotCode } from "../lib/code-screenshot";
const lowlight=createLowlight(common);
self.onmessage=(event: MessageEvent<{ source:string; language:string }>) => {
    try {const source=validateScreenshotCode(event.data.source), language=event.data.language;if(language!=="plaintext"&&!lowlight.registered(language))throw new Error("This language is not registered. Choose plain text.");self.postMessage({lines:language==="plaintext"?plainCodeLines(source):codeTokensFromTree(lowlight.highlight(language,source))});}
    catch(cause){self.postMessage({error:String(cause)});}
};
