# **Simple Http Service**

![npm](https://img.shields.io/npm/v/@coheia/simple-http-service)
![npm bundle size](https://img.shields.io/bundlephobia/min/@coheia/simple-http-service?color=1bbfc1)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@coheia/simple-http-service?color=1bbfc1)
![npm](https://img.shields.io/npm/dt/@coheia/simple-http-service?color=6d9c29)

The SimpleHttpService class provides a simple way to make HTTP requests using the fetch API. The class supports GET, POST, PUT, PATCH, and DELETE methods and returns the response in JSON format, already typed. The class can also be extended to add authentication or other customizations and each method can have its behavior changed at the time of use through the `requestInit`.

And if you only need the most used methods and not a lot of things you won't use...

![image](https://user-images.githubusercontent.com/81380764/218327047-e83b2aa1-9ff7-4a76-9661-95c52b425a2f.png)

## **Table of Contents**
  - [**Installation**](#installation)
  - [**Import**](#import)
  - [**Usage**](#usage)
  - [**Configuration object**](#configuration-object)
  - [**Override handleHeaders - JWT Example**](#override-handleheaders---jwt-example)
  - [**Manage CRUD API - "Projects" example**](#manage-crud-api---projects-example)
  - [**Same domain API**](#same-domain-api)
  - [**Contributing**](#contributing)
  - [**License**](#license)

### **Installation**

```console
$ npm install @coheia/simple-http-service
```

### **Import**

Import the SimpleHttpService class and its related types as follow:

```typescript
import SimpleHttpService, { Headers, SimpleConfigs } from '@coheia/simple-http-service'
```

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

### **Configuration object**

`SimpleConfigs` type defines the configuration object (optional) received in the SimpleHttpService class's constructor.

```typescript
import { SimpleConfigs } from '@coheia/simple-http-service';

export const httpServiceConfig: SimpleConfigs = {
  baseUrl: 'http://localhost:3001', // don't add for same domain
  baseEndpoint: 'api/v1' // prefixed in every method's endpoint param
}
```

### **Override handleHeaders - JWT Example**

If you need to add authentication, you can extend the SimpleHttpService class and override the handleHeaders method.

> `'Content-Type': 'application/json'` is default in SimpleHttpService, if override handleHeaders remember to reset it, or not if you preferer other type 👏

```typescript
import SimpleHttpService, { Headers, SimpleConfigs} from '@coheia/simple-http-service'

// Create a subclass called ProtectedService that extends SimpleHttpService.
class ProtectedService extends SimpleHttpService {
  private readonly token: string

  // The constructor sets the token and calls the parent class's constructor with the config param.
  constructor(token: string, config?: SimpleConfigs) {
    super(config)
    this.token = token
  }

  protected override handleHeaders(headers: Headers): Headers {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      ...headers
    }
  }
}

export const TOKEN = 'your_token'
export const apiProtected = new ProtectedService(TOKEN)
```

### **Manage CRUD API - "Projects" example**

The following code manages a CRUD API by creating a ProjectService class that extends a ProtectedService (the JWT example). The code removes the authorization header when the request does not require authentication, which is the case for the `getProjects` and `getProject` methods. The code also includes methods for creating, updating, and deleting projects, which make use of the ProtectedService's `post`, `put`, and `delete` methods.

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

### **Same domain API**

If you are using the same domain for both the API and the client, you can omit the configuration object completely, or individually `baseUrl` and `baseEndpoint` like this:

```typescript
import SimpleHttpService from '@coheia/simple-http-service';

//for same domain api without baseEndpoint
const http = new SimpleHttpService();
const project = await http.get<ProjectType>('/project/10');
// GET - CLIENT_DOMAIN/project/10
```

```typescript
// and for same domain api with baseEndpoint as api version
const http = new SimpleHttpService({ baseEndpoint: 'api/v3' });
const project = await http.get<ProjectType>('/project/10');
// GET - CLIENT_DOMAIN/api/v3/project/10
```

### **Contributing**

Your contributions are always welcome! Submit a pull request with your changes or create an issue to discuss anything.

### **License**

This package is licensed under the MIT License.
