import type { MessageInstance } from "antd/es/message/interface";

let _msg: MessageInstance | null = null;

export const setMessageInstance = (msg: MessageInstance) => {
    _msg = msg;
};

export const messageService = {
    success: (content: string) => _msg?.success(content),
    error: (content: string) => _msg?.error(content),
    warning: (content: string) => _msg?.warning(content),
    info: (content: string) => _msg?.info(content),
};
