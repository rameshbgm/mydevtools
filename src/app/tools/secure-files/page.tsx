"use client";
import { FileProtectOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import EncryptedVault from "@/components/EncryptedVault";
import { useLanguage } from "@/components/LanguageProvider";
export default function SecureFilesPage() {
    const { t } = useLanguage();
    return <ToolPageLayout title={t("Secure Files")} description={t("Encrypt file contents and metadata locally, with portable encrypted backups")} icon={<FileProtectOutlined />} color="#be123c"><EncryptedVault purpose="files" /></ToolPageLayout>;
}
