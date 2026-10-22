(() => {
  const screens = [...document.querySelectorAll('.screen')];
  const toast = document.getElementById('toast');
  let applicant = {};
  let toastTimer;
  const taskLoader = document.createElement('div'); taskLoader.className='ep-form-task-loader'; taskLoader.hidden=true; taskLoader.setAttribute('role','status'); taskLoader.textContent='✦ Sending your owl…'; document.body.appendChild(taskLoader);
  const db = window.supabase && window.EPISTEME_SUPABASE_CONFIG
    ? window.supabase.createClient(window.EPISTEME_SUPABASE_CONFIG.url, window.EPISTEME_SUPABASE_CONFIG.publishableKey)
    : null;

  const wingOptions = document.getElementById('wing-options');
  if (wingOptions) {
    (window.EPISTEME_CONFIG?.WINGS || []).forEach(wing => {
      const label = document.createElement('label');
      label.className = 'wing-card';
      const input = document.createElement('input');
      input.type = 'checkbox'; input.name = 'wing'; input.value = wing.name;
      const img = document.createElement('img'); img.src = wing.image; img.alt = `${wing.name} wing emblem`; img.loading = 'lazy';
      const title = document.createElement('span'); title.className = 'wing-card-name'; title.textContent = wing.name;
      const tagline = document.createElement('span'); tagline.className = 'wing-card-sub'; tagline.textContent = wing.tagline || 'Explore · Create · Evolve';
      const mark = document.createElement('span'); mark.className = 'selected-mark'; mark.textContent = '✓';
      label.append(input, img, title, tagline, mark); wingOptions.appendChild(label);
    });
  }

  function showScreen(id) {
    screens.forEach(screen => {
      const active = screen.id === id;
      screen.hidden = !active;
      screen.classList.toggle('active', active);
    });
    document.getElementById('wing-error').hidden = true;
    // Return focus to the new screen heading or first control for accessibility.
    const target = document.getElementById(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const focusTarget = target?.querySelector('h1,h2,input,button');
    if (focusTarget) setTimeout(() => focusTarget.focus?.({preventScroll:true}), 30);
    if (id === 'wing-picker') {
      const loader = document.getElementById('wing-logo-loader');
      if (loader) {
        loader.hidden = false;
        const images = [...document.querySelectorAll('#wing-options img')];
        Promise.all(images.map(img => img.decode ? img.decode().catch(() => {}) : Promise.resolve())).finally(() => {
          window.setTimeout(() => { loader.hidden = true; }, 700);
        });
      }
    }
  }
  document.addEventListener('EPISTEME:show-screen', event => {
    const id = event.detail && event.detail.id;
    if (id && screens.some(screen => screen.id === id)) showScreen(id);
  });

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 5000);
  }
  function referenceId() {
    const stamp = Date.now().toString().slice(-6);
    const rand = Math.floor(Math.random() * 90 + 10);
    return `EPI-${stamp}${rand}`;
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-go]');
    if (button) showScreen(button.dataset.go);
  });

  document.getElementById('wings-details-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = new FormData(event.currentTarget);
    applicant = { name: String(data.get('name')).trim(), mobile: String(data.get('mobile')).trim(), year: String(data.get('year')) };
    showScreen('wing-picker');
  });

  document.getElementById('wing-selection-form').addEventListener('submit', async event => {
    event.preventDefault();
    const wings = [...document.querySelectorAll('input[name="wing"]:checked')].map(input => input.value);
    const error = document.getElementById('wing-error');
    if (!wings.length) { error.hidden = false; return; }
    await submitApplication({ ...applicant, type: 'Wings', wings });
  });

  document.getElementById('membership-form').addEventListener('submit', async event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    const data = new FormData(event.currentTarget);
    await submitApplication({ name: String(data.get('name')).trim(), mobile: String(data.get('mobile')).trim(), year: String(data.get('year')), type: 'Episteme Membership', wings: [] });
  });

  function startMembershipCeremony() {
    const ceremony = document.getElementById('membership-ceremony');
    if (!ceremony) return;
    const phases = [...ceremony.querySelectorAll('[data-ceremony-phase]:not([data-ceremony-phase="wallet"])')];
    const durations = [2900, 2700, 0];
    let index = 0;
    const showPhase = (next) => {
      if (next >= phases.length) return;
      phases.forEach((phase, i) => {
        phase.hidden = i !== next;
        phase.classList.toggle('is-active', i === next);
      });
      index = next;
      if (durations[next] > 0) window.setTimeout(() => showPhase(next + 1), durations[next]);
    };
    showPhase(0);
  }

  async function submitApplication(payload) {
    const submitButtons = [...document.querySelectorAll('form button[type="submit"]')];
    taskLoader.hidden=false;
    submitButtons.forEach(button => { button.disabled = true; button.dataset.originalText = button.innerHTML; button.textContent = 'Submitting…'; });
    try {
      if (!db) throw new Error('The secure submission service could not be loaded. Please refresh and try again.');
      const ref = referenceId();
      const record = {
        reference_id: ref,
        full_name: payload.name,
        mobile: payload.mobile,
        year_of_study: payload.year,
        application_type: payload.type,
        // The database only accepts title-case wing names (e.g. 'Cognitiva'), so normalise the uppercase display names.
        wings: (payload.wings || []).map(wing => wing.charAt(0).toUpperCase() + wing.slice(1).toLowerCase()),
        source: 'EPISTEME Joining Portal'
      };
      // Never leave the form spinning indefinitely if the network or Supabase stalls.
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 12000);
      let result;
      try {
        result = await db.from('episteme_membership_applications').insert(record).abortSignal(controller.signal);
      } catch (requestError) {
        if (controller.signal.aborted) throw new Error('The request took too long. Check your connection and try again.');
        throw requestError;
      } finally {
        window.clearTimeout(timeoutId);
      }
      const { error } = result;
      if (error) throw error;
      const sortingResult = document.getElementById('sorting-result');
      const letterResult = document.getElementById('letter-result');
      sortingResult.hidden = payload.type !== 'Wings';
      letterResult.hidden = payload.type === 'Wings';
      if (payload.type === 'Wings') {
        document.getElementById('wing-member-name').textContent = payload.name;
        const wingNames = document.getElementById('sorted-wing-names');
        wingNames.replaceChildren();
        payload.wings.forEach(wing => {
          const pill = document.createElement('span'); pill.className = 'sorted-wing-pill'; pill.textContent = wing; wingNames.appendChild(pill);
        });
        const hatStage = document.querySelector('.sorting-hat-stage');
        const sortingCopy = document.querySelector('.sorting-copy');
        if (hatStage && sortingCopy) { hatStage.style.animation = 'none'; sortingCopy.style.animation = 'none'; void hatStage.offsetWidth; hatStage.style.animation = ''; sortingCopy.style.animation = ''; }
      } else {
        document.getElementById('letter-member-name').textContent = payload.name;
        const ceremonyName = document.getElementById('ceremony-member-name');
        if (ceremonyName) ceremonyName.textContent = payload.name;
        const ceremony = document.getElementById('membership-ceremony');
        if (ceremony) {
          ceremony.hidden = false;
          ceremony.classList.remove('ceremony-finished');
          const phases = [...ceremony.querySelectorAll('[data-ceremony-phase]:not([data-ceremony-phase="wallet"])')];
          ceremony.querySelector('[data-ceremony-phase="wallet"]')?.setAttribute('hidden','');
          phases.forEach((phase, index) => { phase.hidden = index !== 0; phase.classList.toggle('is-active', index === 0); });
        }
        const envelope = document.getElementById('envelope-wrap');
        if (envelope) {
          envelope.style.animation = 'none';
          const letter = envelope.querySelector('.acceptance-letter');
          const flap = envelope.querySelector('.envelope-flap');
          const seal = envelope.querySelector('.wax-seal');
          [letter, flap, seal].filter(Boolean).forEach(el => { el.style.animation = 'none'; });
          void envelope.offsetWidth;
          envelope.style.animation = ''; [letter, flap, seal].filter(Boolean).forEach(el => { el.style.animation = ''; });
        }
      }
      showScreen('success');
      if (payload.type !== 'Wings') startMembershipCeremony();
      showToast(`Application submitted successfully. Reference: ${ref}`);
    } catch (error) {
      console.error('EPISTEME application submission failed:', error);
      const message = String(error?.message || '');
      showToast(/too long|abort|fetch|network|timeout/i.test(message) ? 'Connection is taking too long. Check your internet and try again.' : 'We could not save your application. Nothing has been marked as submitted; please try again.');
    } finally {
      taskLoader.hidden=true;
      submitButtons.forEach(button => { button.disabled = false; if (button.dataset.originalText) button.innerHTML = button.dataset.originalText; });
    }
  }
  const dobbyButton = document.getElementById('join-dobby-nav');
  const dobbyMenu = document.getElementById('join-dobby-menu');
  const dobbyClose = document.getElementById('join-dobby-close');
  if (dobbyButton && dobbyMenu) {
    const closeMenu = () => { dobbyMenu.hidden = true; dobbyButton.setAttribute('aria-expanded','false'); };
    dobbyButton.addEventListener('click', () => { dobbyMenu.hidden = !dobbyMenu.hidden; dobbyButton.setAttribute('aria-expanded', String(!dobbyMenu.hidden)); });
    dobbyClose?.addEventListener('click', closeMenu);
    dobbyMenu.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', closeMenu));
    document.addEventListener('click', event => { if (!dobbyMenu.hidden && !dobbyMenu.contains(event.target) && !dobbyButton.contains(event.target)) closeMenu(); });
  }
})();
