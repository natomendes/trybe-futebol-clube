export const matchMock = {
  "id": 1,
  "homeTeam": 16,
  "homeTeamGoals": 1,
  "awayTeam": 8,
  "awayTeamGoals": 1,
  "inProgress": false,
  "teamHome": {
    "teamName": "São Paulo"
  },
  "teamAway": {
    "teamName": "Grêmio"
  }
}

export const allMatchesMock = [
  {
    "id": 1,
    "homeTeam": 16,
    "homeTeamGoals": 1,
    "awayTeam": 8,
    "awayTeamGoals": 1,
    "inProgress": false,
    "teamHome": {
      "teamName": "São Paulo"
    },
    "teamAway": {
      "teamName": "Grêmio"
    }
  },
  {
    "id": 41,
    "homeTeam": 16,
    "homeTeamGoals": 2,
    "awayTeam": 9,
    "awayTeamGoals": 0,
    "inProgress": true,
    "teamHome": {
      "teamName": "São Paulo"
    },
    "teamAway": {
      "teamName": "Internacional"
    }
  }
];

export const matchesInProgressMock = [{
  "id": 41,
  "homeTeam": 16,
  "homeTeamGoals": 2,
  "awayTeam": 9,
  "awayTeamGoals": 0,
  "inProgress": true,
  "teamHome": {
    "teamName": "São Paulo"
  },
  "teamAway": {
    "teamName": "Internacional"
  }
}];

export const matchesNotInProgress = [
  {
    "id": 1,
    "homeTeam": 16,
    "homeTeamGoals": 1,
    "awayTeam": 8,
    "awayTeamGoals": 1,
    "inProgress": false,
    "teamHome": {
      "teamName": "São Paulo"
    },
    "teamAway": {
      "teamName": "Grêmio"
    }
  }];

export const invalidTokenHttpRequest = {
  headers: { 
    authorization: 'invalid_token'
  },
  body: {
    homeTeam: 16,
    awayTeam: 8,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
  }
};

export const missingTokenHttpRequest = {
  headers: {},
  body: {
    homeTeam: 16,
    awayTeam: 8,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
  }
};

export const missingHomeTeamParamHttpRequest = {
  headers: { 
    authorization: 'valid_token'
  },
  body: {
    awayTeam: 8,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
  }
};

export const missingAwayTeamParamHttpRequest = {
  headers: { 
    authorization: 'valid_token'
  },
  body: {
    homeTeam: 8,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
  }
};

export const missingHomeTeamGoalsParamHttpRequest = {
  headers: { 
    authorization: 'valid_token'
  },
  body: {
    homeTeam: 16,
    awayTeam: 8,
    awayTeamGoals: 2,
  }
};

export const missingAwayTeamGoalsParamHttpRequest = {
  headers: { 
    authorization: 'valid_token'
  },
  body: {
    homeTeam: 16,
    awayTeam: 8,
    homeTeamGoals: 2,
  }
};