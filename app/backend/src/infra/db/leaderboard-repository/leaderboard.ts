import Match from '../../../database/models/Match';
import Team from '../../../database/models/Team';

interface Typpp {
  dataValues: Match
}

const getResult = async () => {
  const result = await Team.findAll({
    include: [{ model: Match, as: 'teamAway', where: { inProgress: false } }],
  });
  console.log('[');
  result.forEach(({ dataValues }) => {
    console.log('  {');
    console.log(`    id: ${dataValues.id},`);
    console.log(`    teamName: '${dataValues.teamName}',`);
    console.log('    teamAway: [');
    dataValues.teamAway.forEach(({ dataValues: data2 }: Typpp) => {
      console.log('        ', data2, ',');
    });
    console.log('    ],');
    console.log('  },');
  });
  console.log(']');
};

getResult();
