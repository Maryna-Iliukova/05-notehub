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


export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
}

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

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params = {
    page,
    perPage,
    ...(search ? { search } : {}),
  };
  const response: AxiosResponse<FetchNotesResponse> = await axiosInstance.get('/', { params });
  return response.data;
};

export const createNote = async (
  payload: CreateNotePayload
): Promise<CreateNoteResponse> => {
  const response: AxiosResponse<CreateNoteResponse> = await axiosInstance.post('/', payload);
  return response.data;
};

export const deleteNote = async (
  id: string
): Promise<DeleteNoteResponse> => {
  const response: AxiosResponse<DeleteNoteResponse> = await axiosInstance.delete(`/${id}`);
  return response.data;
};