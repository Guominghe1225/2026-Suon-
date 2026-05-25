// ===== js/storage.js =====
const STORE_KEYS = {
  votes: "bb_votes",       // 人气投票
  predicts: "bb_predicts",    // 赛事预测
  scores: "bb_scores"       // 录入的实际比分（管理员用）
};

/* ---------- 投票 ---------- */
function getVotes() {
  return JSON.parse(localStorage.getItem(STORE_KEYS.votes) || "{}");
}
function voteFor(player) {
  const v = getVotes();
  v[player] = (v[player] || 0) + 1;
  localStorage.setItem(STORE_KEYS.votes, JSON.stringify(v));
  return v;
}
function getVoteCount(player) {
  return (getVotes()[player]) || 0;
}
function getTotalVotes() {
  return Object.values(getVotes()).reduce((a, b) => a + b, 0);
}

/* ---------- 预测 ---------- */
function savePrediction(category, matchId, pick) {
  // pick = { winner:"Yuze", comment:"感觉他发球稳", user:"匿名" }
  const all = JSON.parse(localStorage.getItem(STORE_KEYS.predicts) || "[]");
  all.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    category,
    matchId,
    pick,
    time: new Date().toLocaleString()
  });
  localStorage.setItem(STORE_KEYS.predicts, JSON.stringify(all));
}
function getPredictions(category, matchId) {
  const all = JSON.parse(localStorage.getItem(STORE_KEYS.predicts) || "[]");
  return all.filter(p => p.category === category && p.matchId === matchId);
}
function getAllPredictions() {
  return JSON.parse(localStorage.getItem(STORE_KEYS.predicts) || "[]");
}

/* ---------- 比分录入 ---------- */
function saveScore(category, matchId, scoreObj) {
  const key = STORE_KEYS.scores;
  const all = JSON.parse(localStorage.getItem(key) || "{}");
  if (!all[category]) all[category] = {};
  all[category][matchId] = scoreObj; // { s1:21, s2:18, done:true }
  localStorage.setItem(key, JSON.stringify(all));
}
function getScores(category) {
  const all = JSON.parse(localStorage.getItem(STORE_KEYS.scores) || "{}");
  return all[category] || {};
}