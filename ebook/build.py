#!/usr/bin/env python3
"""Build the Should way ebook: EPUB 3 and PDF, English and Spanish, from Markdown.

    python3 ebook/build.py            # every should-way.<lang>.md in ebook/
    python3 ebook/build.py en         # one language

Input: ebook/should-way.<lang>.md. Optional front matter between --- lines
(title, subtitle, author). The first "# " heading is the book title when there's
no front matter title; each "## " heading starts a chapter.

Tools (pinned, kept out of the repo): markdown-it-py 3.0.0 and WeasyPrint 62.3
(with pydyf 0.10.0) in ~/.cache/should-ebook/py:
    pip3 install --target ~/.cache/should-ebook/py weasyprint==62.3 pydyf==0.10.0 markdown-it-py==3.0.0
Colors come from the design system's Should brand (ds/tokens.css, light values).
The EPUB is assembled with zipfile, so it needs nothing else.
"""
import html, re, sys, uuid, zipfile
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path.home() / ".cache/should-ebook/py"))
from markdown_it import MarkdownIt  # noqa: E402

HERE = Path(__file__).resolve().parent
SITE = HERE.parent
LANG_NAMES = {"en": "en", "es": "es-419"}
LABELS = {
    "en": {"contents": "Contents", "by": "Should", "note": "rodmjay.github.io/should"},
    "es": {"contents": "Contenido", "by": "Should", "note": "rodmjay.github.io/should"},
}


def tokens():
    """Light values of the Should brand's M3 color roles."""
    css = (SITE / "ds/tokens.css").read_text()
    out = {}
    for name, light in re.findall(r"--md-sys-color-([a-z-]+):\s*light-dark\((#[0-9a-fA-F]{6})", css):
        out.setdefault(name, light)
    return out


def parse(md_text):
    meta = {}
    m = re.match(r"^---\n(.*?)\n---\n", md_text, re.S)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip().strip('"')
        md_text = md_text[m.end():]
    h1 = re.search(r"^# (.+)$", md_text, re.M)
    if h1:
        meta.setdefault("title", h1.group(1).strip())
        md_text = md_text[:h1.start()] + md_text[h1.end():]
    parts = re.split(r"^(?=## )", md_text, flags=re.M)
    intro, chapters = parts[0].strip(), []
    for p in parts[1:]:
        head, _, body = p.partition("\n")
        chapters.append((head[3:].strip(), body.strip()))
    return meta, intro, chapters


MD = MarkdownIt("commonmark", {"typographer": True}).enable(["replacements", "smartquotes", "table"])


def css(t, pdf):
    page = f"""
@page {{ size: 6in 9in; margin: 0.8in 0.7in 0.85in;
  @bottom-center {{ content: counter(page); font: 9pt Inter, sans-serif; color: {t['on-surface-variant']}; }} }}
@page :first {{ margin: 0; @bottom-center {{ content: none; }} }}
.chapter {{ page-break-before: always; }}
""" if pdf else ""
    return page + f"""
html, body {{ margin: 0; }}
body {{ font-family: Inter, "Helvetica Neue", Arial, sans-serif; font-size: 11pt; line-height: 1.55; color: {t['on-surface']}; }}
h1, h2, h3 {{ font-family: Fraunces, Georgia, serif; line-height: 1.15; color: {t['on-surface']}; }}
h2 {{ font-size: 22pt; margin: 0 0 0.6em; }}
h3 {{ font-size: 14pt; margin: 1.4em 0 0.4em; }}
.eyebrow {{ font-size: 8pt; letter-spacing: .14em; text-transform: uppercase; color: {t['primary']}; font-weight: 600; margin: 0 0 6pt; }}
p {{ margin: 0 0 0.8em; }}
blockquote {{ margin: 1em 0; padding: 0.6em 1em; border-left: 3pt solid {t['tertiary']}; background: {t['tertiary-container']}; color: {t['on-tertiary-container']}; }}
blockquote p:last-child {{ margin: 0; }}
strong {{ color: {t['on-surface']}; }}
a {{ color: {t['primary']}; }}
ul, ol {{ padding-left: 1.3em; }} li {{ margin: 0.2em 0; }}
table {{ border-collapse: collapse; width: 100%; font-size: 9.5pt; margin: 1em 0; }}
th, td {{ border-bottom: 0.5pt solid {t['outline-variant']}; padding: 4pt 6pt; text-align: left; vertical-align: top; }}
th {{ color: {t['primary']}; }}
code {{ font-size: 0.9em; }}
hr {{ border: 0; border-top: 0.5pt solid {t['outline-variant']}; margin: 1.5em 0; }}
.toc ol {{ list-style: none; padding: 0; }} .toc li {{ margin: 0.4em 0; }}
.toc a {{ text-decoration: none; color: {t['on-surface']}; }}
.cover {{ background: {t['primary']}; color: {t['on-primary']}; height: 9in; padding: 1.1in 0.75in; box-sizing: border-box; position: relative; }}
.cover h1 {{ color: {t['on-primary']}; font-size: 34pt; margin: 0.5in 0 0.2in; }}
.cover .sub {{ font-size: 13pt; line-height: 1.4; opacity: .92; }}
.cover .foot {{ position: absolute; left: 0.75in; bottom: 0.8in; font-size: 10pt; opacity: .85; }}
"""


def mark_svg(t, size):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 64 64">'
            f'<rect width="64" height="64" rx="16" fill="{t["on-primary"]}"/>'
            f'<path d="M17 34.5 L27.5 44.5 L45 23" fill="none" stroke="{t["primary"]}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<circle cx="50" cy="16.5" r="5" fill="{t["tertiary"]}"/></svg>')


def cover_svg(t, title, subtitle):
    """Standalone 1600x2400 cover for EPUB readers' shelves."""
    def lines(text, width):
        words, out, cur = text.split(), [], ""
        for w in words:
            if len(cur) + len(w) + 1 > width and cur:
                out.append(cur); cur = w
            else:
                cur = f"{cur} {w}".strip()
        return out + ([cur] if cur else [])
    ty = "".join(f'<text x="160" y="{820 + i * 150}" font-family="Fraunces, Georgia, serif" font-size="130" font-weight="700" fill="{t["on-primary"]}">{html.escape(l)}</text>'
                 for i, l in enumerate(lines(title, 16)))
    base = 820 + len(lines(title, 16)) * 150 + 60
    sy = "".join(f'<text x="160" y="{base + i * 70}" font-family="Inter, Arial, sans-serif" font-size="52" fill="{t["on-primary"]}" opacity=".9">{html.escape(l)}</text>'
                 for i, l in enumerate(lines(subtitle, 40)))
    return (f'<?xml version="1.0" encoding="utf-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2400" viewBox="0 0 1600 2400">'
            f'<rect width="1600" height="2400" fill="{t["primary"]}"/>'
            f'<g transform="translate(160 300) scale(4)"><rect width="64" height="64" rx="16" fill="{t["on-primary"]}"/>'
            f'<path d="M17 34.5 L27.5 44.5 L45 23" fill="none" stroke="{t["primary"]}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<circle cx="50" cy="16.5" r="5" fill="{t["tertiary"]}"/></g>{ty}{sy}'
            f'<text x="160" y="2240" font-family="Inter, Arial, sans-serif" font-size="44" fill="{t["on-primary"]}" opacity=".85">rodmjay.github.io/should</text></svg>')


def build(lang):
    src = HERE / f"should-way.{lang}.md"
    meta, intro, chapters = parse(src.read_text())
    t, L = tokens(), LABELS[lang]
    title, subtitle = meta.get("title", "The Should Way"), meta.get("subtitle", "")
    author = meta.get("author", L["by"])
    chs = [(f"ch{i + 1}", h, MD.render(b)) for i, (h, b) in enumerate(chapters)]
    intro_html = MD.render(intro) if intro else ""
    out = HERE / f"should-way.{lang}"

    # PDF
    from weasyprint import HTML
    fonts = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;600&display=swap">'
    toc = "".join(f'<li><a href="#{cid}">{html.escape(h)}</a></li>' for cid, h, _ in chs)
    body = (f'<section class="cover">{mark_svg(t, 72)}<h1>{html.escape(title)}</h1><p class="sub">{html.escape(subtitle)}</p>'
            f'<p class="foot">{html.escape(L["note"])}</p></section>'
            + (f'<section class="chapter">{intro_html}</section>' if intro_html else "")
            + f'<section class="chapter toc"><h2>{L["contents"]}</h2><ol>{toc}</ol></section>'
            + "".join(f'<section class="chapter" id="{cid}"><h2>{html.escape(h)}</h2>{b}</section>' for cid, h, b in chs))
    doc = f'<!doctype html><html lang="{LANG_NAMES[lang]}"><head><meta charset="utf-8"><title>{html.escape(title)}</title>{fonts}<style>{css(t, True)}</style></head><body>{body}</body></html>'
    HTML(string=doc, base_url=str(HERE)).write_pdf(f"{out}.pdf", pdf_variant=None,
                                                    custom_metadata=False)

    # EPUB 3
    xl = LANG_NAMES[lang]
    def xhtml(t_, inner):
        return (f'<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="{xl}" lang="{xl}">'
                f'<head><meta charset="utf-8"/><title>{html.escape(t_)}</title><link rel="stylesheet" href="style.css"/></head><body>{inner}</body></html>')
    def x(s):  # markdown-it HTML is already well formed except void tags
        return re.sub(r"<(br|hr|img[^>]*?)\s*/?>", lambda m: f"<{m.group(1)}/>", s)
    files = {"style.css": css(t, False), "cover.svg": cover_svg(t, title, subtitle),
             "cover.xhtml": xhtml(title, f'<div style="text-align:center"><img src="cover.svg" alt="{html.escape(title)}" style="max-width:100%;height:auto"/></div>')}
    spine = ["cover"]
    if intro_html:
        files["intro.xhtml"] = xhtml(title, x(intro_html)); spine.append("intro")
    for cid, h, b in chs:
        files[f"{cid}.xhtml"] = xhtml(h, f"<section epub:type=\"chapter\"><h2>{html.escape(h)}</h2>{x(b)}</section>"); spine.append(cid)
    nav_items = "".join(f'<li><a href="{cid}.xhtml">{html.escape(h)}</a></li>' for cid, h, _ in chs)
    files["nav.xhtml"] = xhtml(L["contents"], f'<nav epub:type="toc" id="toc" class="toc"><h2>{L["contents"]}</h2><ol>{nav_items}</ol></nav>')
    bid = f"urn:uuid:{uuid.uuid5(uuid.NAMESPACE_URL, 'should-way-' + lang)}"
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    manifest = ['<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
                '<item id="css" href="style.css" media-type="text/css"/>',
                '<item id="cover-img" href="cover.svg" media-type="image/svg+xml" properties="cover-image"/>']
    manifest += [f'<item id="{s}" href="{s}.xhtml" media-type="application/xhtml+xml"{" properties=\"svg\"" if s == "cover" else ""}/>' for s in spine]
    opf = (f'<?xml version="1.0" encoding="utf-8"?>\n<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bid" xml:lang="{xl}">'
           f'<metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="bid">{bid}</dc:identifier>'
           f'<dc:title>{html.escape(title)}</dc:title><dc:creator>{html.escape(author)}</dc:creator><dc:language>{xl}</dc:language>'
           f'<meta property="dcterms:modified">{now}</meta></metadata>'
           f'<manifest>{"".join(manifest)}</manifest><spine>{"".join(f"<itemref idref=\"{s}\"/>" for s in spine)}</spine></package>')
    container = ('<?xml version="1.0" encoding="utf-8"?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">'
                 '<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>')
    with zipfile.ZipFile(f"{out}.epub", "w") as z:
        z.writestr(zipfile.ZipInfo("mimetype"), "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        z.writestr("META-INF/container.xml", container, compress_type=zipfile.ZIP_DEFLATED)
        z.writestr("OEBPS/content.opf", opf, compress_type=zipfile.ZIP_DEFLATED)
        for name, data in files.items():
            z.writestr(f"OEBPS/{name}", data, compress_type=zipfile.ZIP_DEFLATED)
    print(f"built {out.name}.pdf and {out.name}.epub ({len(chs)} chapters)")


if __name__ == "__main__":
    langs = sys.argv[1:] or sorted(p.name.split(".")[1] for p in HERE.glob("should-way.*.md"))
    if not langs:
        sys.exit("no manuscript yet: ebook/should-way.<lang>.md")
    for lang in langs:
        build(lang)
