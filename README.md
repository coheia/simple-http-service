# **Simple Http Service**

A class that facilitates the use of HTTP methods, it's a simple and easy way to use in HTTP requests, each method already returns the response of the request in JSON and can also be extended to add authentication or perform other types of customization.

### **Usage**

```javascript
import { SimpleHttpService } from 'simple-http-service'

// simple get request
const response = (await api.get) < YourResponseType > '/your/endpoint'

// simple post request
const response =
  (await api.post) <
  YourResponseType >
  ('/your/endpoint',
  {
    key: 'value'
  })
```

### **Override methods**

If you need to add authentication, you can extend the SimpleHttpService class and override the handleHeaders method.

```javascript
import { SimpleHttpService, Headers, Endpoint } from 'simple-http-service'

const TOKEN = 'your_token'

export class IsAuthenticatedService extends SimpleHttpService {
  private readonly token: string

  constructor(token: string, baseUrl?: Endpoint) {
    super(baseUrl)
    this.token = token
  }

  handleHeaders(headers: Headers): Headers {
    return {
      Authorization: `Bearer ${this.token}`,
      ...super.handleHeaders(headers)
    }
  }
}

export const apiAuthenticated = new IsAuthenticatedService(TOKEN)
```

### **License**

This package is licensed under the MIT License.
