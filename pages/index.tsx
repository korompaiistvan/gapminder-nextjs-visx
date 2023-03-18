import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import getData, { YearlyData } from "@/lib/data";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import { Container } from "@mui/system";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { ScatterPlot } from "@/components/ScatterPlot";
import { useState } from "react";

interface PageProps {
  data: YearlyData;
}

export default function Index(props: PageProps) {
  const [year, setYear] = useState(2000);
  return (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      direction={"column"}
      height={"100vh"}
    >
      <Card
        raised
        elevation={3}
        sx={{ padding: "32px", borderRadius: "12px", width: "65%" }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Set the year
        </Typography>
        <Slider
          aria-label="Year"
          onChange={(e, v) => setYear(v as number)}
          value={year}
          defaultValue={2000}
          min={1950}
          max={2018}
          valueLabelDisplay="on"
        />
        <Container sx={{ height: "400px", position: "relative" }}>
          <ParentSize className="graphName" debounceTime={5}>
            {({ width, height }) => {
              return (
                <ScatterPlot
                  data={props.data}
                  width={width}
                  height={height}
                  year={year}
                />
              );
            }}
          </ParentSize>
        </Container>
      </Card>
    </Grid>
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
