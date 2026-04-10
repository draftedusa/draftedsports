export { nflTeams } from "./nfl";
export { nbaTeams } from "./nba";
export { collegeTeams } from "./college";

// Convenience: single flat array for consumers that don't need league filtering
import { nflTeams } from "./nfl";
import { nbaTeams } from "./nba";
import { collegeTeams } from "./college";

export const allTeams = [...nflTeams, ...nbaTeams, ...collegeTeams];
