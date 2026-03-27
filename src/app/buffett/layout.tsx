import type { Metadata } from "next";
import "./buffett.css";

export const metadata: Metadata = {
  title: {
    default: "重走巴菲特人生路",
    template: "%s | 重走巴菲特人生路",
  },
  description:
    "巴菲特靠 10 个选择赚了 1000 亿。回到历史节点，做出你的决策，看看你能活过第几关。",
};

export default function BuffettLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="buffett-scope min-h-screen bg-[#0a0a0a] text-[#f5f0e8]" style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}>
      {children}
    </div>
  );
}
