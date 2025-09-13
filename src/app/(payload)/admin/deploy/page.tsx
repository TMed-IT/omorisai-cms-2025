import { Metadata } from "next";
import DeployPageClient from "@/components/DeployPageClient";

export const metadata: Metadata = {
    title: "デプロイ管理 - 大森祭CMS",
};

export default function DeployPage() {
    return <DeployPageClient />;
}
