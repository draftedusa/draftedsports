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
