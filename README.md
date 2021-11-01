# Adonis Ally Gitlab Driver

[![NPM version](https://img.shields.io/npm/v/adonis-ally-gitlab.svg)](https://www.npmjs.com/package/adonis-ally-gitlab)

A [Gitlab](https://gitlab.com/) driver for [AdonisJS Ally](https://docs.adonisjs.com/guides/auth/social).
You can authenticate with your self hosted gitlab or with https://gitlab.com/

## Getting started

### 1. Install the package

Install the package from your command line.

```bash
npm install --save adonis-ally-gitlab
```

or

```bash
yarn add adonis-ally-gitlab
```

### 2. Configure the package

```bash
node ace configure adonis-ally-gitlab
```

### 3. Validate environment variables

```ts
GITLAB_URL: Env.schema.string(),
GITLAB_CLIENT_ID: Env.schema.string(),
GITLAB_CLIENT_SECRET: Env.schema.string(),
```

### 4. Add variables to your ally configuration

```ts
const allyConfig: AllyConfig = {
  // ... other drivers
  gitlab: {
    driver: 'gitlab',
    gitlabUrl: 'https://gitlab.example.com/'
    clientId: Env.get('GITLAB_CLIENT_ID'),
    clientSecret: Env.get('GITLAB_CLIENT_SECRET'),
    callbackUrl: 'http://localhost:3333/gitlab/callback',
  },
}
```

If you don't supply gitlabUrl, https.//www.gitlab.com/ will be used.

When using self hosted gitlab,
get the clientId and clientSecret from /admin/applications/ on your gitlab instance.

## Scopes

You can pass an array of scopes in your configuration, for example `['read_user', 'profile', 'api']`. You have a full list of scopes in the [Gitlab Oauth documentation](https://docs.gitlab.com/ee/integration/oauth_provider.html#authorized-applications)

## How it works

You can learn more about [AdonisJS Ally](https://docs.adonisjs.com/guides/auth/social) in the documentation. And learn about the implementation in the [ally-driver-boilerplate](https://github.com/adonisjs-community/ally-driver-boilerplate) repository.

## Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'feat: Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[MIT](LICENSE)
