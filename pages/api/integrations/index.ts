// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Database, FieldType } from "../../../database";

type UserIntegration = {
  name: string;
  isEnabled: boolean;
  fields: UserIntegrationField[];
};

type UserIntegrationField = {
  key: string;
  label: string;
  hint?: string;

  type: FieldType;
  value: null;
}

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<UserIntegration[]>
) {
  const partners = Database.getIntegrationPartners();
  const integrations = Database.getIntegrations();

  res.status(200).json(
    partners.map(x => ({
      id: x.id,
      name: x.name,
      isEnabled: false,

      fields: []

    }))
  )
}
