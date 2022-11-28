import Match from '../../../database/models/Match';
import Team from '../../../database/models/Team';

const getResult = async () => {
  const result = await Team.findAll({
    include: [{ model: Match, as: 'teamHome' }],
  });

  console.log(result);
};

getResult();
