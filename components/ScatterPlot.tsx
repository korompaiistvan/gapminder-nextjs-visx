// a visx scatterplot with tooltip
import type { Data } from "@/lib/data";
import { Group } from "@visx/group";
import { Circle } from "@visx/shape";
import { scaleLinear, scaleRadial } from "@visx/scale";

interface Props {
  data: Data;
  year: number;
  width: number;
  height: number;
}

export const ScatterPlot = (props: Props) => {
  const { data, width, height, year } = props;
  console.log(width, height);
  const oneYear = data.filter((d) => d.year === year);
  const xScale = scaleLinear({
    domain: [0, 20000],
    range: [0, width],
  });

  const yScale = scaleLinear({
    domain: [0, 100],
    range: [height, 0],
  });

  const rScale = scaleRadial({
    domain: [0, 1_000_000_000],
    range: [0, 32],
  });

  return (
    <svg width={width} height={height}>
      <Group>
        {oneYear.map((d, i) => {
          return (
            <Circle
              key={`scatter-${i}`}
              cx={xScale(d.gdp)}
              cy={yScale(d.lifeExpectancy)}
              r={rScale(d.population)}
              fill="rgba(255, 255, 255, 0.5)"
            />
          );
        })}
      </Group>
    </svg>
  );
};
