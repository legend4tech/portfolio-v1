import type { Metadata } from "next";
import { OpenSourcePage } from "@/components/opensource/OpenSourcePage";

export const metadata: Metadata = {
  title: "Open Source Contributions | Legend4Tech",
  description:
    "My open source contributions and merged pull requests through OnlyDust",
};

export default function Page() {
  return <OpenSourcePage />;
}
