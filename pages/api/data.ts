// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// change runtime to experimental-edge

import getData from "@/lib/data";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = await getData();
  res.status(200).json({ data });
}
