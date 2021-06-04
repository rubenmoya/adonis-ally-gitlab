import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class GitlabProvider {
  constructor(protected app: ApplicationContract) {}

  public async boot() {
    const Ally = this.app.container.resolveBinding('Adonis/Addons/Ally')
    const { GitlabDriver } = await import('../src/Gitlab')

    Ally.extend('gitlab', (_, __, config, ctx) => {
      return new GitlabDriver(ctx, config)
    })
  }
}
