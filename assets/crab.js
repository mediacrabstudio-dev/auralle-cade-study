/* Crab Studio site script: shared by the home page and every case page. */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover:hover)').matches;
  var root = document.documentElement;

  /* ---------- menu ---------- */
  var mb = document.querySelector('.menu-btn');
  if(mb){
    mb.addEventListener('click', function(){
      var open = !root.classList.contains('menu-open');
      root.classList.toggle('menu-open', open);
      mb.setAttribute('aria-expanded', open ? 'true' : 'false');
      if(window.__lenis){ open ? window.__lenis.stop() : window.__lenis.start(); }
    });
    document.querySelectorAll('.drawer a').forEach(function(a){
      a.addEventListener('click', function(){ root.classList.remove('menu-open'); mb.setAttribute('aria-expanded','false'); if(window.__lenis) window.__lenis.start(); });
    });
  }

  /* ---------- videos: play only while on screen ---------- */
  var autoV = document.querySelectorAll('video[data-auto]');
  var vio = null;
  if('IntersectionObserver' in window){
    vio = new IntersectionObserver(function(es){
      es.forEach(function(e){
        var v = e.target;
        if(e.isIntersecting){
          if(v.dataset.userpaused) return;
          if(v.preload === 'none') v.preload = 'auto';
          var p = v.play(); if(p && p.catch) p.catch(function(){});
        } else { v.pause(); }
      });
    }, { threshold: 0.25, rootMargin: '120px 0px' });
    autoV.forEach(function(v){ v.muted = true; vio.observe(v); });
  }
  /* hover-to-play videos (work cards) */
  document.querySelectorAll('[data-hoverplay]').forEach(function(card){
    var v = card.querySelector('video'); if(!v) return;
    if(!canHover){ v.setAttribute('data-auto',''); if(vio){ v.muted = true; vio.observe(v); } return; }
    card.addEventListener('mouseenter', function(){ v.preload = 'auto'; var p = v.play(); if(p && p.catch) p.catch(function(){}); });
    card.addEventListener('mouseleave', function(){ v.pause(); });
  });

  /* ---------- hero film player (case pages) ---------- */
  var fv = document.getElementById('filmv');
  if(fv){
    var fb = document.getElementById('fbtn'), fl = document.getElementById('flbl'), fi = document.getElementById('ficon');
    var sb = document.getElementById('snd'), sl = document.getElementById('sndl'), ft = document.getElementById('ftime');
    function fmt(s){ s = Math.floor(s||0); return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2); }
    fv.addEventListener('timeupdate', function(){ if(ft) ft.textContent = fmt(fv.currentTime)+' / '+fmt(fv.duration); });
    function setIcon(){ if(!fb) return; var p = fv.paused; fl.textContent = p ? 'Play' : 'Pause'; fb.setAttribute('aria-label', p ? 'Play film' : 'Pause film');
      fi.innerHTML = p ? '<path d="M2 1l9 5-9 5z" fill="currentColor"/>' : '<rect x="2" y="1" width="2.6" height="10" fill="currentColor"/><rect x="7.4" y="1" width="2.6" height="10" fill="currentColor"/>'; }
    fv.addEventListener('play', setIcon); fv.addEventListener('pause', setIcon);
    if(fb) fb.addEventListener('click', function(){ if(fv.paused){ delete fv.dataset.userpaused; fv.play().catch(function(){}); } else { fv.dataset.userpaused = '1'; fv.pause(); } });
    if(sb) sb.addEventListener('click', function(){ fv.muted = !fv.muted; if(!fv.muted){ fv.currentTime = 0; delete fv.dataset.userpaused; fv.play().catch(function(){}); }
      sl.textContent = fv.muted ? 'Sound on' : 'Sound off'; sb.setAttribute('aria-label', fv.muted ? 'Turn sound on' : 'Turn sound off'); });
    var fsb = document.getElementById('fs');
    if(fsb) fsb.addEventListener('click', function(){ openLB([{src:fv.currentSrc||fv.src, type:'video', cap:document.title}], 0); fv.pause(); });
  }

  /* ---------- lightbox ---------- */
  var lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true'); lb.setAttribute('aria-label','Media viewer');
  lb.innerHTML = '<div class="stage"></div><button class="x" type="button" aria-label="Close">×</button><button class="pv" type="button" aria-label="Previous">←</button><button class="nx" type="button" aria-label="Next">→</button><div class="cap"></div>';
  document.body.appendChild(lb);
  var stage = lb.querySelector('.stage'), cap = lb.querySelector('.cap'), items = [], idx = 0, lastFocus = null;
  function show(i){
    idx = (i + items.length) % items.length; var it = items[idx];
    stage.innerHTML = it.type === 'video'
      ? '<video src="'+it.src+'" controls autoplay playsinline'+(it.poster?' poster="'+it.poster+'"':'')+'></video>'
      : '<img src="'+it.src+'" alt="'+(it.cap||'')+'">';
    cap.textContent = it.cap || '';
    lb.querySelector('.pv').style.display = lb.querySelector('.nx').style.display = items.length > 1 ? '' : 'none';
  }
  function openLB(list, i){
    items = list; lastFocus = document.activeElement; show(i); lb.classList.add('on');
    document.querySelectorAll('video[data-auto]').forEach(function(v){ v.pause(); });
    if(window.__lenis) window.__lenis.stop();
    lb.querySelector('.x').focus();
  }
  window.openLB = openLB;
  function closeLB(){ lb.classList.remove('on'); stage.innerHTML = ''; if(window.__lenis) window.__lenis.start(); if(lastFocus) lastFocus.focus(); }
  lb.querySelector('.x').addEventListener('click', closeLB);
  lb.querySelector('.pv').addEventListener('click', function(){ show(idx-1); });
  lb.querySelector('.nx').addEventListener('click', function(){ show(idx+1); });
  lb.addEventListener('click', function(e){ if(e.target === lb) closeLB(); });
  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('on')) return;
    if(e.key === 'Escape') closeLB(); if(e.key === 'ArrowRight') show(idx+1); if(e.key === 'ArrowLeft') show(idx-1);
  });
  function collect(el){
    var g = el.getAttribute('data-group');
    var els = g ? Array.prototype.filter.call(document.querySelectorAll('[data-lightbox][data-group="'+g+'"]'), function(x){ return !x.closest('[hidden]'); }) : [el];
    return { list: els.map(function(x){ return { src:x.getAttribute('data-lightbox'), type:/\.mp4$/i.test(x.getAttribute('data-lightbox'))?'video':'img', cap:x.getAttribute('data-cap')||'', poster:x.getAttribute('data-poster') }; }), i: els.indexOf(el) };
  }
  document.addEventListener('click', function(e){
    var el = e.target.closest('[data-lightbox]'); if(!el) return;
    e.preventDefault(); var c = collect(el); openLB(c.list, Math.max(0, c.i));
  });
  document.querySelectorAll('[data-lightbox]').forEach(function(el){
    if(!el.hasAttribute('tabindex') && el.tagName !== 'A' && el.tagName !== 'BUTTON'){ el.setAttribute('tabindex','0'); el.setAttribute('role','button'); }
    el.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); el.click(); } });
  });

  /* ---------- reel filters ---------- */
  document.querySelectorAll('.filters').forEach(function(f){
    var target = document.getElementById(f.getAttribute('data-for')); if(!target) return;
    var moreBtn = document.querySelector('[data-more="'+target.id+'"]');
    var limit = parseInt(target.getAttribute('data-limit') || '0', 10), expanded = false, current = '*';
    function apply(){
      var n = 0;
      target.querySelectorAll('[data-cat]').forEach(function(r){
        var cats = r.getAttribute('data-cat').split('|');
        var match = current === '*' || cats.indexOf(current) > -1;
        if(match) n++;
        r.hidden = !match || (limit && !expanded && current === '*' && n > limit);
      });
      if(moreBtn) moreBtn.parentNode.hidden = !(limit && current === '*' && !expanded && n > limit);
      if(window.ScrollTrigger) window.ScrollTrigger.refresh();
    }
    f.addEventListener('click', function(e){
      var b = e.target.closest('button'); if(!b) return;
      f.querySelectorAll('button').forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      current = b.getAttribute('data-f'); apply();
    });
    if(moreBtn) moreBtn.addEventListener('click', function(){ expanded = true; apply(); });
    apply();
  });

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq details').forEach(function(d){
    d.addEventListener('toggle', function(){ if(d.open) document.querySelectorAll('.faq details').forEach(function(o){ if(o !== d) o.open = false; }); if(window.ScrollTrigger) setTimeout(function(){ window.ScrollTrigger.refresh(); }, 50); });
  });

  /* ---------- brief builder (home) ---------- */
  var bf = document.getElementById('brief');
  if(bf){
    var out = document.getElementById('briefout'), mail = document.getElementById('briefmail'), copyb = document.getElementById('briefcopy'), note = document.getElementById('briefnote');
    function text(){
      var picks = Array.prototype.map.call(bf.querySelectorAll('input[name="svc"]:checked'), function(i){ return i.value; });
      var name = bf.querySelector('#bname').value.trim(), co = bf.querySelector('#bco').value.trim(), when = bf.querySelector('#bwhen').value, msg = bf.querySelector('#bmsg').value.trim();
      return 'Hi Crab Studio,\n\n' + (name ? 'I am ' + name + (co ? ' from ' + co : '') + '. ' : '') + 'We are looking for help with: ' + (picks.length ? picks.join(', ') : 'a new project') + '.\n' + (when ? 'Timeline: ' + when + '.\n' : '') + (msg ? '\n' + msg + '\n' : '') + '\nThanks!';
    }
    function update(){ var t = text(); out.textContent = t; mail.href = 'mailto:media.crabstudio@gmail.com?subject=' + encodeURIComponent('New project' + (bf.querySelector('#bco').value.trim() ? ' — ' + bf.querySelector('#bco').value.trim() : '')) + '&body=' + encodeURIComponent(t); }
    bf.addEventListener('input', update); bf.addEventListener('change', update);
    bf.addEventListener('submit', function(e){ e.preventDefault(); mail.click(); });
    copyb.addEventListener('click', function(){
      var t = text();
      if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(function(){ note.textContent = 'Copied. Paste it into an email to media.crabstudio@gmail.com or a WhatsApp to +91 92136 37784.'; }, function(){ note.textContent = 'Select the text above and copy it.'; }); }
      else note.textContent = 'Select the text above and copy it.';
    });
    update();
  }

  /* ---------- showreel timecode (home) ---------- */
  var hv = document.getElementById('herov'), tc = document.getElementById('tc');
  if(hv && tc){
    hv.addEventListener('timeupdate', function(){ var s = hv.currentTime, f = Math.floor((s % 1) * 25); tc.textContent = '00:' + ('0'+Math.floor(s/60)).slice(-2) + ':' + ('0'+Math.floor(s%60)).slice(-2) + ':' + ('0'+f).slice(-2); });
  }

  /* ---------- GSAP layer ---------- */
  var loader = document.querySelector('.loader');
  var hasG = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if(!hasG){ if(loader) loader.remove(); document.querySelectorAll('.nav,.hero .tag,.hero .hsub,.hx').forEach(function(x){ x.style.opacity = 1; }); return; }
  gsap.registerPlugin(ScrollTrigger);

  var lenis = null;
  if(!reduce && typeof Lenis !== 'undefined'){
    lenis = new Lenis({ lerp:0.09, smoothWheel:true, wheelMultiplier:0.95 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(t){ lenis.raf(t*1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href'); var el = id.length > 1 ? document.querySelector(id) : document.body;
      if(!el) return; e.preventDefault();
      if(lenis) lenis.scrollTo(el, { duration:1.6, offset: id.length > 1 ? -10 : 0 }); else el.scrollIntoView({ behavior:'smooth' });
    });
  });

  function splitLines(el){
    var words = [];
    Array.prototype.forEach.call(el.childNodes, function(n){
      var cls = n.nodeType === 1 ? (n.className || '') : '';
      (n.textContent || '').split(/\s+/).forEach(function(w){ if(w) words.push({ t:w, c:cls }); });
    });
    el.innerHTML = words.map(function(w){ return '<span class="w '+w.c+'" style="display:inline-block">'+w.t+'</span>'; }).join(' ');
    var lines = [], top = null, cur = [];
    el.querySelectorAll('.w').forEach(function(w){ var t = w.offsetTop; if(top === null || Math.abs(t-top) > 4){ if(cur.length) lines.push(cur); cur = []; top = t; } cur.push(w); });
    if(cur.length) lines.push(cur);
    el.innerHTML = lines.map(function(l){ return '<span class="line"><span>'+l.map(function(w){ return w.outerHTML; }).join(' ')+'</span></span>'; }).join('');
    return el.querySelectorAll('.line>span');
  }

  /* loader + intro */
  var heroWords = document.querySelectorAll('.hero h1 > span, .hx-h .l > span');
  var heroMedia = document.querySelector('.hero .player, .hx-media');
  var heroFade = document.querySelectorAll('.nav, .hero .tag, .hero .hsub, .hx');
  gsap.set(heroWords, { yPercent:110 });
  if(heroMedia) gsap.set(heroMedia, { y:60, opacity:0 });
  gsap.set(heroFade, { opacity:0 });
  function intro(){
    var tl = gsap.timeline({ onComplete:function(){ if(lenis) lenis.start(); } });
    if(loader) tl.to(loader, { yPercent:-100, duration:1.05, ease:'expo.inOut' });
    if(heroMedia) tl.to(heroMedia, { y:0, opacity:1, duration:1.5, ease:'expo.out' }, '-=0.5');
    tl.to(heroWords, { yPercent:0, duration:1.3, ease:'expo.out', stagger:0.06 }, '-=1.3')
      .to(heroFade, { opacity:1, duration:1, ease:'power2.out' }, '-=0.9')
      .add(function(){ if(loader) loader.remove(); });
  }
  var cnt = document.getElementById('cnt');
  if(reduce || !loader || sessionStorageSeen()){
    if(loader) loader.remove(); loader = null;
    if(reduce){ gsap.set(heroWords, { yPercent:0 }); if(heroMedia) gsap.set(heroMedia, { y:0, opacity:1 }); gsap.set(heroFade, { opacity:1 }); if(lenis) lenis.start(); }
    else intro();
  } else {
    var o = { v:0 };
    gsap.to(o, { v:100, duration:1.3, ease:'power3.inOut', onUpdate:function(){ cnt.textContent = Math.round(o.v); }, onComplete:intro });
  }
  function sessionStorageSeen(){ try { var k = 'crab-seen-' + location.pathname; if(sessionStorage.getItem(k)) return true; sessionStorage.setItem(k, '1'); } catch(e){} return false; }

  /* progress + nav */
  gsap.to('.progress', { scaleX:1, ease:'none', scrollTrigger:{ start:0, end:'max', scrub:0.3 } });
  var nav = document.querySelector('.nav'), lastY = 0;
  ScrollTrigger.create({ start:0, end:'max', onUpdate:function(s){ var y = s.scroll(); if(!root.classList.contains('menu-open')) nav.classList.toggle('hide', y > lastY && y > 300); nav.classList.toggle('solid', y > 80); lastY = y; } });

  if(reduce) return;

  function setupText(){
    document.querySelectorAll('.split').forEach(function(el){
      var lines = splitLines(el);
      gsap.from(lines, { yPercent:110, duration:1.3, ease:'expo.out', stagger:0.08, scrollTrigger:{ trigger:el, start:'top 88%' } });
    });
    document.querySelectorAll('.scrub').forEach(function(st){
      st.innerHTML = st.textContent.trim().split(/\s+/).map(function(w){ return '<span class="w">'+w+'</span>'; }).join(' ');
      gsap.set(st.querySelectorAll('.w'), { opacity:.14 });
      gsap.to(st.querySelectorAll('.w'), { opacity:1, stagger:0.1, ease:'none', scrollTrigger:{ trigger:st, start:'top 80%', end:'bottom 50%', scrub:true } });
    });
    gsap.utils.toArray('.meta > div, .csi > div, .stat').forEach(function(x, i){
      gsap.from(x, { y:24, opacity:0, duration:1, ease:'expo.out', delay:(i%4)*0.06, scrollTrigger:{ trigger:x, start:'top 92%' } });
    });
    ScrollTrigger.refresh();
  }
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(setupText); else setupText();

  /* media reveal */
  document.querySelectorAll('[data-reveal]').forEach(function(f){
    var inner = f.querySelector('.in'); var media = inner ? inner.firstElementChild : null;
    var tl = gsap.timeline({ scrollTrigger:{ trigger:f, start:'top 95%', end:'top 40%', scrub:1 } });
    tl.fromTo(f, { clipPath:'inset(12% 9% 12% 9% round 6px)' }, { clipPath:'inset(0% 0% 0% 0% round 3px)', ease:'none' }, 0);
    if(media) tl.fromTo(media, { scale:1.25 }, { scale:1, ease:'none' }, 0);
  });
  gsap.utils.toArray('.reel, .wcard, .gal figure').forEach(function(r){
    gsap.from(r, { y:40, opacity:0, duration:1.1, ease:'expo.out', scrollTrigger:{ trigger:r, start:'top 96%' } });
  });

  var mm = gsap.matchMedia();
  mm.add('(min-width: 861px)', function(){
    document.querySelectorAll('.hpin').forEach(function(pin){
      var track = pin.querySelector('.htrack');
      gsap.to(track, { x:function(){ return -(track.scrollWidth - window.innerWidth); }, ease:'none',
        scrollTrigger:{ trigger:pin, start:'top top', end:function(){ return '+=' + (track.scrollWidth - window.innerWidth); }, pin:true, scrub:1, invalidateOnRefresh:true, anticipatePin:1 } });
    });
    document.querySelectorAll('[data-par]').forEach(function(c){
      var s = parseFloat(c.getAttribute('data-par'));
      gsap.fromTo(c, { yPercent:s }, { yPercent:-s, ease:'none', scrollTrigger:{ trigger:c.parentNode, start:'top bottom', end:'bottom top', scrub:true } });
    });
  });
  var nx = document.querySelector('.next .in');
  if(nx) gsap.fromTo(nx, { yPercent:-8 }, { yPercent:8, ease:'none', scrollTrigger:{ trigger:'.next', start:'top bottom', end:'bottom top', scrub:true } });

  /* tickers: time + scroll velocity */
  document.querySelectorAll('.ticker .tt, .mtrack').forEach(function(mt, k){
    mt.innerHTML += mt.innerHTML;
    var mx = 0, vel = 0, dir = mt.getAttribute('data-dir') === 'r' ? 1 : -1;
    if(lenis) lenis.on('scroll', function(e){ vel = e.velocity || 0; });
    gsap.ticker.add(function(){ var half = mt.scrollWidth/2; mx += dir*(0.6 + Math.abs(vel)*0.3); vel *= 0.92;
      if(dir < 0 && -mx >= half) mx += half; if(dir > 0 && mx >= 0) mx -= half; mt.style.transform = 'translate3d('+mx+'px,0,0)'; });
    if(dir > 0) mx = -mt.scrollWidth/4;
  });

  /* cursor */
  var cur = document.querySelector('.cur');
  if(cur && canHover){
    var xTo = gsap.quickTo(cur, 'x', { duration:0.5, ease:'power3' }), yTo = gsap.quickTo(cur, 'y', { duration:0.5, ease:'power3' });
    window.addEventListener('mousemove', function(e){ xTo(e.clientX); yTo(e.clientY); });
    document.querySelectorAll('[data-cur]').forEach(function(el){
      el.addEventListener('mouseenter', function(){ cur.querySelector('span').textContent = el.getAttribute('data-cur') || 'View'; cur.classList.add('big'); });
      el.addEventListener('mouseleave', function(){ cur.classList.remove('big'); });
    });
  }
  window.addEventListener('load', function(){ ScrollTrigger.refresh(); });
})();
