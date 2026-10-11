document.documentElement.classList.add('js');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const easing = 'cubic-bezier(.22,1,.36,1)';
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navegacao');
if (menu && nav) {
  menu.hidden = false;
  const close = () => {
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      close();
      menu.focus();
    }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', close);
}
const header = document.getElementById('header');
if (header) {
  let scheduled = false;
  const update = () => {
    const range = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('is-scrolled', scrollY > 40);
    header.style.setProperty('--scroll-progress', range > 0 ? Math.min(1, scrollY / range) : 0);
    scheduled = false;
  };
  addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive: true });
  addEventListener('resize', update);
  update();
}
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -25px 0px' });
  document.querySelectorAll('.sensory-grid .reveal').forEach((element, i) => {
    element.style.setProperty('--reveal-delay', `${i * 90}ms`);
  });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  document.documentElement.classList.add('motion-ready');
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      observer.disconnect();
      document.documentElement.classList.remove('motion-ready');
    }
  });
}
const tablist = document.querySelector('.flavor-tabs');
if (tablist) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const controls = document.querySelector('.flavor-controls');
  let current = 'morango';
  let requested = current;
  let generation = 0;
  let animations = [];
  const commit = slug => {
    tabs.forEach(tab => {
      const active = tab.dataset.flavor === slug;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      panel.hidden = !active;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
    });
    document.getElementById('flavor-counter').textContent = `${String(tabs.findIndex(tab => tab.dataset.flavor === slug) + 1).padStart(2, '0')} / 03`;
    current = slug;
  };
  const select = async (slug, focus = false) => {
    const tab = tabs.find(item => item.dataset.flavor === slug);
    if (!tab) return;
    if (focus) tab.focus();
    requested = slug;
    const token = ++generation;
    animations.forEach(animation => animation.cancel());
    animations = [];
    if (slug === current) return;
    const outgoing = document.getElementById(`panel-${current}`);
    if (!reducedMotion.matches && outgoing.animate) {
      const fade = outgoing.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: 'ease-out', fill: 'forwards' });
      animations.push(fade);
      await fade.finished.catch(() => {});
    }
    if (token !== generation) return;
    animations.forEach(animation => animation.cancel());
    animations = [];
    commit(slug);
    const incoming = document.getElementById(`panel-${slug}`);
    if (!reducedMotion.matches && incoming.animate) {
      animations.push(incoming.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 650, easing }));
      const image = incoming.querySelector('img');
      animations.push(image.animate([{ transform: 'scale(1.045)' }, { transform: 'scale(1)' }], { duration: 950, easing }));
      incoming.querySelectorAll('.flavor-copy > :not(.flavor-index)').forEach((element, i) => {
        animations.push(element.animate([{ opacity: 0, transform: 'translateY(15px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 620, delay: i * 45, easing, fill: 'backwards' }));
      });
    }
  };
  tablist.hidden = false;
  controls.hidden = false;
  commit(current);
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.flavor));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        select(tabs[next].dataset.flavor, true);
      }
    });
  });
  controls.querySelectorAll('[data-step]').forEach(button => {
    button.addEventListener('click', () => {
      const index = tabs.findIndex(tab => tab.dataset.flavor === requested);
      select(tabs[(index + Number(button.dataset.step) + tabs.length) % tabs.length].dataset.flavor);
    });
  });
  document.querySelectorAll('[data-select]').forEach(link => {
    link.addEventListener('click', () => select(link.dataset.select));
  });
}
// Keep native details semantics while animating their natural content height.
document.querySelectorAll('details').forEach(details => {
  const summary = details.querySelector('summary');
  let animation;
  let targetOpen = details.open;
  summary.addEventListener('click', event => {
    if (reducedMotion.matches || !details.animate) return;
    event.preventDefault();
    const from = details.getBoundingClientRect().height;
    animation?.cancel();
    targetOpen = !targetOpen;
    details.style.overflow = 'hidden';
    details.open = true;
    const to = targetOpen ? details.scrollHeight : summary.getBoundingClientRect().height;
    animation = details.animate([{ height: `${from}px` }, { height: `${to}px` }], { duration: 340, easing });
    animation.onfinish = () => {
      details.open = targetOpen;
      details.style.removeProperty('overflow');
      animation = undefined;
    };
  });
});
