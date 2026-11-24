import axios from 'axios'

const api = 'https://to-dos-api.softclub.tj/'

export interface Todo {
  id: number | string
  name: string
}

export interface TodoResponse {
  data: Todo[]
}

export const getTodo = async (): Promise<TodoResponse> => {
  const { data } = await axios.get<TodoResponse>(`${api}api/to-dos`)
  return data
}

export const deleteTodo = async (id: Todo['id']): Promise<void> => {
  await axios.delete(`${api}api/to-dos`, { params: { id } })
}
