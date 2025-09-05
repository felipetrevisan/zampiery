export type PaginatedPlayers = {
  data: Player[]
  total: number
  page: number
  pageSize: number
  nextOffset: number
  hasNextPage: boolean
}

export type Player = {
  id: string
  name: string
  favoritePosition?: string
  favoriteTeam?: string
}

export enum PlayerPosition {
  GK = "GK",
  RB = "RB",
  LB = "LB",
  CB = "CB",
  CDM = "CDM",
  CM = "CM",
  CAM = "CAM",
  RM = "RM",
  LM = "LM",
  RW = "RW",
  LW = "LW",
  ST = "ST"
}

export const PlayerPositionLabels: Record<PlayerPosition, string> = {
  [PlayerPosition.GK]: "Goleiro",
  [PlayerPosition.RB]: "Lateral Direito",
  [PlayerPosition.LB]: "Lateral Esquerdo",
  [PlayerPosition.CB]: "Zagueiro Central",
  [PlayerPosition.CDM]: "Volante",
  [PlayerPosition.CM]: "Meio-Campo Central",
  [PlayerPosition.CAM]: "Meia Ofensivo Central",
  [PlayerPosition.RM]: "Meio-Campo Direito",
  [PlayerPosition.LM]: "Meio-Campo Esquerdo",
  [PlayerPosition.RW]: "Ponta Direita",
  [PlayerPosition.LW]: "Ponta Esquerda",
  [PlayerPosition.ST]: "Atacante Central"
};
