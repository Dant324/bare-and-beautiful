"use client";

import React, { createContext, useContext, useId, useMemo } from "react";
import * as RechartsPrimitive from "recharts@2.15.2";
import { cn } from "./utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" };

const ChartContext = createContext(null);

function useChart() {
  const context = useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within a <ChartContainer />");
  return context;
}

export function ChartContainer({ id, className, children, config, ...props }) {
  const uniqueId = useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]-border/50 [&_.recharts-curve.recharts-tooltip-cursor]-border [&_.recharts-polar-grid_[stroke='#ccc']]-border [&_.recharts-radial-bar-background-sector]-muted [&_.recharts-rectangle.recharts-tooltip-cursor]-muted [&_.recharts-reference-line_[stroke='#ccc']]-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]-transparent [&_.recharts-layer]-hidden [&_.recharts-sector]-hidden [&_.recharts-sector[stroke='#fff']]-transparent [&_.recharts-surface]-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export function ChartStyle({ id, config }) {
  const colorConfig = Object.entries(config || {}).filter(([key, c]) => c.theme || c.color);
  if (!colorConfig.length) return null;

  const styleContent = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const rules = colorConfig
        .map(([key, itemConfig]) => {
          const color = (itemConfig.theme && itemConfig.theme[theme]) || itemConfig.color;
          return color ? `  --color-${key}: ${color};` : null;
        })
        .filter(Boolean)
        .join("\n");
      return `${prefix} [data-chart=${id}] {\n${rules}\n}`;
    })
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: styleContent }} />;
}

export const ChartTooltip = RechartsPrimitive.Tooltip;

export function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}) {
  const { config } = useChart();

  const tooltipLabel = useMemo(() => {
    if (hideLabel || !payload?.length) return null;
    const item = payload[0];
    const value = label || item.name;
    return <div className={cn("font-medium", labelClassName)}>{labelFormatter ? labelFormatter(value, payload) : value}</div>;
  }, [label, labelFormatter, payload, hideLabel, labelClassName]);

  if (!active || !payload?.length) return null;

  const nestLabel = payload.length === 1 && indicator !== "dot";

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const indicatorColor = color || item.payload?.fill || item.color;
          return (
            <div key={index} className={cn("[&>svg]-muted-foreground flex w-full flex-wrap items-stretch gap-2", indicator === "dot" && "items-center")}>
              {!hideIndicator && (
                <div
                  className={cn(
                    "shrink-0 rounded-[2px] border",
                    indicator === "dot" ? "h-2.5 w-2.5" : indicator === "line" ? "w-1" : "w-0 border-[1.5px] border-dashed bg-transparent"
                  )}
                  style={{ "--color-bg": indicatorColor, "--color-border": indicatorColor }}
                />
              )}
              <div className={cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center")}>
                <div className="grid gap-1.5">{nestLabel ? tooltipLabel : <span className="text-muted-foreground">{item.name}</span>}</div>
                {item.value !== undefined && <span className="text-foreground font-mono font-medium tabular-nums">{item.value.toLocaleString()}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const ChartLegend = RechartsPrimitive.Legend;

export function ChartLegendContent({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }) {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div className={cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className)}>
      {payload.map((item, index) => (
        <div key={index} className={cn("[&>svg]-muted-foreground flex items-center gap-1.5 [&>svg]-3 [&>svg]-3")}>
          {!hideIcon && <div className="h-2 w-2 shrink-0 rounded-[2px]" style={{ backgroundColor: item.fill || item.color }} />}
          {item.name}
        </div>
      ))}
    </div>
  );
}
