"use client";

import dynamic from "next/dynamic";

const WorkbenchLayout = dynamic(
  () => import("@/components/workbench/WorkbenchLayout"),
  { ssr: false }
);

export default function WorkbenchPage() {
  return <WorkbenchLayout />;
}
