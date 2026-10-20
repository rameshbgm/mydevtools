"use client";
import { LockOutlined } from "@ant-design/icons";
import ToolPageLayout from "@/components/ToolPageLayout";
import EncryptedVault from "@/components/EncryptedVault";
import { useLanguage } from "@/components/LanguageProvider";
export default function CredentialVaultPage() {
    const { t } = useLanguage();
    return <ToolPageLayout title={t("Credential Vault")} description={t("Keep project passwords, API keys, environment variables and connections encrypted on your device")} icon={<LockOutlined />} color="#be123c"><EncryptedVault purpose="credentials" /></ToolPageLayout>;
}
