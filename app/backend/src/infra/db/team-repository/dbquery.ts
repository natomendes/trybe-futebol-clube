// import * as P from './team-repository-protocols';

// const getMock = async () => {
//   const homeMatches = await P.Team.findAll({
//     include: [{ model: P.Match, as: 'teamAway', where: { inProgress: false } }],
//   });
//   console.log('[');
//   homeMatches.forEach((team) => {
//     console.log('{');
//     const { teamAway } = team as P.TeamModel;
//     console.log('teamName: ', `'${team.teamName}'`, ',');
//     console.log('teamAway: [');
//     if (teamAway) {
//       teamAway.forEach((match) => {
//         console.log(match.dataValues, ',');
//       });
//       console.log(']');
//     }
//     console.log('},');
//   });
//   console.log(']');
// };
// getMock();
