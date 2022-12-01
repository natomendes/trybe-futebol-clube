export interface HttpRequest {
  headers: any
  params: any
  body: any
  query: any
}

export interface HttpResponse {
  statusCode: number
  body: any
}

export interface AddMatchReqBody {
  homeTeam?: number
  awayTeam?: number
  homeTeamGoals?: number
  awayTeamGoals?: number
}
