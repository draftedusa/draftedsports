import { Article } from "@/types";

export const articles: Article[] = [
  {
    id: "art-001",
    title: "Rockets Recap: Sengun Dominates as Houston Stuns Lakers in Fourth Quarter",
    slug: "rockets-recap-sengun-dominates-lakers",
    byline: "Marcus Webb",
    publishDate: "2026-04-01",
    body: `Alperen Sengun put on a clinic Tuesday night, posting 34 points, 12 rebounds, and 6 assists as the Houston Rockets dismantled the Los Angeles Lakers 118-107 in a game that wasn't as close as the final score suggests.

The 22-year-old center was unguardable in the fourth quarter, scoring 14 of his points in the final frame while Anthony Davis struggled with foul trouble. "He's special," Lakers head coach JJ Redick said postgame. "We had no answer for him tonight."

Jalen Green added 24 points on 9-of-16 shooting, and the Rockets bench outscored the Lakers reserves 38-18. Houston has now won six of their last eight games, firmly planting themselves in the Western Conference playoff picture.

For the Lakers, LeBron James finished with 28 points and 9 assists, but the effort wasn't enough. The team shot just 41% from the field and committed 16 turnovers — a recipe for disaster against a Rockets team playing at full throttle.

This is the version of the Rockets that their fan base knew was possible. Sengun is becoming a franchise cornerstone, and with Jalen Green hitting his stride, Houston could make serious noise in April.`,
    teamIds: ["nba-rockets", "nba-lakers"],
    gameId: "game-001",
    tagIds: ["tag-nba", "tag-recap"],
    relatedArticleIds: ["art-003", "art-006"],
    views: 45200,
    readTime: 4,
  },
  {
    id: "art-002",
    title: "Chiefs Dynasty Watch: Kansas City Eyes Unprecedented Third Straight Super Bowl",
    slug: "chiefs-dynasty-third-straight-super-bowl",
    byline: "Dana Howell",
    publishDate: "2026-03-30",
    body: `Patrick Mahomes and the Kansas City Chiefs are doing something no team in NFL history has ever accomplished: positioning for a third consecutive Super Bowl championship. With a 21-17 lead over the Eagles heading into the fourth quarter, the Chiefs continue to flex their dominance in a league built on parity.

The formula remains the same: Mahomes extending plays, Travis Kelce (before his ankle scare) dominating underneath, and a defense that bends but rarely breaks. Andy Reid's offensive creativity continues to baffle coordinators league-wide.

"We don't talk about legacy or dynasty in the locker room," Mahomes said this week. "We talk about winning the next play, the next game." That focused mentality is precisely what separates Kansas City from the rest.

The Eagles are a legitimate threat — Jalen Hurts is playing the best football of his career — but the Chiefs have a knack for finding ways to win, especially in January and February. The football world is watching.`,
    teamIds: ["nfl-chiefs", "nfl-eagles"],
    gameId: "game-002",
    tagIds: ["tag-nfl", "tag-analysis"],
    relatedArticleIds: ["art-005", "art-007"],
    views: 31400,
    readTime: 3,
  },
  {
    id: "art-003",
    title: "Is Alperen Sengun the Next Great NBA Big Man?",
    slug: "alperen-sengun-next-great-nba-big",
    byline: "Priya Nair",
    publishDate: "2026-03-29",
    body: `The comparisons have started. Nikola Jokic. Domantas Sabonis. Names reserved for once-a-generation passing bigs who redefine the position. Alperen Sengun, at just 22, is forcing those conversations.

His combination of post footwork, pick-and-roll brilliance, and court vision is unprecedented for his age. He's averaging 28.4 points, 11.2 rebounds, and 7.1 assists per game in March — numbers that would be remarkable for any player, let alone a center.

What makes Sengun different isn't just the stats. It's the feel. He slows the game down, reads defenses two steps ahead, and manufactures points out of nothing. The Rockets are 18-5 when he posts a usage rate above 30%.

Draft analysts who pegged him as a lottery pick in 2021 look prescient. Those who questioned whether his game would translate to the NBA look foolish. Sengun isn't just translating — he's thriving, and Houston may have found the centerpiece of a dynasty in the making.`,
    teamIds: ["nba-rockets"],
    tagIds: ["tag-nba", "tag-analysis", "tag-mvp"],
    relatedArticleIds: ["art-001", "art-006"],
    views: 28100,
    readTime: 5,
  },
  {
    id: "art-004",
    title: "Lakers Debate: Is This the Last Dance for LeBron in Purple and Gold?",
    slug: "lakers-debate-lebron-last-dance",
    byline: "Trevor Banks",
    publishDate: "2026-03-28",
    body: `The whispers have grown louder. After Tuesday's loss to Houston, questions are swirling about LeBron James's future with the Los Angeles Lakers. At 41, the King is still producing — 28 points, 8 rebounds, and 8 assists per game — but the Lakers are 43-26 and struggling to find a consistent identity.

Sources close to the situation say LeBron has had internal conversations about his future, including the possibility of returning to Cleveland for a final chapter. Nothing is imminent, and the Lakers organization remains confident he'll re-sign. But the uncertainty alone is enough to shake Hollywood.

The bigger issue is roster construction. The Lakers haven't been able to pair LeBron with a true co-star since Anthony Davis's injury woes became chronic. Management has a critical summer ahead — get the pieces right, or risk watching the franchise icon walk.

Whatever happens, LeBron's legacy in Los Angeles is secure: two Finals appearances and one championship. But greatness is never satisfied, and LeBron James is still chasing more.`,
    teamIds: ["nba-lakers"],
    tagIds: ["tag-nba", "tag-analysis"],
    relatedArticleIds: ["art-001", "art-003"],
    views: 22900,
    readTime: 4,
  },
  {
    id: "art-005",
    title: "NFL Power Rankings: Chiefs Still #1, But Lions Are Coming",
    slug: "nfl-power-rankings-chiefs-lions",
    byline: "Carlos Mendez",
    publishDate: "2026-03-27",
    body: `Week 18 power rankings are here, and the Kansas City Chiefs remain atop the NFL for the 14th consecutive week. But the Detroit Lions are making a compelling case for the top spot heading into the postseason.

**1. Kansas City Chiefs (14-3)** — Mahomes is Mahomes. Need we say more?
**2. Philadelphia Eagles (13-4)** — Jalen Hurts is an MVP candidate. Defense is elite.
**3. Detroit Lions (11-6)** — Dan Campbell's squad is battle-tested and dangerous.
**4. Baltimore Ravens (11-6)** — Lamar Jackson quietly having another MVP-caliber season.
**5. San Francisco 49ers (12-5)** — The offense is clicking. Watch out for the playoffs.

The biggest movers this week: the Buffalo Bills drop two spots after a shaky performance on the road, while the Green Bay Packers climb three after their dominant win over the Vikings. Jordan Love is maturing fast.

The NFC is historically strong this year. Don't sleep on the Lions.`,
    teamIds: ["nfl-chiefs", "nfl-lions", "nfl-eagles", "nfl-ravens"],
    tagIds: ["tag-nfl", "tag-rankings"],
    relatedArticleIds: ["art-002", "art-007"],
    views: 19300,
    readTime: 3,
  },
  {
    id: "art-006",
    title: "Rockets vs. Thunder Preview: Battle for Western Conference Positioning",
    slug: "rockets-thunder-preview-western-conference",
    byline: "Priya Nair",
    publishDate: "2026-03-27",
    body: `When the Houston Rockets host the Oklahoma City Thunder on April 28, it's not just a regular season game — it's a battle for seeding that could determine home court advantage deep into the playoffs.

The Rockets (40-29) are riding a six-game winning streak. The Thunder (52-17) have been the best team in the Western Conference all season, led by Shai Gilgeous-Alexander's ridiculous scoring. But Houston has been here before — they beat OKC just last week, 112-108, in a game that announced Sengun as a legitimate MVP contender.

Match-ups to watch:
- **Sengun vs. Holmgren**: Two elite young bigs who play completely different styles.
- **Jalen Green vs. Luguentz Dort**: Green's speed vs. Dort's physicality.
- **Bench depth**: Houston's second unit has been their secret weapon.

Prediction: Rockets win in a close one, 109-106. Sengun 30+. Sengun always goes for 30+ against the Thunder.`,
    teamIds: ["nba-rockets", "nba-thunder"],
    gameId: "game-019",
    tagIds: ["tag-nba", "tag-preview"],
    relatedArticleIds: ["art-001", "art-003"],
    views: 16800,
    readTime: 3,
  },
  {
    id: "art-007",
    title: "Jalen Hurts is Playing His Best Football — But Can He Carry Eagles Past Chiefs?",
    slug: "jalen-hurts-eagles-best-football",
    byline: "Dana Howell",
    publishDate: "2026-03-26",
    body: `Jalen Hurts has silenced every critic. The quarterback once questioned for his passing ability is completing 68% of his throws, has 29 touchdowns to just 6 interceptions, and is the most valuable dual-threat player in the NFL not named Lamar Jackson.

But questions linger: can he beat Patrick Mahomes when it matters most? The Eagles are 1-2 in their last three games against Kansas City, including a painful Super Bowl loss two seasons ago. Hurts himself acknowledges the weight of that history.

"I use it as fuel," Hurts said after practice. "Every time I step on the field, I'm trying to get better so moments like that don't happen again."

The Eagles have built around their quarterback correctly: elite offensive line, DeVonta Smith and A.J. Brown as receiver weapons, and a defense that can take over games. If Philadelphia is going to end the Chiefs dynasty, Jalen Hurts has to be the reason why.`,
    teamIds: ["nfl-eagles", "nfl-chiefs"],
    tagIds: ["tag-nfl", "tag-analysis"],
    relatedArticleIds: ["art-002", "art-005"],
    views: 14500,
    readTime: 4,
  },
  {
    id: "art-008",
    title: "Dodgers-Yankees Spring Classic: Baseball's Greatest Rivalry Is Back",
    slug: "dodgers-yankees-spring-classic",
    byline: "Gina Torres",
    publishDate: "2026-03-30",
    body: `Los Angeles defeated New York 5-3 in what felt like a preview of October baseball — crisp pitching, timely hitting, and a sold-out crowd hanging on every pitch. The Dodgers improved to 98-64, while the Yankees dropped to 94-68.

Shohei Ohtani was Shohei Ohtani: 2-for-3, a home run, and 6 innings of two-run ball. Juan Soto went deep for New York in a losing effort. Both stars are already having legendary seasons.

The real story? Starting pitching. Both teams have built rotations capable of deep playoff runs, and when they meet in October — and they will meet in October — the series will be decided by who blinks first on the mound.

Baseball is back in a big way, and these two franchises are leading the charge.`,
    teamIds: ["mlb-dodgers", "mlb-yankees"],
    gameId: "game-006",
    tagIds: ["tag-mlb", "tag-recap"],
    relatedArticleIds: [],
    views: 12100,
    readTime: 3,
  },
  {
    id: "art-009",
    title: "Celtics-Thunder: The NBA Finals Preview Nobody Asked For But Everyone Wants",
    slug: "celtics-thunder-nba-finals-preview",
    byline: "Marcus Webb",
    publishDate: "2026-03-31",
    body: `Boston's 114-109 win over Oklahoma City wasn't just a regular season result — it was a statement. Jayson Tatum erupted for 38 points, Jaylen Brown added 26, and the Celtics held Shai Gilgeous-Alexander to 24 points on 35% shooting.

If the NBA Finals were played today, this would be the matchup. Two superteam-less rosters built through the draft, patience, and brilliant front office decisions. Two coaches (Joe Mazzulla and Mark Daigneault) who've gotten the most out of their talent.

The Celtics are 54-15. The Thunder are 52-17. The gap is real, but small. And in a seven-game series, anything can happen.

"We want to play them again," Thunder guard SGA said. "We know what we're capable of." Boston, meanwhile, is quietly hunting for a repeat. Both teams look like legitimate champions.`,
    teamIds: ["nba-celtics", "nba-thunder"],
    gameId: "game-004",
    tagIds: ["tag-nba", "tag-analysis", "tag-playoffs"],
    relatedArticleIds: ["art-003", "art-006"],
    views: 18700,
    readTime: 4,
  },
  {
    id: "art-010",
    title: "MacKinnon vs. Pastrnak: The NHL MVP Race Is Coming Down to the Wire",
    slug: "mackinnon-pastrnak-nhl-mvp-race",
    byline: "Alexei Volkov",
    publishDate: "2026-03-31",
    body: `With six weeks left in the regular season, the Hart Trophy race has two clear frontrunners: Nathan MacKinnon of the Colorado Avalanche and David Pastrnak of the Boston Bruins. Both are having historic seasons. Both have carried their teams through adversity. Only one can win.

MacKinnon: 52 goals, 71 assists, +38 rating. He's a force of nature every single shift.
Pastrnak: 47 goals, 64 assists, +29 rating. His goal-scoring touch this season has been supernatural.

The Bruins-Avalanche game tonight is the most anticipated regular season clash in the NHL this year, and both players delivered. MacKinnon's go-ahead goal in the third period showcased his elite puck skills. Pastrnak's power play tally drew the comparison side-by-side.

Voters will decide in June. The hockey world is divided. This writer's edge: MacKinnon, by a hair.`,
    teamIds: ["nhl-bruins", "nhl-avalanche"],
    gameId: "game-003",
    tagIds: ["tag-nhl", "tag-mvp", "tag-analysis"],
    relatedArticleIds: [],
    views: 10400,
    readTime: 4,
  },
];

// ── Additional articles (art-011 through art-020) ──────────────

export const additionalArticles: Article[] = [
  {
    id: "art-011",
    title: "Bills vs Cowboys Recap: Buffalo Wins 35-28 in a Wild Fourth Quarter",
    slug: "bills-cowboys-recap-wild-fourth-quarter",
    byline: "Carlos Mendez",
    publishDate: "2026-03-29",
    body: `The Buffalo Bills escaped Dallas with a 35-28 victory in one of the most entertaining games of the NFL season. Josh Allen threw for 312 yards and three touchdowns, and ran for one more, as the Bills overcame a 28-21 fourth-quarter deficit.\n\nDak Prescott led the Cowboys on a furious comeback attempt, finishing with 387 passing yards and four touchdowns, but a late interception sealed the game for Buffalo. The Cowboys' defensive secondary, ravaged by injuries, simply had no answer for Stefon Diggs and Dalton Kincaid.\n\nFor Buffalo, the win keeps their playoff seeding in play. Josh Allen continues to be the most complete quarterback in football, his dual-threat ability creating matchup nightmares for every defense he faces.\n\nDallas falls to 12-5 and will need help to secure a top seed in the NFC. Sean Payton's offense is dynamic, but the defense remains the Achilles' heel of this otherwise championship-caliber team.`,
    teamIds: ["nfl-bills", "nfl-cowboys"],
    gameId: "game-020",
    tagIds: ["tag-nfl", "tag-recap"],
    relatedArticleIds: ["art-005", "art-002"],
    views: 11200,
    readTime: 3,
  },
  {
    id: "art-012",
    title: "Warriors-Heat: Golden State Wins 121-118 in Overtime Thriller",
    slug: "warriors-heat-overtime-thriller",
    byline: "Priya Nair",
    publishDate: "2026-03-29",
    body: `Stephen Curry hit a step-back three-pointer with 0.4 seconds left in overtime to lift the Golden State Warriors past the Miami Heat 121-118 in a game that had the Chase Center crowd in a frenzy.\n\nCurry finished with 44 points on 15-of-28 shooting, including 8-of-16 from three. Jimmy Butler countered with 39 points for Miami, a performance that would have won in almost any other game.\n\nThe Warriors are 38-31 and still chasing a playoff spot in the loaded Western Conference. The Heat fall to 36-33, sitting precariously in play-in territory. Both teams enter the final stretch of the season with everything on the line.\n\n"Steph is different," Heat coach Erik Spoelstra said simply after the game. "There's nothing more you can say. When he gets going, there's no answer."`,
    teamIds: ["nba-warriors", "nba-heat"],
    gameId: "game-008",
    tagIds: ["tag-nba", "tag-recap"],
    relatedArticleIds: ["art-001", "art-009"],
    views: 9800,
    readTime: 3,
  },
  {
    id: "art-013",
    title: "Saquon Barkley's Historic Season: Breaking Down the Numbers",
    slug: "saquon-barkley-historic-season-breakdown",
    byline: "Dana Howell",
    publishDate: "2026-03-28",
    body: `Saquon Barkley is having the greatest rushing season in Philadelphia Eagles history and one of the best in modern NFL history. His 2,005 rushing yards — with three games remaining in the regular season — places him in elite company.\n\nOnly Eric Dickerson (2,105 yards in 1984) and Adrian Peterson (2,097 yards in 2012) have finished a season with more rushing yards in the Super Bowl era. Barkley, 29, has defied the conventional wisdom that running backs decline after their mid-20s.\n\nThe key to his success? The Eagles' offensive line, which ranks second in the NFL in run-blocking grade, and Barkley's own vision and physicality. He averages 4.8 yards after contact per carry — a number that would be extraordinary for a player half his age.\n\nBarely has 13 touchdowns and is averaging 5.8 yards per carry. If he reaches 2,100 yards, he'll have broken one of football's most enduring records. Watch this space.`,
    teamIds: ["nfl-eagles"],
    tagIds: ["tag-nfl", "tag-analysis", "tag-records", "tag-stats"],
    relatedArticleIds: ["art-007", "art-002"],
    views: 15600,
    readTime: 4,
  },
  {
    id: "art-014",
    title: "Aaron Judge is Having the Greatest Season in Yankees History",
    slug: "aaron-judge-greatest-yankees-season",
    byline: "Gina Torres",
    publishDate: "2026-03-27",
    body: `At 58 home runs with two weeks remaining in the regular season, Aaron Judge is on pace to shatter his own American League record of 62 set in 2022. His 2026 season, quietly, may be the greatest in New York Yankees history.\n\nJudge is hitting .322 with 58 homers, 144 RBI, and an OPS of 1.159. For context, Babe Ruth's legendary 1927 season produced a 1.258 OPS. Judge isn't quite Ruth, but he's in the conversation for the most dominant offensive season of the modern era.\n\nThe Yankees' postseason chances hinge on Judge. When he's locked in — and he has been for three straight months — New York is virtually unbeatable. The lineup behind him is formidable, but Judge is the engine.\n\nFans in the Bronx are dreaming of October. With Judge leading the way, they have every reason to.`,
    teamIds: ["mlb-yankees"],
    tagIds: ["tag-mlb", "tag-analysis", "tag-records", "tag-mvp"],
    relatedArticleIds: ["art-008"],
    views: 14100,
    readTime: 4,
  },
  {
    id: "art-015",
    title: "2026 NBA Draft Big Board: Top 10 Prospects You Need to Know",
    slug: "2026-nba-draft-big-board-top-10",
    byline: "Marcus Webb",
    publishDate: "2026-03-26",
    body: `The 2026 NBA Draft class is shaping up to be one of the deepest in recent memory, headlined by a pair of once-in-a-generation wing prospects. Here's our updated big board ahead of the April lottery.\n\n**1. Victor Ewuansiokpe, PF — Duke** — The most physically gifted prospect since Zion Williamson. 6'9", 245 pounds of pure athleticism, with a developing three-point shot that makes him a true franchise cornerstone.\n\n**2. Amara Diallo, PG — Kentucky** — The consensus second pick, Diallo has the playmaking vision and defensive intensity of a future All-Star. His floor vision at age 18 is genuinely startling.\n\n**3. Matteo Conti, SF — International (Bologna)** — The European wildcard. An elite shooter (42% from three in the EuroLeague) who projects as an immediate 3-and-D starter.\n\n**4-10**: Ja'Marcus Hill (Kansas), Devon Osei (Memphis), Kofi Mensah (Italy), Luka Perović (Serbia), Marcus Caldwell (Michigan), Tariq Johnson (Arizona), Cole Ashby (Tennessee).\n\nThe lottery order will be set in mid-May. Teams like the Pistons, Wizards, and Trail Blazers are poised to select in the top five.`,
    teamIds: [],
    tagIds: ["tag-nba", "tag-draft", "tag-rookies"],
    relatedArticleIds: ["art-003"],
    views: 22300,
    readTime: 5,
  },
  {
    id: "art-016",
    title: "Celtics Defense Is Historic: The Numbers Behind Boston's Dominance",
    slug: "celtics-defense-historic-numbers",
    byline: "Priya Nair",
    publishDate: "2026-03-25",
    body: `The Boston Celtics are allowing 104.1 points per 100 possessions this season — the best defensive rating in the NBA since the San Antonio Spurs' 2003-04 championship team. This defense isn't just good. It's historically great.\n\nJaylen Brown and Jrue Holiday form the most suffocating perimeter duo in the league. Al Horford, at 39, continues to be the backbone of the interior. And head coach Joe Mazzulla has deployed a switching scheme that has opposing offenses completely flummoxed.\n\nThe Celtics are 54-15. Their point differential of +11.2 is the best in the NBA, and it's not particularly close. When they're locked in defensively, they're virtually unstoppable.\n\nThe question for Boston is whether they can sustain this into the playoffs, where pace slows and individual brilliance matters more. Based on the evidence so far, the answer is emphatically yes.`,
    teamIds: ["nba-celtics"],
    tagIds: ["tag-nba", "tag-analysis", "tag-stats"],
    relatedArticleIds: ["art-009", "art-003"],
    views: 12800,
    readTime: 4,
  },
  {
    id: "art-017",
    title: "NHL Power Rankings: Bruins Lead the Pack as Playoffs Loom",
    slug: "nhl-power-rankings-bruins-lead",
    byline: "Alexei Volkov",
    publishDate: "2026-03-24",
    body: `With four weeks left in the regular season, the NHL playoff picture is taking shape. Here are this week's power rankings.\n\n**1. Boston Bruins (52-18-8)** — MacKinnon vs. Pastrnak for MVP is the story of the season, but Boston has the best record in hockey. Their penalty kill is operating at 89% efficiency.\n\n**2. Colorado Avalanche (50-22-6)** — MacKinnon is otherworldly. If healthy, Colorado is the team nobody wants to face in a seven-game series.\n\n**3. New York Rangers (48-24-6)** — Igor Shesterkin has been the best goaltender in hockey. The Rangers live and die by his brilliance.\n\n**4. Tampa Bay Lightning (46-26-6)** — Never count out Cooper's squad. This team has a playoff DNA unlike any franchise in the modern era.\n\n**5. Edmonton Oilers (44-28-6)** — McDavid and Draisaitl are the most dangerous offensive duo in the game. If the goaltending holds, watch out.\n\nThe wild card race is historically tight. Expect drama until the final weekend of the regular season.`,
    teamIds: ["nhl-bruins", "nhl-avalanche", "nhl-rangers"],
    tagIds: ["tag-nhl", "tag-rankings", "tag-playoffs"],
    relatedArticleIds: ["art-010"],
    views: 8900,
    readTime: 3,
  },
  {
    id: "art-018",
    title: "Fantasy Baseball Sleepers: 10 Players to Target Before the Playoffs",
    slug: "fantasy-baseball-sleepers-playoffs",
    byline: "Carlos Mendez",
    publishDate: "2026-03-23",
    body: `Fantasy baseball playoffs are right around the corner, and the waiver wire is your last chance to make a move. Here are ten players who are available in most leagues and could win you a championship.\n\n**1. Jorge Mateo, SS (Orioles)** — Batting .289 in his last 30 games with 6 stolen bases. His speed alone makes him a must-add in leagues that track steals.\n\n**2. Ryan Walker, RP (Giants)** — Quietly saving 4 of his last 5 opportunities with a 1.42 ERA in April. He's owned in less than 20% of leagues.\n\n**3. Christian Encarnacion-Strand, 3B (Reds)** — Power numbers (.312/.389/.567) that project elite production for the rest of the season.\n\nThe common thread: these are players on teams with favorable schedules down the stretch. Matchups matter enormously in fantasy playoffs, and targeting the right streams can be the difference between winning and losing your league.\n\nDon't sleep on the waiver wire. Championships are won there.`,
    teamIds: [],
    tagIds: ["tag-mlb", "tag-fantasy", "tag-stats"],
    relatedArticleIds: ["art-008", "art-014"],
    views: 7400,
    readTime: 3,
  },
  {
    id: "art-019",
    title: "Lamar Jackson's Quiet MVP Campaign Deserves More Attention",
    slug: "lamar-jackson-quiet-mvp-campaign",
    byline: "Dana Howell",
    publishDate: "2026-03-22",
    body: `While the football world obsesses over Patrick Mahomes and Jalen Hurts, Lamar Jackson is quietly having the greatest season of his career. Through 17 games, he's thrown for 3,812 yards, rushed for 1,102, totaled 38 touchdowns against only 7 interceptions, and has a passer rating of 116.4.\n\nThe Ravens are 11-6 — a somewhat misleading record that masks just how dominant Jackson has been. Six of those losses came with key offensive linemen injured. When healthy, Baltimore is an elite offense.\n\nHere's the thing about the Jackson MVP conversation: he's been doing this for seven years. The novelty has worn off. Voters have started taking him for granted. But look at the numbers. Look at the tape. There is no more complete quarterback in football.\n\nMahomes will probably win the MVP. He usually does. But Jackson is just as deserving, and the Ravens are primed for a deep playoff run.`,
    teamIds: ["nfl-ravens"],
    tagIds: ["tag-nfl", "tag-analysis", "tag-mvp"],
    relatedArticleIds: ["art-005", "art-007"],
    views: 10200,
    readTime: 4,
  },
  {
    id: "art-020",
    title: "The Nuggets Dilemma: Can Denver Defend Their Title Without Their Bench?",
    slug: "nuggets-dilemma-defend-title-bench",
    byline: "Marcus Webb",
    publishDate: "2026-03-21",
    body: `The Denver Nuggets are 48-21 and Nikola Jokic is having yet another historic season. But something is different this year: the bench is a question mark, and it might cost them in the playoffs.\n\nJamal Murray has been brilliant. Aaron Gordon is healthy. But beyond the starting five, Denver has struggled with depth. Their bench ranks 22nd in the NBA in net rating, a stark drop from the championship years when Bruce Brown and Reggie Jackson provided essential support.\n\nHead coach Michael Malone has leaned heavily on his starters, and the usage rates reflect it. Jokic is playing 35.2 minutes per game — the most of his career. Murray is averaging 34.8. That pace is sustainable in the regular season. In a deep playoff run, fatigue becomes the enemy.\n\nDenver will be a tough out regardless. Jokic is the best player in the world on his best nights. But for the Nuggets to repeat, they need more from the second unit. The West is simply too competitive for bench shortcomings to go unaddressed.`,
    teamIds: ["nba-nuggets"],
    tagIds: ["tag-nba", "tag-analysis", "tag-playoffs"],
    relatedArticleIds: ["art-009", "art-003"],
    views: 9100,
    readTime: 4,
  },
];

// Merge so the full export includes all articles
articles.push(...additionalArticles);
