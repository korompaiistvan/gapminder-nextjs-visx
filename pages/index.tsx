import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import getData, { YearlyData } from "@/lib/data";
import Card from "@mui/material/Card";
import { Container } from "@mui/system";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { ScatterPlot } from "@/components/ScatterPlot";
import { useState, useDeferredValue, useMemo, useEffect } from "react";
import { Button, Stack } from "@mui/material";
import FastRewind from "@mui/icons-material/FastRewind";
import FastForward from "@mui/icons-material/FastForward";

interface PageProps {
  data: YearlyData;
}

export default function Index(props: PageProps) {
  const [year, setYear] = useState(2000);
  const [playDirection, setPlayDirection] = useState<
    "forward" | "backward" | null
  >(null);
  const deferredYear = useDeferredValue(year);

  const yearBounds = useMemo(() => [1950, 2018], []);
  const animationSpeed = 125;

  const play = () => {
    if (!playDirection) {
      return;
    }
    if (playDirection === "forward") {
      if (year < yearBounds[1]) {
        setTimeout(() => {
          setYear(year + 1);
        }, animationSpeed);
        return;
      }
    } else if (playDirection === "backward") {
      if (year > yearBounds[0]) {
        setTimeout(() => {
          setYear(year - 1);
        }, animationSpeed);

        return;
      }
    }
    setPlayDirection(null);
    return;
  };
  play();

  const scatterPLot = useMemo(() => {
    return (
      <ParentSize className="graphName" debounceTime={5}>
        {({ width, height }) => {
          return (
            <ScatterPlot
              data={props.data}
              width={width}
              height={height}
              year={deferredYear}
            />
          );
        }}
      </ParentSize>
    );
  }, [deferredYear, props.data]);

  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      direction={"column"}
      height={"100vh"}
    >
      <Card
        raised
        elevation={3}
        sx={{ padding: "32px", borderRadius: "12px", width: "760px" }}
      >
        <Typography variant="h4" component="h2" marginBottom={"32px"}>
          200 countries, 68 years, 1 chart
        </Typography>
        <Typography variant="body2" marginBottom={"24px"}>
          The Gapminder moving bubble chart is a powerful visualization tool
          that illustrates complex global trends in a simple and engaging way.
          The chart was popularized by the late Hans Rosling, a Swedish
          physician and data analyst who dedicated his life to promoting a
          fact-based worldview. The chart shows data on various countries and
          regions of the world, plotted against each other on an x-y axis, with
          the size of the bubbles representing population. The bubbles move over
          time, showing changes in these variables over decades, and allowing
          viewers to see how countries have developed and how they compare to
          each other. The chart is an excellent way to grasp global trends and
          see how our world is changing over time.
        </Typography>
        <Stack
          direction="row"
          gap={"24px"}
          alignItems={"center"}
          marginBottom={"24px"}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<FastRewind />}
            onClick={() => setPlayDirection("backward")}
            style={{ paddingRight: "16px", paddingLeft: "16px" }}
          >
            Rewind
          </Button>
          <Slider
            aria-label="Year"
            onChange={(e, v) => {
              setYear(v as number);
              setPlayDirection(null);
            }}
            value={year}
            defaultValue={2000}
            min={yearBounds[0]}
            max={yearBounds[1]}
          />
          <Button
            variant="outlined"
            size="small"
            endIcon={<FastForward />}
            onClick={() => setPlayDirection("forward")}
            style={{ paddingRight: "16px", paddingLeft: "16px" }}
          >
            Play
          </Button>
        </Stack>
        <Box
          sx={{
            height: "400px",
            position: "relative",
            padding: "0",
          }}
        >
          {scatterPLot}
        </Box>
      </Card>
    </Stack>
  );
}

export async function getStaticProps(): Promise<{ props: PageProps }> {
  const data = await getData();
  return {
    props: {
      data,
    },
  };
}
