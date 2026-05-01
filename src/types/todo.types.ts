export type Todo = {
  _id?: string
  id?: string
  title: string
  description?: string
  isCompleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export type TodoPayload = {
  title: string
  description?: string
}

export type ApiResponse<T> = {
  statusCode: number
  success: boolean
  message: string
  data?: T
}
