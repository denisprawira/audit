export interface IAuthResponse {
  username: string;
  roles: string[];
}

export interface ILoginParams {
  username: string;
  password: string;
}
