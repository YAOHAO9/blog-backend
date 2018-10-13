"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
class MatchResult {
    constructor(teamName) {
        this.MP = 0;
        this.W = 0;
        this.D = 0;
        this.L = 0;
        this.P = 0;
        this.Team = teamName;
    }
}
const matchReuslts = {};
const closeInput = () => {
    let matchResultList = Object.values(matchReuslts);
    matchResultList.forEach((matchReuslt) => {
        matchReuslt.P = matchReuslt.W * 3 + matchReuslt.D * 1;
    });
    matchResultList = matchResultList.sort((a, b) => {
        if (b.P === a.P) {
            return a.Team > b.Team ? 1 : -1;
        }
        return b.P - a.P;
    });
    console.log('Team', ' | ', 'MP', ' | ', 'W', ' | ', 'D', ' | ', 'L', ' | ', 'P');
    matchResultList.forEach((matchResult) => {
        // tslint:disable-next-line:max-line-length
        console.log(matchResult.Team, ' | ', matchResult.MP, ' | ', matchResult.W, ' | ', matchResult.D, ' | ', matchResult.L, ' | ', matchResult.P);
    });
};
console.log('Please input data:');
rl.on('line', (line) => {
    if (!line || !line.match(/;/g) || line.match(/;/g).length !== 2) {
        rl.close();
        closeInput();
        return;
    }
    const [teamName1, teamName2, result] = line.split(';');
    if (!(['win', 'draw', 'loss'].includes(result))) {
        rl.close();
        closeInput();
        return;
    }
    if (!matchReuslts[teamName1]) {
        matchReuslts[teamName1] = new MatchResult(teamName1);
    }
    if (!matchReuslts[teamName2]) {
        matchReuslts[teamName2] = new MatchResult(teamName2);
    }
    const team1 = matchReuslts[teamName1];
    const team2 = matchReuslts[teamName2];
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
    }
    team1.MP++;
    team2.MP++;
});
//# sourceMappingURL=question1.js.map