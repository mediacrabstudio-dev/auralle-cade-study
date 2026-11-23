(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // phone gets the lighter film / photos
  if (window.matchMedia('(max-width: 860px)').matches) {
    document.querySelectorAll('video[data-mobile]').forEach(function(v){ v.src = v.dataset.mobile; });
  }
  // play videos only while visible
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ var v=e.target; if(e.isIntersecting){ v.play().catch(function(){}); } else v.pause(); }); }, { rootMargin:'150px' });
  document.querySelectorAll('video[data-auto]').forEach(function(v){ io.observe(v); });
  if (reduce || typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (typeof Lenis !== 'undefined') {
    var lenis = new Lenis({ lerp:0.085 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(t){ lenis.raf(t*1000); }); gsap.ticker.lagSmoothing(0);
  }
  gsap.from('.head h1, .head p, .head .no', { y:40, opacity:0, duration:1.2, ease:'expo.out', stagger:0.08 });
  var small = window.innerWidth < 861;
  document.querySelectorAll('.hero, .ph').forEach(function(f){
    var m = f.querySelector('img,video'); if(!m) return;
    gsap.fromTo(f, { clipPath: small ? 'inset(5% 4% 5% 4%)' : 'inset(10% 8% 10% 8%)' }, { clipPath:'inset(0% 0% 0% 0%)', ease:'none', scrollTrigger:{ trigger:f, start:'top 95%', end:'top 45%', scrub:1 } });
    gsap.fromTo(m, { scale:1.18 }, { scale:1, ease:'none', scrollTrigger:{ trigger:f, start:'top 95%', end:'top 45%', scrub:1 } });
  });
  gsap.utils.toArray('.sec').forEach(function(s){ gsap.from(s.children, { y:30, opacity:0, duration:1, ease:'expo.out', stagger:0.08, scrollTrigger:{ trigger:s, start:'top 85%' } }); });
  window.addEventListener('load', function(){ ScrollTrigger.refresh(); });
})();
