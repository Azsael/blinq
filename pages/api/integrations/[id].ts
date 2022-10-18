// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Database } from "../../../database";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  const { id } = req.query;

  if (req.method === 'POST') {
    Database.updateIntegration(id as string, req.body)
    
  } else if (req.method === 'DELETE') {
    Database.disconnectIntegration(id as string);
  }

  res.status(204).send();
}
