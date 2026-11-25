import axios from 'axios'

const api = 'https://to-dos-api.softclub.tj/'

export interface Todo {
  id: number | string
  name: string
  description?: string
  isCompleted?: boolean
}

export interface TodoResponse {
  data: Todo[]
}

export const getTodo = async (query = ''): Promise<TodoResponse> => {
  const { data } = await axios.get<TodoResponse>(`${api}api/to-dos`, {
    params: { query: query || undefined },
  })
  return data
}

export const deleteTodo = async (id: Todo['id']): Promise<void> => {
  await axios.delete(`${api}api/to-dos`, { params: { id } })
}

export const addTodo = async (name: string): Promise<void> => {
  const formData = new FormData()
  formData.append('Name', name)
  formData.append('Description', name)
  formData.append('Images', new Blob([], { type: 'application/octet-stream' }), 'todo.txt')
  await axios.post(`${api}api/to-dos`, formData)
}

export const updateTodo = async (
  id: Todo['id'],
  name: string,
  description = name,
): Promise<void> => {
  await axios.put(`${api}api/to-dos`, {
    id: Number(id),
    name,
    description,
  })
}

export const toggleTodoCompleted = async (id: Todo['id']): Promise<void> => {
  await axios.put(`${api}completed`, null, { params: { id } })
}
