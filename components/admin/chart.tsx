"use client";

import { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  type: "line" | "bar";
  data: ChartData<"line" | "bar">;
  options?: ChartOptions<"line" | "bar">;
  height?: number;
}

export function Chart({ type, data, options, height = 300 }: ChartProps) {
  const chartRef = useRef<ChartJS>(null);

  useEffect(() => {
    // Update chart on theme change
    const handleThemeChange = () => {
      if (chartRef.current) {
        chartRef.current.update();
      }
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  const defaultOptions: ChartOptions<"line" | "bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgb(107, 114, 128)",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#4A3034",
        bodyColor: "#4A3034",
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 10,
        boxPadding: 5,
        usePointStyle: true,
        bodyFont: {
          family: "'Inter', sans-serif",
        },
        titleFont: {
          family: "'Inter', sans-serif",
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgb(107, 114, 128)",
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
        },
        ticks: {
          color: "rgb(107, 114, 128)",
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
        },
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div style={{ height: `${height}px` }}>
      {type === "line" ? (
        <Line
          ref={chartRef as any}
          data={
            data as ChartData<
              "line",
              (number | [number, number] | null)[],
              unknown
            >
          }
          options={mergedOptions}
        />
      ) : (
        <Bar
          ref={chartRef as any}
          data={
            data as ChartData<
              "bar",
              (number | [number, number] | null)[],
              unknown
            >
          }
          options={mergedOptions}
        />
      )}
    </div>
  );
}
