export interface Startup {
  id: string,
  name: string,
  amount: number
}

export interface User {
  id: string,
  name: string,
  email_id: string,
  amount: number
}

export interface AuthContextType {
  user: User | null,
  setUser: (user: User | null) => void,
  loading: boolean
}