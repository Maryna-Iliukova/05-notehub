import axios, {type AxiosResponse} from 'axios';
import type { Note } from '../types/note';

const API_URL = 'https://notehub-public.goit.study/api/notes';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: Note['tag'];
}

export interface CreateNoteResponse {
  result: Note;
}

export interface DeleteNoteResponse {
  message: string;
}
export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export const fetchNotes = async ({
  search,
  page,
  perPage,
}: FetchNotesParams): Promise<{ notes: Note[]; totalPages: number }> => {
  const params = {
    page,
    perPage,
    ...(search ? { search } : {}),
  };

  const response = await axiosInstance.get('/', { params });
  return response.data;
};


export const createNote = async (
  payload: CreateNotePayload
): Promise<Note> => {
  const response: AxiosResponse<{ result: Note }> = await axiosInstance.post('/', payload);
  return response.data.result;
};

export const deleteNote = async (
  id: number
): Promise<Note> => {
  const response: AxiosResponse<{ result: Note }> = await axiosInstance.delete(`/${id}`);
  return response.data.result;
};