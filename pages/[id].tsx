import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent } from "react";
import { ContactFieldMappings, Database } from "../database";
import styles from "../styles/Integration.module.css";
import qs from 'qs';

interface UserIntegration {
  id: string;
  name: string;
  isEnabled: boolean;
  fields: UserIntegrationField[];
}

type UserIntegrationField = UserIntegrationTextField | UserIntegrationMappingField;

interface UserIntegrationTextField {

  key: string;
  label: string;
  hint?: string;

  type: 'string';
  value: string;
}

interface UserIntegrationMappingField {
  key: string;
  label: string;
  hint?: string;

  type: 'mappings';
  value: { [key: string]: string };
}

const Integration: NextPage<{ integration: UserIntegration }> = ({ integration }) => {
  const router = useRouter();

  const onDisconnect = async () => {
    if (!confirm("Are you sure?")) { // nicer dialog or something
      return;
    }
    const options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }
    const response = await fetch(`/api/integrations/${integration.id}`, options)
    if (response.ok) {
      // maybe a success snack or something?
      router.push('/');
    } else {
      // todo: proper app should handle error states :)
      alert('ugh...error')
    }
  }

  return (
    <main className={styles.container}>
      <Head>
        <title>Blinq • Integrations</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>{integration.name}</h1>

      <Link href="/" >
        <a className={styles.back}>
          Back to integrations
        </a>        
      </Link>
      
      <IntegrationForm integration={integration}></IntegrationForm>

      {integration.isEnabled && <button type="button" onClick={() => onDisconnect()} className={styles.disconnect}>Disconnect</button>}
      

    </main>
  );
};

function IntegrationForm({ integration }: { integration: UserIntegration }) {
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement).entries();
    // funky voodoo to nest the form... should probably use proper form framework... in a proper solution
    const data = qs.parse(qs.stringify(Object.fromEntries(formData)));
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
    const response = await fetch(`/api/integrations/${integration.id}`, options)

    if (response.ok) {
      // maybe a success snack or something?
      router.push('/');
    } else {
      // todo: proper app should handle error states :)
      // server side validation + internet issues 
      alert('ugh...error');
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>{integration.isEnabled ? "Manage your integration" : "Setup your integration"}</h2>
      
      {integration.fields?.map(x => <IntegrationFormField key={x.key} field={x} />)}

      <button className={styles.submit} type="submit">{integration.isEnabled ? "Update" : "Setup"} {integration.name}</button>
    </form>
  )
}

function IntegrationFormField({ field }: { field: UserIntegrationField }) {
  if (field.type === 'mappings') {
    return (
      <div className={styles.mapping}>
        <div>{field.label}</div>
        <small>{field.hint}</small>

        <div className={styles.mappings}>
          {ContactFieldMappings.map(x => (
            <fieldset className={styles.fieldset} key={x.key}>
              <label className={styles.label} htmlFor={x.key}>{x.label}</label>
              <input className={styles.input} type="text" id={field.key} name={`${field.key}[${x.key}]`} defaultValue={field.value[x.key]} />
            </fieldset>
          ))}
        </div>
      </div>
    );
  }

  return (
    <fieldset className={styles.fieldset}>
      <label className={styles.label} htmlFor={field.key}>{field.label}</label>
      <input className={styles.input} type="text" id={field.key} name={field.key} defaultValue={field.value} required />
      <small className={styles.hint}>{field.hint}</small>
    </fieldset>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // should be redirecting/handling error in case of invalid id / no access / etc

  const id = context.params!.id as string;

  const userIntegration = Database.getIntegration(id);
  const partner = Database.getIntegrationPartner(id);
  
  const integration = {
    id: id,
    name: partner.name,
    isEnabled: !!userIntegration,

    fields: partner.fields.map(x => ({
        ...x,
        value: userIntegration?.fields[x.key] ?? ''
    })),
  };
  return { props: { integration } }
}


export default Integration;
