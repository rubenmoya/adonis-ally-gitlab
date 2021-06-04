The package has been configured successfully.

Make sure to first define the mapping inside the `contracts/ally.ts` file as follows.

```ts
declare module '@ioc:Adonis/Addons/Ally' {
  import { GitlabDriver, GitlabDriverConfig } from 'adonis-ally-gitlab/build/standalone'

  interface SocialProviders {
    // ... other mappings
    gitlab: {
      config: GitlabDriverConfig
      implementation: GitlabDriver
    }
  }
}
```

Ally config relies on environment variables for the client id and secret. We recommend you to validate environment variables inside the `env.ts` file.

## Variables for Gitlab driver

```ts
GITLAB_CLIENT_ID: Env.schema.string(),
GITLAB_CLIENT_SECRET: Env.schema.string(),
```

## Ally config for Gitlab driver

```ts
const allyConfig: AllyConfig = {
  // ... other drivers
  gitlab: {
    driver: 'gitlab',
    clientId: Env.get('GITLAB_CLIENT_ID'),
    clientSecret: Env.get('GITLAB_CLIENT_SECRET'),
    callbackUrl: 'http://localhost:3333/gitlab/callback',
  },
}
```
