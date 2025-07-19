import request from '@/utils/request.ts'
import type { LoginRequest, LoginResponse, UserInfo, RefreshTokenRequest, RefreshTokenResponse } from '@/views/login/api/login.types.ts'

/**
 * 用户登录
 */
export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  return request.post<LoginResponse>('/auth/login', data)
}

/**
 * 获取用户信息
 */
export const getUserInfoApi = async (): Promise<{ code: number; message: string; data: UserInfo }> => {
  return request.get<{ code: number; message: string; data: UserInfo }>('/auth/me')
}

/**
 * 刷新Token
 */
export const refreshTokenApi = async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  return request.post<RefreshTokenResponse>('/auth/refresh', data)
}

/**
 * 用户登出
 */
export const logoutApi = async (): Promise<{ code: number; message: string }> => {
  return request.post<{ code: number; message: string }>('/auth/logout')
}
