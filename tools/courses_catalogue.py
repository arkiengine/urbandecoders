#!/usr/bin/env python3
"""Course copy for the Urban Decoders courses section.

Editorial only — layout lives in tools/build_courses.py. Every course is
waiting-list stage: no dates, no price, nothing promised we cannot deliver.
"""

SHARED_FORMAT = [
    ("Self-paced video", "Short lessons you can take at the pace a live project allows."),
    ("Written guide per lesson", "The same material in text, with the prompts and settings copy-pastable."),
    ("Exercise files", "Real drawings, models and site data to work on — not toy examples."),
    ("Live Q&A", "A monthly session with the studio to unpick what broke on your own work."),
    ("Certificate", "On completion, for CPD records."),
    ("12 months access", "Including updates, which these tools need more than most."),
]

COURSES = [
    {
        "slug": "ai-visualisation",
        "field": "track_visualisation",
        "number": "01",
        "title": "AI for Visualisation",
        "nav": "Visualisation",
        "level": "Beginner → Intermediate",
        "length": "9 modules · ~11 hours",
        "software": "Nano Banana Pro, Gemini, Flux, Veo, Kling, Google Earth, Photoshop",
        "audience": "Architects, designers and visualisers",
        "hero": "assets/img/courses/ai-visualisation.jpg",
        "blurb": "Get the same image twice — then make it move. Controlled, repeatable, on-brand "
                 "stills and video from sketches, models and real sites, instead of generating "
                 "until something lucky appears.",
        "lede": "Most people using image models in practice are gambling. They prompt, they "
                "discard, they prompt again, and when a client asks for the same building with "
                "a different cladding they start over. This course is about control: reference "
                "conditioning, mark-up, structure preservation, a prompt system your whole "
                "studio can reuse — and then taking the stills you trust into moving image "
                "without the building melting on the way through.",
        "outcomes": [
            ("Keep the design you drew", "Render from your own sketches, massing and models "
             "without the model redesigning the building on the way through."),
            ("Produce comparable options", "Facade, material and massing variants that differ "
             "only in the one thing you changed — so a client can actually choose."),
            ("Work from the real site", "Google Earth, street view and site photographs as "
             "context you can trust, decluttered and re-lit."),
            ("Make it move", "Film sequences from your own stills — camera moves that hold the "
             "geometry, cut together into something you can put in front of a client."),
            ("Build a house style", "A documented prompt system that produces your practice's "
             "look, not the model's default."),
        ],
        "modules": [
            ("How image models read a prompt", [
                "Diffusion in one lesson — only the parts that change what you type",
                "Why the same prompt gives different answers, and how to stop that",
                "Model families: what to reach for and when",
                "Aspect ratio, resolution and when to upscale",
            ]),
            ("Conditioning: the reference is the prompt", [
                "Image inputs, and why they beat adjectives",
                "Depth, edge and segmentation control",
                "Mark-up as instruction — the coloured-zone method",
                "Masks and in-painting for surgical changes",
            ]),
            ("Sketch and model to render", [
                "Hand sketch to a coherent image without losing the proportion",
                "Rhino, SketchUp and Revit viewports as the structural base",
                "Clay and white-model renders as a conditioning layer",
                "Keeping geometry fixed while materials and light change",
            ]),
            ("Facade and material studies", [
                "The consistency block: what every variant must share",
                "Running a cladding study a client can judge",
                "Bay, rhythm and window-to-wall variants",
                "Presenting options as options, never as a recommendation",
            ]),
            ("Real context", [
                "Google Earth and street view as a site resource",
                "Removing clutter — cars, hoardings, signage",
                "Inserting a design into a real plot and keeping the scale",
                "Weather, season and time of day from one base image",
            ]),
            ("Boards, plans and diagrams", [
                "Rendered site plans that stay accurate",
                "Axonometrics and massing diagrams from aerial imagery",
                "Mood boards built from the actual place",
                "What AI cannot do: dimensions, annotations, anything measured",
            ]),
            ("Video: holding the building still", [
                "The video models worth your credits, and what each is good at",
                "First-frame and last-frame control — the only reliable lever",
                "Camera language these models understand: dolly, orbit, crane, reveal",
                "Motion strength, duration and the shots that always break",
            ]),
            ("From clips to a film", [
                "Storyboarding a walkthrough before you generate a frame",
                "Continuity across shots — same building, same light, same season",
                "Restyling a Rhino, Blender or Unreal camera path instead of inventing one",
                "Interpolation, upscaling, sound and the edit",
            ]),
            ("A studio prompt system", [
                "Writing prompts as reusable templates",
                "Packaging a workflow as a skill the whole team triggers",
                "Naming, versioning and storing your references",
                "Disclosure: telling clients what is AI, and when it matters",
            ]),
        ],
        "forwhom": [
            ("Architects and designers", "You present work regularly and want imagery that "
             "argues for the design rather than for the tool."),
            ("Visualisation teams", "You already render, and want AI as a controllable stage in "
             "the pipeline rather than a slot machine."),
            ("Small practices", "No viz budget, high expectations, and a need for a repeatable "
             "look across every project."),
        ],
        "prereq": "No AI experience needed. You should be comfortable in one 3D or drawing "
                  "package and able to export an image from it. No video editing experience "
                  "assumed.",
    },
    {
        "slug": "realtime-3d",
        "field": "track_realtime_3d",
        "number": "02",
        "title": "AI for Real-Time 3D",
        "nav": "Real-time 3D",
        "level": "Intermediate",
        "length": "8 modules · ~12 hours",
        "software": "Rhino, Grasshopper, Revit, Blender, Unreal Engine 5, Datasmith, image-to-3D, MCP",
        "audience": "Designers, visualisers and 3D teams",
        "hero": "assets/img/courses/realtime-3d.jpg",
        "blurb": "Let AI drive the modelling software you already use, then stand the result up "
                 "in Unreal — lit, interactive, and fast enough to walk a client through live.",
        "lede": "The pipeline from a model on your desk to something somebody can walk around. "
                "It covers connecting AI to Rhino, Revit and Blender over MCP; generating assets "
                "instead of modelling them; getting geometry into Unreal with its structure "
                "intact; and lighting, filming and packaging a real-time build. Geography and "
                "city data are the next track — this one is about the model and the engine.",
        "outcomes": [
            ("Drive software conversationally", "Connect Claude or Codex to Rhino, Revit and "
             "Blender, and know which jobs are worth the tokens."),
            ("Get structure, not just geometry", "Models that arrive with layers, levels, "
             "categories and native families — schedulable and taggable."),
            ("Fill a scene without modelling it", "Image-to-3D assets, generated materials and "
             "libraries that sit inside a real-time budget."),
            ("Ship a real-time build", "Your project in Unreal: lit, navigable, rendered to "
             "stills and film, and packaged for somebody else to open."),
        ],
        "modules": [
            ("Where AI fits in a 3D pipeline", [
                "Scripting against an API versus driving software over MCP",
                "The token economics of each, with real numbers",
                "What to automate, what to keep manual, and why",
                "Setting up a project so the AI can check its own work",
            ]),
            ("MCP, properly", [
                "What MCP is, and the three mistakes behind most failures",
                "Rhino, Blender and Revit via pyRevit — install and verify",
                "Permissions, checkpoints and working on a copy",
                "Reading the connection rather than trusting it",
            ]),
            ("Prompting for model structure", [
                "Making it plan before it builds — the sentence that matters",
                "Specifying a layer schema it can actually follow",
                "Reference and dimension registers from drawings",
                "Checkpoints and validation between stages",
            ]),
            ("Assets without modelling", [
                "Image-to-3D: when the mesh is good enough and when it is not",
                "Multi-view capture for accuracy and material direction",
                "PBR, texture resolution and real-time budgets",
                "Retopology, LODs and collision before anything reaches the engine",
            ]),
            ("Rhino to Revit, natively", [
                "Rhino.Inside.Revit and what it can and cannot carry",
                "Driving the conversion with AI, and reading the report",
                "Standardising components upstream so they map to families",
                "DirectShapes: when to accept them and when to fix the source",
            ]),
            ("Into Unreal with the model intact", [
                "Datasmith from Revit, Rhino and SketchUp — and what it drops",
                "Hierarchy, naming and metadata that survive the import",
                "Materials: translating a specification into engine materials",
                "Nanite, Lumen and where each one stops being free",
            ]),
            ("Light, camera, output", [
                "Exterior and interior lighting that reads as architecture",
                "Path tracing for stills against real-time for everything else",
                "Sequencer: camera paths, moves and a render queue",
                "Getting film out — and handing it to the visualisation track for restyling",
            ]),
            ("Interactive builds and handover", [
                "First-person, orbit and fly modes without writing C++",
                "Blueprints for the three interactions clients actually ask for",
                "PCG for vegetation, crowds and street furniture",
                "Packaging for desktop, web or a touch table, and documenting the build",
            ]),
        ],
        "forwhom": [
            ("Visualisation and 3D teams", "You already render stills and want an interactive "
             "deliverable without a games studio behind you."),
            ("Computational designers", "You write Grasshopper or Python and want AI as another "
             "tool in the pipeline, not a replacement for thinking."),
            ("BIM and digital leads", "You are responsible for model quality and want the "
             "automation without the mess it usually leaves."),
        ],
        "prereq": "Comfortable in Rhino, Revit or Blender, and able to install a plugin and edit "
                  "a config file. No programming required, though you will read some. No Unreal "
                  "experience assumed.",
    },
    {
        "slug": "urban-digital-twins",
        "field": "track_3d_twins",
        "number": "03",
        "title": "Urban Digital Twins",
        "nav": "Urban twins",
        "level": "Intermediate → Advanced",
        "length": "9 modules · ~14 hours",
        "software": "QGIS, Cesium, Unreal Engine 5, PLATEAU &amp; CityGML, OSM, IFC, Python",
        "audience": "Twin builders, BIM and digital leads, authorities",
        "hero": "assets/img/courses/urban-digital-twins.jpg",
        "blurb": "Build a twin of a real place: the right coordinates, the open data that exists, "
                 "live feeds behind it, and analysis somebody can make a decision on.",
        "lede": "This is the hard track, and the one almost nobody teaches properly. It is not a "
                "tool tour — it is the geospatial discipline that decides whether a twin is "
                "useful or just a heavy model on the wrong coordinates. CRS and precision, city "
                "geometry at scale, attribute joins that hold, live data that fails gracefully, "
                "and a build you can hand to a client authority. The work we do for clients, "
                "taught as a method.",
        "outcomes": [
            ("Scope a twin that earns its cost", "Decide what it must answer before anybody "
             "models anything — and what it should refuse to answer."),
            ("Find the data that actually exists", "National, municipal and open sources — "
             "PLATEAU, CityGML, OSM, LiDAR — with the licence read."),
            ("Place it correctly", "CRS, EPSG, anchor points, large-coordinate precision and the "
             "mistakes that silently ruin a twin."),
            ("Join geometry to information", "IFC GlobalId discipline, schedules and attribute "
             "tables that survive a model revision."),
            ("Run it live, and hand it over", "Sensor, transport and weather feeds through a "
             "bridge that degrades gracefully, documented for somebody else to operate."),
        ],
        "modules": [
            ("What a twin is, and what it is not", [
                "The question-first brief: what decision is this for?",
                "Twin, model, render and dashboard — where each one stops",
                "Level of detail as a budget, not an aspiration",
                "Scoping with a client so expectations survive delivery",
            ]),
            ("Finding the data", [
                "Open portals, national datasets and what they really contain",
                "OSM, PLATEAU and CityGML — structure, attributes and quirks",
                "LiDAR, photogrammetry and point clouds as a base",
                "Licensing, attribution and the data you cannot legally publish",
            ]),
            ("Coordinates, properly", [
                "CRS and EPSG for people who have been bitten once",
                "Projected versus geographic, and when the difference bites",
                "Earth anchor points, origins and large-coordinate precision loss",
                "Verifying position against an independent source — every time",
            ]),
            ("City geometry at scale", [
                "3D tiles and streaming: Cesium, Google and national tilesets",
                "Clipping, masking and blending a site into streamed context",
                "Terrain, bathymetry and vertical datum mismatches",
                "Performance budgets before you add a single building",
            ]),
            ("Your scheme inside the city", [
                "Bringing Revit, Rhino and IFC models in on the right coordinates",
                "Scale and alignment checks that catch the one-metre error",
                "Context massing from footprints and heights when there is no 3D",
                "Versioning a proposal so options can be compared",
            ]),
            ("Attributes and joins", [
                "IFC, GlobalId discipline and joins that survive a model revision",
                "Schedules, ownership, planning and condition data onto geometry",
                "Graph thinking: when Neo4j beats another spreadsheet",
                "Provenance: every number knowing where it came from",
            ]),
            ("Analysis people act on", [
                "Sun, shadow and overshadowing against the real context",
                "Visibility, viewsheds and townscape views",
                "Access, isochrones and catchments",
                "Capacity, density and massing studies with the numbers attached",
            ]),
            ("Live data", [
                "Sensors, transport, air quality and weather APIs",
                "A small FastAPI bridge: polling, caching and rate limits",
                "Failing gracefully — stale data is worse than none",
                "What to visualise, what to chart, and what to leave out",
            ]),
            ("Delivery and governance", [
                "Web, desktop or media table — choosing by who will open it",
                "Optimisation: the twin that runs on the client's laptop",
                "Documentation and handover so it outlives the project",
                "Privacy, security and the claims you must not make",
            ]),
        ],
        "forwhom": [
            ("Twin and viz teams", "You are standing up real-time models of real places and need "
             "the geospatial parts to be right."),
            ("BIM and digital leads", "You are being asked for a twin and want to know what to "
             "build, what to buy and what to refuse."),
            ("Authorities and masterplanners", "You hold the data and the decisions, and want a "
             "model that informs them rather than decorating them."),
        ],
        "prereq": "You should already model in Rhino, Revit or Blender, and be willing to open "
                  "QGIS. The Real-Time 3D track is the natural lead-in but is not required.",
    },
    {
        "slug": "ai-real-estate",
        "field": "track_real_estate",
        "number": "04",
        "title": "AI for Real Estate &amp; Proptech",
        "nav": "Real estate",
        "level": "Beginner · non-technical",
        "length": "8 modules · ~7 hours",
        "software": "Claude, Google Earth, open GIS data, Excel, image models",
        "audience": "Developers, investors, agents and asset managers",
        "hero": "assets/img/courses/ai-real-estate.jpg",
        "blurb": "Site finding, document work, appraisal support and marketing material — plus "
                 "how to judge the proptech being sold to you, and a clear line around the "
                 "things you must never let a model decide.",
        "lede": "Written for people who make property decisions rather than models. It covers "
                "where AI genuinely saves time in a development business — screening sites, "
                "reading policy and leases, drafting the papers nobody has time to write, and "
                "producing marketing imagery — and it is equally direct about where it will cost "
                "you money if you trust it. It also covers the other half of the job now: "
                "reading a proptech pitch and knowing whether there is anything behind it.",
        "outcomes": [
            ("Screen more sites, faster", "Use open data to find and filter opportunities before "
             "anyone has paid for a report."),
            ("Get through documents", "Policy, leases, tender packs and reports summarised "
             "against your own questions, with the source quoted."),
            ("Produce the material yourself", "Marketing imagery, consultation boards and "
             "investment papers without a four-week agency loop."),
            ("Buy proptech well", "Judge a vendor's AI claims, brief a twin or platform supplier, "
             "and know what you are actually signing for."),
            ("Know the boundary", "A working governance position on confidentiality, disclosure "
             "and the numbers that must stay human."),
        ],
        "modules": [
            ("Where AI pays in a property business", [
                "An honest map of the development process and the time sinks",
                "What it does well, what it fakes, and how to tell the difference",
                "Picking tools and accounts — including the commercial ones you need",
                "Setting it up once so every answer arrives in your format",
            ]),
            ("Finding and screening sites", [
                "Open data: ownership, planning, constraints, transport, demographics",
                "Catchments, isochrones and accessibility without a GIS team",
                "Competition and saturation analysis for a use class",
                "Building a repeatable screening sheet",
            ]),
            ("Reading planning and policy", [
                "Extracting the clauses that bind your site, with citations",
                "Local plan, allocations and precedent decisions",
                "Comparing your scheme against policy, honestly",
                "The hallucinated-clause problem, and how to check",
            ]),
            ("Documents and deals", [
                "Leases, heads of terms and tender packs summarised against your questions",
                "Risk and omission flagging — the section worth the whole exercise",
                "Drafting the first version of papers and reports",
                "What never goes into a general-purpose chat window",
            ]),
            ("Numbers, carefully", [
                "Where a model helps with appraisals and where it quietly invents",
                "Comparables, schedules of accommodation and area takeoffs",
                "Sensitivity narratives for an investment committee",
                "Why every figure needs a source and a human signature",
            ]),
            ("Marketing and sales material", [
                "Scheme imagery from drawings, massing or a site photograph",
                "Virtual staging and furniture that matches the specification",
                "Brochure copy, floor plans and boards in your brand",
                "Disclosure: labelling indicative imagery so it stays defensible",
            ]),
            ("Stakeholders and consultation", [
                "Explaining a scheme to a community without jargon",
                "Boards, FAQs and response summaries at volume",
                "Reading and categorising consultation responses fairly",
                "Committee-ready summaries",
            ]),
            ("Buying proptech, and twins", [
                "Reading an AI pitch: what is a model, what is a wrapper, what is a spreadsheet",
                "When a digital twin earns its cost, and when a render is enough",
                "Briefing a supplier so you get something that works — the five questions",
                "Operational data: occupancy, energy, maintenance, and who owns it",
            ]),
        ],
        "forwhom": [
            ("Developers and investors", "You are appraising, acquiring and promoting sites and "
             "want the research and document load to stop being the bottleneck."),
            ("Agents and asset managers", "You produce marketing material and reporting "
             "constantly, and could own more of it in-house."),
            ("Planning and development consultants", "You read policy and write documents for a "
             "living, and want the first draft faster without risking the citation."),
        ],
        "prereq": "None. If you can use Excel and a web browser, you can take this course. "
                  "Nothing here requires 3D software.",
    },
]

FAQ = [
    ("When do the courses start?",
     "No dates yet. We are building the material now and the waiting list is how we decide the "
     "order to finish them in — the track with the most interest gets made first."),
    ("What will they cost?",
     "Not set. The waiting list is not a commitment to buy, and nobody on it is charged "
     "anything. You will see the price before you are asked to decide."),
    ("Are these live or self-paced?",
     "Self-paced video and written lessons, with a monthly live Q&amp;A so you can bring your own "
     "project and get it unstuck."),
    ("Will the material go out of date?",
     "Parts of it, quickly — that is the nature of these tools. Enrolment includes twelve months "
     "of updates, and we re-record the lessons that break rather than leaving them up."),
    ("Do I need to take them in order?",
     "No. They are four separate tracks, not four levels. Visualisation and Real Estate assume "
     "no technical background; Real-Time 3D and Urban Digital Twins assume you already model."),
    ("What is the difference between Real-Time 3D and Urban Digital Twins?",
     "Real-Time 3D is about the model and the engine: getting your project into Unreal, lit, "
     "interactive and packaged. Urban Digital Twins is about the place: coordinates, open city "
     "data, attribute joins, live feeds and analysis. If you want a walkthrough of a building, "
     "take the first. If you need to answer questions about a district, take the second."),
    ("Can you run this for our team instead?",
     "Yes — we deliver these as private workshops, tailored to the software and projects your "
     "team actually works on. Mention it in the waiting-list note and we will come back to you."),
    ("What is the catch with the waiting list?",
     "There isn't one. We email you when a course has a date and a price. No drip campaign, and "
     "you can leave with one click."),
]
