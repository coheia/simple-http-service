/**
 * Type that defines the configuration object.
 */
export interface SimpleConfigs {
  /**
   * The base URL of the API, ex: 'http://localhost:3001/'
   */
  readonly baseUrl: string
  /**
   * The base endpoint of the API, ex: '/api/v1', '/projects'
   */
  readonly baseEndpoint?: Endpoint
}
/**
 * Type that defines the endpoint URL.
 */
export type Endpoint = string
/**
 * Type that defines the Request options.
 */
export type ReqInit = Omit<RequestInit, 'body'> & { body?: BodyReq }
/**
 * Type that defines the body of the request.
 */
export type BodyReq<K = {}> = (K & { [key: string]: string }) | string
/**
 * Type that defines the headers of the request.
 */
export type Headers = ReqInit['headers']

/**
 * The SimpleHttpService class makes it easier to use http methods.
 * Each method returns the response of the request already typed in JSON, and it can also be
 * extended to add authentication or perform other types of customization.
 *
 * @export
 * @class SimpleHttpService
 */
export default class SimpleHttpService {
  private readonly config: SimpleConfigs

  /**
   * Initializes the class with a base URL.
   *
   * @param config
   */
  constructor(config: SimpleConfigs) {
    this.config = config
  }

  /**
   * Makes a GET request to the API.
   *
   * @template T Response type.
   * @param {Endpoint} endpoint Endpoint URL.
   * @param {ReqInit} requestInit - Additional options for the request
   * @returns {Promise<T>} Response of the request in JSON format, already typed.
   */
  public async get<T>(endpoint: Endpoint, requestInit?: ReqInit): Promise<T> {
    return await this.fetch(endpoint, {
      method: 'GET',
      ...requestInit
    })
  }

  /**
   * Makes a POST request to the API.
   *
   * @template T Response type.
   * @template K Body type.
   * @param {Endpoint} endpoint Endpoint URL.
   * @param {BodyReq} body Request body.
   * @param {ReqInit} requestInit - Additional options for the request
   * @returns {Promise<T>} Response of the request in JSON format, already typed.
   */
  public async post<T, K extends BodyReq>(
    endpoint: Endpoint,
    body: K,
    requestInit?: Omit<ReqInit, 'body'>
  ): Promise<T> {
    return await this.fetch(endpoint, {
      method: 'POST',
      body,
      ...requestInit
    })
  }

  /**
   * Makes a PUT request to the API.
   *
   * @template T Response type.
   * @template K Body type.
   * @param {Endpoint} endpoint Endpoint URL.
   * @param {BodyReq} body Request body.
   * @param {ReqInit} requestInit - Additional options for the request
   * @returns {Promise<T>} Response of the request in JSON format, already typed.
   */
  public async put<T, K extends BodyReq>(
    endpoint: Endpoint,
    body: K,
    requestInit?: Omit<ReqInit, 'body'>
  ): Promise<T> {
    return await this.fetch(endpoint, {
      method: 'PUT',
      body,
      ...requestInit
    })
  }

  /**
   * Makes a PATCH request to the API.
   *
   * @template T Response type.
   * @template K Body type.
   * @param {Endpoint} endpoint Endpoint URL.
   * @param {BodyReq} body Request body.
   * @param {ReqInit} requestInit - Additional options for the request
   * @returns {Promise<T>} Response of the request in JSON format, already typed.
   */
  public async patch<T, K extends BodyReq>(
    endpoint: Endpoint,
    body: K,
    requestInit?: Omit<ReqInit, 'body'>
  ): Promise<T> {
    return await this.fetch(endpoint, {
      method: 'PATCH',
      body,
      ...requestInit
    })
  }

  /**
   * Deletes a resource at the specified endpoint
   *
   * @param {Endpoint} endpoint Endpoint URL.
   * @param {ReqInit} requestInit - Additional options for the request
   * @returns {Promise<T>} - The response of the deleted resource, already typed
   */
  public async delete<T>(
    endpoint: Endpoint,
    requestInit?: ReqInit
  ): Promise<T> {
    return await this.fetch<T>(endpoint, {
      method: 'DELETE',
      ...requestInit
    })
  }

  /**
   * Sends the request to the specified endpoint
   *
   * @param endpoint - The endpoint to send the request
   * @param requestInit - Additional options for the request
   * @returns {Promise<T>} - The response from the request, already typed
   */
  public async fetch<T>(endpoint: Endpoint, requestInit?: ReqInit): Promise<T> {
    const baseEndpoint = this._removeSlashes(this.config.baseEndpoint || '')
    const url = `${baseEndpoint}/${this._removeSlashes(endpoint)}`
    const fullEndpoint = new URL(url, this.config.baseUrl)
    const response = await fetch(fullEndpoint, {
      ...requestInit,
      body: JSON.stringify(requestInit?.body),
      headers: this.handleHeaders(requestInit?.headers)
    })
    return await this.handleResponse<T>(response)
  }

  /**
   * Handles the response from a request
   *
   * @param response - The response from the request
   * @returns {Promise<T>} - The response from the request, already typed
   */
  protected async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw response
    }
    return (await response.json()) as T
  }

  /**
   * Handles the headers for the request, you can extends SimpleHttpService class and
   * override handleHeaders to include the authentication token or other cutomizations.
   *
   * @param headers - Additional headers for the request
   * @returns {Headers} - The headers for the request
   */
  protected handleHeaders(headers: Headers): Headers {
    const newHeaders = new Headers(headers)
    newHeaders.set('Content-Type', 'application/json')

    return newHeaders
  }

  private _removeSlashes(path: string): string {
    path = path.endsWith('/') ? path.slice(0, -1) : path
    path = path.startsWith('/') ? path.slice(1) : path
    return path
  }
}
