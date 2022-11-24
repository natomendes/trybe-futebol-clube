import { Model, DataTypes } from 'sequelize';
import db from '.';
import Match from './Match';
// import OtherModel from './OtherModel';

class Team extends Model {
  // declare <campo>: <tipo>;
}

Team.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  // ... Outras configs
  underscored: true,
  sequelize: db,
  // modelName: 'example',
  tableName: 'teams',
  timestamps: false,
});

/**
  * `Workaround` para aplicar as associations em TS:
  * Associations 1:N devem ficar em uma das instâncias de modelo
  * */

// OtherModel.belongsTo(Example, { foreignKey: 'campoA', as: 'campoEstrangeiroA' });
// OtherModel.belongsTo(Example, { foreignKey: 'campoB', as: 'campoEstrangeiroB' });

// Example.hasMany(OtherModel, { foreignKey: 'campoC', as: 'campoEstrangeiroC' });
// Example.hasMany(OtherModel, { foreignKey: 'campoD', as: 'campoEstrangeiroD' });

Match.belongsTo(Team, { foreignKey: 'homeTeam', as: 'home_team' });
Match.belongsTo(Team, { foreignKey: 'awayTeam', as: 'away_team' });

Team.hasMany(Match, { foreignKey: 'homeTeam', as: 'home_team' });
Team.hasMany(Match, { foreignKey: 'awayTeam', as: 'away_team' });

export default Team;
