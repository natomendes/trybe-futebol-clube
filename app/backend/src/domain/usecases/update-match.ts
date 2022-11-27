export interface UpdateMatchModel {
  id: string
  homeTeamGoals: string
  awayTeamGoals: string
}

export interface UpdateMatch {
  update(updateMatchData: UpdateMatchModel): Promise<number>
}
