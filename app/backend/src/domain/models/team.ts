import Match from '../../database/models/Match';

export interface TeamModel {
  id?: number
  teamName: string
  teamHome: Match[]
  teamAway: Match[]
}
