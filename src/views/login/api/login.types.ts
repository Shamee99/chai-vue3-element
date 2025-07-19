export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn?: number
}

export interface UserInfo {
  userId: number
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  roles: string[]
  permissions: string[]
  status: number
  createTime: string
  updateTime: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  token: string
  refreshToken: string
  expiresIn?: number
}
