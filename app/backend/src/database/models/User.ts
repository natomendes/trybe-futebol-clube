import { Model, DataTypes } from 'sequelize';
import db from '.';
import Match from './Match';

class User extends Model {
  // declare <campo>: <tipo>;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  // ... Outras configs
  underscored: true,
  sequelize: db,
  // modelName: 'example',
  tableName: 'users',
  timestamps: false,
});

/**
  * `Workaround` para aplicar as associations em TS:
  * Associations 1:N devem ficar em uma das instâncias de modelo
  * */

Match.belongsTo(User, { foreignKey: 'homeTeam', as: 'home_team' });
Match.belongsTo(User, { foreignKey: 'awayTeam', as: 'away_team' });

User.hasMany(Match, { foreignKey: 'homeTeam', as: 'home_team' });
User.hasMany(Match, { foreignKey: 'awayTeam', as: 'away_team' });

export default User;
