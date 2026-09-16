# Colossi of the Drylands — a Daggerheart chronicle

A static campaign wiki for the Daggerheart *Colossus of the Drylands* game **Colossi of the
Drylands**. Fantasy-western kaiju aesthetic: sun-bleached broadside type over dust and rust, lit
from below by something cold.

## Structure

| Path | What |
|------|------|
| `index.html` | Landing page — masthead, shard tally, section cards |
| `chronicle/` | Session pages. **Empty — no sessions played yet** |
| `posse/` | The player characters. **Empty — no characters yet** |
| `dramatis-personae/` | 5 entries — the gods and the living, grouped |
| `colossi/` | The Children of Godfell — what has risen and what is coming |
| `factions/` | 7 — mine moguls, unions, outlaw posses, sheriffs, two generations of gods |
| `atlas/` | Godfell Mountain + the outposts, grouped |
| `relics/` | Essentia, cells, a soul shard, a stone sickle |
| `lore/` | The prophecy, the war that buried the gods, essentia, the Rush |
| `table/` | Player-facing: principles, Session 0 questions, communities/ancestries/classes, steeds |
| `gm/` | **Behind the Veil** — campaign state, next-session prep, the nine-shard tally |
| `drylands.css` | The theme |

**The shard tally is the spine.** `shards.reached` / `shards.total` in
`../colossi-of-the-drylands-support/site.config.json` drives the diamond row on the home page and
the Colossi index. Bump `reached` when Kudamat gets another piece.

## Theme

Two temperatures, and the whole design lives in the gap: everything mortal is warm (dust, rust,
ochre, bone), everything divine is cold (essentia teal, blight violet for the GM section). Warm is
the world; cold is what is coming up through it.

Type: **Rye** (wood-type mastheads) · **Alfa Slab One** (numerals, drop caps) · **Oswald**
(wanted-poster caps, nav, headings) · **Vollkorn** (body) · **Special Elite** (dispatches,
epigraphs, empty states).

## Regenerating

This site is **generated** from Markdown in `../colossi-of-the-drylands-support/content/`:

```bash
python3 ../colossi-of-the-drylands-support/scripts/build_site.py
```

One `.md` file per page, one directory per category, front matter carrying `title` / `eyebrow` /
`summary` / `group` / `order` / `pronouns` / `source`. `[[Wikilinks]]` resolve against page titles
(leading articles and the part before a comma both match, so `[[Kudamat]]` finds *Kudamat, the
First Doom*); unresolved ones render as dotted "not yet chronicled" spans, and the build prints
them. Re-running wipes and rebuilds the generated category directories and `index.html` only —
`drylands.css`, `README.md`, `LICENSE`, `CNAME`, `favicon.svg` and `.git` are preserved.

Adding a session: drop `content/chronicle/s01-<slug>.md` in with `date:` and `order:` front matter
and rebuild; the Chronicle index swaps its empty state for the session list.

## Provenance

Player- and world-facing text is passed through **verbatim** from the campaign frame material in
`../colossi-of-the-drylands-support/`: *Drylands History.pdf*, *Player Principles.pdf*, and
*Character Creation Considerations.pdf*. Each page carries its source in a footer note. Connective
sentences that stitch two source passages together are the only non-source prose; the GM pages are
scaffolding plus source quotes, and invent no campaign secrets.
