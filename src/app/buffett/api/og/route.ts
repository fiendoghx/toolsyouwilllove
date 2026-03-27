import { ImageResponse } from "@vercel/og";
import React, { type CSSProperties } from "react";
import { gameNodes } from "@/data/nodes";
import { calculateDNAScore, getDNAType } from "@/lib/game-logic";
import { formatPercent, formatUsd } from "@/lib/formatters";
import { calculateBuffettMatchRate, simulateGameSummary } from "@/lib/game-summary";
import { decodeShareData } from "@/lib/share-codec";

export const runtime = "edge";

const rootStyle: CSSProperties = {
  width: "1200px",
  height: "630px",
  display: "flex",
  position: "relative",
  overflow: "hidden",
  background:
    "radial-gradient(circle at top, rgba(212,168,83,0.24), transparent 32%), #0a0a0a",
  color: "#f8ebc8",
  fontFamily: '"Noto Serif SC", "Songti SC", serif',
};

const shellStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
  padding: "56px",
  border: "1px solid rgba(212,168,83,0.22)",
  background:
    "linear-gradient(180deg, rgba(20,20,20,0.88), rgba(10,10,10,0.96))",
};

const eyebrowStyle: CSSProperties = {
  fontSize: "18px",
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "#d4a853",
};

const titleStyle: CSSProperties = {
  fontSize: "64px",
  lineHeight: 1.1,
  marginTop: "18px",
  fontWeight: 700,
};

const statsRowStyle: CSSProperties = {
  display: "flex",
  gap: "18px",
  marginTop: "34px",
};

const statCardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  minWidth: "240px",
  padding: "22px 24px",
  borderRadius: "28px",
  border: "1px solid rgba(212,168,83,0.18)",
  background: "rgba(255,255,255,0.04)",
};

const statLabelStyle: CSSProperties = {
  fontSize: "16px",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "#bda980",
};

const statValueStyle: CSSProperties = {
  fontSize: "38px",
  marginTop: "14px",
  fontWeight: 700,
};

function createStatCard(label: string, value: string) {
  return React.createElement(
    "div",
    { style: statCardStyle },
    React.createElement("div", { style: statLabelStyle }, label),
    React.createElement("div", { style: statValueStyle }, value)
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code") ?? "";
  const data = decodeShareData(code);

  if (!data) {
    return new ImageResponse(
      React.createElement(
        "div",
        { style: rootStyle },
        React.createElement(
          "div",
          { style: shellStyle },
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column" } },
            React.createElement("div", { style: eyebrowStyle }, "重走巴菲特人生路"),
            React.createElement(
              "div",
              { style: titleStyle },
              "这个分享码无效，换一局重新来。"
            )
          ),
          React.createElement(
            "div",
            { style: { fontSize: "24px", color: "#bda980" } },
            "Buffett Decision Simulator"
          )
        )
      ),
      { width: 1200, height: 630 }
    );
  }

  const score = calculateDNAScore(data.choices, gameNodes);
  const dnaType = getDNAType(score);
  const matchRate = calculateBuffettMatchRate(data.choices, gameNodes);
  const summary = simulateGameSummary(data.choices, gameNodes);
  const outcome = data.isBankrupt ? `第 ${data.bankruptNode} 关破产` : "完整走完 10 关";

  return new ImageResponse(
    React.createElement(
      "div",
      { style: rootStyle },
      React.createElement(
        "div",
        { style: shellStyle },
        React.createElement(
          "div",
          { style: { display: "flex", flexDirection: "column" } },
          React.createElement("div", { style: eyebrowStyle }, "重走巴菲特人生路"),
          React.createElement("div", { style: titleStyle }, dnaType),
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                marginTop: "18px",
                fontSize: "26px",
                lineHeight: 1.5,
                color: "#d7c5a1",
              },
            },
            `10 个选择，${formatPercent(matchRate)} 与巴菲特同路。`
          ),
          React.createElement(
            "div",
            { style: statsRowStyle },
            createStatCard("匹配率", formatPercent(matchRate)),
            createStatCard("最终资产", formatUsd(summary.playerAssets)),
            createStatCard("结局", outcome)
          )
        ),
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "22px",
              color: "#bda980",
            },
          },
          React.createElement("div", null, "Buffett Decision Simulator"),
          React.createElement("div", null, "Dark Gold Edition")
        )
      )
    ),
    { width: 1200, height: 630 }
  );
}
