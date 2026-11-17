'use strict';

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('nav-left');

function setMobileMenu(open) {
  navigation.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
}

menuToggle.addEventListener('click', () => {
  setMobileMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

navigation.addEventListener('click', event => {
  if (event.target.closest('a')) setMobileMenu(false);
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (menuToggle.getAttribute('aria-expanded') === 'true') {
    setMobileMenu(false);
    menuToggle.focus();
  } else if (document.activeElement.closest('.apf-dropdown')) {
    const dropdown = document.activeElement.closest('.apf-dropdown');
    dropdown.parentElement.querySelector(':scope > a').focus();
  }
});

const tabs = [...document.querySelectorAll('.cust-tab')];
if (tabs.length) {
  const syncTabs = () => {
    tabs.forEach(tab => {
      const active = tab.classList.contains('active');
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
  };

  const tablist = document.getElementById('cust-tabs');
  const track = new MutationObserver(syncTabs);
  tabs.forEach(tab => track.observe(tab, { attributes: true, attributeFilter: ['class'] }));

  tablist.addEventListener('keydown', event => {
    const index = tabs.indexOf(event.target);
    if (index === -1) return;
    const destination = {
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    if (destination === undefined) return;
    event.preventDefault();
    tabs[destination].click();
    tabs[destination].focus();
  });
}

const workVideo = document.querySelector('.rr-hero video');
const workVideoToggle = document.getElementById('work-video-toggle');
if (workVideo && workVideoToggle) {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let playbackRequested = !motion.matches;

  function syncVideoPlayback() {
    if (playbackRequested && !document.hidden) {
      workVideo.play().catch(() => {});
    } else {
      workVideo.pause();
    }
    workVideoToggle.setAttribute('aria-pressed', String(!playbackRequested));
    workVideoToggle.setAttribute('aria-label', playbackRequested ? 'Pause background video' : 'Play background video');
    workVideoToggle.textContent = playbackRequested ? 'Ⅱ' : '▶';
    document.documentElement.classList.toggle('pause-all', !playbackRequested);
  }

  workVideoToggle.addEventListener('click', () => {
    playbackRequested = !playbackRequested;
    syncVideoPlayback();
  });
  document.addEventListener('visibilitychange', syncVideoPlayback);
  motion.addEventListener('change', event => {
    playbackRequested = !event.matches;
    syncVideoPlayback();
  });
  syncVideoPlayback();
}

const updatesForm = document.getElementById('newsletter-form');
if (updatesForm) {
  updatesForm.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('email');
    if (!email.reportValidity()) return;
    const subject = encodeURIComponent('NC East Alliance news and updates');
    const body = encodeURIComponent('Hello NC East Alliance,\n\nPlease share how I can receive news and updates at ' + email.value.trim() + '.\n\nThank you.');
    document.getElementById('nl-msg').textContent = 'An email draft will open with your request.';
    location.href = 'mailto:raynor@nceast.org?subject=' + subject + '&body=' + body;
  });
}
