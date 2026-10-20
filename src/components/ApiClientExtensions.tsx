"use client";
import { useLanguage } from "@/components/LanguageProvider";
import { Tabs } from "antd";
import { ApiOutlined, ApartmentOutlined, CloudServerOutlined } from "@ant-design/icons";
import LocalConnectorAccess from "@/components/LocalConnectorAccess";
import ApiCollectionRunner from "@/components/ApiCollectionRunner";
import ApiGrpcClient from "@/components/ApiGrpcClient";
import ApiLocalMocks from "@/components/ApiLocalMocks";
import type { ApiSavedRequest } from "@/lib/api-builder/request-model";
export default function ApiClientExtensions(props: { requests: ApiSavedRequest[]; variables: Record<string, string>; environmentName: string }) {
    const { t } = useLanguage();
    return <section id="api-client-extensions" className="wb-workbench wb-api-extensions" aria-labelledby="api-extensions-title"><h2 id="api-extensions-title">{t("Collections, gRPC & local mocks")}</h2><LocalConnectorAccess /><Tabs items={[{ key: "runner", label: t("Collection runner"), icon: <ApartmentOutlined />, children: <ApiCollectionRunner {...props} /> }, { key: "grpc", label: t("gRPC client"), icon: <ApiOutlined />, children: <ApiGrpcClient /> }, { key: "mocks", label: t("Local mock server"), icon: <CloudServerOutlined />, children: <ApiLocalMocks /> }]} /></section>;
}
