interface JsonNumberContext { source?: string }
interface RawJsonFactory { rawJSON?: (source:string)=>unknown }
function decimalValue(source:string): string {
    const match=/^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i.exec(source);
    if(!match)return source;
    if(source.length>2000||(match[4]?.replace(/^[+-]/,"").length??0)>6)return source;
    let digits=(match[2]+(match[3]??"")).replace(/^0+/,""),scale=Number(match[4]??0)-(match[3]?.length??0);
    if(!digits)return "0";
    const trimmed=digits.replace(/0+$/,"");scale+=digits.length-trimmed.length;digits=trimmed;
    return `${match[1]}${digits}e${scale}`;
}
/** Retain source numbers that native Number would round, overflow or erase -0.
 * Raw mode is for re-encoding provider requests on the Node 24 runtime.
 * String mode is for previews; the original response text is exported separately.
 */
export function parseDocumentJson(source:string,mode:"strings"|"raw"|"reject"="strings"):{value:unknown;convertedNumbers:number}{
    if(source.length>2*1024*1024)throw new Error("JSON text exceeds 2 MiB.");
    let convertedNumbers=0;
    const reviver=(_key:string,value:unknown,context?:JsonNumberContext)=>{
        if(typeof value!=="number")return value;
        if(!context?.source)throw new Error("This connector requires Node.js 24+ JSON source tracking.");
        if(Number.isFinite(value)&&!Object.is(value,-0)&&decimalValue(context.source)===decimalValue(String(value)))return value;
        convertedNumbers++;
        if(mode==="reject")throw new Error("Use Extended JSON $numberLong/$numberDecimal strings for numbers that JavaScript would round.");
        if(mode==="strings")return context.source;
        const raw=(JSON as RawJsonFactory).rawJSON;if(!raw)throw new Error("This connector requires Node.js 24+ raw JSON support.");
        return raw(context.source);
    };
    const value=JSON.parse(source,reviver);
    return {value,convertedNumbers};
}
export function documentJsonObject(value:unknown,label="Query"):Record<string,unknown>{if(!value||typeof value!=="object"||Array.isArray(value))throw new Error(`${label} must be a JSON object.`);return value as Record<string,unknown>;}
