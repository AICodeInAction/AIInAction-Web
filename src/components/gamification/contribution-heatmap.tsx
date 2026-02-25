"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";

type Props = {
  data: Record<string, number>;
  year: number;
};

function getColor(count: number): string {
  if (count === 0) return "bg-muted/40";
  if (count === 1) return "bg-emerald-300/60 dark:bg-emerald-700/60";
  if (count === 2) return "bg-emerald-400/70 dark:bg-emerald-600/70";
  if (count <= 4) return "bg-emerald-500/80 dark:bg-emerald-500/80";
  return "bg-emerald-600 dark:bg-emerald-400";
}

export function ContributionHeatmap({ data, year }: Props) {
  const t = useTranslations("gamification");
  const tm = useTranslations("heatmap.months");
  const td = useTranslations("heatmap.days");

  const weeks = useMemo(() => {
    const result: { date: string; count: number; day: number }[][] = [];
    const start = new Date(year, 0, 1);
    // Align to Sunday
    const startDay = start.getDay();
    const alignedStart = new Date(start);
    alignedStart.setDate(alignedStart.getDate() - startDay);

    const end = new Date(year, 11, 31);
    const current = new Date(alignedStart);
    let week: { date: string; count: number; day: number }[] = [];

    while (current <= end || week.length > 0) {
      const dateKey = current.toISOString().split("T")[0];
      const inYear = current.getFullYear() === year;
      week.push({
        date: dateKey,
        count: inYear ? (data[dateKey] || 0) : -1,
        day: current.getDay(),
      });

      if (week.length === 7) {
        result.push(week);
        week = [];
      }

      current.setDate(current.getDate() + 1);
      if (current > end && week.length === 0) break;
    }

    if (week.length > 0) {
      result.push(week);
    }

    return result;
  }, [data, year]);

  const totalCompletions = Object.values(data).reduce((s, v) => s + v, 0);

  const months = Array.from({ length: 12 }, (_, i) => tm(String(i)));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          {t("completionsInYear", { count: totalCompletions, year })}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1">
          {/* Month labels */}
          <div className="flex gap-[3px] pl-8 text-[10px] text-muted-foreground">
            {months.map((m, i) => (
              <span
                key={m}
                style={{
                  width: `${(i === 1 && year % 4 === 0 ? 29 : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i]) / 7 * 15}px`,
                }}
              >
                {m}
              </span>
            ))}
          </div>

          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] text-[10px] text-muted-foreground pr-1">
              <span className="h-3 leading-3">&nbsp;</span>
              <span className="h-3 leading-3">{td("mon")}</span>
              <span className="h-3 leading-3">&nbsp;</span>
              <span className="h-3 leading-3">{td("wed")}</span>
              <span className="h-3 leading-3">&nbsp;</span>
              <span className="h-3 leading-3">{td("fri")}</span>
              <span className="h-3 leading-3">&nbsp;</span>
            </div>

            {/* Grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={`h-3 w-3 rounded-[2px] ${
                        day.count < 0 ? "bg-transparent" : getColor(day.count)
                      }`}
                      title={
                        day.count >= 0
                          ? `${day.date}: ${day.count} completion${day.count !== 1 ? "s" : ""}`
                          : undefined
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground pt-1">
            <span>{t("less")}</span>
            <div className={`h-3 w-3 rounded-[2px] bg-muted/40`} />
            <div className={`h-3 w-3 rounded-[2px] bg-emerald-300/60 dark:bg-emerald-700/60`} />
            <div className={`h-3 w-3 rounded-[2px] bg-emerald-400/70 dark:bg-emerald-600/70`} />
            <div className={`h-3 w-3 rounded-[2px] bg-emerald-500/80 dark:bg-emerald-500/80`} />
            <div className={`h-3 w-3 rounded-[2px] bg-emerald-600 dark:bg-emerald-400`} />
            <span>{t("more")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
