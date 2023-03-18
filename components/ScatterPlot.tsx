// a visx scatterplot with tooltip
import type { YearlyData } from "@/lib/data";
import { Group } from "@visx/group";
import { Circle } from "@visx/shape";
import { scaleLinear, scaleRadial, scalePower, scaleLog } from "@visx/scale";

interface Props {
  data: YearlyData;
  year: number;
  width: number;
  height: number;
}

export const ScatterPlot = (props: Props) => {
  const { data, width, height, year } = props;
  const oneYear = data[year];
  const xScale = scaleLog({
    domain: [400, 200000],
    range: [0, width],
    base: 10,
  });

  const yScale = scaleLinear({
    domain: [25, 100],
    range: [height, 0],
  });

  const rScale = scaleRadial({
    domain: [0, 1_000_000_000],
    range: [0, 48],
  });

  return (
    <svg width={width} height={height}>
      <Group>
        {oneYear.map((d, i) => {
          return (
            <Circle
              key={`scatter-${d.country}`}
              cx={xScale(d.gdp)}
              cy={yScale(d.lifeExpectancy)}
              r={rScale(d.population)}
              fill="rgba(255, 255, 255, 0.5)"
              aria-label={`${d.country} has a population of ${d.population}`}
              style={{ transition: "all 0.2s linear" }}
            />
          );
        })}
      </Group>
    </svg>
  );
};
