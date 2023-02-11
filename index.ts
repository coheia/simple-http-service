import { removeAuthorizationHeader } from './src/Utils.js'
import SimpleHttpService, {
  BodyReq,
  Endpoint,
  Headers,
  SimpleConfigs
} from './src/SimpleHttpService.js'

export {
  SimpleHttpService as default,
  BodyReq,
  Endpoint,
  Headers,
  SimpleConfigs,
  removeAuthorizationHeader
}
