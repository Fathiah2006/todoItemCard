const DUE = new Date('2026-04-16T16:00:00Z');
  let isChecked = false;
 
  function calcTime() {
    const diff = DUE - Date.now();
    const abs  = Math.abs(diff);
    const mins = Math.floor(abs / 60000);
    const hrs  = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (diff < 0) {
      if (mins < 60) return { t: 'Overdue by ' + mins + 'm',  c: 'overdue' };
      if (hrs  < 24) return { t: 'Overdue by ' + hrs  + 'h',  c: 'overdue' };
      return { t: 'Overdue by ' + days + 'd', c: 'overdue' };
    }
    if (mins < 1)  return { t: 'Due now!',              c: 'soon' };
    if (mins < 60) return { t: 'In ' + mins + ' min',   c: 'soon' };
    if (hrs  < 24) return { t: 'In ' + hrs  + ' hours', c: 'soon' };
    if (hrs  < 48) return { t: 'Due tomorrow',           c: 'soon' };
    return { t: 'In ' + days + ' days', c: 'ok' };
  }
 
  function updateTime() {
    const el = document.getElementById('time-rem');
    const { t, c } = calcTime();
    el.textContent = t;
    el.className = 'time-chip ' + c;
  }
 
  function setDone(done) {
    const card = document.getElementById('todo-card');
    const sb   = document.getElementById('status-badge');
    const st   = document.getElementById('status-text');
    const rb   = document.getElementById('ring-btn');
    if (done) {
      card.classList.add('done');
      sb.className = 'badge badge-done';
      st.textContent = 'Done';
      sb.setAttribute('aria-label', 'Status: Done');
      rb.setAttribute('aria-checked', 'true');
    } else {
      card.classList.remove('done');
      sb.className = 'badge badge-inprogress';
      st.textContent = 'In Progress';
      sb.setAttribute('aria-label', 'Status: In Progress');
      rb.setAttribute('aria-checked', 'false');
    }
  }
 
  function clickRing() {
    isChecked = !isChecked;
    document.getElementById('chk').checked = isChecked;
    setDone(isChecked);
  }
 
  function handleToggle(cb) {
    isChecked = cb.checked;
    setDone(isChecked);
  }
 
  document.getElementById('ring-btn').addEventListener('keydown', function(e) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); clickRing(); }
  });
 
  updateTime();
  setInterval(updateTime, 60000);
 