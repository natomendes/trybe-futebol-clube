import { UpdateMatchModel } from '../../domain/usecases';

export interface UpdateMatchRepository {
  update(updateMatchdata: UpdateMatchModel): Promise<number>
}
