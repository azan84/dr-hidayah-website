/* ============================================================
   Shared Kahoot-style quiz engine
   Each quiz page defines window.QUIZ_CONFIG = {
     title:             "Thermodynamics Quiz",
     subtitleBadge:     "SKTC 1623 · Chapters 1 & 2",
     logoText:          "THERMO QUIZ",
     reviewText:        "Review Chapters 1 & 2",
     lbCollection:      "thermoQuizLB",      // Firestore collection
     lbLocalKey:        "thermoQuizLB",      // localStorage key
     questions:         [ ... ],             // array of question objects
     totalQuestions:    12,                  // optional (default = min(12, questions.length))
     timePerQ:          20,                  // optional (default 20)
     backHref:          "students.html"      // optional (default "students.html")
   };
   ============================================================ */

(function(){
  const CFG = window.QUIZ_CONFIG || {};
  const TOTAL_QUESTIONS = Math.min(CFG.totalQuestions || 12, (CFG.questions || []).length);
  const TIME_PER_Q = CFG.timePerQ || 20;
  const LB_COLLECTION = CFG.lbCollection || 'genericQuizLB';
  const LB_LOCAL_KEY = CFG.lbLocalKey || LB_COLLECTION;
  const REVIEW_TEXT = CFG.reviewText || "Review the material";

  // ===== State =====
  const state = {
    player: "",
    idx: 0,
    score: 0,
    correctCount: 0,
    totalTime: 0,
    timer: null,
    timeLeft: TIME_PER_Q,
    questionStart: 0,
    answered: false,
    questions: []
  };

  // ===== Utilities =====
  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function $(id){return document.getElementById(id);}
  function show(id){ ['startScreen','playScreen','feedbackScreen','endScreen','lbScreen'].forEach(s=>{
    const el=$(s); if(el) el.classList.add('hidden');
  }); const t=$(id); if(t) t.classList.remove('hidden'); }

  function escapeHtml(s){ return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  // ===== Start =====
  document.addEventListener('DOMContentLoaded', ()=>{
    const qc = $('qCount'); if(qc) qc.textContent = TOTAL_QUESTIONS;
    initFirebase();
    updateBackendBadge();

    const nameInput = $('playerName');
    const startBtn = $('startBtn');
    if(nameInput && startBtn){
      nameInput.addEventListener('input', ()=>{
        startBtn.disabled = nameInput.value.trim().length < 1;
      });
      nameInput.addEventListener('keydown', e=>{
        if(e.key==='Enter' && !startBtn.disabled) startBtn.click();
      });
      startBtn.addEventListener('click', startQuiz);
    }
    const rb = $('resetLbBtn'); if(rb) rb.addEventListener('click', ()=>handleReset());

    const viewLb = $('viewLbBtn');
    if(viewLb) viewLb.addEventListener('click', ()=>{
      renderLeaderboardInto('lbScreenList');
      show('lbScreen');
    });
    const lbBack = $('lbBackBtn');
    if(lbBack) lbBack.addEventListener('click', ()=>{ show('startScreen'); });
    const lbReset = $('lbResetBtn');
    if(lbReset) lbReset.addEventListener('click', ()=>{ handleReset('lbScreenList'); });
  });

  function handleReset(targetId){
    if(firebaseReady){
      alert(
        'The shared leaderboard is stored in Firebase. For safety it cannot be cleared from the browser.\n\n' +
        'To reset it, open Firebase Console -> Firestore Database -> collection "' +
        LB_COLLECTION +
        '" -> delete the documents you want to remove.'
      );
      return;
    }
    if(confirm('Reset the leaderboard on this device? This cannot be undone.')){
      localStorage.removeItem(LB_LOCAL_KEY);
      if(targetId) renderLeaderboardInto(targetId);
      else renderLeaderboard();
    }
  }

  function updateBackendBadge(){
    const badge = document.getElementById('backendBadge');
    const note = document.getElementById('lbNote');
    if(badge){
      if(firebaseReady){
        badge.innerHTML = '&#128308; LIVE &middot; shared leaderboard';
        badge.style.background = 'linear-gradient(135deg,#26890c,#4caf50)';
      } else {
        badge.innerHTML = '&#128190; Local &middot; this device only';
        badge.style.background = 'linear-gradient(135deg,#6b7280,#9ca3af)';
      }
    }
    if(note){
      if(firebaseReady){
        note.innerHTML = '<strong>Live mode:</strong> scores are synced from every student across every device in real time.';
      } else {
        note.innerHTML = '<strong>Note:</strong> scores are saved only in <em>this browser on this device</em>. Students on their own devices have their own separate leaderboards.';
      }
    }
    const sub = document.getElementById('lbSub');
    if(sub){
      sub.textContent = firebaseReady
        ? 'Top 10 scores across all players (live)'
        : 'Top 10 scores saved on this device';
    }
  }

  function startQuiz(){
    state.player = $('playerName').value.trim().slice(0,20);
    state.idx = 0;
    state.score = 0;
    state.correctCount = 0;
    state.totalTime = 0;
    state.questions = shuffle(CFG.questions).slice(0, TOTAL_QUESTIONS).map(q=>{
      const idxs = shuffle(q.options.map((_,i)=>i));
      const newOptions = idxs.map(i=>q.options[i]);
      const newCorrect = idxs.indexOf(q.correct);
      return { ...q, options:newOptions, correct:newCorrect };
    });
    show('playScreen');
    renderQuestion();
  }

  function renderQuestion(){
    const q = state.questions[state.idx];
    state.answered = false;
    state.timeLeft = TIME_PER_Q;
    state.questionStart = performance.now();

    $('qCounter').textContent = `Question ${state.idx+1} / ${TOTAL_QUESTIONS}`;
    $('qScore').innerHTML = `&#11088; ${state.score} pts`;
    $('qChapter').innerHTML = q.chapter || '';
    $('qText').innerHTML = q.q;

    const colors = ['btn-red','btn-blue','btn-yellow','btn-green'];
    const shapes = ['&#9650;','&#9670;','&#9679;','&#9632;'];
    const grid = $('answerGrid');
    grid.innerHTML = '';
    q.options.forEach((opt, i)=>{
      const btn = document.createElement('button');
      btn.className = `answer-btn ${colors[i]}`;
      btn.innerHTML = `<span class="shape">${shapes[i]}</span><span>${opt}</span>`;
      btn.addEventListener('click', ()=>handleAnswer(i));
      grid.appendChild(btn);
    });

    updateTimerVisual();
    if(state.timer) clearInterval(state.timer);
    state.timer = setInterval(()=>{
      state.timeLeft -= 1;
      if(state.timeLeft <= 0){
        clearInterval(state.timer);
        if(!state.answered) handleAnswer(-1);
      } else {
        updateTimerVisual();
      }
    }, 1000);
  }

  function updateTimerVisual(){
    const t = Math.max(0, state.timeLeft);
    $('timerT').textContent = t;
    const pct = t / TIME_PER_Q;
    const circ = 2 * Math.PI * 36;
    $('timerFg').style.strokeDasharray = circ;
    $('timerFg').style.strokeDashoffset = circ * (1 - pct);
    $('timerFg').style.stroke = t <= 5 ? '#e21b3c' : (t <= 10 ? '#d89e00' : '#46178f');
    $('timerT').style.color = t <= 5 ? '#e21b3c' : (t <= 10 ? '#d89e00' : '#46178f');
  }

  function handleAnswer(choice){
    if(state.answered) return;
    state.answered = true;
    clearInterval(state.timer);

    const q = state.questions[state.idx];
    const elapsedMs = performance.now() - state.questionStart;
    const elapsed = Math.min(elapsedMs/1000, TIME_PER_Q);
    state.totalTime += elapsed;

    const timeout = (choice === -1);
    const correct = (choice === q.correct);

    let pts = 0;
    if(correct){
      const fraction = 1 - (elapsed / TIME_PER_Q);
      pts = Math.round(500 + 500 * fraction);
      state.score += pts;
      state.correctCount += 1;
    }

    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach((b, i)=>{
      b.disabled = true;
      if(i === q.correct) b.classList.add('correct');
      else if(i === choice && !correct) b.classList.add('wrong');
      else b.classList.add('dim');
    });

    setTimeout(()=>showFeedback(correct, timeout, pts, q.explain), 900);
  }

  function showFeedback(correct, timeout, pts, explain){
    const emoji = $('fbEmoji');
    const title = $('fbTitle');
    const points = $('fbPoints');
    title.className = '';
    if(correct){
      emoji.innerHTML = '&#127881;';
      title.textContent = 'Correct!';
      title.classList.add('right');
      points.classList.remove('zero');
      points.textContent = `+${pts} points`;
    } else if(timeout){
      emoji.innerHTML = '&#9200;';
      title.textContent = "Time's up!";
      title.classList.add('timeup');
      points.classList.add('zero');
      points.textContent = '+0 points';
    } else {
      emoji.innerHTML = '&#128533;';
      title.textContent = 'Incorrect';
      title.classList.add('wrong');
      points.classList.add('zero');
      points.textContent = '+0 points';
    }
    $('fbExplain').innerHTML = explain || '';
    $('fbTotal').textContent = state.score;
    show('feedbackScreen');

    setTimeout(()=>{
      state.idx += 1;
      if(state.idx >= TOTAL_QUESTIONS){
        endQuiz();
      } else {
        show('playScreen');
        renderQuestion();
      }
    }, 3000);
  }

  async function endQuiz(){
    const entry = {
      name: state.player,
      score: state.score,
      correct: state.correctCount,
      total: TOTAL_QUESTIONS,
      avgTime: state.totalTime / TOTAL_QUESTIONS,
      date: new Date().toISOString()
    };
    await saveLeaderboard(entry);

    $('finalName').textContent = state.player;
    $('finalScore').textContent = state.score.toLocaleString();
    $('statCorrect').textContent = `${state.correctCount} / ${TOTAL_QUESTIONS}`;
    const acc = Math.round((state.correctCount/TOTAL_QUESTIONS)*100);
    $('statAccuracy').textContent = `${acc}%`;
    $('statAvg').textContent = `${(state.totalTime/TOTAL_QUESTIONS).toFixed(1)}s`;

    const fe = $('finalEmoji');
    const ft = $('finalTitle');
    const fs = $('finalSub');
    if(acc >= 90){ fe.innerHTML='&#128081;'; ft.textContent='Champion!'; fs.innerHTML=`Outstanding work, <span id="finalName">${escapeHtml(state.player)}</span>! &#128293;`; }
    else if(acc >= 70){ fe.innerHTML='&#127942;'; ft.textContent='Great job!'; fs.innerHTML=`Solid run, <span id="finalName">${escapeHtml(state.player)}</span>!`; }
    else if(acc >= 50){ fe.innerHTML='&#128170;'; ft.textContent='Not bad!'; fs.innerHTML=`Keep practicing, <span id="finalName">${escapeHtml(state.player)}</span>!`; }
    else { fe.innerHTML='&#128218;'; ft.textContent='Quiz complete'; fs.innerHTML=`${REVIEW_TEXT} and try again, <span id="finalName">${escapeHtml(state.player)}</span>!`; }

    renderLeaderboard(entry);
    show('endScreen');

    if(acc >= 70) launchConfetti();
  }

  // ===== Leaderboard storage =====
  let firebaseDb = null;
  let firebaseReady = false;
  let remoteLB = [];
  let lbSubscribers = [];

  function initFirebase(){
    if(!window.FIREBASE_ENABLED) return false;
    try {
      if(!firebase.apps.length){
        firebase.initializeApp(window.FIREBASE_CONFIG);
      }
      firebaseDb = firebase.firestore();
      firebaseReady = true;
      firebaseDb.collection(LB_COLLECTION)
        .orderBy('score', 'desc')
        .limit(50)
        .onSnapshot(snap=>{
          remoteLB = snap.docs.map(d=>{
            const x = d.data();
            return {
              id: d.id,
              name: x.name,
              score: x.score,
              correct: x.correct,
              total: x.total,
              avgTime: x.avgTime,
              date: x.date || (x.createdAt && x.createdAt.toDate && x.createdAt.toDate().toISOString()) || new Date().toISOString()
            };
          });
          lbSubscribers.forEach(fn=>{ try{fn();}catch(e){} });
        }, err=>{
          console.warn('Firestore listener failed, falling back to localStorage.', err);
          firebaseReady = false;
        });
      return true;
    } catch(e){
      console.warn('Firebase init failed, falling back to localStorage.', e);
      firebaseReady = false;
      return false;
    }
  }

  async function saveLeaderboard(entry){
    if(firebaseReady){
      try {
        const docRef = await firebaseDb.collection(LB_COLLECTION).add({
          name: entry.name,
          score: entry.score,
          correct: entry.correct,
          total: entry.total,
          avgTime: entry.avgTime,
          date: entry.date,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        entry.id = docRef.id;
        return;
      } catch(e){
        console.warn('Firestore write failed, saving locally.', e);
      }
    }
    const lb = getLocalLeaderboard();
    lb.push(entry);
    lb.sort((a,b)=>b.score - a.score);
    const top = lb.slice(0, 50);
    try { localStorage.setItem(LB_LOCAL_KEY, JSON.stringify(top)); } catch(e){}
  }

  function getLocalLeaderboard(){
    try {
      const raw = localStorage.getItem(LB_LOCAL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch(e){ return []; }
  }
  function getLeaderboard(){
    if(firebaseReady) return remoteLB.slice();
    return getLocalLeaderboard();
  }

  function renderLeaderboardInto(targetId){
    renderLeaderboard(null, targetId);
  }
  function renderLeaderboard(currentEntry, targetId){
    const list = $(targetId || 'leaderboardList');
    if(!list) return;
    const redraw = ()=>renderLeaderboardOnce(currentEntry, targetId || 'leaderboardList');
    if(!list._lbSubscribed){
      list._lbSubscribed = true;
      lbSubscribers.push(redraw);
    }
    redraw();
  }
  function renderLeaderboardOnce(currentEntry, targetId){
    const list = $(targetId);
    if(!list) return;
    const lb = getLeaderboard().slice(0, 10);
    if(!lb.length){
      list.innerHTML = '<div class="lb-empty">No scores yet. Be the first!</div>';
      return;
    }
    list.innerHTML = lb.map((e, i)=>{
      const rank = i+1;
      const isYou = currentEntry && (
        (e.id && currentEntry.id && e.id === currentEntry.id) ||
        (e.name === currentEntry.name && e.date === currentEntry.date)
      );
      let rowCls = '';
      if(isYou) rowCls += ' you';
      if(rank===1) rowCls += ' gold';
      else if(rank===2) rowCls += ' silver';
      else if(rank===3) rowCls += ' bronze';
      let medal = `${rank}`;
      let medalCls = '';
      if(rank===1){ medal='&#129351;'; medalCls=' medal'; }
      else if(rank===2){ medal='&#129352;'; medalCls=' medal'; }
      else if(rank===3){ medal='&#129353;'; medalCls=' medal'; }
      const d = new Date(e.date);
      const datestr = `${d.toLocaleDateString()} &middot; ${e.correct}/${e.total} &middot; avg ${(e.avgTime||0).toFixed(1)}s`;
      return `<div class="lb-row${rowCls}">
        <div class="lb-rank${medalCls}">${medal}</div>
        <div class="lb-name">${escapeHtml(e.name)}${isYou?' <span style="color:#f59e0b;font-weight:800;">(YOU)</span>':''}<small>${datestr}</small></div>
        <div class="lb-score">${e.score.toLocaleString()}</div>
      </div>`;
    }).join('');
  }

  // ===== Confetti =====
  function launchConfetti(){
    const c = $('confetti');
    if(!c) return;
    c.innerHTML = '';
    const colors = ['#e21b3c','#1368ce','#d89e00','#26890c','#864cbf','#f59e0b'];
    for(let i=0; i<80; i++){
      const s = document.createElement('span');
      s.style.left = Math.random()*100 + 'vw';
      s.style.background = colors[Math.floor(Math.random()*colors.length)];
      s.style.animationDuration = (2 + Math.random()*2) + 's';
      s.style.animationDelay = (Math.random()*0.8) + 's';
      s.style.transform = `rotate(${Math.random()*360}deg)`;
      c.appendChild(s);
    }
    setTimeout(()=>{ c.innerHTML=''; }, 5000);
  }
})();
