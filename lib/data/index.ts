import { DSVRowArray } from "d3";
import { csvParse } from "d3-dsv";
import path from "path";
import { promises as fs } from "fs";

export interface DataRecord {
  code: string;
  year: number;
  country: string;
  population: number;
  gdp: number;
  lifeExpectancy: number;
}

export interface Data extends Array<DataRecord> {}

const getData = async () => {
  // fetch the csv-s from public folder
  const dataDirectory = path.join(process.cwd(), "data/");

  const loadAndParseCsv = async (fileName: string) => {
    const fileContents = await fs.readFile(dataDirectory + fileName, "utf8");
    return csvParse(fileContents);
  };

  const population = loadAndParseCsv("population.csv");
  const gdp = loadAndParseCsv("gdp-per-capita.csv");
  const lifeExpectancy = loadAndParseCsv("life-expectancy.csv");

  // wait for all the csv-s to be fetched
  const [populationResponse, gdpResponse, lifeExpectancyResponse] =
    await Promise.all([population, gdp, lifeExpectancy]);

  // get the years and countries common to all the csv-s
  const getKeys = async (response: DSVRowArray<string>) => {
    return new Set(
      response
        .filter((d) => Boolean(d.Code))
        .map((d) => `${d.Code}---${d.Year}`)
    );
  };

  const populationKeysPromise = getKeys(populationResponse);
  const gdpKeysPromise = getKeys(gdpResponse);
  const lifeExpectancyKeysPromise = getKeys(lifeExpectancyResponse);

  const [populationKeys, gdpKeys, lifeExpectancyKeys] = await Promise.all([
    populationKeysPromise,
    gdpKeysPromise,
    lifeExpectancyKeysPromise,
  ]);

  const commonKeys = new Set(
    [...populationKeys].filter(
      (d) => gdpKeys.has(d) && lifeExpectancyKeys.has(d)
    )
  );

  // filter the csv-s to get only the common data
  const getCommonData = async (
    response: DSVRowArray<string>,
    commonKeys: Set<string>,
    rowGetter: (d: any) => any
  ) => {
    return response
      .filter((d) => commonKeys.has(`${d.Code}---${d.Year}`))
      .map((d) => rowGetter(d));
  };

  const populationDataPromise = getCommonData(
    populationResponse,
    commonKeys,
    (d) => ({
      country: d.Entity as string,
      code: d.Code as string,
      year: +d.Year!,
      population: +(d["Population (historical estimates)"] as string),
    })
  );

  const gdpDataPromise = getCommonData(gdpResponse, commonKeys, (d) => ({
    country: d.Entity as string,
    code: d.Code as string,
    year: +d.Year!,
    gdp: +(d["GDP per capita"] as string),
  }));

  const lifeExpectancyDataPromise = getCommonData(
    lifeExpectancyResponse,
    commonKeys,
    (d) => ({
      country: d.Entity as string,
      code: d.Code as string,
      year: +d.Year!,
      lifeExpectancy: +(d["Life expectancy"] as string),
    })
  );

  const [populationData, gdpData, lifeExpectancyData] = await Promise.all([
    populationDataPromise,
    gdpDataPromise,
    lifeExpectancyDataPromise,
  ]);

  // merge the data

  const mergedData = Array.from(commonKeys).map((key) => {
    const [code, year] = key.split("---");
    const population = populationData.find(
      (d) => d.code === code && d.year === +year
    );
    const gdp = gdpData.find((d) => d.code === code && d.year === +year);
    const lifeExpectancy = lifeExpectancyData.find(
      (d) => d.code === code && d.year === +year
    );

    return {
      code,
      year: +year,
      country: population.country as string,
      population: +population.population,
      gdp: +gdp.gdp,
      lifeExpectancy: +lifeExpectancy.lifeExpectancy,
    };
  }) satisfies Data;
  return mergedData;
};

export default getData;
