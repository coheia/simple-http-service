/**
 * Type that defines the configuration object.
 */
export interface SimpleConfigs {
  /**
   * The base URL of the API, ex: 'http://localhost:3001/'
   */
  readonly baseUrl: string
  /**
   * The base endpoint of the API, ex: '/api/v1'
   */
  readonly baseEndpoint: Endpoint
}
/**
 * Type that defines the endpoint URL.
 */
export type Endpoint = string
/**
 * Type that defines the body of the request.
 */
export type BodyReq = RequestInit['body'] | FormData
/**
 * Type that defines the headers of the request.
 */
export type Headers = RequestInit['headers']

/**
 * The SimpleHttpService class makes it easier to use http methods.
 * Each method returns the response of the request already typed in JSON, and it can also be
 * extended to add authentication or perform other types of customization.
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
   * @param {RequestInit} requestInit - Additional options for the request
   * @returns {Promise<T>} Response of the request in JSON format, already typed.
   */
  public async get<T>(
    endpoint: Endpoint,
    requestInit?: RequestInit
  ): Promise<T> {
    return await this.fetch(endpoint, {
      method: 'GET',
      ...requestInit
    })
  }

  /**
   * Makes a POST request to the API.
   *
   * @template T Response type.
   * @param {Endpoint} endpoint Endpoint URL.
   * @param {BodyReq} body Request body.
   * @param {RequestInit} requestInit - Additional options for the request
   * @returns {Promise<T>} Response of the request in JSON format, already typed.
   */
  public async post<T>(
    endpoint: Endpoint,
    body: BodyReq,
    requestInit?: Omit<RequestInit, 'body'>
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
   * @param {Endpoint} endpoint Endpoint URL.
   * @param {BodyReq} body Request body.
   * @param {RequestInit} requestInit - Additional options for the request
   * @returns {Promise<T>} Response of the request in JSON format, already typed.
   */
  public async put<T>(
    endpoint: Endpoint,
    body: BodyReq,
    requestInit?: Omit<RequestInit, 'body'>
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
   * @param {Endpoint} endpoint Endpoint URL.
   * @param {BodyReq} body Request body.
   * @param {RequestInit} requestInit - Additional options for the request
   * @returns {Promise<T>} Response of the request in JSON format, already typed.
   */
  public async patch<T>(
    endpoint: Endpoint,
    body: BodyReq,
    requestInit?: Omit<RequestInit, 'body'>
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
   * @param {RequestInit} requestInit - Additional options for the request
   * @returns {Promise<T>} - The response of the deleted resource, already typed
   */
  public async delete<T>(
    endpoint: Endpoint,
    requestInit?: RequestInit
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
  public async fetch<T>(
    endpoint: Endpoint,
    requestInit?: RequestInit
  ): Promise<T> {
    let be = this.config.baseEndpoint
    be = be.endsWith('/') ? be.slice(0, -1) : be
    be = be.startsWith('/') ? be.slice(1) : be

    let ep = endpoint
    ep = ep.endsWith('/') ? ep.slice(0, -1) : ep
    ep = ep.startsWith('/') ? ep.slice(1) : ep

    const fullEndpoint = new URL(`${be}/${ep}`, this.config.baseUrl)
    const response = await fetch(fullEndpoint, {
      body: JSON.stringify(requestInit?.body),
      headers: this.handleHeaders(requestInit?.headers),
      ...requestInit
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
    return new Headers({
      'Content-Type': 'application/json',
      ...headers
    })
  }
}
