export interface FinishMatchRepository {
  finish(id: string): Promise<number>
}
