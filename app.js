// ===== js/app.js =====
document.addEventListener("DOMContentLoaded", () => {

  /* ========== 渲染：英雄信息 ========== */
  const hero = document.getElementById("hero-info");
  if (hero) {
    hero.innerHTML = `
      <h2>${TOURNAMENT.meta.name}</h2>
      <p>📅 ${TOURNAMENT.meta.dates}</p>
      <p style="margin-top:8px;font-size:.88rem;color:#888">
        计分规则：男单小组赛${TOURNAMENT.meta.scoring.groupMS} ｜
        淘汰赛${TOURNAMENT.meta.scoring.knockoutMS} ｜
        女单${TOURNAMENT.meta.scoring.ws} ｜
        女双/混双${TOURNAMENT.meta.scoring.wd_xd}
      </p>`;
  }

  /* ========== 渲染：男单分组 ========== */
  const msEl = document.getElementById("ms-groups");
  if (msEl) {
    msEl.innerHTML = `<div class="group-grid">` +
      Object.entries(TOURNAMENT.msGroups).map(([g, players]) =>
        `<div class="group-box">
           <h4>Group ${g}</h4>
           <ul>${players.map(p => `<li><span>${p}</span><span style="color:#aaa;font-size:.8rem">●</span></li>`).join("")}
           </ul>
           <div style="margin-top:8px;font-size:.78rem;color:#999">每人与组内另两人各打1场（单局15分）</div>
         </div>`
      ).join("") +
      `</div>`;
  }

  /* ========== 渲染：男双分组 ========== */
  const mdEl = document.getElementById("md-groups");
  if (mdEl) {
    mdEl.innerHTML = `<div class="group-grid">` +
      Object.entries(TOURNAMENT.mdGroups).map(([g, teams]) =>
        `<div class="group-box">
           <h4>Pool ${g}</h4>
           <ul>${teams.map(t => `<li><span>${t}</span></li>`).join("")}</ul>
           <div style="margin-top:8px;font-size:.78rem;color:#999">小组赛单局21分</div>
         </div>`
      ).join("") +
      `</div>`;
  }

  /* ========== 渲染：女单赛程表 ========== */
  const wsEl = document.getElementById("ws-matches");
  if (wsEl) {
    const scores = getScores("ws");
    wsEl.innerHTML = TOURNAMENT.wsMatches.map(m => {
      const sc = scores[m.id];
      return `<div class="match-row">
        <span class="match-label">${m.id}</span>
        <span class="match-vs">${m.p1} <b style="color:#ccc;margin:0 4px">vs</b> ${m.p2}</span>
        ${sc?.done
          ? `<span style="color:var(--primary);font-weight:700">${sc.s1} – ${sc.s2}</span>`
          : `<span style="color:#ccc;font-size:.85rem">未开始</span>`}
      </div>`;
    }).join("");
  }

  /* ========== 渲染：投票面板 ========== */
  const votePanel = document.getElementById("vote-panel");
  if (votePanel) renderVotePanel();

  function renderVotePanel() {
    const total = getTotalVotes();
    votePanel.innerHTML = TOURNAMENT.allPlayers.map(p => {
      const c = getVoteCount(p);
      const pct = total ? ((c / total) * 100).toFixed(1) : 0;
      return `<div class="vote-item">
        <span class="name">🏸 ${p}</span>
        <div class="vote-bar-wrap" style="flex:1">
          <div class="vote-bar-fill" style="width:${Math.max(pct, 2)}%"></div>
        </div>
        <span class="pct">${pct}%</span>
        <span style="font-size:.82rem;color:#aaa;width:32px">${c}票</span>
        <button class="btn btn-sm btn-primary" onclick="doVote('${p}')">投</button>
      </div>`;
    }).join("");
  }

  window.doVote = function (player) {
    voteFor(player);
    renderVotePanel();
    showToast(`✅ 已投给 ${player}！`);
  };

  /* ========== 渲染：预测面板 ========== */
  const predEl = document.getElementById("predict-form");
  if (predEl) {
    // 构建所有可预测场次的下拉选项
    let options = '<optgroup label="男单（各小组赛）">';
    Object.entries(TOURNAMENT.msGroups).forEach(([g, ps]) => {
      options += `<option value="ms|${g}-01">Group ${g}: ${ps[0]} vs ${ps[1]}</option>`;
      options += `<option value="ms|${g}-02">Group ${g}: ${ps[1]} vs ${ps[2]}</option>`;
      options += `<option value="ms|${g}-03">Group ${g}: ${ps[0]} vs ${ps[2]}</option>`;
    });
    options += '</optgroup>';
    predEl.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:end">
        <div>
          <label style="font-size:.82rem;color:#888">选择场次</label><br>
          <select id="pred-select" style="padding:8px 12px;border:1.5px solid #ddd;border-radius:10px;min-width:240px;font-size:.92rem">
            ${options}
          </select>
        </div>
        <div>
          <label style="font-size:.82rem;color:#888">你认为谁赢？</label><br>
          <input id="pred-winner" list="pred-datalist" placeholder="输入选手名…"
                 style="padding:8px 12px;border:1.5px solid #ddd;border-radius:10px;min-width:160px;font-size:.92rem">
          <datalist id="pred-datalist">
            ${TOURNAMENT.allPlayers.map(p => `<option value="${p}">`).join("")}
          </datalist>
        </div>
        <div>
          <label style="font-size:.82rem;color:#888">理由（可选）</label><br>
          <input id="pred-comment" placeholder="比如：发球太稳了"
                 style="padding:8px 12px;border:1.5px solid #ddd;border-radius:10px;min-width:180px;font-size:.92rem">
        </div>
        <button class="btn btn-primary" onclick="submitPredict()">提交预测</button>
      </div>
      <div id="predict-feed" style="margin-top:18px"></div>`;
    renderPredictFeed();
  }

  window.submitPredict = function () {
    const sel = document.getElementById("pred-select").value; // "ms|A-01"
    const winner = document.getElementById("pred-winner").value.trim();
    const comment = document.getElementById("pred-comment").value.trim();
    if (!winner) { showToast("⚠️ 请填写你预测的赢家！"); return; }
    const [cat, mid] = sel.split("|");
    savePrediction(cat, mid, { winner, comment: comment || "", user: "球迷" });
    document.getElementById("pred-winner").value = "";
    document.getElementById("pred-comment").value = "";
    renderPredictFeed();
    showToast("🔮 预测已提交，看看下面实时更新！");
  };

  function renderPredictFeed() {
    const feed = document.getElementById("predict-feed");
    if (!feed) return;
    const list = getAllPredictions().reverse().slice(0, 30);
    if (!list.length) { feed.innerHTML = `<div style="color:#bbb;font-size:.88rem;padding:10px 0">还没人预测，来做第一个吧 👆</div>`; return; }
    feed.innerHTML = list.map(p =>
      `<div class="predict-card">
        <b>${p.pick.winner}</b> wins <code style="font-size:.75rem;color:#999">[${p.category}] ${p.matchId}</code>
        ${p.pick.comment ? `<div style="color:#555;margin-top:2px">💬 ${p.pick.comment}</div>` : ""}
        <div class="meta">🕐 ${p.time}</div>
       </div>`
    ).join("");
  }

  /* ========== Toast ========== */
  window.showToast = function (msg) {
    let t = document.getElementById("_toast");
    if (!t) {
      t = document.createElement("div"); t.id = "_toast";
      Object.assign(t.style, {
        position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
        background: "#1d1d1f", color: "#fff", padding: "10px 24px", borderRadius: "99px",
        fontSize: ".9rem", zIndex: 9999, opacity: "0", transition: "opacity .3s",
        boxShadow: "0 6px 24px rgba(0,0,0,.2)"
      }); document.body.appendChild(t);
    }
    t.textContent = msg; t.style.opacity = "1";
    clearTimeout(t._t); t._t = setTimeout(() => t.style.opacity = "0", 2200);
  };
});