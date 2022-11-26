import Match from '../../database/models/Match';

export interface FindMatches {
  find(inProgress?: string): Promise<Match[]>
}
