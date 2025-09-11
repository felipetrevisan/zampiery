export type Teams = {
  teams: Team[]
}

export type Team = {
  id: string
  name: string
  country: string
  continent: string
  logo?: string
}
