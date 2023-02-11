# **Simple Http Service**

A class that facilitates the use of HTTP methods in a elegant way, it's simple to use HTTP requests, each method already returns the response of the request in JSON and can also be extended to add authentication or perform other types of customization.

### **Usage**

```typescript
import SimpleHttpService from '@coheia/simple-http-service'

const api = new SimpleHttpService({
  baseUrl: 'http://localhost:3001',
  baseEndpoint: 'api/v1'
})

// simple get request
const response = await api.get<YourResponseType>('your/endpoint')

// simple destruct response
interface LoginSuccess {
  accessToken: string
}
const { accessToken } = await api.post<LoginSuccess>('auth/login', {
  username: 'admin',
  password: '***'
})
```

### **Override methods**

If you need to add authentication, you can extend the SimpleHttpService class and override the handleHeaders method.

```typescript
// Import the SimpleHttpService class and its related types, Headers and Endpoint.
import SimpleHttpService, {
  Headers,
  SimpleConfigs
} from '@coheia/simple-http-service'

// Define a constant for the token value.
const TOKEN = 'your_token'

// Create a subclass called ProtectedService that extends SimpleHttpService.
class ProtectedService extends SimpleHttpService {
  // Declare a private property for the token.
  private readonly token: string

  // The constructor sets the token and calls the parent class's constructor with the base URL.
  constructor(token: string, config: SimpleConfigs) {
    super(config)
    this.token = token
  }

  // Override the handleHeaders method to add an Authorization header with the token.
  // Content-Type: application/json is default, if override remember to set
  protected override handleHeaders(headers: Headers): Headers {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      ...headers
    }
  }
}

// Export an instance of the ProtectedService class with the token.
export const apiProtected = new ProtectedService(TOKEN, {
  baseUrl: 'https://localhost:3001'
})
```

### **License**

This package is licensed under the MIT License.
