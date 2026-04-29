"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
    Card,
    Input,
    Button,
    Typography,
    Row,
    Col,
    Space,
    message,
    Tag,
    Alert,
    Descriptions,
    Tabs,
    InputNumber,
    Table,
    Select,
} from "antd";
import {
    WifiOutlined,
    CopyOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    SearchOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import { useAppStore } from "@/lib/store";

const { Text } = Typography;

// ─── Vendor Database (Expanded) ──────────────────────────────────────

const VENDOR_DATABASE: Record<string, string> = {
    // Apple
    "00:1C:B3": "Apple, Inc.",
    "00:1E:C2": "Apple, Inc.",
    "00:21:E9": "Apple, Inc.",
    "00:23:DF": "Apple, Inc.",
    "00:25:00": "Apple, Inc.",
    "00:26:08": "Apple, Inc.",
    "00:26:BB": "Apple, Inc.",
    "00:3E:E1": "Apple, Inc.",
    "04:0C:CE": "Apple, Inc.",
    "04:15:52": "Apple, Inc.",
    "04:26:65": "Apple, Inc.",
    "04:54:53": "Apple, Inc.",
    "04:D3:CF": "Apple, Inc.",
    "04:F7:E4": "Apple, Inc.",
    "08:66:98": "Apple, Inc.",
    "0C:15:39": "Apple, Inc.",
    "14:10:9F": "Apple, Inc.",
    "14:5A:05": "Apple, Inc.",
    "18:9E:FC": "Apple, Inc.",
    "24:AB:81": "Apple, Inc.",
    "28:37:37": "Apple, Inc.",
    "30:63:6B": "Apple, Inc.",
    "34:36:3B": "Apple, Inc.",
    "38:C9:86": "Apple, Inc.",
    "40:33:1A": "Apple, Inc.",
    "48:60:BC": "Apple, Inc.",
    "50:ED:3C": "Apple, Inc.",
    "54:4E:90": "Apple, Inc.",
    "58:55:CA": "Apple, Inc.",
    "60:C5:47": "Apple, Inc.",
    "64:E6:82": "Apple, Inc.",
    "68:5B:35": "Apple, Inc.",
    "6C:4D:73": "Apple, Inc.",
    "70:3E:AC": "Apple, Inc.",
    "78:31:C1": "Apple, Inc.",
    "7C:D1:C3": "Apple, Inc.",
    "80:E6:50": "Apple, Inc.",
    "84:78:8B": "Apple, Inc.",
    "88:66:A5": "Apple, Inc.",
    "8C:29:37": "Apple, Inc.",
    "90:8D:6C": "Apple, Inc.",
    "98:03:D8": "Apple, Inc.",
    "9C:20:7B": "Apple, Inc.",
    "A4:5E:60": "Apple, Inc.",
    "A8:5C:2C": "Apple, Inc.",
    "AC:87:A3": "Apple, Inc.",
    "B0:34:95": "Apple, Inc.",
    "B4:18:D1": "Apple, Inc.",
    "B8:17:C2": "Apple, Inc.",
    "BC:52:B7": "Apple, Inc.",
    "C0:CE:CD": "Apple, Inc.",
    "C4:2C:03": "Apple, Inc.",
    "C8:69:CD": "Apple, Inc.",
    "CC:20:E8": "Apple, Inc.",
    "D0:03:4B": "Apple, Inc.",
    "D4:61:9D": "Apple, Inc.",
    "D8:00:4D": "Apple, Inc.",
    "DC:41:5F": "Apple, Inc.",
    "E0:C7:67": "Apple, Inc.",
    "E4:25:E7": "Apple, Inc.",
    "E8:80:2E": "Apple, Inc.",
    "EC:35:86": "Apple, Inc.",
    "F0:18:98": "Apple, Inc.",
    "F4:1B:A1": "Apple, Inc.",
    "F8:27:93": "Apple, Inc.",
    "FC:D8:48": "Apple, Inc.",

    // Samsung
    "00:07:AB": "Samsung Electronics",
    "00:12:47": "Samsung Electronics",
    "00:15:99": "Samsung Electronics",
    "00:17:D5": "Samsung Electronics",
    "00:21:D1": "Samsung Electronics",
    "00:24:90": "Samsung Electronics",
    "00:26:5D": "Samsung Electronics",
    "08:EE:8B": "Samsung Electronics",
    "10:D5:42": "Samsung Electronics",
    "1C:66:AA": "Samsung Electronics",
    "24:4B:81": "Samsung Electronics",
    "30:CD:A7": "Samsung Electronics",
    "38:01:97": "Samsung Electronics",
    "44:4E:1A": "Samsung Electronics",
    "50:01:BB": "Samsung Electronics",
    "5C:A3:9D": "Samsung Electronics",
    "64:77:91": "Samsung Electronics",
    "6C:2F:2C": "Samsung Electronics",
    "78:47:1D": "Samsung Electronics",
    "84:11:9E": "Samsung Electronics",
    "90:18:7C": "Samsung Electronics",
    "94:35:0A": "Samsung Electronics",
    "A8:7C:01": "Samsung Electronics",
    "BC:14:85": "Samsung Electronics",
    "C4:42:02": "Samsung Electronics",
    "D0:17:6A": "Samsung Electronics",
    "E4:FA:ED": "Samsung Electronics",
    "F0:25:B7": "Samsung Electronics",
    "FC:A1:3E": "Samsung Electronics",

    // Google
    "00:1A:11": "Google, Inc.",
    "08:9E:08": "Google, Inc.",
    "3C:5A:B4": "Google, Inc.",
    "54:60:09": "Google, Inc.",
    "94:EB:2C": "Google, Inc.",
    "A4:77:33": "Google, Inc.",
    "F4:F5:D8": "Google, Inc.",
    "F4:F5:E8": "Google, Inc.",

    // Microsoft
    "00:0D:3A": "Microsoft Corporation",
    "00:12:5A": "Microsoft Corporation",
    "00:15:5D": "Microsoft Corporation",
    "00:17:FA": "Microsoft Corporation",
    "00:1D:D8": "Microsoft Corporation",
    "00:50:F2": "Microsoft Corporation",
    "28:18:78": "Microsoft Corporation",
    "30:59:B7": "Microsoft Corporation",
    "3C:83:75": "Microsoft Corporation",
    "50:1A:C5": "Microsoft Corporation",
    "58:82:A8": "Microsoft Corporation",
    "60:45:BD": "Microsoft Corporation",
    "7C:1E:52": "Microsoft Corporation",
    "7C:ED:8D": "Microsoft Corporation",
    "98:5F:D3": "Microsoft Corporation",
    "B4:AE:2B": "Microsoft Corporation",
    "C8:3F:26": "Microsoft Corporation",
    "DC:B4:C4": "Microsoft Corporation",

    // Intel
    "00:02:B3": "Intel Corporation",
    "00:03:47": "Intel Corporation",
    "00:07:E9": "Intel Corporation",
    "00:0E:0C": "Intel Corporation",
    "00:0E:35": "Intel Corporation",
    "00:12:F0": "Intel Corporation",
    "00:13:02": "Intel Corporation",
    "00:13:20": "Intel Corporation",
    "00:13:E8": "Intel Corporation",
    "00:15:00": "Intel Corporation",
    "00:16:6F": "Intel Corporation",
    "00:16:76": "Intel Corporation",
    "00:16:EA": "Intel Corporation",
    "00:18:DE": "Intel Corporation",
    "00:19:D1": "Intel Corporation",
    "00:1B:21": "Intel Corporation",
    "00:1C:BF": "Intel Corporation",
    "00:1D:E0": "Intel Corporation",
    "00:1E:64": "Intel Corporation",
    "00:1E:65": "Intel Corporation",
    "00:1E:67": "Intel Corporation",
    "00:1F:3B": "Intel Corporation",
    "00:1F:3C": "Intel Corporation",
    "00:21:5C": "Intel Corporation",
    "00:21:5D": "Intel Corporation",
    "00:21:6A": "Intel Corporation",
    "00:21:6B": "Intel Corporation",
    "00:22:FA": "Intel Corporation",
    "00:22:FB": "Intel Corporation",
    "00:24:D6": "Intel Corporation",
    "00:24:D7": "Intel Corporation",
    "00:26:C6": "Intel Corporation",
    "00:26:C7": "Intel Corporation",
    "00:27:10": "Intel Corporation",
    "24:77:03": "Intel Corporation",
    "3C:A9:F4": "Intel Corporation",
    "48:51:B7": "Intel Corporation",
    "60:67:20": "Intel Corporation",
    "80:19:34": "Intel Corporation",
    "84:3A:4B": "Intel Corporation",
    "94:65:9C": "Intel Corporation",
    "A0:36:9F": "Intel Corporation",
    "B4:6B:FC": "Intel Corporation",
    "C8:F7:33": "Intel Corporation",
    "DC:53:60": "Intel Corporation",
    "E4:B3:18": "Intel Corporation",
    "F8:94:C2": "Intel Corporation",

    // Dell
    "00:06:5B": "Dell Inc.",
    "00:08:74": "Dell Inc.",
    "00:0B:DB": "Dell Inc.",
    "00:0D:56": "Dell Inc.",
    "00:0F:1F": "Dell Inc.",
    "00:11:43": "Dell Inc.",
    "00:12:3F": "Dell Inc.",
    "00:13:72": "Dell Inc.",
    "00:14:22": "Dell Inc.",
    "00:15:C5": "Dell Inc.",
    "00:18:8B": "Dell Inc.",
    "00:19:B9": "Dell Inc.",
    "00:1A:A0": "Dell Inc.",
    "00:1C:23": "Dell Inc.",
    "00:1D:09": "Dell Inc.",
    "00:1E:4F": "Dell Inc.",
    "00:21:70": "Dell Inc.",
    "00:21:9B": "Dell Inc.",
    "00:22:19": "Dell Inc.",
    "00:24:E8": "Dell Inc.",
    "00:25:64": "Dell Inc.",
    "14:18:77": "Dell Inc.",
    "18:03:73": "Dell Inc.",
    "1C:40:24": "Dell Inc.",
    "24:6E:96": "Dell Inc.",
    "34:17:EB": "Dell Inc.",
    "44:A8:42": "Dell Inc.",
    "50:9A:4C": "Dell Inc.",
    "54:9F:35": "Dell Inc.",
    "5C:F9:DD": "Dell Inc.",
    "74:86:7A": "Dell Inc.",
    "78:45:C4": "Dell Inc.",
    "84:8F:69": "Dell Inc.",
    "90:B1:1C": "Dell Inc.",
    "98:90:96": "Dell Inc.",
    "A4:1F:72": "Dell Inc.",
    "A4:BA:DB": "Dell Inc.",
    "B0:83:FE": "Dell Inc.",
    "B8:AC:6F": "Dell Inc.",
    "BC:30:5B": "Dell Inc.",
    "C8:1F:66": "Dell Inc.",
    "D4:81:D7": "Dell Inc.",
    "D4:AE:52": "Dell Inc.",
    "D4:BE:D9": "Dell Inc.",
    "EC:F4:BB": "Dell Inc.",
    "F0:1F:AF": "Dell Inc.",
    "F4:8E:38": "Dell Inc.",
    "F8:BC:12": "Dell Inc.",

    // Cisco
    "00:00:0C": "Cisco Systems",
    "00:01:42": "Cisco Systems",
    "00:01:43": "Cisco Systems",
    "00:01:63": "Cisco Systems",
    "00:01:64": "Cisco Systems",
    "00:01:96": "Cisco Systems",
    "00:01:97": "Cisco Systems",
    "00:01:C7": "Cisco Systems",
    "00:01:C9": "Cisco Systems",
    "00:02:16": "Cisco Systems",
    "00:02:17": "Cisco Systems",
    "00:02:3D": "Cisco Systems",
    "00:02:4A": "Cisco Systems",
    "00:02:4B": "Cisco Systems",
    "00:02:7D": "Cisco Systems",
    "00:02:7E": "Cisco Systems",
    "00:02:B9": "Cisco Systems",
    "00:02:BA": "Cisco Systems",
    "00:02:FC": "Cisco Systems",
    "00:02:FD": "Cisco Systems",
    "00:03:31": "Cisco Systems",
    "00:03:32": "Cisco Systems",
    "00:03:6B": "Cisco Systems",
    "00:03:6C": "Cisco Systems",
    "00:03:9F": "Cisco Systems",
    "00:03:A0": "Cisco Systems",
    "00:03:E3": "Cisco Systems",
    "00:03:E4": "Cisco Systems",
    "00:03:FD": "Cisco Systems",
    "00:03:FE": "Cisco Systems",
    "00:04:27": "Cisco Systems",
    "00:04:28": "Cisco Systems",
    "00:04:4D": "Cisco Systems",
    "00:04:4E": "Cisco Systems",
    "00:04:6D": "Cisco Systems",
    "00:04:6E": "Cisco Systems",
    "00:04:9A": "Cisco Systems",
    "00:04:9B": "Cisco Systems",
    "00:04:C0": "Cisco Systems",
    "00:04:C1": "Cisco Systems",
    "00:04:DD": "Cisco Systems",
    "00:04:DE": "Cisco Systems",
    "00:05:00": "Cisco Systems",
    "00:05:01": "Cisco Systems",
    "00:05:31": "Cisco Systems",
    "00:05:32": "Cisco Systems",
    "00:05:5E": "Cisco Systems",
    "00:05:5F": "Cisco Systems",
    "00:05:73": "Cisco Systems",
    "00:05:74": "Cisco Systems",
    "00:05:9A": "Cisco Systems",
    "00:05:9B": "Cisco Systems",
    "00:05:DC": "Cisco Systems",
    "00:05:DD": "Cisco Systems",
    "00:06:28": "Cisco Systems",
    "00:06:2A": "Cisco Systems",
    "00:06:52": "Cisco Systems",
    "00:06:53": "Cisco Systems",
    "00:06:7C": "Cisco Systems",
    "00:06:C1": "Cisco Systems",
    "00:06:D6": "Cisco Systems",
    "00:06:D7": "Cisco Systems",
    "00:06:F6": "Cisco Systems",

    // HP/HPE
    "00:01:E6": "Hewlett Packard",
    "00:01:E7": "Hewlett Packard",
    "00:04:EA": "Hewlett Packard",
    "00:08:02": "Hewlett Packard",
    "00:08:83": "Hewlett Packard",
    "00:0A:57": "Hewlett Packard",
    "00:0B:CD": "Hewlett Packard",
    "00:0D:9D": "Hewlett Packard",
    "00:0E:7F": "Hewlett Packard",
    "00:0F:20": "Hewlett Packard",
    "00:0F:61": "Hewlett Packard",
    "00:10:83": "Hewlett Packard",
    "00:11:0A": "Hewlett Packard",
    "00:11:85": "Hewlett Packard",
    "00:12:79": "Hewlett Packard",
    "00:13:21": "Hewlett Packard",
    "00:14:38": "Hewlett Packard",
    "00:14:C2": "Hewlett Packard",
    "00:15:60": "Hewlett Packard",
    "00:16:35": "Hewlett Packard",
    "00:17:08": "Hewlett Packard",
    "00:17:A4": "Hewlett Packard",
    "00:18:71": "Hewlett Packard",
    "00:18:FE": "Hewlett Packard",
    "00:19:BB": "Hewlett Packard",
    "00:1A:4B": "Hewlett Packard",
    "00:1B:78": "Hewlett Packard",
    "00:1C:2E": "Hewlett Packard",
    "00:1C:C4": "Hewlett Packard",
    "00:1E:0B": "Hewlett Packard",
    "00:1F:29": "Hewlett Packard",
    "00:1F:FE": "Hewlett Packard",
    "00:21:5A": "Hewlett Packard",
    "00:22:64": "Hewlett Packard",
    "00:23:7D": "Hewlett Packard",
    "00:24:81": "Hewlett Packard",
    "00:25:B3": "Hewlett Packard",
    "00:26:55": "Hewlett Packard",
    "08:2E:5F": "Hewlett Packard",
    "10:1F:74": "Hewlett Packard",
    "10:60:4B": "Hewlett Packard",
    "18:A9:05": "Hewlett Packard",
    "1C:98:EC": "Hewlett Packard",
    "1C:C1:DE": "Hewlett Packard",
    "24:BE:05": "Hewlett Packard",
    "28:80:23": "Hewlett Packard",
    "2C:27:D7": "Hewlett Packard",
    "2C:41:38": "Hewlett Packard",
    "2C:44:FD": "Hewlett Packard",
    "2C:59:E5": "Hewlett Packard",
    "2C:76:8A": "Hewlett Packard",
    "30:8D:99": "Hewlett Packard",
    "30:E1:71": "Hewlett Packard",
    "34:64:A9": "Hewlett Packard",
    "38:63:BB": "Hewlett Packard",
    "38:EA:A7": "Hewlett Packard",
    "3C:4A:92": "Hewlett Packard",
    "3C:A8:2A": "Hewlett Packard",
    "3C:D9:2B": "Hewlett Packard",
    "40:A8:F0": "Hewlett Packard",
    "40:B0:34": "Hewlett Packard",
    "44:1E:A1": "Hewlett Packard",
    "44:31:92": "Hewlett Packard",
    "48:0F:CF": "Hewlett Packard",
    "48:DF:37": "Hewlett Packard",
    "4C:39:09": "Hewlett Packard",
    "50:65:F3": "Hewlett Packard",
    "58:20:B1": "Hewlett Packard",
    "5C:8A:38": "Hewlett Packard",
    "5C:B9:01": "Hewlett Packard",
    "64:51:06": "Hewlett Packard",
    "68:B5:99": "Hewlett Packard",
    "6C:3B:E5": "Hewlett Packard",
    "70:10:6F": "Hewlett Packard",
    "78:AC:C0": "Hewlett Packard",
    "78:E3:B5": "Hewlett Packard",
    "78:E7:D1": "Hewlett Packard",
    "80:C1:6E": "Hewlett Packard",
    "84:34:97": "Hewlett Packard",
    "88:51:FB": "Hewlett Packard",
    "8C:DC:D4": "Hewlett Packard",
    "94:18:82": "Hewlett Packard",
    "94:57:A5": "Hewlett Packard",
    "98:4B:E1": "Hewlett Packard",
    "98:E7:F4": "Hewlett Packard",
    "9C:8E:99": "Hewlett Packard",
    "9C:B6:54": "Hewlett Packard",
    "A0:1D:48": "Hewlett Packard",
    "A0:2B:B8": "Hewlett Packard",
    "A0:48:1C": "Hewlett Packard",
    "A0:D3:C1": "Hewlett Packard",
    "A4:5D:36": "Hewlett Packard",
    "A8:B4:56": "Hewlett Packard",
    "AC:16:2D": "Hewlett Packard",
    "B0:5A:DA": "Hewlett Packard",
    "B4:39:D6": "Hewlett Packard",
    "B4:99:BA": "Hewlett Packard",
    "B4:B5:2F": "Hewlett Packard",
    "B8:AF:67": "Hewlett Packard",
    "BC:EA:FA": "Hewlett Packard",
    "C0:91:34": "Hewlett Packard",
    "C4:34:6B": "Hewlett Packard",
    "C8:B5:AD": "Hewlett Packard",
    "C8:CB:B8": "Hewlett Packard",
    "CC:3E:5F": "Hewlett Packard",
    "D0:7E:28": "Hewlett Packard",
    "D4:85:64": "Hewlett Packard",
    "D4:C9:EF": "Hewlett Packard",
    "D8:9D:67": "Hewlett Packard",
    "D8:D3:85": "Hewlett Packard",
    "DC:4A:3E": "Hewlett Packard",
    "E0:07:1B": "Hewlett Packard",
    "E4:11:5B": "Hewlett Packard",
    "E8:39:35": "Hewlett Packard",
    "E8:F7:24": "Hewlett Packard",
    "EC:8E:B5": "Hewlett Packard",
    "EC:B1:D7": "Hewlett Packard",
    "F0:62:81": "Hewlett Packard",
    "F0:92:1C": "Hewlett Packard",
    "F4:03:43": "Hewlett Packard",
    "F4:CE:46": "Hewlett Packard",
    "FC:15:B4": "Hewlett Packard",
    "FC:3F:DB": "Hewlett Packard",

    // VMware
    "00:0C:29": "VMware, Inc.",
    "00:50:56": "VMware, Inc.",
    "00:05:69": "VMware, Inc.",

    // VirtualBox
    "08:00:27": "Oracle VirtualBox",
    "0A:00:27": "Oracle VirtualBox",

    // Raspberry Pi
    "B8:27:EB": "Raspberry Pi Foundation",
    "DC:A6:32": "Raspberry Pi Foundation",
    "E4:5F:01": "Raspberry Pi Foundation",

    // Espressif (ESP32/ESP8266)
    "24:0A:C4": "Espressif Inc.",
    "24:6F:28": "Espressif Inc.",
    "30:AE:A4": "Espressif Inc.",
    "3C:61:05": "Espressif Inc.",
    "3C:71:BF": "Espressif Inc.",
    "4C:11:AE": "Espressif Inc.",
    "5C:CF:7F": "Espressif Inc.",
    "60:01:94": "Espressif Inc.",
    "68:C6:3A": "Espressif Inc.",
    "84:0D:8E": "Espressif Inc.",
    "84:CC:A8": "Espressif Inc.",
    "84:F3:EB": "Espressif Inc.",
    "8C:AA:B5": "Espressif Inc.",
    "8C:CE:4E": "Espressif Inc.",
    "90:97:D5": "Espressif Inc.",
    "94:B5:55": "Espressif Inc.",
    "94:B9:7E": "Espressif Inc.",
    "98:CD:AC": "Espressif Inc.",
    "98:F4:AB": "Espressif Inc.",
    "A0:20:A6": "Espressif Inc.",
    "A4:7B:9D": "Espressif Inc.",
    "A4:CF:12": "Espressif Inc.",
    "AC:67:B2": "Espressif Inc.",
    "B4:E6:2D": "Espressif Inc.",
    "BC:DD:C2": "Espressif Inc.",
    "C4:4F:33": "Espressif Inc.",
    "C4:5B:BE": "Espressif Inc.",
    "C8:2B:96": "Espressif Inc.",
    "CC:50:E3": "Espressif Inc.",
    "D8:A0:1D": "Espressif Inc.",
    "D8:BF:C0": "Espressif Inc.",
    "DC:4F:22": "Espressif Inc.",
    "E0:98:06": "Espressif Inc.",
    "EC:FA:BC": "Espressif Inc.",
    "F0:08:D1": "Espressif Inc.",
    "FC:F5:C4": "Espressif Inc.",

    // Amazon
    "00:BB:3A": "Amazon Technologies",
    "0C:47:C9": "Amazon Technologies",
    "10:CE:A9": "Amazon Technologies",
    "14:91:38": "Amazon Technologies",
    "18:74:2E": "Amazon Technologies",
    "34:D2:70": "Amazon Technologies",
    "40:B4:CD": "Amazon Technologies",
    "44:65:0D": "Amazon Technologies",
    "50:DC:E7": "Amazon Technologies",
    "50:F5:DA": "Amazon Technologies",
    "68:37:E9": "Amazon Technologies",
    "68:54:FD": "Amazon Technologies",
    "6C:56:97": "Amazon Technologies",
    "74:C2:46": "Amazon Technologies",
    "78:E1:03": "Amazon Technologies",
    "84:D6:D0": "Amazon Technologies",
    "88:71:B1": "Amazon Technologies",
    "A0:02:DC": "Amazon Technologies",
    "AC:63:BE": "Amazon Technologies",
    "B4:7C:9C": "Amazon Technologies",
    "F0:27:2D": "Amazon Technologies",
    "F0:81:73": "Amazon Technologies",
    "FC:65:DE": "Amazon Technologies",
    "FC:A1:83": "Amazon Technologies",

    // TP-Link
    "00:27:19": "TP-Link Technologies",
    "14:CC:20": "TP-Link Technologies",
    "18:A6:F7": "TP-Link Technologies",
    "1C:3B:F3": "TP-Link Technologies",
    "30:B5:C2": "TP-Link Technologies",
    "50:C7:BF": "TP-Link Technologies",
    "54:C8:0F": "TP-Link Technologies",
    "60:E3:27": "TP-Link Technologies",
    "64:56:01": "TP-Link Technologies",
    "64:70:02": "TP-Link Technologies",
    "6C:5A:B0": "TP-Link Technologies",
    "70:4F:57": "TP-Link Technologies",
    "78:44:76": "TP-Link Technologies",
    "80:89:17": "TP-Link Technologies",
    "8C:A6:DF": "TP-Link Technologies",
    "90:F6:52": "TP-Link Technologies",
    "94:D9:B3": "TP-Link Technologies",
    "98:DA:C4": "TP-Link Technologies",
    "A0:F3:C1": "TP-Link Technologies",
    "A4:2B:B0": "TP-Link Technologies",
    "B0:4E:26": "TP-Link Technologies",
    "B0:95:75": "TP-Link Technologies",
    "B0:BE:76": "TP-Link Technologies",
    "BC:46:99": "TP-Link Technologies",
    "C0:E4:2D": "TP-Link Technologies",
    "C4:E9:84": "TP-Link Technologies",
    "CC:32:E5": "TP-Link Technologies",
    "D4:6E:0E": "TP-Link Technologies",
    "D8:07:B6": "TP-Link Technologies",
    "D8:47:32": "TP-Link Technologies",
    "E4:8D:8C": "TP-Link Technologies",
    "EC:08:6B": "TP-Link Technologies",
    "EC:17:2F": "TP-Link Technologies",
    "F0:A7:31": "TP-Link Technologies",
    "F4:EC:38": "TP-Link Technologies",
    "F8:1A:67": "TP-Link Technologies",
    "F8:D1:11": "TP-Link Technologies",

    // Netgear
    "00:09:5B": "Netgear",
    "00:0F:B5": "Netgear",
    "00:14:6C": "Netgear",
    "00:18:4D": "Netgear",
    "00:1B:2F": "Netgear",
    "00:1E:2A": "Netgear",
    "00:1F:33": "Netgear",
    "00:22:3F": "Netgear",
    "00:24:B2": "Netgear",
    "00:26:F2": "Netgear",
    "04:A1:51": "Netgear",
    "08:BD:43": "Netgear",
    "0C:80:63": "Netgear",
    "10:0C:6B": "Netgear",
    "10:0D:7F": "Netgear",
    "14:59:C0": "Netgear",
    "20:0C:C8": "Netgear",
    "20:4E:7F": "Netgear",
    "28:C6:8E": "Netgear",
    "2C:B0:5D": "Netgear",
    "30:46:9A": "Netgear",
    "38:94:ED": "Netgear",
    "3C:37:86": "Netgear",
    "44:94:FC": "Netgear",
    "4C:60:DE": "Netgear",
    "50:6A:03": "Netgear",
    "54:07:7D": "Netgear",
    "6C:B0:CE": "Netgear",
    "74:44:01": "Netgear",
    "78:D2:94": "Netgear",
    "80:37:73": "Netgear",
    "84:1B:5E": "Netgear",
    "8C:3B:AD": "Netgear",
    "94:44:52": "Netgear",
    "9C:3D:CF": "Netgear",
    "A0:04:60": "Netgear",
    "A0:21:B7": "Netgear",
    "A0:40:A0": "Netgear",
    "A4:2B:8C": "Netgear",
    "B0:7F:B9": "Netgear",
    "B0:B9:8A": "Netgear",
    "C0:3F:0E": "Netgear",
    "C0:FF:D4": "Netgear",
    "C4:04:15": "Netgear",
    "C4:3D:C7": "Netgear",
    "CC:40:D0": "Netgear",
    "D8:EB:97": "Netgear",
    "DC:EF:09": "Netgear",
    "E0:46:9A": "Netgear",
    "E0:91:F5": "Netgear",
    "E4:F4:C6": "Netgear",
    "E8:FC:AF": "Netgear",
    "F8:4E:73": "Netgear",
    "FC:09:D8": "Netgear",
};

// ─── Sample MAC Addresses ────────────────────────────────────────────

const SAMPLE_MACS = [
    { mac: "00:1C:B3:00:00:01", desc: "Apple Device" },
    { mac: "00:50:56:C0:00:08", desc: "VMware Virtual" },
    { mac: "08:00:27:12:34:56", desc: "VirtualBox VM" },
    { mac: "B8:27:EB:00:00:01", desc: "Raspberry Pi" },
    { mac: "24:0A:C4:00:00:01", desc: "ESP32/ESP8266" },
    { mac: "00:0C:29:AB:CD:EF", desc: "VMware VM" },
    { mac: "FF:FF:FF:FF:FF:FF", desc: "Broadcast" },
    { mac: "01:00:5E:00:00:01", desc: "IPv4 Multicast" },
    { mac: "33:33:00:00:00:01", desc: "IPv6 Multicast" },
    { mac: "00:00:0C:07:AC:01", desc: "Cisco HSRP" },
];

// ─── MAC Address Utils ───────────────────────────────────────────────

interface MACInfo {
    isValid: boolean;
    normalized: string;
    vendor: string;
    oui: string;
    nic: string;
    type: "Unicast" | "Multicast";
    scope: "Globally Unique (UAA)" | "Locally Administered (LAA)";
    isBroadcast: boolean;
    isMulticast: boolean;
    isUnicast: boolean;
    isLocallyAdministered: boolean;
    isUniversallyAdministered: boolean;
    binaryFormat: string;
    formats: {
        colon: string;
        hyphen: string;
        dot: string;
        bare: string;
        cisco: string;
    };
    eui64: string;
}

function normalizeMac(mac: string): string | null {
    const clean = mac.replace(/[:\-.\s]/g, "").toUpperCase();
    if (!/^[0-9A-F]{12}$/.test(clean)) return null;
    return clean;
}

function formatMac(mac: string, format: "colon" | "hyphen" | "dot" | "bare" | "cisco"): string {
    const clean = mac.replace(/[:\-.\s]/g, "").toUpperCase();

    switch (format) {
        case "colon":
            return clean.match(/.{2}/g)!.join(":");
        case "hyphen":
            return clean.match(/.{2}/g)!.join("-");
        case "dot":
            return clean.match(/.{4}/g)!.join(".");
        case "bare":
            return clean;
        case "cisco":
            return clean.match(/.{4}/g)!.join(".").toLowerCase();
        default:
            return clean;
    }
}

function lookupVendor(oui: string): string {
    const normalizedOUI = oui.toUpperCase().replace(/[:\-]/g, ":");
    const colonFormat = normalizedOUI.split("").reduce((acc, char, i) => {
        if (i > 0 && i % 2 === 0) acc += ":";
        acc += char;
        return acc;
    }, "").substring(0, 8);

    return VENDOR_DATABASE[colonFormat] || "Unknown Vendor";
}

function analyzeMac(input: string): MACInfo {
    const normalized = normalizeMac(input);

    if (!normalized) {
        return {
            isValid: false,
            normalized: "",
            vendor: "",
            oui: "",
            nic: "",
            type: "Unicast",
            scope: "Globally Unique (UAA)",
            isBroadcast: false,
            isMulticast: false,
            isUnicast: false,
            isLocallyAdministered: false,
            isUniversallyAdministered: false,
            binaryFormat: "",
            formats: {
                colon: "",
                hyphen: "",
                dot: "",
                bare: "",
                cisco: "",
            },
            eui64: "",
        };
    }

    const oui = normalized.substring(0, 6);
    const nic = normalized.substring(6);
    const firstByte = parseInt(normalized.substring(0, 2), 16);

    const isMulticast = (firstByte & 0x01) === 1;
    const isLocallyAdministered = (firstByte & 0x02) === 2;
    const isBroadcast = normalized === "FFFFFFFFFFFF";

    const binaryBytes = normalized.match(/.{2}/g)!.map(byte =>
        parseInt(byte, 16).toString(2).padStart(8, "0")
    );

    // Generate EUI-64 (for IPv6 SLAAC)
    const ouiPart = normalized.substring(0, 6);
    const nicPart = normalized.substring(6);
    const modifiedFirstByte = (firstByte ^ 0x02).toString(16).padStart(2, "0").toUpperCase();
    const eui64 = `${modifiedFirstByte}${ouiPart.substring(2, 6)}FFFE${nicPart}`;
    const eui64Formatted = eui64.match(/.{4}/g)!.join(":").toLowerCase();

    return {
        isValid: true,
        normalized,
        vendor: lookupVendor(oui),
        oui: formatMac(oui + "000000", "colon").substring(0, 8),
        nic: formatMac("000000" + nic, "colon").substring(9),
        type: isMulticast ? "Multicast" : "Unicast",
        scope: isLocallyAdministered ? "Locally Administered (LAA)" : "Globally Unique (UAA)",
        isBroadcast,
        isMulticast,
        isUnicast: !isMulticast,
        isLocallyAdministered,
        isUniversallyAdministered: !isLocallyAdministered,
        binaryFormat: binaryBytes.join("."),
        formats: {
            colon: formatMac(normalized, "colon"),
            hyphen: formatMac(normalized, "hyphen"),
            dot: formatMac(normalized, "dot"),
            bare: normalized,
            cisco: formatMac(normalized, "cisco"),
        },
        eui64: eui64Formatted,
    };
}

function generateRandomMac(options: {
    unicast?: boolean;
    universal?: boolean;
    prefix?: string;
}): string {
    const { unicast = true, universal = true, prefix } = options;

    let bytes: number[];

    if (prefix) {
        const prefixClean = prefix.replace(/[:\-.\s]/g, "").toUpperCase();
        const prefixBytes = prefixClean.match(/.{2}/g)?.map(b => parseInt(b, 16)) || [];
        bytes = [...prefixBytes];
        while (bytes.length < 6) {
            bytes.push(Math.floor(Math.random() * 256));
        }
    } else {
        bytes = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256));
    }

    // Modify first byte based on options
    if (unicast) {
        bytes[0] = bytes[0] & 0xFE; // Clear multicast bit
    } else {
        bytes[0] = bytes[0] | 0x01; // Set multicast bit
    }

    if (universal) {
        bytes[0] = bytes[0] & 0xFD; // Clear local bit
    } else {
        bytes[0] = bytes[0] | 0x02; // Set local bit
    }

    return bytes.map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(":");
}

// ─── Component ───────────────────────────────────────────────────────

export default function MACAddressToolsPage() {
    const { darkMode } = useAppStore();
    const [inputMAC, setInputMAC] = useState("");
    const [generateCount, setGenerateCount] = useState(10);
    const [generatePrefix, setGeneratePrefix] = useState("");
    const [generateUnicast, setGenerateUnicast] = useState(true);
    const [generateUniversal, setGenerateUniversal] = useState(false);
    const [generatedMACs, setGeneratedMACs] = useState<string[]>([]);
    const [vendorSearch, setVendorSearch] = useState("");

    const macInfo = useMemo(() => analyzeMac(inputMAC), [inputMAC]);

    const filteredVendors = useMemo(() => {
        if (!vendorSearch.trim()) return [];
        const search = vendorSearch.toLowerCase();
        return Object.entries(VENDOR_DATABASE)
            .filter(([oui, vendor]) =>
                oui.toLowerCase().includes(search) ||
                vendor.toLowerCase().includes(search)
            )
            .slice(0, 50);
    }, [vendorSearch]);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        message.success(`${label} copied!`);
    };

    const handleGenerate = useCallback(() => {
        const macs: string[] = [];
        for (let i = 0; i < generateCount; i++) {
            macs.push(generateRandomMac({
                unicast: generateUnicast,
                universal: generateUniversal,
                prefix: generatePrefix || undefined,
            }));
        }
        setGeneratedMACs(macs);
    }, [generateCount, generatePrefix, generateUnicast, generateUniversal]);

    const handleCopyAll = () => {
        navigator.clipboard.writeText(generatedMACs.join("\n"));
        message.success("All MAC addresses copied!");
    };

    const handleDownload = () => {
        const blob = new Blob([generatedMACs.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mac-addresses.txt";
        a.click();
        URL.revokeObjectURL(url);
    };

    const getStatusColor = () => {
        if (!inputMAC) return undefined;
        return macInfo.isValid ? "success" : "error";
    };

    const sampleColumns = [
        { title: "MAC Address", dataIndex: "mac", key: "mac", render: (mac: string) => <Text code style={{ fontSize: 10 }}>{mac}</Text> },
        { title: "Type", dataIndex: "desc", key: "desc", render: (desc: string) => <Text style={{ fontSize: 11 }}>{desc}</Text> },
        {
            title: "",
            key: "action",
            width: 50,
            render: (_: unknown, record: { mac: string }) => (
                <Button size="small" type="link" onClick={() => setInputMAC(record.mac)}>Use</Button>
            )
        },
    ];

    const vendorColumns = [
        { title: "OUI", dataIndex: "oui", key: "oui", render: (oui: string) => <Text code>{oui}</Text> },
        { title: "Vendor", dataIndex: "vendor", key: "vendor" },
    ];

    return (
        <ToolPageLayout
            title="MAC Address Tools"
            description="Comprehensive MAC address analyzer, generator, and vendor lookup"
            icon={<WifiOutlined style={{ fontSize: 24, color: "#722ed1" }} />}
            color="#722ed1"
            learnMore={{
                whatIs: "MAC (Media Access Control) addresses are 48-bit unique identifiers assigned to network interfaces. The first 3 bytes (OUI - Organizationally Unique Identifier) identify the manufacturer, while the last 3 bytes (NIC) are device-specific.",
                whyUse: "Essential for network troubleshooting, security auditing, device identification, VM configuration, IoT development, and understanding network traffic.",
                howToUse: [
                    "Enter a MAC address to analyze its properties and lookup the vendor",
                    "Generate random MAC addresses with custom prefixes",
                    "Search the vendor database by OUI or company name",
                    "Copy addresses in various formats for different use cases",
                ],
                tips: [
                    "The first bit indicates unicast (0) or multicast (1)",
                    "The second bit indicates universal (0) or local (1) administration",
                    "Use locally administered MACs for VMs and containers",
                    "FF:FF:FF:FF:FF:FF is the broadcast address",
                ],
                useCases: [
                    "Identifying device manufacturers on a network",
                    "Generating unique MACs for virtual machines",
                    "Network security analysis and MAC filtering",
                    "IoT device identification and management",
                ],
            }}
        >
            <Tabs
                defaultActiveKey="analyze"
                items={[
                    {
                        key: "analyze",
                        label: <span><SearchOutlined /> Analyze</span>,
                        children: (
                            <Row gutter={[16, 16]}>
                                <Col xs={24} lg={16}>
                                    <Card size="small">
                                        <Space direction="vertical" style={{ width: "100%" }} size="middle">
                                            <Input
                                                size="large"
                                                placeholder="Enter MAC address (e.g., 00:1C:B3:00:00:01, 001CB3000001)"
                                                value={inputMAC}
                                                onChange={(e) => setInputMAC(e.target.value)}
                                                prefix={<WifiOutlined />}
                                                allowClear
                                                status={getStatusColor()}
                                                suffix={
                                                    inputMAC && (
                                                        macInfo.isValid ? (
                                                            <CheckCircleOutlined style={{ color: "#52c41a" }} />
                                                        ) : (
                                                            <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
                                                        )
                                                    )
                                                }
                                            />

                                            <Space wrap>
                                                <Text type="secondary">Generate:</Text>
                                                <Button size="small" onClick={() => setInputMAC(generateRandomMac({ unicast: true, universal: true }))}>
                                                    Random Universal
                                                </Button>
                                                <Button size="small" onClick={() => setInputMAC(generateRandomMac({ unicast: true, universal: false }))}>
                                                    Random Local
                                                </Button>
                                                <Button size="small" onClick={() => setInputMAC(generateRandomMac({ unicast: false, universal: true }))}>
                                                    Random Multicast
                                                </Button>
                                            </Space>
                                        </Space>
                                    </Card>

                                    {macInfo.isValid && (
                                        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                                            <Col xs={24} md={12}>
                                                <Card title="Address Information" size="small">
                                                    <Descriptions column={1} size="small">
                                                        <Descriptions.Item label="Vendor">
                                                            <Tag color={macInfo.vendor === "Unknown Vendor" ? "default" : "blue"}>
                                                                {macInfo.vendor}
                                                            </Tag>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="OUI (Manufacturer)">
                                                            <Text code>{macInfo.oui}</Text>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="NIC (Device)">
                                                            <Text code>{macInfo.nic}</Text>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Type">
                                                            <Tag color={macInfo.isMulticast ? "orange" : "green"}>
                                                                {macInfo.type}
                                                            </Tag>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Scope">
                                                            <Tag color={macInfo.isLocallyAdministered ? "purple" : "cyan"}>
                                                                {macInfo.scope}
                                                            </Tag>
                                                        </Descriptions.Item>
                                                        <Descriptions.Item label="Properties">
                                                            <Space wrap size={[4, 4]}>
                                                                {macInfo.isBroadcast && <Tag color="red">Broadcast</Tag>}
                                                                {macInfo.isMulticast && <Tag color="orange">Multicast</Tag>}
                                                                {macInfo.isUnicast && <Tag color="green">Unicast</Tag>}
                                                            </Space>
                                                        </Descriptions.Item>
                                                    </Descriptions>
                                                </Card>
                                            </Col>

                                            <Col xs={24} md={12}>
                                                <Card title="Formats" size="small">
                                                    <Space direction="vertical" style={{ width: "100%" }} size="small">
                                                        {Object.entries(macInfo.formats).map(([format, value]) => (
                                                            <div key={format} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                                <Text type="secondary" style={{ textTransform: "capitalize" }}>{format}:</Text>
                                                                <Space>
                                                                    <Text code>{value}</Text>
                                                                    <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(value, format)} />
                                                                </Space>
                                                            </div>
                                                        ))}
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <Text type="secondary">EUI-64:</Text>
                                                            <Space>
                                                                <Text code style={{ fontSize: 11 }}>{macInfo.eui64}</Text>
                                                                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(macInfo.eui64, "EUI-64")} />
                                                            </Space>
                                                        </div>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                                                            <Text type="secondary">Binary:</Text>
                                                            <Space>
                                                                <Text code style={{ fontSize: 9, wordBreak: "break-all" }}>{macInfo.binaryFormat}</Text>
                                                                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(macInfo.binaryFormat, "Binary")} />
                                                            </Space>
                                                        </div>
                                                    </Space>
                                                </Card>
                                            </Col>
                                        </Row>
                                    )}

                                    {!macInfo.isValid && inputMAC && (
                                        <Alert
                                            style={{ marginTop: 16 }}
                                            type="error"
                                            message="Invalid MAC Address"
                                            description="Enter a valid 48-bit MAC address (6 bytes). Supported formats: 00:1C:B3:00:00:01, 00-1C-B3-00-00-01, 001C.B300.0001, 001CB3000001"
                                            showIcon
                                        />
                                    )}
                                </Col>

                                <Col xs={24} lg={8}>
                                    <Card title="Example MAC Addresses" size="small">
                                        <Table
                                            dataSource={SAMPLE_MACS}
                                            columns={sampleColumns}
                                            pagination={false}
                                            size="small"
                                            rowKey="mac"
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        ),
                    },
                    {
                        key: "generate",
                        label: <span><SyncOutlined /> Generate</span>,
                        children: (
                            <Row gutter={[16, 16]}>
                                <Col xs={24} lg={16}>
                                    <Card title="Generate MAC Addresses" size="small">
                                        <Space direction="vertical" style={{ width: "100%" }} size="middle">
                                            <Row gutter={16} align="middle">
                                                <Col xs={24} md={6}>
                                                    <Text type="secondary">Count:</Text>
                                                    <InputNumber
                                                        min={1}
                                                        max={1000}
                                                        value={generateCount}
                                                        onChange={(v) => setGenerateCount(v || 10)}
                                                        style={{ width: "100%", marginTop: 4 }}
                                                    />
                                                </Col>
                                                <Col xs={24} md={8}>
                                                    <Text type="secondary">Prefix (OUI):</Text>
                                                    <Input
                                                        value={generatePrefix}
                                                        onChange={(e) => setGeneratePrefix(e.target.value)}
                                                        placeholder="e.g., 00:50:56 for VMware"
                                                        style={{ marginTop: 4 }}
                                                    />
                                                </Col>
                                                <Col xs={24} md={5}>
                                                    <Text type="secondary">Type:</Text>
                                                    <Select
                                                        value={generateUnicast ? "unicast" : "multicast"}
                                                        onChange={(v) => setGenerateUnicast(v === "unicast")}
                                                        style={{ width: "100%", marginTop: 4 }}
                                                        options={[
                                                            { value: "unicast", label: "Unicast" },
                                                            { value: "multicast", label: "Multicast" },
                                                        ]}
                                                    />
                                                </Col>
                                                <Col xs={24} md={5}>
                                                    <Text type="secondary">Scope:</Text>
                                                    <Select
                                                        value={generateUniversal ? "universal" : "local"}
                                                        onChange={(v) => setGenerateUniversal(v === "universal")}
                                                        style={{ width: "100%", marginTop: 4 }}
                                                        options={[
                                                            { value: "universal", label: "Universal" },
                                                            { value: "local", label: "Local" },
                                                        ]}
                                                    />
                                                </Col>
                                            </Row>

                                            <Button type="primary" icon={<SyncOutlined />} onClick={handleGenerate} block>
                                                Generate MAC Addresses
                                            </Button>

                                            {generatedMACs.length > 0 && (
                                                <>
                                                    <Space>
                                                        <Button icon={<CopyOutlined />} onClick={handleCopyAll}>
                                                            Copy All
                                                        </Button>
                                                        <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                                                            Download
                                                        </Button>
                                                    </Space>

                                                    <div
                                                        style={{
                                                            maxHeight: 400,
                                                            overflow: "auto",
                                                            background: darkMode ? "#141414" : "#f5f5f5",
                                                            padding: 12,
                                                            borderRadius: 6,
                                                            fontFamily: "monospace",
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        {generatedMACs.map((mac, i) => (
                                                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px 0" }}>
                                                                <Text code>{mac}</Text>
                                                                <Space size="small">
                                                                    <Button size="small" type="link" onClick={() => setInputMAC(mac)}>
                                                                        Analyze
                                                                    </Button>
                                                                    <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopy(mac, "MAC")} />
                                                                </Space>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </Space>
                                    </Card>
                                </Col>

                                <Col xs={24} lg={8}>
                                    <Card title="Common OUI Prefixes" size="small">
                                        <Space direction="vertical" style={{ width: "100%" }} size="small">
                                            <Button size="small" block onClick={() => setGeneratePrefix("00:50:56")}>
                                                00:50:56 - VMware
                                            </Button>
                                            <Button size="small" block onClick={() => setGeneratePrefix("08:00:27")}>
                                                08:00:27 - VirtualBox
                                            </Button>
                                            <Button size="small" block onClick={() => setGeneratePrefix("00:1C:B3")}>
                                                00:1C:B3 - Apple
                                            </Button>
                                            <Button size="small" block onClick={() => setGeneratePrefix("B8:27:EB")}>
                                                B8:27:EB - Raspberry Pi
                                            </Button>
                                            <Button size="small" block onClick={() => setGeneratePrefix("24:0A:C4")}>
                                                24:0A:C4 - ESP32
                                            </Button>
                                            <Button size="small" block onClick={() => setGeneratePrefix("00:0C:29")}>
                                                00:0C:29 - VMware
                                            </Button>
                                            <Button size="small" block onClick={() => setGeneratePrefix("")}>
                                                Clear Prefix
                                            </Button>
                                        </Space>

                                        <Alert
                                            style={{ marginTop: 16 }}
                                            type="info"
                                            message="Tip"
                                            description="Use 'Local' scope for VMs and containers to avoid conflicts with real hardware addresses."
                                            showIcon
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        ),
                    },
                    {
                        key: "vendors",
                        label: <span><SearchOutlined /> Vendor Lookup</span>,
                        children: (
                            <Row gutter={[16, 16]}>
                                <Col xs={24}>
                                    <Card title="Search Vendor Database" size="small">
                                        <Space direction="vertical" style={{ width: "100%" }} size="middle">
                                            <Input
                                                size="large"
                                                placeholder="Search by OUI (e.g., 00:1C:B3) or vendor name (e.g., Apple)"
                                                value={vendorSearch}
                                                onChange={(e) => setVendorSearch(e.target.value)}
                                                prefix={<SearchOutlined />}
                                                allowClear
                                            />

                                            {filteredVendors.length > 0 && (
                                                <Table
                                                    dataSource={filteredVendors.map(([oui, vendor]) => ({ oui, vendor }))}
                                                    columns={vendorColumns}
                                                    pagination={{ pageSize: 20 }}
                                                    size="small"
                                                    rowKey="oui"
                                                    onRow={(record) => ({
                                                        onClick: () => setGeneratePrefix(record.oui),
                                                        style: { cursor: "pointer" },
                                                    })}
                                                />
                                            )}

                                            {vendorSearch && filteredVendors.length === 0 && (
                                                <Alert
                                                    type="info"
                                                    message="No Results"
                                                    description="No vendors found matching your search. Try a different OUI prefix or vendor name."
                                                    showIcon
                                                />
                                            )}

                                            {!vendorSearch && (
                                                <Alert
                                                    type="info"
                                                    message="Vendor Database"
                                                    description={`This database contains ${Object.keys(VENDOR_DATABASE).length}+ OUI prefixes from major manufacturers including Apple, Samsung, Intel, Cisco, HP, VMware, and many more.`}
                                                    showIcon
                                                />
                                            )}
                                        </Space>
                                    </Card>
                                </Col>
                            </Row>
                        ),
                    },
                ]}
            />
        </ToolPageLayout>
    );
}
