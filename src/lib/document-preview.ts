/** Limit rendering work independently of the full lossless export payload. */
export function documentPreview(value:unknown,maximum=65536):string{
    const compact=JSON.stringify(value)??"";
    const text=compact.length>maximum?compact:JSON.stringify(value,null,2)??"";
    return text.length>maximum?text.slice(0,maximum)+"\n… Preview truncated. Use the raw JSON export for the complete result.":text;
}
