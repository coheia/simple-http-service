# **Simple Http Service**

The SimpleHttpService class provides a simple and convenient way to interact with an API using HTTP methods such as GET, POST, PUT, PATCH and DELETE. The class has a constructor that accepts a configuration object which contains the base URL of the API and the base endpoint (optional).

The class has methods for each HTTP method that accept the endpoint URL and additional options for the request (optional). These methods return a promise that resolves to the response of the request in JSON format, already typed.

The class also has a private method named fetch that is responsible for sending the actual request to the API. This method can be extended to add authentication or perform other customizations.

### **Usage**

```typescript
import SimpleHttpService from '@coheia/simple-http-service'

const api = new SimpleHttpService({
  baseUrl: 'http://localhost:3001',
  baseEndpoint: 'api/v1'
})

// simple get request
const response = await api.get<YourResponseType>('your/endpoint')

type LoginBody = {
  username: string
  password: string
}
// simple destruct response
type LoginSuccess = {
  accessToken: string
}
const { accessToken } = await api.post<LoginSuccess, LoginBody>('auth/login', {
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
export const TOKEN = 'your_token'

// Create a subclass called ProtectedService that extends SimpleHttpService.
class ProtectedService extends SimpleHttpService {
  // Declare a private property for the token.
  private readonly token: string

  // The constructor sets the token and calls the parent class's constructor with the base URL.
  constructor(token: string, config: SimpleConfigs) {
    super(config)
    this.token = token
  }

  // Override the handleHeaders method to add an Authorization header with the token;
  // Content-Type: application/json is default, if override remember to reset it.
  protected override handleHeaders(headers: Headers): Headers {
    return {
      Authorization: `Bearer ${this.token}`,
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

### **Manages CRUD API - "Projects" example**

The following code manages a CRUD API by creating a ProjectService class that extends a ProtectedService (the prev example). The code removes the authorization header when the request does not require authentication, which is the case for the `getProjects` and `getProject` methods. The code also includes methods for creating, updating, and deleting projects, which make use of the ProtectedService's `post`, `put`, and `delete` methods.

```typescript
import { ProtectedService, TOKEN } from './ProtectedService'
import { removeAuthorizationHeader } from '@coheia/simple-http-service'

const httpServiceConfig = {
  baseUrl: 'http://localhost:3001'
}

interface NewProject {
  name: string
  order?: number
}

interface Project extends NewProject {
  id: string
  created_at: string
  updated_at: string
}

class ProjectService extends ProtectedService {
  constructor() {
    super(TOKEN, {
      ...httpServiceConfig,
      baseEndpoint: '/projects'
    })
  }

  async getProjects(): Promise<Project[]> {
    return await this.get<Project[]>('/', removeAuthorizationHeader)
  }

  async getProject(id: string): Promise<Project> {
    return await this.get<Project>(`/${id}`, removeAuthorizationHeader)
  }

  async createProject(project: NewProject): Promise<Project> {
    return await this.post<Project, NewProject>('/', project)
  }

  async updateProject(id: string, project: NewProject): Promise<Project> {
    return await this.put<Project, NewProject>(`/${id}`, project)
  }

  async deleteProject(id: string): Promise<void> {
    return await this.delete<void>(`/${id}`)
  }
}

export const projectService = new ProjectService()
```

### **License**

This package is licensed under the MIT License.
