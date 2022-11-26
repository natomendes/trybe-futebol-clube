import Match from '../../database/models/Match';

export interface FindMatches {
  find(): Promise<Match[]>
}
