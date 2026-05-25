// ===== js/data.js =====
const TOURNAMENT = {
  meta: {
    name: "校羽毛球挑战赛 2025",
    dates: "5月25日(男单) / 5月27日(男双) / 5月28日(女单·女双·混双)",
    scoring: {
      groupMS: "单局15分（男单小组赛）",
      knockoutMS: "3局15分（男单淘汰赛）",
      groupMD: "单局21分（男双小组赛）",
      knockoutMD: "3局15分（男双淘汰赛）",
      ws: "21分一局（女单循环）",
      wd_xd: "3×21分（女双/混双）"
    }
  },

  // 男单分组
  msGroups: {
    A: ["Yuze", "Cason", "Darren"],
    B: ["Mason", "Harry", "David"],
    C: ["Daniel", "Motis", "Eric"],
    D: ["Gary", "Jacky", "Morgan"]
  },

  // 男双分组
  mdGroups: {
    A: ["Yuze & Mason", "Motis & Jacky", "Morgan & Flyer"],
    B: ["Gary & Darren", "Cason & Eric", "David & Harry"]
  },

  // 女单赛程表
  wsMatches: [
    { id: "WS-G1", p1: "Andy", p2: "Shirley", score: null },
    { id: "WS-G2", p1: "Yvette", p2: "Zoey", score: null },
    { id: "WS-G3", p1: "Andy", p2: "Yvette", score: null },
    { id: "WS-G4", p1: "Shirley", p2: "Zoey", score: null },
    { id: "WS-G5", p1: "Andy", p2: "Zoey", score: null },
    { id: "WS-G6", p1: "Shirley", p2: "Yvette", score: null }
  ],

  // 女双
  wdTeams: ["Andy & Shirley", "Yvette & Zoey"],
  xdTeams: ["Mark & Tina", "Andy & Flyer"],

  // 所有人气选手池（用于投票）
  allPlayers: [
    "Yuze", "Mason", "Daniel", "Gary", "Motis", "Jacky",
    "Harry", "Cason", "Morgan", "Eric", "David", "Darren",
    "Andy", "Shirley", "Yvette", "Zoey", "Mark", "Tina", "Flyer"
  ]
};