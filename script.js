let DUE = new Date('2026-04-16T16:00:00Z');
let isChecked = false;
let currentStatus = 'In Progress';
let currentPriority = 'High';
let isExpanded = false;
let isEditMode = false;
let timeInterval;

function calcTime() {
  if (currentStatus === 'Done') {
    return { t: 'Completed', c: 'completed' };
  }
  const diff = DUE - Date.now();
  const abs = Math.abs(diff);
  const mins = Math.floor(abs / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (diff < 0) {
    document.getElementById('overdue-indicator').style.display = 'inline';
    if (mins < 60) return { t: 'Overdue by ' + mins + 'm', c: 'overdue' };
    if (hrs < 24) return { t: 'Overdue by ' + hrs + 'h', c: 'overdue' };
    return { t: 'Overdue by ' + days + 'd', c: 'overdue' };
  } else {
    document.getElementById('overdue-indicator').style.display = 'none';
  }

  if (mins < 1) return { t: 'Due now!', c: 'soon' };
  if (mins < 60) return { t: 'Due in ' + mins + ' min', c: 'soon' };
  if (hrs < 24) return { t: 'Due in ' + hrs + ' hours', c: 'soon' };
  if (hrs < 48) return { t: 'Due tomorrow', c: 'soon' };
  return { t: 'Due in ' + days + ' days', c: 'ok' };
}

function updateTime() {
  const el = document.getElementById('time-rem');
  const { t, c } = calcTime();
  el.textContent = t;
  el.className = 'time-chip ' + c;
}

function updateDueDateDisplay() {
  const dueDateEl = document.getElementById('due-date');
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  dueDateEl.textContent = DUE.toLocaleDateString('en-US', options);
  dueDateEl.setAttribute('datetime', DUE.toISOString());
}

function setStatus(status) {
  currentStatus = status;
  const card = document.getElementById('todo-card');
  const sb = document.getElementById('status-badge');
  const st = document.getElementById('status-text');
  const rb = document.getElementById('ring-btn');
  const statusControl = document.getElementById('status-control');

  statusControl.value = status;

  if (status === 'Done') {
    isChecked = true;
    card.classList.add('done');
    sb.className = 'badge badge-done';
    st.textContent = 'Done';
    sb.setAttribute('aria-label', 'Status: Done');
    rb.setAttribute('aria-checked', 'true');
    document.getElementById('chk').checked = true;
    clearInterval(timeInterval);
    updateTime();
  } else {
    if (status === 'Pending') {
      isChecked = false;
      card.classList.remove('done');
      sb.className = 'badge badge-pending';
      st.textContent = 'Pending';
      sb.setAttribute('aria-label', 'Status: Pending');
      rb.setAttribute('aria-checked', 'false');
      document.getElementById('chk').checked = false;
    } else { // In Progress
      isChecked = false;
      card.classList.remove('done');
      sb.className = 'badge badge-inprogress';
      st.textContent = 'In Progress';
      sb.setAttribute('aria-label', 'Status: In Progress');
      rb.setAttribute('aria-checked', 'false');
      document.getElementById('chk').checked = false;
    }
    if (!timeInterval) {
      timeInterval = setInterval(updateTime, 30000);
    }
    updateTime();
  }
}

function setPriority(priority) {
  currentPriority = priority;
  const badge = document.querySelector('#priority-indicator .badge');
  const priorityDot = document.querySelector('.priority-dot');

  badge.className = `badge badge-${priority.toLowerCase()}`;
  badge.setAttribute('aria-label', `Priority: ${priority}`);

  // Update priority dot color
  switch (priority.toLowerCase()) {
    case 'high':
      priorityDot.style.background = 'var(--red)';
      break;
    case 'medium':
      priorityDot.style.background = 'var(--amber)';
      break;
    case 'low':
      priorityDot.style.background = 'var(--green)';
      break;
  }
}

function clickRing() {
  isChecked = !isChecked;
  document.getElementById('chk').checked = isChecked;
  setStatus(isChecked ? 'Done' : 'Pending');
}

function handleToggle(cb) {
  isChecked = cb.checked;
  setStatus(isChecked ? 'Done' : 'Pending');
}

function handleStatusChange(status) {
  setStatus(status);
}

function toggleExpand() {
  const desc = document.getElementById('task-desc');
  const toggle = document.getElementById('expand-toggle');
  const container = document.getElementById('description-container');

  isExpanded = !isExpanded;

  if (isExpanded) {
    container.classList.remove('collapsed');
    toggle.innerHTML = `
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="3,10 7,6 11,10" />
      </svg>
      Collapse
    `;
    toggle.setAttribute('aria-expanded', 'true');
  } else {
    container.classList.add('collapsed');
    toggle.innerHTML = `
      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="3,6 7,10 11,6" />
      </svg>
      Expand
    `;
    toggle.setAttribute('aria-expanded', 'false');
  }
}

function checkDescriptionLength() {
  setTimeout(() => {
    const desc = document.getElementById('task-desc');
    const toggle = document.getElementById('expand-toggle');
    const container = document.getElementById('description-container');

    desc.style.display = 'block';
    const scrollHeight = desc.scrollHeight;
    desc.style.display = '';

    if (scrollHeight > 60) {
      toggle.style.display = 'inline-flex';
      container.classList.add('collapsed');
    } else {
      toggle.style.display = 'none';
      container.classList.remove('collapsed');
    }
  }, 100);
}

function enterEditMode() {
  isEditMode = true;
  document.getElementById('edit-form').style.display = 'block';
  document.querySelector('.card-inner').style.display = 'none';
  document.querySelector('.card-footer').style.display = 'none';

  document.getElementById('edit-title').value = document.getElementById('task-title').textContent.trim();
  document.getElementById('edit-description').value = document.getElementById('task-desc').textContent.trim();
  document.getElementById('edit-priority').value = currentPriority;
  document.getElementById('edit-due-date').value = DUE.toISOString().slice(0, 16);

  document.getElementById('edit-title').focus();
}

function saveEdit() {
  document.getElementById('task-title').textContent = document.getElementById('edit-title').value;
  document.getElementById('task-desc').textContent = document.getElementById('edit-description').value;
  DUE = new Date(document.getElementById('edit-due-date').value);
  updateDueDateDisplay();

  const newPriority = document.getElementById('edit-priority').value;
  if (newPriority !== currentPriority) {
    setPriority(newPriority);
  }

  exitEditMode();
  checkDescriptionLength();
  updateTime();
}

function cancelEdit() {
  exitEditMode();
}

function exitEditMode() {
  isEditMode = false;
  document.getElementById('edit-form').style.display = 'none';
  document.querySelector('.card-inner').style.display = 'block';
  document.querySelector('.card-footer').style.display = 'flex';

  document.querySelector('[data-testid="test-todo-edit-button"]').focus();
}

document.addEventListener('keydown', function(e) {
  if (isEditMode) {
    if (e.key === 'Escape') {
      cancelEdit();
    }
    return;
  }

  const focusableElements = [
    document.getElementById('ring-btn'),
    document.getElementById('status-control'),
    document.getElementById('expand-toggle'),
    document.querySelector('[data-testid="test-todo-edit-button"]'),
    document.querySelector('[data-testid="test-todo-delete-button"]')
  ].filter(el => el && el.style.display !== 'none');

  const currentIndex = focusableElements.indexOf(document.activeElement);

  if (e.key === 'Tab') {
    e.preventDefault();
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    focusableElements[nextIndex].focus();
  }
});

document.getElementById('ring-btn').addEventListener('keydown', function(e) {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    clickRing();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  updateDueDateDisplay();
  setPriority(currentPriority);
  checkDescriptionLength();
  updateTime();
  timeInterval = setInterval(updateTime, 30000);
});
 