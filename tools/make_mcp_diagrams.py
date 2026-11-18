#!/usr/bin/env python3
"""Build the MCP connection diagrams used by the setup guides.

    py tools/make_mcp_diagrams.py

Writes assets/img/mcp/<slug>.svg — one per guide: Claude on the left, the MCP
connector in the middle, the application on the right, with the real transport
and the real plugin names from each guide.

Marks are drawn, not vendor logos: abstract geometry plus the product name.
"""
from __future__ import annotations

import html
import re
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "assets" / "img" / "mcp"

W, H = 1200, 440
RED = "#FF5A4A"          # Claude side
TEAL = "#4FA6C8"         # application side
TEAL_DEEP = "#2A7B9B"
CYAN = "#5ACDFF"
INK = "#fcfdff"
MUTE = "#a1a4a5"
CARD = "#101012"
LINE = "rgba(255,255,255,0.14)"
SANS = "IBM Plex Sans, Segoe UI, Helvetica Neue, Arial, sans-serif"
MONO = "JetBrains Mono, Consolas, ui-monospace, monospace"

E = html.escape


# --------------------------------------------------------------------------- #
# brand marks — official outlines from assets/logos/brands, drawn at 96x96
# --------------------------------------------------------------------------- #
BRANDS = Path(__file__).resolve().parent.parent / "assets" / "logos" / "brands"


def logo(name: str, colour: str, size: int = 96) -> str:
    """Scale a 24x24 single-path brand mark to `size` and fill it with `colour`."""
    src = (BRANDS / f"{name}.svg").read_text(encoding="utf-8")
    paths = re.findall(r'<path[^>]*\sd="([^"]+)"', src)
    if not paths:
        raise ValueError(f"no path data in {name}.svg")
    k = size / 24
    inner = "".join(f'<path d="{d}" fill="{colour}"/>' for d in paths)
    return f'<g transform="scale({k:.4f})">{inner}</g>'


def mark_stack(c: str) -> str:
    """Generic mark for the vendor-neutral explainer."""
    return "".join(
        f'<rect x="{x}" y="{y}" width="34" height="34" rx="7" fill="none" stroke="{c}" '
        f'stroke-width="3" opacity="{op}"/>'
        for x, y, op in ((8, 8, "1"), (54, 8, "0.8"), (8, 54, "0.8"), (54, 54, "0.6"))
    )


# --------------------------------------------------------------------------- #
# the guides
# --------------------------------------------------------------------------- #
APPS = [
    {
        "slug": "mcp-rhino", "app": "Rhino 8", "logo": "rhinoceros",
        "client": "Claude Desktop", "client_note": "one-click connector",
        "server": "Rhino MCP Platform", "transport": "McNeel · Yak plugin + connector",
        "down": "tool calls — run commands, place geometry",
        "up": "scene, selection, viewport image",
        "left_foot": "Installs: the connector, from McNeel",
        "right_foot": "Installs: Yak package inside Rhino",
    },
    {
        "slug": "mcp-blender", "app": "Blender", "logo": "blender",
        "client": "Claude Desktop / Code", "client_note": "config written for you",
        "server": "mcp-for-blender", "transport": "stdio · uvx mcp-for-blender",
        "down": "tool calls — bpy, objects, materials",
        "up": "scene graph, screenshots, errors",
        "left_foot": "Installs: one setup command",
        "right_foot": "Installs: add-on inside Blender",
    },
    {
        "slug": "mcp-qgis", "app": "QGIS", "logo": "qgis",
        "client": "Claude Desktop", "client_note": "claude_desktop_config.json",
        "server": "qgis-mcp", "transport": "stdio · uvx qgis-mcp",
        "down": "tool calls — layers, processing, layouts",
        "up": "features, attributes, canvas image",
        "left_foot": "Installs: uv, then the JSON block",
        "right_foot": "Installs: plugin inside QGIS",
    },
    {
        "slug": "mcp-revit-pyrevit", "app": "Revit", "logo": "autodesk",
        "client": "Claude Desktop", "client_note": "two routes, one config",
        "server": "Autodesk read-only · pyRevit", "transport": "stdio · .exe or pyRevit extension",
        "down": "tool calls — read, or Python against the API",
        "up": "elements, parameters, schedules",
        "left_foot": "Installs: server path in the config",
        "right_foot": "Installs: pyRevit extension in Revit",
    },
    {
        "slug": "mcp-sketchup", "app": "SketchUp", "logo": "sketchup",
        "client": "Claude Desktop", "client_note": "packaged extension",
        "server": "SketchUp MCP", "transport": "Desktop extension + Ruby bridge",
        "down": "tool calls — geometry, components, views",
        "up": "model tree, selection, screenshots",
        "left_foot": "Installs: .mcpb extension in Claude",
        "right_foot": "Installs: Ruby plugin in SketchUp",
    },
    {
        "slug": "mcp-unreal", "app": "Unreal Engine 5.8", "logo": "unrealengine",
        "client": "Claude Code", "client_note": "no JSON to write",
        "server": "Built into the engine", "transport": "ModelContextProtocol + AllToolsets",
        "down": "tool calls — actors, assets, blueprints",
        "up": "level contents, logs, viewport",
        "left_foot": "Adds: Epic's skills plugin (optional)",
        "right_foot": "Enable: two plugins, two console commands",
    },
    {
        "slug": "mcp-what-it-is", "app": "Any application", "logo": "",
        "client": "Claude Desktop / Code", "client_note": "one config, many servers",
        "server": "An MCP server", "transport": "stdio, launched by the client",
        "down": "tool calls — whatever the server exposes",
        "up": "results, state, images",
        "left_foot": "Reads: the config file on your machine",
        "right_foot": "Runs: a server, usually beside the app",
    },
]


def node(x: int, y: int, w: int, h: int, mark: str, colour: str,
         title: str, sub: str) -> str:
    mx = x + (w - 96) / 2
    return f"""
  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="20" fill="{CARD}" stroke="{LINE}"/>
  <g transform="translate({mx:.0f},{y + 34})">{mark}</g>
  <text x="{x + w / 2:.0f}" y="{y + h - 58}" text-anchor="middle" font-family="{SANS}"
        font-size="26" font-weight="600" fill="{INK}">{E(title)}</text>
  <text x="{x + w / 2:.0f}" y="{y + h - 30}" text-anchor="middle" font-family="{MONO}"
        font-size="15" fill="{MUTE}">{E(sub)}</text>"""


def svg(a: dict) -> str:
    lx, rw = 40, 300
    rx = W - 40 - rw
    ny, nh = 56, 230
    mid_l, mid_r = lx + rw + 28, rx - 28
    mid_c = (mid_l + mid_r) / 2

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"
     role="img" aria-label="{E(a['client'])} connects over MCP to {E(a['app'])}">
  <defs>
    <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7"
            orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="{TEAL}"/>
    </marker>
    <marker id="ar-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7"
            orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="{RED}"/>
    </marker>
  </defs>
{node(lx, ny, rw, nh, logo("claude", RED), RED, a["client"], a["client_note"])}
{node(rx, ny, rw, nh, logo(a["logo"], TEAL) if a["logo"] else mark_stack(TEAL), TEAL, a["app"], "the application")}

  <text x="{mid_c:.0f}" y="{ny + 36}" text-anchor="middle" font-family="{MONO}"
        font-size="15" fill="{MUTE}">{E(a['down'])}</text>
  <line x1="{mid_l}" y1="{ny + 54}" x2="{mid_r}" y2="{ny + 54}" stroke="{TEAL}"
        stroke-width="2.5" marker-end="url(#ar)"/>

  <rect x="{mid_c - 68:.0f}" y="{ny + 86}" width="136" height="54" rx="27"
        fill="{CARD}" stroke="{TEAL_DEEP}" stroke-width="2"/>
  <text x="{mid_c:.0f}" y="{ny + 121}" text-anchor="middle" font-family="{SANS}"
        font-size="24" font-weight="700" letter-spacing="2" fill="{CYAN}">MCP</text>

  <line x1="{mid_r}" y1="{ny + 172}" x2="{mid_l}" y2="{ny + 172}" stroke="{RED}"
        stroke-width="2.5" marker-end="url(#ar-r)"/>
  <text x="{mid_c:.0f}" y="{ny + 198}" text-anchor="middle" font-family="{MONO}"
        font-size="15" fill="{MUTE}">{E(a['up'])}</text>

  <text x="{mid_c:.0f}" y="{ny + nh + 44}" text-anchor="middle" font-family="{SANS}"
        font-size="19" font-weight="600" fill="{INK}">{E(a['server'])}</text>
  <text x="{mid_c:.0f}" y="{ny + nh + 70}" text-anchor="middle" font-family="{MONO}"
        font-size="14" fill="{MUTE}">{E(a['transport'])}</text>

  <text x="{lx + rw / 2:.0f}" y="{ny + nh + 44}" text-anchor="middle" font-family="{MONO}"
        font-size="13.5" fill="{MUTE}">{E(a['left_foot'])}</text>
  <text x="{rx + rw / 2:.0f}" y="{ny + nh + 44}" text-anchor="middle" font-family="{MONO}"
        font-size="13.5" fill="{MUTE}">{E(a['right_foot'])}</text>
</svg>
"""


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for a in APPS:
        p = OUT / f"{a['slug']}.svg"
        p.write_text(svg(a), encoding="utf-8")
        print(f"  {p.relative_to(OUT.parent.parent.parent)}")
    print(f"\n{len(APPS)} diagrams written")


if __name__ == "__main__":
    main()
