import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import getData, { Data } from "@/lib/data";
import { Container } from "@mui/system";
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { ScatterPlot } from "@/components/ScatterPlot";
import { useState } from "react";

interface PageProps {
  data: Data;
}

export default function Index(props: PageProps) {
  const [year, setYear] = useState(2000);
  // console.log(props.data);
  return (
    <Grid
      container
      justifyContent={"center"}
      alignItems={"center"}
      direction={"column"}
      height={"100vh"}
    >
      <Box width={"40%"}>
        <Typography variant="h2" component="h2" gutterBottom>
          Set the year
        </Typography>
        <Slider
          aria-label="Year"
          onChange={(e, v) => setYear(v as number)}
          value={year}
          defaultValue={2000}
          min={1950}
          max={2020}
          valueLabelDisplay="on"
        />
        <Container maxWidth="md" sx={{ height: "400px" }}>
          <ParentSize className="graphName" debounceTime={10}>
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
      </Box>
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
