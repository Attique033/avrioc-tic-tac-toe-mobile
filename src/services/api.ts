import axios, {AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import {
  GameSession,
  GameState,
  GameStats,
  GameStatus,
  LoginUserRequest,
  MakeMoveRequest,
  RegisterUserRequest,
  UserSession,
} from '../types';
import {config as envConfig} from '../config';
import {getSessionToken} from '../utils/storage/Auth';

const api = axios.create({
  baseURL: envConfig.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getSessionToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (params: LoginUserRequest): Promise<UserSession> => {
    const response = await api.post<UserSession>('/auth/login', params);
    console.error('login res', response)
    return response.data;
  },

  register: async (params: RegisterUserRequest): Promise<UserSession> => {
    const response = await api.post<UserSession>('/auth/register', params);
    console.error('register res', response)
    return response.data;
  },
};

export const gameService = {
  createGameSession: async (playerStarts: boolean = true) => {
    const response: AxiosResponse<GameSession> = await api.post(
      '/game/create_game_session',
      {
        startWithPlayer: playerStarts,
      },
    );
    return response.data;
  },

  makeMove: async (payload: MakeMoveRequest) => {
    const response: AxiosResponse<{status: GameStatus}> = await api.post(
      '/game/player_move',
        payload,
    );
    return response.data;
  },

  pcMove: async (payload: MakeMoveRequest) => {
    const response = await api.post<{gameState: GameState}>(
        '/game/pc_move',
        payload
    );
    return response.data;
  },

  getGameState: async (sessionId: string) => {
    const response: AxiosResponse<GameSession> = await api.get('/game', {
      params: {sessionId},
    });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<{stats: GameStats}>('/game/stats');
    return response.data;
  },

  resetGame: async () => {
    const response = await api.post<{gameState: GameState; sessionId: string}>(
      '/game/create_game_session',
      {
        startWithPlayer: true,
      },
    );
    return response.data;
  },
};
