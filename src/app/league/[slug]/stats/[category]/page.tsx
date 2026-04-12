import { notFound } from "next/navigation";
import Link from "next/link";
import { leagues } from "@/data/leagues";
import FullStatsTable, { type ColumnDef, type StatRow } from "@/components/stats/FullStatsTable";
import Kicker from "@/components/ui/Kicker";

interface Props {
  params: Promise<{ slug: string; category: string }>;
}

// ─────────────────────────────────────────────────────────
// Category config type
// ─────────────────────────────────────────────────────────
interface CategoryConfig {
  title: string;
  columns: ColumnDef[];
  rows: StatRow[];
  conferenceToggle?: boolean;
  conferences?: string[];
}

// ─────────────────────────────────────────────────────────
// Column helpers
// ─────────────────────────────────────────────────────────
const L = (key: string, label: string): ColumnDef => ({ key, label, align: "left" });
const R = (key: string, label: string): ColumnDef => ({ key, label, align: "right" });

// ─────────────────────────────────────────────────────────
// All category configs keyed by "slug/category"
// ─────────────────────────────────────────────────────────
const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {

  // ── NFL ────────────────────────────────────────────────

  "nfl/passing-yards": {
    title: "Passing Yards",
    columns: [R("rank","#"), L("name","Player"), L("team","TM"), R("cmp","CMP"), R("att","ATT"), R("cmpPct","CMP%"), R("yds","YDS"), R("td","TD"), R("int","INT"), R("rating","RTG")],
    rows: [
      { rank:1,  name:"Josh Allen",           team:"BUF", cmp:385, att:579, cmpPct:".665", yds:4812, td:40, int:6,  rating:"105.3" },
      { rank:2,  name:"Lamar Jackson",        team:"BAL", cmp:301, att:457, cmpPct:".659", yds:4601, td:39, int:7,  rating:"104.1" },
      { rank:3,  name:"C.J. Stroud",          team:"HOU", cmp:358, att:542, cmpPct:".661", yds:4388, td:32, int:9,  rating:"98.7"  },
      { rank:4,  name:"Jalen Hurts",          team:"PHI", cmp:312, att:489, cmpPct:".638", yds:4201, td:35, int:8,  rating:"101.2" },
      { rank:5,  name:"Tua Tagovailoa",       team:"MIA", cmp:378, att:558, cmpPct:".677", yds:4158, td:28, int:10, rating:"97.4"  },
      { rank:6,  name:"Patrick Mahomes",      team:"KC",  cmp:362, att:543, cmpPct:".667", yds:4089, td:37, int:11, rating:"102.1" },
      { rank:7,  name:"Jordan Love",          team:"GB",  cmp:329, att:505, cmpPct:".651", yds:3983, td:30, int:12, rating:"94.8"  },
      { rank:8,  name:"Dak Prescott",         team:"DAL", cmp:341, att:524, cmpPct:".651", yds:3921, td:29, int:8,  rating:"96.1"  },
      { rank:9,  name:"Joe Burrow",           team:"CIN", cmp:334, att:506, cmpPct:".660", yds:3877, td:31, int:7,  rating:"99.8"  },
      { rank:10, name:"Trevor Lawrence",      team:"JAX", cmp:318, att:492, cmpPct:".646", yds:3801, td:26, int:9,  rating:"93.2"  },
      { rank:11, name:"Justin Herbert",       team:"LAC", cmp:308, att:478, cmpPct:".644", yds:3744, td:25, int:11, rating:"91.7"  },
      { rank:12, name:"Sam Darnold",          team:"MIN", cmp:289, att:447, cmpPct:".646", yds:3612, td:27, int:12, rating:"90.3"  },
      { rank:13, name:"Baker Mayfield",       team:"TB",  cmp:298, att:463, cmpPct:".644", yds:3589, td:24, int:10, rating:"89.9"  },
      { rank:14, name:"Brock Purdy",          team:"SF",  cmp:301, att:452, cmpPct:".666", yds:3501, td:22, int:8,  rating:"95.4"  },
      { rank:15, name:"Geno Smith",           team:"SEA", cmp:318, att:491, cmpPct:".648", yds:3421, td:21, int:9,  rating:"88.6"  },
    ],
  },

  "nfl/rushing-yards": {
    title: "Rushing Yards",
    columns: [R("rank","#"), L("name","Player"), L("team","TM"), R("car","CAR"), R("yds","YDS"), R("avg","AVG"), R("td","TD"), R("lng","LNG")],
    rows: [
      { rank:1,  name:"Derrick Henry",        team:"BAL", car:329, yds:1921, avg:"5.8", td:16, lng:73 },
      { rank:2,  name:"Bijan Robinson",       team:"ATL", car:272, yds:1744, avg:"6.4", td:14, lng:63 },
      { rank:3,  name:"Jahmyr Gibbs",         team:"DET", car:255, yds:1589, avg:"6.2", td:12, lng:58 },
      { rank:4,  name:"Saquon Barkley",       team:"PHI", car:261, yds:1511, avg:"5.8", td:11, lng:66 },
      { rank:5,  name:"Josh Jacobs",          team:"GB",  car:248, yds:1432, avg:"5.8", td:10, lng:54 },
      { rank:6,  name:"Kyren Williams",       team:"LAR", car:238, yds:1398, avg:"5.9", td:11, lng:61 },
      { rank:7,  name:"Tony Pollard",         team:"TEN", car:229, yds:1312, avg:"5.7", td:9,  lng:49 },
      { rank:8,  name:"De'Von Achane",        team:"MIA", car:214, yds:1289, avg:"6.0", td:10, lng:57 },
      { rank:9,  name:"Joe Mixon",            team:"HOU", car:221, yds:1244, avg:"5.6", td:8,  lng:44 },
      { rank:10, name:"James Cook",           team:"BUF", car:208, yds:1201, avg:"5.8", td:9,  lng:52 },
      { rank:11, name:"Raheem Mostert",       team:"MIA", car:199, yds:1132, avg:"5.7", td:8,  lng:48 },
      { rank:12, name:"Isiah Pacheco",        team:"KC",  car:211, yds:1098, avg:"5.2", td:10, lng:43 },
      { rank:13, name:"Aaron Jones",          team:"MIN", car:196, yds:1044, avg:"5.3", td:7,  lng:46 },
      { rank:14, name:"D'Andre Swift",        team:"CHI", car:201, yds:1021, avg:"5.1", td:6,  lng:41 },
      { rank:15, name:"Rachaad White",        team:"TB",  car:188, yds:989,  avg:"5.3", td:5,  lng:39 },
    ],
  },

  "nfl/receiving-yards": {
    title: "Receiving Yards",
    columns: [R("rank","#"), L("name","Player"), L("team","TM"), R("rec","REC"), R("tgt","TGT"), R("yds","YDS"), R("avg","AVG"), R("td","TD")],
    rows: [
      { rank:1,  name:"Ja'Marr Chase",        team:"CIN", rec:102, tgt:151, yds:1654, avg:"16.2", td:14 },
      { rank:2,  name:"Tyreek Hill",          team:"MIA", rec:98,  tgt:145, yds:1601, avg:"16.3", td:12 },
      { rank:3,  name:"Davante Adams",        team:"LVR", rec:91,  tgt:130, yds:1422, avg:"15.6", td:10 },
      { rank:4,  name:"Justin Jefferson",     team:"MIN", rec:94,  tgt:140, yds:1401, avg:"14.9", td:9  },
      { rank:5,  name:"CeeDee Lamb",          team:"DAL", rec:107, tgt:158, yds:1389, avg:"13.0", td:11 },
      { rank:6,  name:"Stefon Diggs",         team:"BUF", rec:89,  tgt:128, yds:1321, avg:"14.8", td:8  },
      { rank:7,  name:"A.J. Brown",           team:"PHI", rec:84,  tgt:119, yds:1298, avg:"15.5", td:10 },
      { rank:8,  name:"DK Metcalf",           team:"SEA", rec:78,  tgt:118, yds:1244, avg:"15.9", td:9  },
      { rank:9,  name:"Garrett Wilson",       team:"NYJ", rec:82,  tgt:125, yds:1198, avg:"14.6", td:7  },
      { rank:10, name:"Amon-Ra St. Brown",    team:"DET", rec:101, tgt:139, yds:1187, avg:"11.8", td:10 },
      { rank:11, name:"Brandon Aiyuk",        team:"SF",  rec:75,  tgt:108, yds:1132, avg:"15.1", td:8  },
      { rank:12, name:"Jaylen Waddle",        team:"MIA", rec:72,  tgt:104, yds:1089, avg:"15.1", td:6  },
      { rank:13, name:"Mike Evans",           team:"TB",  rec:68,  tgt:97,  yds:1044, avg:"15.4", td:9  },
      { rank:14, name:"Diontae Johnson",      team:"CAR", rec:76,  tgt:112, yds:1012, avg:"13.3", td:5  },
      { rank:15, name:"Terry McLaurin",       team:"WAS", rec:71,  tgt:103, yds:991,  avg:"14.0", td:7  },
    ],
  },

  "nfl/defense": {
    title: "Defensive Leaders",
    columns: [R("rank","#"), L("name","Player"), L("team","TM"), R("solo","SOLO"), R("ast","AST"), R("tot","TOT"), R("sack","SACK"), R("int","INT"), R("ff","FF")],
    rows: [
      { rank:1,  name:"Roquan Smith",         team:"BAL", solo:82, ast:39, tot:121, sack:"3.0", int:2, ff:2 },
      { rank:2,  name:"Fred Warner",          team:"SF",  solo:76, ast:41, tot:117, sack:"2.5", int:3, ff:1 },
      { rank:3,  name:"Lavonte David",        team:"TB",  solo:71, ast:44, tot:115, sack:"1.0", int:1, ff:3 },
      { rank:4,  name:"Demario Davis",        team:"NO",  solo:68, ast:46, tot:114, sack:"2.0", int:2, ff:1 },
      { rank:5,  name:"Bobby Wagner",         team:"SEA", solo:70, ast:40, tot:110, sack:"1.5", int:1, ff:2 },
      { rank:6,  name:"Zaire Franklin",       team:"IND", solo:65, ast:44, tot:109, sack:"1.0", int:2, ff:1 },
      { rank:7,  name:"Micah Parsons",        team:"DAL", solo:44, ast:32, tot:76,  sack:"13.0",int:1, ff:4 },
      { rank:8,  name:"Maxx Crosby",          team:"LVR", solo:41, ast:29, tot:70,  sack:"12.5",int:0, ff:5 },
      { rank:9,  name:"T.J. Watt",            team:"PIT", solo:38, ast:27, tot:65,  sack:"14.0",int:1, ff:6 },
      { rank:10, name:"Myles Garrett",        team:"CLE", solo:36, ast:24, tot:60,  sack:"13.5",int:0, ff:4 },
      { rank:11, name:"Darius Leonard",       team:"IND", solo:62, ast:38, tot:100, sack:"2.0", int:3, ff:2 },
      { rank:12, name:"Jordyn Brooks",        team:"SEA", solo:58, ast:40, tot:98,  sack:"1.5", int:1, ff:1 },
      { rank:13, name:"Eric Kendricks",       team:"LAR", solo:55, ast:38, tot:93,  sack:"1.0", int:2, ff:1 },
      { rank:14, name:"De'Vondre Campbell",   team:"GB",  solo:53, ast:39, tot:92,  sack:"0.5", int:2, ff:0 },
      { rank:15, name:"Tremaine Edmunds",     team:"CHI", solo:51, ast:38, tot:89,  sack:"1.0", int:1, ff:1 },
    ],
  },

  // ── NBA ────────────────────────────────────────────────

  "nba/points-per-game": {
    title: "Points Per Game",
    columns: [R("rank","#"), L("name","Player"), L("team","TM"), R("gp","GP"), R("min","MIN"), R("fgPct","FG%"), R("threePct","3P%"), R("ftPct","FT%"), R("pts","PTS")],
    rows: [
      { rank:1,  name:"Luka Dončić",              team:"DAL", gp:67, min:"34.5", fgPct:".481", threePct:".371", ftPct:".793", pts:"32.4" },
      { rank:2,  name:"Shai Gilgeous-Alexander",  team:"OKC", gp:70, min:"33.8", fgPct:".535", threePct:".345", ftPct:".874", pts:"30.1" },
      { rank:3,  name:"Giannis Antetokounmpo",    team:"MIL", gp:66, min:"32.1", fgPct:".588", threePct:".278", ftPct:".651", pts:"29.8" },
      { rank:4,  name:"Joel Embiid",              team:"PHI", gp:39, min:"34.6", fgPct:".533", threePct:".331", ftPct:".881", pts:"28.9" },
      { rank:5,  name:"Jayson Tatum",             team:"BOS", gp:74, min:"35.9", fgPct:".466", threePct:".374", ftPct:".831", pts:"28.1" },
      { rank:6,  name:"Kevin Durant",             team:"PHX", gp:61, min:"35.1", fgPct:".524", threePct:".411", ftPct:".860", pts:"27.9" },
      { rank:7,  name:"Donovan Mitchell",         team:"CLE", gp:68, min:"34.2", fgPct:".487", threePct:".368", ftPct:".841", pts:"27.1" },
      { rank:8,  name:"Damian Lillard",           team:"MIL", gp:65, min:"35.2", fgPct:".462", threePct:".371", ftPct:".911", pts:"26.8" },
      { rank:9,  name:"Anthony Edwards",          team:"MIN", gp:72, min:"35.8", fgPct:".465", threePct:".351", ftPct:".831", pts:"26.4" },
      { rank:10, name:"LeBron James",             team:"LAL", gp:71, min:"35.3", fgPct:".504", threePct:".410", ftPct:".751", pts:"25.7" },
      { rank:11, name:"Stephen Curry",            team:"GSW", gp:63, min:"32.7", fgPct:".451", threePct:".401", ftPct:".921", pts:"25.4" },
      { rank:12, name:"Trae Young",               team:"ATL", gp:68, min:"34.7", fgPct:".441", threePct:".348", ftPct:".871", pts:"24.9" },
      { rank:13, name:"Nikola Jokić",             team:"DEN", gp:69, min:"33.9", fgPct:".583", threePct:".358", ftPct:".820", pts:"24.5" },
      { rank:14, name:"De'Aaron Fox",             team:"SAC", gp:73, min:"34.1", fgPct:".491", threePct:".331", ftPct:".761", pts:"24.1" },
      { rank:15, name:"Devin Booker",             team:"PHX", gp:67, min:"34.8", fgPct:".491", threePct:".361", ftPct:".861", pts:"23.9" },
    ],
  },

  "nba/rebounds-per-game": {
    title: "Rebounds Per Game",
    columns: [R("rank","#"), L("name","Player"), L("team","TM"), R("gp","GP"), R("oreb","OREB"), R("dreb","DREB"), R("reb","REB")],
    rows: [
      { rank:1,  name:"Nikola Jokić",             team:"DEN", gp:69, oreb:"3.9", dreb:"9.3", reb:"13.2" },
      { rank:2,  name:"Giannis Antetokounmpo",    team:"MIL", gp:66, oreb:"2.8", dreb:"9.3", reb:"12.1" },
      { rank:3,  name:"Alperen Şengün",           team:"HOU", gp:68, oreb:"3.2", dreb:"8.1", reb:"11.3" },
      { rank:4,  name:"Domantas Sabonis",         team:"SAC", gp:72, oreb:"3.5", dreb:"7.6", reb:"11.1" },
      { rank:5,  name:"Joel Embiid",              team:"PHI", gp:39, oreb:"2.1", dreb:"8.9", reb:"11.0" },
      { rank:6,  name:"Brook Lopez",             team:"MIL", gp:67, oreb:"2.9", dreb:"7.8", reb:"10.7" },
      { rank:7,  name:"Clint Capela",             team:"ATL", gp:63, oreb:"3.8", dreb:"6.6", reb:"10.4" },
      { rank:8,  name:"Evan Mobley",              team:"CLE", gp:70, oreb:"2.6", dreb:"7.4", reb:"10.0" },
      { rank:9,  name:"Jarrett Allen",            team:"CLE", gp:68, oreb:"3.1", dreb:"6.7", reb:"9.8"  },
      { rank:10, name:"Anthony Davis",            team:"LAL", gp:61, oreb:"2.4", dreb:"7.2", reb:"9.6"  },
      { rank:11, name:"Bam Adebayo",              team:"MIA", gp:71, oreb:"2.2", dreb:"7.1", reb:"9.3"  },
      { rank:12, name:"Karl-Anthony Towns",       team:"NYK", gp:67, oreb:"2.1", dreb:"7.0", reb:"9.1"  },
      { rank:13, name:"Jonas Valančiūnas",        team:"WAS", gp:65, oreb:"3.3", dreb:"5.6", reb:"8.9"  },
      { rank:14, name:"Jayson Tatum",             team:"BOS", gp:74, oreb:"1.4", dreb:"7.3", reb:"8.7"  },
      { rank:15, name:"Pascal Siakam",            team:"IND", gp:72, oreb:"1.9", dreb:"6.7", reb:"8.6"  },
    ],
  },

  "nba/assists-per-game": {
    title: "Assists Per Game",
    columns: [R("rank","#"), L("name","Player"), L("team","TM"), R("gp","GP"), R("ast","AST"), R("to","TO"), R("ratio","AST/TO")],
    rows: [
      { rank:1,  name:"Tyrese Haliburton",        team:"IND", gp:68, ast:"11.0", to:"3.2", ratio:"3.4" },
      { rank:2,  name:"LeBron James",             team:"LAL", gp:71, ast:"8.3",  to:"3.4", ratio:"2.4" },
      { rank:3,  name:"Trae Young",               team:"ATL", gp:68, ast:"7.9",  to:"4.1", ratio:"1.9" },
      { rank:4,  name:"Luka Dončić",              team:"DAL", gp:67, ast:"7.8",  to:"3.9", ratio:"2.0" },
      { rank:5,  name:"Chris Paul",               team:"GS",  gp:58, ast:"7.6",  to:"2.1", ratio:"3.6" },
      { rank:6,  name:"Shai Gilgeous-Alexander",  team:"OKC", gp:70, ast:"6.2",  to:"2.5", ratio:"2.5" },
      { rank:7,  name:"James Harden",             team:"LAC", gp:67, ast:"8.5",  to:"3.8", ratio:"2.2" },
      { rank:8,  name:"Nikola Jokić",             team:"DEN", gp:69, ast:"7.6",  to:"2.9", ratio:"2.6" },
      { rank:9,  name:"Dejounte Murray",          team:"ATL", gp:70, ast:"6.0",  to:"2.6", ratio:"2.3" },
      { rank:10, name:"Ja Morant",                team:"MEM", gp:61, ast:"7.8",  to:"3.3", ratio:"2.4" },
      { rank:11, name:"De'Aaron Fox",             team:"SAC", gp:73, ast:"6.1",  to:"2.4", ratio:"2.5" },
      { rank:12, name:"Darius Garland",           team:"CLE", gp:69, ast:"6.8",  to:"2.9", ratio:"2.3" },
      { rank:13, name:"Fred VanVleet",            team:"HOU", gp:70, ast:"6.6",  to:"2.4", ratio:"2.8" },
      { rank:14, name:"Kyrie Irving",             team:"DAL", gp:62, ast:"5.8",  to:"2.5", ratio:"2.3" },
      { rank:15, name:"Jordan Poole",             team:"WAS", gp:71, ast:"5.4",  to:"2.2", ratio:"2.5" },
    ],
  },

  // ── MLB ────────────────────────────────────────────────

  "mlb/batting-average": {
    title: "Batting Average",
    conferenceToggle: true,
    conferences: ["AL", "NL"],
    columns: [R("rank","#"), L("name","Player"), L("team","TM"), L("conference","LG"), R("g","G"), R("ab","AB"), R("h","H"), R("hr","HR"), R("rbi","RBI"), R("bb","BB"), R("so","SO"), R("avg","AVG"), R("ops","OPS")],
    rows: [
      { rank:1,  name:"Luis Arraez",             team:"SD",  conference:"NL", g:148, ab:572, h:208, hr:3,  rbi:64,  bb:42, so:35,  avg:".364", ops:".857" },
      { rank:2,  name:"Freddie Freeman",         team:"LAD", conference:"NL", g:145, ab:549, h:190, hr:22, rbi:89,  bb:75, so:112, avg:".346", ops:".985" },
      { rank:3,  name:"Steven Kwan",             team:"CLE", conference:"AL", g:150, ab:561, h:189, hr:8,  rbi:58,  bb:66, so:74,  avg:".337", ops:".881" },
      { rank:4,  name:"Corey Seager",            team:"TEX", conference:"AL", g:143, ab:538, h:180, hr:33, rbi:96,  bb:55, so:104, avg:".335", ops:"1.011"},
      { rank:5,  name:"Paul Goldschmidt",        team:"STL", conference:"NL", g:151, ab:556, h:183, hr:26, rbi:97,  bb:81, so:131, avg:".329", ops:".981" },
      { rank:6,  name:"Mookie Betts",            team:"LAD", conference:"NL", g:152, ab:569, h:186, hr:39, rbi:107, bb:78, so:101, avg:".327", ops:"1.041"},
      { rank:7,  name:"Rafael Devers",           team:"BOS", conference:"AL", g:149, ab:555, h:181, hr:33, rbi:101, bb:58, so:133, avg:".326", ops:".987" },
      { rank:8,  name:"Yordan Alvarez",          team:"HOU", conference:"AL", g:135, ab:499, h:162, hr:31, rbi:97,  bb:72, so:121, avg:".325", ops:"1.019"},
      { rank:9,  name:"Trea Turner",             team:"PHI", conference:"NL", g:154, ab:596, h:191, hr:26, rbi:76,  bb:40, so:141, avg:".321", ops:".871" },
      { rank:10, name:"Alex Bregman",            team:"HOU", conference:"AL", g:148, ab:536, h:171, hr:23, rbi:91,  bb:87, so:89,  avg:".319", ops:".941" },
      { rank:11, name:"Juan Soto",               team:"NYY", conference:"AL", g:157, ab:558, h:177, hr:35, rbi:109, bb:132,so:138, avg:".317", ops:"1.011"},
      { rank:12, name:"Pete Alonso",             team:"NYM", conference:"NL", g:158, ab:571, h:180, hr:46, rbi:118, bb:71, so:142, avg:".315", ops:"1.001"},
      { rank:13, name:"Gunnar Henderson",        team:"BAL", conference:"AL", g:155, ab:566, h:178, hr:28, rbi:82,  bb:55, so:143, avg:".314", ops:".916" },
      { rank:14, name:"Ketel Marte",             team:"ARI", conference:"NL", g:146, ab:532, h:167, hr:25, rbi:88,  bb:61, so:99,  avg:".314", ops:".927" },
      { rank:15, name:"José Ramírez",            team:"CLE", conference:"AL", g:158, ab:571, h:178, hr:29, rbi:102, bb:78, so:88,  avg:".312", ops:".942" },
      { rank:16, name:"Xander Bogaerts",         team:"SD",  conference:"NL", g:141, ab:521, h:162, hr:17, rbi:74,  bb:59, so:91,  avg:".311", ops:".868" },
      { rank:17, name:"Adolis García",           team:"TEX", conference:"AL", g:154, ab:565, h:175, hr:39, rbi:107, bb:38, so:161, avg:".310", ops:".927" },
      { rank:18, name:"Nico Hoerner",            team:"CHC", conference:"NL", g:148, ab:539, h:166, hr:8,  rbi:52,  bb:50, so:72,  avg:".308", ops:".791" },
      { rank:19, name:"Nathaniel Lowe",          team:"TEX", conference:"AL", g:155, ab:571, h:175, hr:17, rbi:79,  bb:71, so:104, avg:".307", ops:".842" },
      { rank:20, name:"Christian Yelich",        team:"MIL", conference:"NL", g:131, ab:482, h:148, hr:19, rbi:68,  bb:81, so:118, avg:".307", ops:".888" },
    ],
  },

  "mlb/earned-run-average": {
    title: "Earned Run Average",
    conferenceToggle: true,
    conferences: ["AL", "NL"],
    columns: [R("rank","#"), L("name","Player"), L("team","TM"), L("conference","LG"), R("g","G"), R("gs","GS"), R("w","W"), R("l","L"), R("era","ERA"), R("ip","IP"), R("k","SO"), R("bb","BB"), R("whip","WHIP")],
    rows: [
      { rank:1,  name:"Zack Wheeler",            team:"PHI", conference:"NL", g:33, gs:33, w:16, l:7,  era:"2.44", ip:"210.0", k:222, bb:41, whip:"0.99" },
      { rank:2,  name:"Spencer Strider",         team:"ATL", conference:"NL", g:32, gs:32, w:18, l:5,  era:"2.67", ip:"204.2", k:281, bb:51, whip:"1.01" },
      { rank:3,  name:"Gerrit Cole",             team:"NYY", conference:"AL", g:33, gs:33, w:15, l:8,  era:"2.90", ip:"209.0", k:210, bb:44, whip:"1.03" },
      { rank:4,  name:"Logan Webb",              team:"SF",  conference:"NL", g:32, gs:32, w:13, l:10, era:"3.01", ip:"202.0", k:188, bb:38, whip:"1.06" },
      { rank:5,  name:"Pablo López",             team:"MIN", conference:"AL", g:32, gs:32, w:14, l:8,  era:"3.11", ip:"198.1", k:201, bb:48, whip:"1.09" },
      { rank:6,  name:"Kevin Gausman",           team:"SF",  conference:"NL", g:31, gs:31, w:15, l:7,  era:"3.16", ip:"196.2", k:198, bb:36, whip:"1.08" },
      { rank:7,  name:"Max Fried",               team:"ATL", conference:"NL", g:30, gs:30, w:11, l:9,  era:"3.23", ip:"185.1", k:172, bb:44, whip:"1.11" },
      { rank:8,  name:"Framber Valdez",          team:"HOU", conference:"AL", g:31, gs:31, w:12, l:10, era:"3.45", ip:"194.0", k:179, bb:59, whip:"1.17" },
      { rank:9,  name:"Sonny Gray",              team:"STL", conference:"NL", g:30, gs:30, w:10, l:8,  era:"3.56", ip:"178.2", k:171, bb:42, whip:"1.12" },
      { rank:10, name:"Justin Verlander",        team:"HOU", conference:"AL", g:28, gs:28, w:13, l:8,  era:"3.61", ip:"175.0", k:162, bb:34, whip:"1.09" },
      { rank:11, name:"Sandy Alcántara",         team:"MIA", conference:"NL", g:31, gs:31, w:9,  l:12, era:"3.78", ip:"199.1", k:185, bb:52, whip:"1.14" },
      { rank:12, name:"Nathan Eovaldi",          team:"TEX", conference:"AL", g:30, gs:30, w:12, l:8,  era:"3.87", ip:"184.0", k:171, bb:41, whip:"1.16" },
      { rank:13, name:"Joe Ryan",                team:"MIN", conference:"AL", g:31, gs:31, w:11, l:10, era:"3.91", ip:"181.1", k:193, bb:48, whip:"1.13" },
      { rank:14, name:"Corbin Burnes",           team:"BAL", conference:"AL", g:32, gs:32, w:15, l:9,  era:"3.99", ip:"197.2", k:201, bb:55, whip:"1.19" },
      { rank:15, name:"Brandon Woodruff",        team:"MIL", conference:"NL", g:29, gs:29, w:10, l:7,  era:"4.04", ip:"170.1", k:178, bb:47, whip:"1.17" },
    ],
  },

  // ── NHL ────────────────────────────────────────────────

  "nhl/points": {
    title: "Points Leaders",
    conferenceToggle: true,
    conferences: ["East", "West"],
    columns: [R("rank","#"), L("name","Player"), L("team","TM"), L("conference","CONF"), R("g","G"), R("a","A"), R("pts","PTS"), R("plusMinus","+/-"), R("pim","PIM")],
    rows: [
      { rank:1,  name:"Nathan MacKinnon",       team:"COL", conference:"West", g:42, a:67, pts:109, plusMinus:28,  pim:32 },
      { rank:2,  name:"Connor McDavid",         team:"EDM", conference:"West", g:38, a:69, pts:107, plusMinus:19,  pim:28 },
      { rank:3,  name:"David Pastrnak",         team:"BOS", conference:"East", g:44, a:59, pts:103, plusMinus:22,  pim:40 },
      { rank:4,  name:"Leon Draisaitl",         team:"EDM", conference:"West", g:41, a:61, pts:102, plusMinus:17,  pim:36 },
      { rank:5,  name:"Nikita Kucherov",        team:"TB",  conference:"East", g:29, a:72, pts:101, plusMinus:24,  pim:20 },
      { rank:6,  name:"Auston Matthews",        team:"TOR", conference:"East", g:54, a:44, pts:98,  plusMinus:11,  pim:18 },
      { rank:7,  name:"Mikko Rantanen",         team:"COL", conference:"West", g:36, a:60, pts:96,  plusMinus:21,  pim:26 },
      { rank:8,  name:"Jason Robertson",        team:"DAL", conference:"West", g:38, a:56, pts:94,  plusMinus:19,  pim:16 },
      { rank:9,  name:"Jack Hughes",            team:"NJ",  conference:"East", g:32, a:61, pts:93,  plusMinus:8,   pim:22 },
      { rank:10, name:"Matthew Tkachuk",        team:"FLA", conference:"East", g:35, a:57, pts:92,  plusMinus:15,  pim:74 },
      { rank:11, name:"Elias Pettersson",       team:"VAN", conference:"West", g:30, a:61, pts:91,  plusMinus:14,  pim:30 },
      { rank:12, name:"Cale Makar",             team:"COL", conference:"West", g:24, a:67, pts:91,  plusMinus:26,  pim:24 },
      { rank:13, name:"Kirill Kaprizov",        team:"MIN", conference:"West", g:40, a:49, pts:89,  plusMinus:9,   pim:28 },
      { rank:14, name:"Sidney Crosby",          team:"PIT", conference:"East", g:33, a:54, pts:87,  plusMinus:5,   pim:34 },
      { rank:15, name:"Quinn Hughes",           team:"VAN", conference:"West", g:10, a:76, pts:86,  plusMinus:18,  pim:16 },
      { rank:16, name:"Mitch Marner",           team:"TOR", conference:"East", g:27, a:57, pts:84,  plusMinus:10,  pim:18 },
      { rank:17, name:"Brady Tkachuk",          team:"OTT", conference:"East", g:37, a:45, pts:82,  plusMinus:4,   pim:112},
      { rank:18, name:"Jake Guentzel",          team:"CAR", conference:"East", g:38, a:43, pts:81,  plusMinus:16,  pim:20 },
      { rank:19, name:"Brayden Point",          team:"TB",  conference:"East", g:36, a:44, pts:80,  plusMinus:12,  pim:22 },
      { rank:20, name:"Steven Stamkos",         team:"TB",  conference:"East", g:39, a:40, pts:79,  plusMinus:7,   pim:30 },
    ],
  },
};

// ─────────────────────────────────────────────────────────
// Static params
// ─────────────────────────────────────────────────────────
export function generateStaticParams() {
  return Object.keys(CATEGORY_CONFIGS).map((key) => {
    const [slug, category] = key.split("/");
    return { slug, category };
  });
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────
export default async function LeagueStatsCategoryPage({ params }: Props) {
  const { slug, category } = await params;

  const league = leagues.find((l) => l.slug === slug);
  if (!league) notFound();

  const config = CATEGORY_CONFIGS[`${slug}/${category}`];
  if (!config) notFound();

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-surface-muted">
        <Link href={`/league/${slug}`} className="hover:text-surface-text transition-colors">
          {league.name}
        </Link>
        <span>/</span>
        <Link href={`/league/${slug}/stats`} className="hover:text-surface-text transition-colors">
          Stats
        </Link>
        <span>/</span>
        <span className="text-surface-text font-semibold">{config.title}</span>
      </nav>

      {/* Header */}
      <div className="pb-4 border-b border-surface-300">
        <Kicker label={league.name} />
        <h1 className="text-2xl font-black tracking-tighter text-surface-text mt-0.5">
          {config.title} <span className="text-brand">Leaders</span>
        </h1>
        <p className="text-[10px] text-surface-muted font-bold uppercase tracking-widest mt-1">
          Season: 2025–2026 · Regular Season
        </p>
      </div>

      {/* Table */}
      <FullStatsTable
        title={config.title}
        columns={config.columns}
        rows={config.rows}
        conferenceToggle={config.conferenceToggle}
        conferences={config.conferences}
      />

    </div>
  );
}
