/**
 * Type that defines the endpoint URL.
 */
export type Endpoint = string
/**
 * Type that defines the body of the request.
 */
export type BodyReq = Record<string, unknown>
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
export class SimpleHttpService {
  private readonly baseUrl

  /**
   * Initializes the class with a base URL.
   *
   * @param baseUrl The base URL of the API.
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  /**
   * Makes a GET request to the API.
   *
   * @template T Response type.
   * @param {Endpoint} endpoint Endpoint URL.
   * @param {Headers} [headers] Request headers.
   * @returns {Promise<T>} Response of the request in JSON format, already typed.
   */
  async get<T>(endpoint: Endpoint, headers?: Headers): Promise<T> {
    return await this.fetch(endpoint, {
      method: 'GET',
      headers
    })
  }

  /**
   * Makes a POST request to the API.
   *
   * @template T Response type.
   * @param {Endpoint} endpoint Endpoint URL.
   * @param {BodyReq} body Request body.
   * @param {Headers} [headers] Request headers.
   * @returns {Promise<T>} Response of the request in JSON format, already typed.
   */
  async post<T>(
    endpoint: Endpoint,
    body: BodyReq,
    headers?: Headers
  ): Promise<T> {
    return await this.fetch(endpoint, {
      method: 'POST',
      headers,
      body
    })
  }

  /**
   * Makes a PUT request to the API.
   *
   * @template T Response type.
   * @param {Endpoint} endpoint Endpoint URL.
   * @param {BodyReq} body Request body.
   * @param {Headers} [headers] Request headers.
   * @returns {Promise<T>} Response of the request in JSON format, already typed.
   */
  async put<T>(
    endpoint: Endpoint,
    body: BodyReq,
    headers?: Headers
  ): Promise<T> {
    return await this.fetch(endpoint, {
      method: 'PUT',
      headers,
      body
    })
  }

  /**
   * Makes a PATCH request to the API.
   *
   * @template T Response type.
   * @param {Endpoint} endpoint Endpoint URL.
   * @param {BodyReq} body Request body.
   * @param {Headers} [headers] Request headers.
   * @returns {Promise<T>} Response of the request in JSON format, already typed.
   */
  async patch<T>(
    endpoint: Endpoint,
    body: BodyReq,
    headers?: Headers
  ): Promise<T> {
    return await this.fetch(endpoint, {
      method: 'PATCH',
      headers,
      body
    })
  }

  /**
   * Deletes a resource at the specified endpoint
   *
   * @param {Endpoint} endpoint Endpoint URL.
   * @param {Headers} [headers] Request headers.
   * @returns {Promise<T>} - The response of the deleted resource, already typed
   */
  async delete<T>(endpoint: Endpoint, headers?: Headers): Promise<T> {
    return await this.fetch<T>(endpoint, {
      method: 'DELETE',
      headers
    })
  }

  /**
   * Handles the response from a request
   *
   * @param response - The response from the request
   * @returns {Promise<T>} - The response from the request, already typed
   */
  async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(await response.text())
    }
    return response.json() as T
  }

  /**
   * Sends the request to the specified endpoint
   *
   * @param endpoint - The endpoint to send the request
   * @param options - Additional options for the request
   * @returns {Promise<T>} - The response from the request, already typed
   */
  async fetch<T>(
    endpoint: Endpoint,
    options: Omit<RequestInit, 'body'> & { body?: BodyReq }
  ): Promise<T> {
    try {
      const response = await fetch(this.baseUrl + endpoint, {
        ...options,
        headers: {
          ...this.handleHeaders(options.headers)
        },
        body: JSON.stringify(options.body)
      })
      const result = await this.handleResponse<T>(response)
      return result
    } catch (e) {
      this.handleErrors(e)
    }
  }

  /**
   * Handles the headers for the request, you can extends HttpClass and
   * override handleHeaders to include the authentication token or other cutomizations.
   *
   * @param headers - Additional headers for the request
   * @returns {Headers} - The headers for the request
   */
  handleHeaders(headers: Headers): Headers {
    return {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  /**
   * Handles the error occurred during the fetch request
   *
   * @param e the error
   * @throws Error with the error message or error object
   */
  handleErrors(e: unknown): never {
    let err = e
    if (typeof e === 'string') {
      err = { message: e.toUpperCase() }
    } else if (e instanceof Error) {
      err = JSON.parse(e.message) as Error
    }
    throw err
  }
}
