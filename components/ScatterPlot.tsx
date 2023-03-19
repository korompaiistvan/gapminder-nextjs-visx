// a visx scatterplot with tooltip
import type { YearlyData } from "@/lib/data";
import { Group } from "@visx/group";
import { Circle } from "@visx/shape";
import { scaleLinear, scaleRadial, scaleLog, scaleOrdinal } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { NumberValue } from "d3-scale";
import { GridRows, GridColumns } from "@visx/grid";
import { Legend } from "@visx/legend";
import { defaultStyles, useTooltipInPortal } from "@visx/tooltip";
import { useState, MouseEvent } from "react";
import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";
import dynamic from "next/dynamic";

interface Props {
  data: YearlyData;
  year: number;
  width: number;
  height: number;
}

const colorScale = scaleOrdinal<string>({
  domain: [
    "Asia",
    "Europe",
    "Africa",
    "Oceania",
    "South America",
    "North America",
  ],
  range: ["#FC7753", "#66D7D1", "#615C84", "#EB7BC0", "#F2EFEA", "#DBD56E"],
});

export const ScatterPlot = (props: Props) => {
  const { data, width, height, year } = props;
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [highlightedCountry, setHighlightedCountry] = useState<string | null>(
    null
  );

  const margin = 24;
  const bottomAxisSize = 40;
  const leftAxisSize = 40;
  const oneYear = data[year];
  const xScale = scaleLog({
    domain: [250, 100_000],
    range: [leftAxisSize + margin, width - margin],
    base: 10,
  });

  const yScale = scaleLinear({
    domain: [15, 90],
    range: [height - bottomAxisSize - margin, margin],
  });

  const rScale = scaleRadial({
    domain: [0, 1_000_000_000],
    range: [0, 24],
  });

  const { containerRef, containerBounds, TooltipInPortal } = useTooltipInPortal(
    {
      scroll: true,
      detectBounds: true,
    }
  );

  const handleContainerClick = (event: MouseEvent) => {
    event.preventDefault();
    if (event.target === event.currentTarget) {
      setTooltipOpen(false);
    }
  };

  const tooltipData = oneYear.find((d) => d.country === highlightedCountry);

  const handleCircleEnter = (country: string) => (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setTooltipPosition({
      x: event.clientX - containerBounds.left,
      y: event.clientY - containerBounds.top,
    });
    setHighlightedCountry(country);
    setTooltipOpen(true);
  };

  const handleCircleExit = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setTooltipOpen(false);
    setHighlightedCountry(null);
  };

  return (
    <>
      <svg width={width} height={height} ref={containerRef}>
        <Group>
          {oneYear.map((d, i) => {
            return (
              <Circle
                key={`scatter-${d.country}`}
                cx={xScale(d.gdp)}
                cy={yScale(d.lifeExpectancy)}
                r={rScale(d.population)}
                fill={colorScale(d.continent) as string}
                fillOpacity={d.country === highlightedCountry ? 1 : 0.75}
                aria-label={`${d.country} has a population of ${d.population}`}
                style={{ transition: "all 0.2s linear" }}
                onMouseEnter={handleCircleEnter(d.country)}
                onMouseLeave={handleCircleExit}
              />
            );
          })}
        </Group>
        <Fade in={tooltipOpen}>
          <div>
            <TooltipInPortal
              key={Math.random()}
              top={tooltipPosition?.y ?? 0}
              left={tooltipPosition?.x ?? 0}
              style={{
                ...defaultStyles,
                background: "rgba(0, 0, 0, 0.8)",
                color: "white",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              <Stack>
                <div>
                  {tooltipData?.country} in {year}
                </div>
                <div>Population: {tooltipData?.population}</div>
                <div>GDP per capita: {tooltipData?.gdp}</div>
                <div>Life expectancy: {tooltipData?.lifeExpectancy}</div>
              </Stack>
            </TooltipInPortal>
          </div>
        </Fade>

        <AxisBottom
          top={height - bottomAxisSize - margin}
          scale={xScale}
          label="GDP per capita"
          labelProps={{
            fill: "white",
            fontSize: 12,
            textAnchor: "middle",
          }}
          stroke="white"
          tickStroke="white"
          tickLabelProps={() => ({
            fill: "white",
            fontSize: 11,
            textAnchor: "middle",
          })}
          tickFormat={(d) => {
            if (+d < 1000) return `${d}`;
            if (+d < 1000000) return `${+d / 1000}k`;
            return `${+d / 1000000}m`;
          }}
          tickValues={[250, 1000, 10000, 100000, 100000]}
        />
        <GridRows
          scale={yScale}
          width={width - leftAxisSize - margin}
          stroke="rgba(255, 255, 255, 0.1)"
          left={leftAxisSize + margin}
        />
        <AxisLeft
          scale={yScale}
          left={leftAxisSize + margin}
          label="Life expectancy"
          labelProps={{
            fill: "white",
            fontSize: 12,
            textAnchor: "middle",
          }}
          stroke="white"
          tickStroke="white"
          tickLabelProps={() => ({
            fill: "white",
            fontSize: 11,
            textAnchor: "end",
          })}
        />
        <GridColumns
          scale={xScale}
          height={height - bottomAxisSize - margin}
          stroke="rgba(255, 255, 255, 0.1)"
          top={margin}
        />
      </svg>
      <Legend
        scale={colorScale}
        direction="row"
        itemMargin="0 4px"
        labelFormat={(label) => label}
        style={{
          position: "absolute",
          bottom: bottomAxisSize + margin,
          right: 0,
          margin: "20px",
          display: "flex",
        }}
      />
    </>
  );
};

export default ScatterPlot;
