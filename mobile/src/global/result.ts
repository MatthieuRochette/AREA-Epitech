export interface APIMessage { message: string };

export interface APISignUp {
  name: string,
  email: string,
  confirmed_account: boolean,
  token: string
}

export interface APILogin {
  name: string,
  email: string,
  confirmed_account: boolean,
  web_token: string,
  mobile_token: string
}

export interface APIAbout {
  client : Client
  server : Server
}

export interface Client {
  host: string
}

export interface Server {
  current_time: number,
  services: Service[]
} 

export interface Service {
  name: string,
  actions: Action[],
  reactions: Reaction[]
}

export interface Action {
  service?: string
  name: string,
  description?: string,
  params?: any
}

export interface Reaction extends Action {}

export interface APIJobs {
  jobs: Job[]
}

export interface Job {
  id: string,
  action: Action,
  reactions: Reaction[],
  user_email?: string,
  trigger: Trigger
}

export interface Trigger {
  _type: string,
  params: Parameters
}

export interface Parameters {
  year?: string,
  month?: string,
  days?: string,
  week?: string,
  day_of_week?: string,
  hours?: string,
  minutes?: string,
  seconds?: string,
  start_date?: string,
  end_date?: string,
  run_date?: string,
  timezone?: string,
  jitter?: string,
  hour?: string,
  minute?: string
}

export interface GithubUser {
  login: string,
  avatar_url: string
}

export interface TrelloUser {
  username?: string,
  avatarUrl?: string
}