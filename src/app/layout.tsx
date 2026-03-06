import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "创意写作沉浸式工作台",
  description: "AI驱动的创意写作平台 - 沉浸式创作体验",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
