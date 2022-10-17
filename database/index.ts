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

  fields: IntegrationPartnerField[];
}

export type FieldType = 'string' | 'secret' | '0';

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


}



export class Database {
  public static getUser(): User {
    return {
      id: "12345",
      given_name: "Jane",
      family_name: "Doe",
      email: "jane@blinq.me",
    };
  }

  public static getContacts(): Contact[] {
    return [
      {
        id: "1234",
        given_name: "Terry",
        family_name: "Walker",
        email: "terry@waffles.co",
        met_at_location: "Melbourne, Australia",
        notes: "Terry has a beard.",
      },
      {
        id: "1235",
        given_name: "Terry",
        family_name: "Walker",
        email: "terry@waffles.co",
        met_at_location: "Melbourne, Australia",
        notes: "Terry has a beard.",
      },
    ];
  }
}
