import { User, Contact, Integration, IntegrationField, IntegrationPartner } from "./types";

// 
const INTEGRATION_STORE = Symbol.for('__INTEGRATION_STORE');

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

  // crappy memory integration store 
  private static get integrations(): Integration[]  {
    if (!global[INTEGRATION_STORE]) {
      global[INTEGRATION_STORE] = [];
    }
    return global[INTEGRATION_STORE];
  };
  private static set integrations(value: Integration[])  {
    global[INTEGRATION_STORE] = value;
  };

  public static getIntegrations(): Integration[] {
    return this.integrations;
  }

  public static getIntegration(integrationPartnerId: string): Integration | undefined {
    return this.integrations.find(x => x.integration_partner_id === integrationPartnerId);
  }

  public static updateIntegration(integrationPartnerId: string, fields: IntegrationField[]): Integration {
    let integration = this.integrations.find(x => x.integration_partner_id === integrationPartnerId);

    if (!integration) {
      integration = {
        id: (Math.random() * 1000).toString(), // i am a fake database beep boop
        user_id: this.getUser().id,
        integration_partner_id: integrationPartnerId,
        fields: fields
      }
      this.integrations.push(integration)
    } else {
      integration.fields = fields;
    }
    return integration;
  }

  public static disconnectIntegration(integrationPartnerId: string) {
    this.integrations = this.integrations.filter(x => x.integration_partner_id !== integrationPartnerId);
  }

  public static getIntegrationPartner(integrationPartnerId: string): IntegrationPartner {
    return Database.getIntegrationPartners().find(x => x.id === integrationPartnerId)!;
  }

  public static getIntegrationPartners(): IntegrationPartner[] {
    return [
      {
        id: 'salesforce',
        name: 'Salesforce',
        fields: [
          {
            key: 'client_id',
            label: 'Client Id',
            hint: 'Please enter your client id',
            type: 'string'
          },
          {
            key: 'client_secret',
            label: 'Client Secret',
            hint: 'Please enter your client secret',
            type: 'string'
          }
        ]        
      },
      {
        id: 'zapier',
        name: 'Zapier',
        fields: [
          {
            key: 'api_key',
            label: 'Api Key',
            hint: 'Please enter your api key',
            type: 'string'
          }
        ]
      },
      {
        id: 'hubspot',
        name: 'HubSpot',
        fields: [
          {
            key: 'tenant_domain',
            label: 'Domain',
            hint: 'Please enter your tenant domain',
            type: 'string'
          },
          {
            key: 'client_id',
            label: 'Client Id',
            hint: 'Please enter your client id',
            type: 'string'
          },
          {
            key: 'client_secret',
            label: 'Client Secret',
            hint: 'Please enter your client secret',
            type: 'string'
          },
          {
            key: 'field_mappings',
            label: 'Field Mappings',
            hint: 'Please enter your field mappings (+help stuff)',
            type: 'mappings'
          },
        ]
      },
    ]
  }
}

export const ContactFieldMappings = [
  {
    key: 'given_name',
    label: 'Given Name'
  },
  {
    key: 'family_name',
    label: 'Family Name'
  },
  {
    key: 'email',
    label: 'Email'
  }
]
