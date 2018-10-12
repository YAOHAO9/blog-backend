import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
class MatchResult {
  constructor(teamName: string) {
    this.Team = teamName;
  }
  public Team: string;
  public MP: number = 0;
  public W: number = 0;
  public D: number = 0;
  public L: number = 0;
  public P: number = 0;
}

const matchReuslts = {};
const closeInput = () => {
  let matchResultList: MatchResult[] = Object.values(matchReuslts);
  matchResultList.forEach((matchReuslt) => {
    matchReuslt.P = matchReuslt.W * 3 + matchReuslt.D * 1;
  });
  matchResultList = matchResultList.sort((a, b) => {
    if (b.P === a.P) {
      return a.Team > b.Team ? 1 : -1;
    }
    return b.P - a.P;
  });
  console.dir(matchResultList);
};
console.log('Please input data:');

rl.on('line', (line: string) => {
  if (!line || (line.match(/;/g) && line.match(/;/g).length !== 2)) {
    rl.close();
    closeInput();
    return;
  }
  const [teamName1, teamName2, result] = line.split(';');
  if (!matchReuslts[teamName1]) {
    matchReuslts[teamName1] = new MatchResult(teamName1);
  }
  if (!matchReuslts[teamName2]) {
    matchReuslts[teamName2] = new MatchResult(teamName2);
  }
  const team1: MatchResult = matchReuslts[teamName1];
  const team2: MatchResult = matchReuslts[teamName2];
  switch (result) {
    case 'win':
      team1.W++;
      team2.L++;
      break;
    case 'draw':
      team1.D++;
      team2.D++;
      break;
    case 'loss':
      team1.L++;
      team2.W++;
      break;
    default:
      closeInput();
      break;
  }
  team1.MP++;
  team2.MP++;
});
