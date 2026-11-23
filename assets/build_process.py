"""Builds the six process detail pages under /process/<slug>/. Run from the repo root."""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def img(src, cls="", cap=None, alt=""):
    m = src[:-4] + "-m.jpg"
    srcset = f' srcset="/{m} 1100w, /{src} 2200w" sizes="(min-width:861px) 50vw, 100vw"' if os.path.exists(os.path.join(ROOT, m)) else ""
    c = f"<figcaption><span>{cap}</span></figcaption>" if cap else ""
    return f'<figure><div class="ph {cls}"><img src="/{src}"{srcset} alt="{alt or cap or ""}" loading="lazy"></div>{c}</figure>'

def vid(src, poster, cls="", cap=None, mobile=None):
    mob = f' data-mobile="/{mobile}"' if mobile else ""
    c = f"<figcaption><span>{cap}</span></figcaption>" if cap else ""
    return f'<figure><div class="ph {cls}"><video src="/{src}"{mob} poster="/{poster}" muted loop playsinline preload="none" data-auto></video></div>{c}</figure>'

def grid(n, *items):
    return f'<div class="grid g{n}">' + "".join(items) + "</div>"

def facts(*pairs):
    return '<div class="facts">' + "".join(f"<div><b>{a}</b><span>{b}</span></div>" for a, b in pairs) + "</div>"

def lst(*pairs):
    return '<ul class="list">' + "".join(f"<li><b>{a}</b><span>{b}</span></li>" for a, b in pairs) + "</ul>"

def sec(label, title, body):
    return f'<section class="sec"><span class="lbl">{label}</span><div><h2>{title}</h2>{body}</div></section>'

PAGES = [
  dict(slug="strategy", n="01", name="Strategy", title='Strategy',
    lead="A calm coastal home for people who already have the city, and want distance from it. Everything else in the brand follows from that one idea.",
    hero=img("media/06_e06_lawn_sea.jpg", alt="The lawn running to the sea with Mumbai on the horizon"),
    body=[
      sec("The buyer", "Who it is for.", "<p>Families from Mumbai who want a second home they can reach without leaving the city behind completely. They value privacy, space and light over spectacle, and they have seen every infinity-pool render already.</p>"),
      sec("The idea", "Quiet, not loud.", "<p>Most coastal launches shout: sunsets, slogans, offers. AURELLE does the opposite. Low buildings, deep shade, honest materials and a tone that never oversells. The line that carries it: <em>a quieter kind of extraordinary.</em></p>"),
      grid(2, img("media/03_a9iii_family_lawn.jpg", "w", "The lawn, with the city across the water"), img("media/01_e01_aerial.jpg", "w", "Between coastal forest and the shore")),
      sec("The selling point", "Mumbai, across the water.", "<p>From the deck, South Mumbai is a thin line on the horizon: close enough to know it is there, far enough to feel the difference. That single view became the anchor for the brochure, the film and the website.</p>"),
      sec("Rules we set", "What the brand never does.", lst(
        ("No prices or unit counts", "Nothing about availability, approvals or prices is stated as fact."),
        ("One call to action", "Every piece ends with a single, calm next step."),
        ("No stock clichés", "No palm-silhouette sunset as the only idea."),
        ("Concept disclaimer", "Every public piece says it is a design concept with visualised imagery."))),
    ]),
  dict(slug="identity", n="02", name="Identity", title='Identity',
    lead="An arch standing on a horizon line: the doorway of the house and the edge of the sea. A palette taken from the site itself.",
    hero=img("media/mock_wall.jpg", alt="Aurelle logo on a lime plaster wall"),
    body=[
      sec("The mark", "An arch, and the horizon.", "<p>A single open arch over one horizontal line. It works as a full lockup with the wordmark, as a small symbol on a gate light or a box, and as a favicon.</p>"),
      '<div class="grid g3">' +
        '<figure><div class="ph s" style="background:#142a32;display:flex;align-items:center;justify-content:center"><svg width="45%" viewBox="0 0 96 72" aria-hidden="true"><path d="M22 60V34A26 26 0 0 1 74 34V60" fill="none" stroke="#b77a55" stroke-width="2"/><line x1="2" y1="60" x2="94" y2="60" stroke="#f7f3ec" stroke-width="2"/></svg></div><figcaption><span>Symbol</span></figcaption></figure>' +
        '<figure><div class="ph s" style="background:#f7f3ec;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;color:#142a32"><svg width="26%" viewBox="0 0 96 72" aria-hidden="true"><path d="M22 60V34A26 26 0 0 1 74 34V60" fill="none" stroke="#142a32" stroke-width="2"/><line x1="2" y1="60" x2="94" y2="60" stroke="#142a32" stroke-width="2"/></svg><span style="font-size:clamp(18px,2.4vw,34px);letter-spacing:.38em;padding-left:.38em;font-weight:300">AURELLE</span></div><figcaption><span>Primary lockup</span></figcaption></figure>' +
        img("media/mock_gate.jpg", "s", "On the gate") + '</div>',
      sec("Colour", "Taken from the site.", '<div class="sw">'
        '<span style="background:#142a32;color:#f7f3ec">DEEP TIDE<br>#142A32</span>'
        '<span style="background:#f7f3ec;color:#142a32;box-shadow:inset 0 0 0 1px rgba(20,42,50,.15)">WARM IVORY<br>#F7F3EC</span>'
        '<span style="background:#e9ddc9;color:#142a32">COASTAL SAND<br>#E9DDC9</span>'
        '<span style="background:#89958a;color:#142a32">MUTED SAGE<br>#89958A</span>'
        '<span style="background:#b77a55;color:#142a32">COPPER<br>#B77A55</span></div>'
        "<p style=\"margin-top:20px\">Copper is used once per layout: a rule, a dot, a hairline. Sage stays on lines and graphics because it is too light to carry text.</p>"),
      sec("Type", "A light serif, a clean sans.", '<p style="font-family:\'Cormorant Garamond\',serif;font-weight:300;font-size:clamp(40px,5vw,84px);line-height:1;color:var(--ink);letter-spacing:-.01em">Space to <em>slow down.</em></p><p>A light display serif for everything you feel, a clean sans for everything you read. Italic replaces any script face.</p>'),
      grid(2, img("media/mock_cards.jpg", "w", "Business cards"), img("media/mock_stationery.jpg", "w", "Stationery")),
      grid(3, img("media/mock_box.jpg", "s", "Welcome box"), img("media/mock_book.jpg", "s", "Brochure"), img("media/mock_phone.jpg", "s", "Instagram")),
    ]),
  dict(slug="3d-estate", n="03", name="3D estate", title='3D estate',
    lead="The whole estate built to size in Blender, then baked with light so it runs live in a browser. Every image and film on this site starts from this model.",
    hero=vid("tour/loop/aerial.mp4", "tour/p/aerial.jpg"),
    body=[
      sec("The model", "Built from the site plan.", facts(
        ("68 × 48 m", "Plot"), ("G+1", "Plus a leisure basement"), ("5", "Bedrooms"),
        ("18 × 5 m", "Pool"), ("8 × 8 m", "Courtyard"), ("6 m", "Fire-pit lounge"))),
      sec("How it was made", "From blockout to baked light.", lst(
        ("Blockout", "Walls, levels and openings drawn to the site-plan dimensions."),
        ("Materials", "Photo-scanned textures: limestone, travertine, teak, lime plaster, linen."),
        ("Landscape", "Real palms, trees and shrubs placed across the plot, plus the shoreline and the bay."),
        ("Lighting", "Rendered in Blender and baked into the model, so the walkthrough looks lit, not flat."),
        ("Web build", "Compressed so the full estate streams into a phone or laptop browser."))),
      '<div class="dark"><section class="sec"><span class="lbl">Live walkthrough</span><div><h2>Walk it yourself.</h2><p>Free walk with solid walls, a fly mode over the roof, a guided tour from the gate to the shoreline, and a site plan you can click to jump anywhere.</p><div class="cta"><a class="pill fill" href="/tour/walk/">Enter the 3D walkthrough →</a></div></div></section>' +
        grid(4, vid("tour/loop/gate.mp4", "tour/p/gate.jpg", "w", "Arrival"), vid("tour/loop/courtyard.mp4", "tour/p/courtyard.jpg", "w", "Courtyard"),
             vid("tour/loop/living.mp4", "tour/p/living.jpg", "w", "Living room"), vid("tour/loop/terrace.mp4", "tour/p/terrace.jpg", "w", "Terrace")) + '</div>',
    ]),
  dict(slug="photoreal-stills", n="04", name="Photoreal stills", title='Photoreal stills',
    lead="Blender sets the layout. Each frame is then lifted to photography, matched to a real reference for hard sun, crisp shadow and a clean new-build feel.",
    hero=img("media/05_e05_hero.jpg", alt="The villa across the pool"),
    body=[
      sec("The method", "Shot, not generated.", lst(
        ("1. Layout from Blender", "Camera, lens and composition come from the 3D model, so the building never changes between shots."),
        ("2. Look reference", "A real terrace photograph sets the light: late-morning sun, deep blue sky, light haze."),
        ("3. Photoreal pass", "Each render is lifted to a photograph with the same recipe, then checked against the model."),
        ("4. Grade", "Gentle contrast, cooler shadows, foliage pulled back so it reads as one shoot."))),
      grid(3, img("media/03_e03_gate.jpg", "t", "Gate"), img("media/18_c05_gate_detail.jpg", "t", "Teak and plaster"), img("media/12_i04_courtyard.jpg", "t", "Courtyard")),
      grid(2, img("media/09_i01_living.jpg", "w", "Living room"), img("media/11_i03_veranda.jpg", "w", "Veranda")),
      grid(4, img("media/15_c02_pool_edge.jpg", "t", "Pool edge"), img("media/16_c03_lounger.jpg", "t", "Midday"), img("media/19_c06_canopy.jpg", "t", "Canopy"), img("media/21_c08_bedroom_seat.jpg", "t", "Bedroom")),
      sec("Times of day", "Morning to blue hour.", "<p>The same house, photographed through a full day: sunrise mist, hard midday, golden hour on the terrace, a monsoon dinner and the villa lit from the beach.</p>"),
      grid(3, img("media/06_sunrise_mist.jpg", "t", "Sunrise"), img("media/05_sun_terrace_couple.jpg", "t", "Golden hour"), img("media/07_monsoon_dinner.jpg", "t", "Monsoon dinner")),
      grid(2, img("media/07_e07_beach_back.jpg", "w", "Blue hour, from the beach"), img("media/02_z6iii_luminous_dusk.jpg", "w", "Dusk")),
    ]),
  dict(slug="film", n="05", name="Film", title='Film',
    lead="A 58-second brand film, from the sea to the lit house at night. Camera moves come from the 3D model, so the film keeps the real architecture.",
    hero=vid("media/film.mp4", "media/film_poster.jpg", mobile="media/film-m.mp4"),
    body=[
      sec("Structure", "One continuous journey.", lst(
        ("Sea to land", "A slow approach across the bay towards the estate."),
        ("Gate and courtyard", "Through the timber gate, under the frangipani."),
        ("Inside", "Living room, veranda and tea, the bedroom in morning light."),
        ("Pool and garden", "The afternoon by the water, a path to the shore."),
        ("Night", "The aerial reveal: the house lit, the city across the water."))),
      sec("Process", "Blocking first, then the film.", "<p>Every shot is planned as a Blender camera move on the real model. Those moves drive the video generation, which is why doors, columns and the pool stay where they belong from shot to shot.</p>"),
      grid(4, vid("tour/loop/gate.mp4", "tour/p/gate.jpg", "w", "Gate"), vid("tour/loop/pool.mp4", "tour/p/pool.jpg", "w", "Pool"),
           vid("tour/loop/bedroom.mp4", "tour/p/bedroom.jpg", "w", "Bedroom"), vid("tour/loop/evening.mp4", "tour/p/evening.jpg", "w", "Evening")),
      sec("Cutdowns", "Built for the feed too.", "<p>The film is cut into a 23-second vertical reel and three square motion posts for the launch campaign.</p>"),
      grid(4, vid("media/reel.mp4", "media/s126_post_1_4x5.jpg", "r", "Reel 9:16"), vid("media/sq1.mp4", "media/s126_post_2_4x5.jpg", "s", "Motion post"), vid("media/sq2.mp4", "media/s126_post_3_4x5.jpg", "s", "Motion post"), vid("media/sq3.mp4", "media/s126_post_5_4x5.jpg", "s", "Motion post")),
    ]),
  dict(slug="launch", n="06", name="Launch", title='Launch',
    lead="Everything a sales team needs on day one: brochure, identity book, mockups, a social campaign, a reel and a buyer website.",
    hero=img("media/mock_book.jpg", alt="The Aurelle brochure"),
    body=[
      sec("Print", "Brochure and identity book.", "<p>A large-format brochure on cream stock with arched image frames, and a brand identity book covering logo, colour, type, formats and photographed mockups.</p>"),
      grid(3, img("media/mock_stationery.jpg", "s", "Stationery"), img("media/mock_box.jpg", "s", "Welcome box"), img("media/mock_cards.jpg", "s", "Cards")),
      sec("Social", "The Quiet Hours.", "<p>One day at AURELLE told hour by hour. Photo, arch-window and solid-colour posts alternate so the grid reads like the pages of a book, with square motion posts and a vertical reel.</p>"),
      grid(3, img("media/s126_post_1_4x5.jpg", "t"), img("media/s126_post_2_4x5.jpg", "t"), img("media/s126_post_3_4x5.jpg", "t")),
      grid(3, img("media/s075_post_01.jpg", "t"), img("media/s075_post_05.jpg", "t"), img("media/s075_post_07.jpg", "t")),
      '<div class="dark"><section class="sec"><span class="lbl">Digital</span><div><h2>Website and 3D tour.</h2><p>A buyer-facing site with one day at AURELLE, the materials, the location and a viewing request, plus the live 3D walkthrough.</p><div class="cta"><a class="pill fill" href="/website/">Visit the website →</a><a class="pill" href="/tour/walk/" style="color:var(--ivory)">Enter the 3D walkthrough →</a></div></div></section>' +
        '<div class="grid g2"><figure><div class="ph w"><img src="/media/website_full.jpg" alt="The Aurelle website" loading="lazy" style="object-position:top"></div><figcaption><span>Brand website</span></figcaption></figure>' +
        vid("tour/loop/living.mp4", "tour/p/living.jpg", "w", "3D walkthrough") + "</div></div>",
    ]),
]

TPL = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{name} — Aurelle — Crab Studio</title>
<meta name="description" content="{lead}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/detail.css">
</head>
<body>
<nav class="nav" aria-label="Main">
  <a class="logo" href="/"><i></i>Crab Studio</a>
  <div style="display:flex;gap:10px;align-items:center"><span class="lbl hide-s" style="color:var(--ink2)">Aurelle · Process {n} / 06</span><a class="pill" href="/#process">← Case study</a></div>
</nav>
<main>
<header class="head">
  <div class="no lbl"><span>({n})</span><span>Process</span></div>
  <div><h1>{title}</h1></div>
  <p>{lead}</p>
</header>
<div class="hero"><div class="in">{hero_media}</div></div>
{body}
<nav class="next" aria-label="More process steps">
  <a href="/process/{prev_slug}/"><span class="lbl">← Previous</span><b>{prev_name}</b></a>
  <a href="/process/{next_slug}/"><span class="lbl">Next →</span><b>{next_name}</b></a>
</nav>
</main>
<footer><span>© 2026 Crab Studio · media.crabstudio@gmail.com</span><span>Aurelle is a concept project. Images are AI-assisted visualisations.</span></footer>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="/assets/detail.js"></script>
</body>
</html>
"""

def hero_media(fig_html):
    # strip the figure/ph wrappers: keep the inner img/video only
    start = fig_html.index('<div class="ph')
    inner = fig_html[fig_html.index('>', start) + 1:]
    return inner[:inner.index('</div>')]

for i, p in enumerate(PAGES):
    prev, nxt = PAGES[i - 1], PAGES[(i + 1) % len(PAGES)]
    html = TPL.format(name=p["name"], n=p["n"], title=p["title"], lead=p["lead"], hero_media=hero_media(p["hero"]),
                      body="\n".join(p["body"]), prev_slug=prev["slug"], prev_name=prev["name"], next_slug=nxt["slug"], next_name=nxt["name"])
    d = os.path.join(ROOT, "process", p["slug"]); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "index.html"), "w").write(html)
    print("built", p["slug"])
