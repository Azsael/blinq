export interface User {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
}

export interface Contact {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
  met_at_location: string;
  notes?: string;
}

export interface IntegrationPartner {
  id: string;
  name: string;

  fields: IntegrationPartnerField[];
}

export type FieldType = 'string' | 'mappings'; // or enum?

export interface IntegrationPartnerField {
  key: string;
  label: string;
  hint?: string;

  type: FieldType;
}

export interface Integration {
  id: string;

  user_id: string;
  integration_partner_id: string;

  fields: {
    [key: string]: string | { [key: string]: string }
  };
}
