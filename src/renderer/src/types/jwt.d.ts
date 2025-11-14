import { JwtPayload as StandardJwtPayload } from 'jwt-decode'

export interface JwtPayload extends StandardJwtPayload {
  userId: number
  role: string
}
