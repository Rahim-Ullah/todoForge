import { api } from "./axios"
import type { ApiResponse, Todo, TodoPayload } from "../types/todo.types"

const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : undefined
}

export const fetchTodos = async () => {
  const response = await api.get<ApiResponse<Todo[] | { todos: Todo[] }>>(
    "/todos",
    {
      headers: getAuthHeaders(),
    }
  )

  return response.data
}

export const createTodo = async (payload: TodoPayload) => {
  const response = await api.post<ApiResponse<Todo | { todo: Todo }>>(
    "/todos",
    payload,
    {
      headers: getAuthHeaders(),
    }
  )

  return response.data
}

export const updateTodo = async (id: string, payload: TodoPayload) => {
  const response = await api.patch<ApiResponse<Todo | { todo: Todo }>>(
    `/todos/${id}`,
    payload,
    {
      headers: getAuthHeaders(),
    }
  )

  return response.data
}

export const deleteTodo = async (id: string) => {
  const response = await api.delete<ApiResponse<null>>(`/todos/${id}`, {
    headers: getAuthHeaders(),
  })

  return response.data
}
