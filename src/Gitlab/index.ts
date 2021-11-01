import type { AllyUserContract, LiteralStringUnion } from '@ioc:Adonis/Addons/Ally'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Oauth2Driver, ApiRequest, RedirectRequest } from '@adonisjs/ally/build/standalone'

export type GitlabAccessToken = {
  token: string
  type: 'bearer'
}

/**
 * Available Gitlab scopes
 *
 * @link https://docs.gitlab.com/ee/integration/oauth_provider.html#authorized-applications
 */
export type GitlabScopes =
  | 'api'
  | 'read_user'
  | 'read_api'
  | 'read_repository'
  | 'write_repository'
  | 'read_registry'
  | 'write_registry'
  | 'sudo'
  | 'openid'
  | 'profile'
  | 'email'

export type GitlabDriverConfig = {
  driver: 'gitlab'
  gitlabUrl?: string
  clientId: string
  clientSecret: string
  callbackUrl: string
  authorizeUrl?: string
  accessTokenUrl?: string
  userInfoUrl?: string

  scopes?: LiteralStringUnion<GitlabScopes>[]
}

/**
 * Gitlab driver to login user via Gitlab
 */
export class GitlabDriver extends Oauth2Driver<GitlabAccessToken, GitlabScopes> {
  protected authorizeUrl = 'https://gitlab.com/oauth/authorize'
  protected accessTokenUrl = 'https://gitlab.com/oauth/token'
  protected userInfoUrl = 'https://gitlab.com/api/v4/user'
  protected codeParamName = 'code'
  protected errorParamName = 'error'
  protected stateCookieName = 'gitlab_oauth_state'
  protected stateParamName = 'state'
  protected scopeParamName = 'scope'
  protected scopesSeparator = '+'

  constructor(ctx: HttpContextContract, public config: GitlabDriverConfig) {
    super(ctx, config)
    if (config.gitlabUrl) {
      this.authorizeUrl = config.gitlabUrl + 'oauth/authorize'
      this.accessTokenUrl = config.gitlabUrl + 'oauth/token'
      this.userInfoUrl = config.gitlabUrl + 'api/v4/user'
    }
    this.loadState()
  }

  protected configureRedirectRequest(request: RedirectRequest<GitlabScopes>) {
    request.scopes(this.config.scopes || ['read_user'])
    request.param('state', this.stateCookieValue)
    request.param('response_type', 'code')
  }

  public accessDenied() {
    return this.ctx.request.input('error') === 'user_denied'
  }

  public async user(
    callback?: (request: ApiRequest) => void
  ): Promise<AllyUserContract<GitlabAccessToken>> {
    const accessToken = await this.accessToken()
    const user = await this.getUserInfo(accessToken.token, callback)

    return {
      ...user,
      token: accessToken,
    }
  }

  public async userFromToken(
    accessToken: string,
    callback?: (request: ApiRequest) => void
  ): Promise<AllyUserContract<{ token: string; type: 'bearer' }>> {
    const user = await this.getUserInfo(accessToken, callback)

    return {
      ...user,
      token: {
        token: accessToken,
        type: 'bearer' as const,
      },
    }
  }

  protected getAuthenticatedRequest(token: string) {
    const request = this.httpClient(this.config.userInfoUrl || this.userInfoUrl)

    request.header('Accept', 'application/json')
    request.header('Authorization', `Bearer ${token}`)
    request.param('format', 'json')
    request.parseAs('json')

    return request
  }

  /**
   * Fetches the user info from the Gitlab API
   * https://docs.gitlab.com/ee/api/users.html#list-current-user-for-normal-users
   */
  protected async getUserInfo(
    token: string,
    callback?: (request: ApiRequest) => void
  ): Promise<Omit<AllyUserContract<GitlabAccessToken>, 'token'>> {
    const request = this.getAuthenticatedRequest(token)

    if (typeof callback === 'function') {
      callback(request)
    }

    const body = await request.get()

    return {
      id: body.id,
      nickName: body.username,
      name: body.name,
      email: body.email,
      avatarUrl: body.avatar_url || null,
      emailVerificationState: body.state === 'active' ? 'verified' : 'unverified',
      original: body,
    }
  }
}
