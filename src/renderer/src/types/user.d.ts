interface IUser {
  id: string
  username: string
  email: string
  avatar: string | null
  role: string
  isActive: boolean
  failedLoginAttempts: number
  lockedUntil: Date | null
  masterPasswordHint: string | null
  twoFactorEnabled: boolean
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
}
