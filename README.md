# **Simple Http Service**

The SimpleHttpService class provides a simple way to make HTTP requests using the fetch API. The class supports GET, POST, PUT, PATCH, and DELETE methods and returns the response in JSON format, already typed. The class can also be extended to add authentication or other customizations and each method can have its behavior changed at the time of use through the `requestInit`.

## **Table of Contents**
  - [**Usage**](#usage)
  - [**Override methods**](#override-methods)
  - [**Manages CRUD API - "Projects" example**](#manages-crud-api---projects-example)
  - [**SimpleConfigs type - constructor config optional param**](#simpleconfigs-type---constructor-config-optional-param)
  - [**Same domain API**](#same-domain-api)
  - [**Contributing**](#contributing)
  - [**License**](#license)

### **Usage**

```typescript
import SimpleHttpService from '@coheia/simple-http-service'

const api = new SimpleHttpService({
  baseUrl: 'http://localhost:3001', // remove for same domain api
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

### **SimpleConfigs type - constructor config optional param**

Defines the optional configuration object for the SimpleHttpService class.

```typescript
import { SimpleConfigs } from '@coheia/simple-http-service';

export const httpServiceConfig: SimpleConfigs = {
  baseUrl: 'http://localhost:3001',
  baseEndpoint: 'api/v1'
}
```

### **Same domain API**

If you are using the same domain for both the API and the client, you can omit the configuration object completely, or individually `baseUrl` or `baseEndpoint` like this:

```typescript
import SimpleHttpService from '@coheia/simple-http-service';

//for same domain api without baseEndpoint
const http = new SimpleHttpService();
const project = await http.get<ProjectType>('/project/10');
// GET - YOUR_DOMAIN/project/10
```

```typescript
// and for same domain api with baseEndpoint as api version
const http = new SimpleHttpService({ baseEndpoint: 'api/v3' });
const project = await http.get<ProjectType>('/project/10');
// GET - YOUR_DOMAIN/api/v3/project/10
```

### **Contributing**

Your contributions are always welcome! Submit a pull request with your changes or create an issue to discuss anything.

### **License**

This package is licensed under the MIT License.