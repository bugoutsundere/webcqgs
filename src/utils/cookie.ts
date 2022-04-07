import Cookies from 'js-cookie'

export function get(TOKEN_KEY: string): string | undefined {
  return Cookies.get(TOKEN_KEY)
}

export function set(TOKEN_KEY: string, token: string | undefined): void {
  token && Cookies.set(TOKEN_KEY, token as string)
}

export function remove(TOKEN_KEY: string): void {
  Cookies.remove(TOKEN_KEY)
}
