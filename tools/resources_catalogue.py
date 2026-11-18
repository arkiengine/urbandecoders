"""Editorial catalogue for the Skills library.

Everything factual (name, description, files, sizes) is read from
D:\\Claude Architecture Skills at build time. This file holds only the
editorial layer: which category a skill sits in, the one-line card blurb,
what it outputs, and its tags.
"""

SOURCE_ROOT = r"D:\Claude Architecture Skills"

SITE_ROOT = r"D:\Websites2026\UrbanDecoders2026\urbandecoders"

CATEGORIES = [
    {
        "slug": "briefs-records",
        "title": "Briefs & records",
        "nav": "Briefs & records",
        "display": ("Briefs and ", "records."),
        "lede": "The paperwork that decides what the project is. Briefs become traceable "
                "registers, reports become one-pagers that keep their caveats, meetings and "
                "site visits become records you can issue.",
        "blurb": "Briefs, reports, minutes, site visits, schedules.",
    },
    {
        "slug": "compliance-files",
        "title": "Compliance & files",
        "nav": "Compliance & files",
        "display": ("Checks, not ", "verdicts."),
        "lede": "Checking, not certifying. These produce the measuring list and the forensic "
                "read on a file — the clause gets named, the figure stays yours to confirm.",
        "blurb": "Access checks and CAD file forensics.",
    },
    {
        "slug": "bids-business",
        "title": "Bids & business",
        "nav": "Bids & business",
        "display": ("Bids and ", "business."),
        "lede": "Winning work without inventing credentials. Tenders get digested before "
                "they get answered, gaps stay visible as [TBC], and research arrives with "
                "a citation on every line.",
        "blurb": "Tenders, proposals, decks, market and pipeline research.",
    },
    {
        "slug": "visuals-diagrams",
        "title": "Visuals & diagrams",
        "nav": "Visuals & diagrams",
        "display": ("Visuals and ", "diagrams."),
        "lede": "Prompt instruments for image and video models. The design is fixed by the "
                "evidence; the camera, the cladding or the layer is what varies. None of "
                "them redesign the building.",
        "blurb": "Hero shots, facade studies, site diagrams, film, maps.",
    },
    {
        "slug": "site-context",
        "title": "Site & context",
        "nav": "Site & context",
        "display": ("Site and ", "context."),
        "lede": "What the site already is, before anything is proposed. Evidence becomes a "
                "register, policy becomes a clause list, and the searches nobody ran get "
                "their own page at the front.",
        "blurb": "Constraints, planning policy, daylight screening.",
    },
    {
        "slug": "programme-area",
        "title": "Programme & area",
        "nav": "Programme & area",
        "display": ("Programme and ", "area."),
        "lede": "The numbers the whole project hangs off. Areas get recomputed rather than "
                "read, occupancy gets scheduled rather than assumed, and an adjacency nobody "
                "stated stays blank.",
        "blurb": "Area audits, occupancy, adjacency matrices.",
    },
    {
        "slug": "drawings-spec",
        "title": "Drawings & spec",
        "nav": "Drawings & spec",
        "display": ("Drawings and ", "spec."),
        "lede": "Coordination before a contractor finds the gap for you. Registers, "
                "cross-references and callouts reconciled against each other — mechanically, "
                "and before the issue goes out.",
        "blurb": "Register audits, spec cross-checks, callouts.",
    },
    {
        "slug": "contract-admin",
        "title": "Contract admin",
        "nav": "Contract admin",
        "display": ("Contract ", "admin."),
        "lede": "The record that gets read adversarially one day. RFIs triaged by what they "
                "actually are, changes traced to the sentence that created them, reports "
                "assembled rather than recalled.",
        "blurb": "RFIs, progress reports, changes, fee proposals.",
    },
    {
        "slug": "carbon-performance",
        "title": "Carbon & performance",
        "nav": "Carbon & performance",
        "display": ("Carbon and ", "performance."),
        "lede": "The inputs an assessor needs, prepared so their first run is the real one. "
                "Scope before quantities, comparability before comparison, and never a factor "
                "from memory.",
        "blurb": "Embodied carbon, EPDs, overheating packs.",
    },
    {
        "slug": "twins-data",
        "title": "Twins & data",
        "nav": "Twins & data",
        "display": ("Twins and ", "data."),
        "lede": "Where a model stops being a picture and starts being operable. Georeferencing, "
                "identity and weight — the three things that decide whether a handover becomes "
                "a twin or a disappointment.",
        "blurb": "IFC audits, CRS reconciliation, engine handover.",
    },
]

# Display order on the index, the rail and the "suggested" sort — the arc of a
# project rather than the order the categories were written.
CATEGORY_ORDER = [
    "site-context",
    "briefs-records",
    "programme-area",
    "visuals-diagrams",
    "drawings-spec",
    "compliance-files",
    "carbon-performance",
    "contract-admin",
    "bids-business",
    "twins-data",
]

# key = source folder name under SOURCE_ROOT
SKILLS = {
    # ---------------------------------------------------------------- briefs
    "Client Brief Intake": {
        "title": "Client Brief Intake",
        "category": "briefs-records",
        "blurb": "A client brief becomes a traceable requirements register, schedule of "
                 "accommodation and query sheet.",
        "output": ".xlsx register",
        "tags": ["Brief", "Stage 0–2", "Requirements"],
        "takes": "Client brief, employer's requirements or competition brief (.pdf, .docx, pasted text)",
        "gives": "Requirements register, schedule of accommodation, client query sheet and conflict log "
                 "as one editable .xlsx — every line tagged Stated / Implied / Assumed against a "
                 "verbatim source.",
        "wont": "Design, test-fit or propose massing; reconcile two stated areas; check drawings "
                "against regulations.",
        "example": "Halden Wharf brief (.docx), with defects planted in the accommodation schedule",
    },
    "Executive Summary Builder": {
        "title": "Executive Summary Builder",
        "category": "briefs-records",
        "blurb": "A long report becomes a one-page summary in which the caveats survive and "
                 "conflicting figures are never quietly reconciled.",
        "output": "One-page summary",
        "tags": ["Reports", "Client-facing"],
        "takes": "Feasibility study, DAS, options appraisal, condition survey, viability or heritage statement",
        "gives": "A one-page executive summary in house style, with a claims ledger behind it and a "
                 "for-author-review checklist so it can be signed off in minutes.",
        "wont": "Smooth over a figure that appears twice at two values; extend the report; review the design.",
        "example": "Ketteridge Maltings feasibility rev C, figures deliberately disagreeing",
    },
    "Meeting Summariser": {
        "title": "Meeting Summariser",
        "category": "briefs-records",
        "blurb": "A transcript becomes minutes that separate decisions from discussion and flag "
                 "verbal instructions and scope creep.",
        "output": "Draft minutes",
        "tags": ["Minutes", "DTM", "Scope"],
        "takes": "Teams/Zoom transcript, dictated notes or pasted text from a DTM, PCM or design review",
        "gives": "Draft minutes with a complete action list (named owners, dates), decisions held "
                 "apart from discussion, and a flag sheet for the project lead.",
        "wont": "Attribute an action to someone who never accepted it; treat a figure quoted from "
                "memory as a fact; write agendas.",
        "example": "Osier Works DTM14 transcript with contradictions and unowned actions",
    },
    "Site Visit Report from Photos": {
        "title": "Site Visit Report from Photos",
        "category": "briefs-records",
        "blurb": "Site photos and narration become an observation report where visible and "
                 "inferred are tagged differently.",
        "output": ".docx report",
        "tags": ["Site visit", "CA", "Photos"],
        "takes": "Site photos, a photo manifest or contact sheet, plus the architect's notes",
        "gives": "An editable .docx report grouped by location — photo reference and provenance tag "
                 "on every observation, follow-up actions with owners, unresolved queries listed.",
        "wont": "Diagnose defects, rate condition, certify workmanship or issue instructions.",
        "example": "Rushmere Court SVR07 photo manifest",
    },
    "Screenshot to Editable Table": {
        "title": "Screenshot to Editable Table",
        "category": "briefs-records",
        "blurb": "A photo of a schedule becomes a faithful .xlsx — original order kept, unreadable "
                 "cells flagged, printed totals never corrected.",
        "output": ".xlsx transcription",
        "tags": ["Transcription", "Schedules"],
        "takes": "Screenshot, photo or scan of a table — door, window, finishes, area or issue schedule",
        "gives": "An .xlsx with every row and column in the original order, values verbatim, "
                 "`[check manually]` on unreadable cells, a transcription-notes tab and a mandatory "
                 "second pass against the image.",
        "wont": "Fix a printed total that doesn't add up; reorder columns; guess a cut-off cell.",
        "example": "Cotterell Yard door schedule photograph",
    },
    # ----------------------------------------------------------- compliance
    "Part M Drawing Check": {
        "title": "Part M Drawing Check",
        "category": "compliance-files",
        "blurb": "A drawing becomes a measuring worksheet: what to check, where, against which "
                 "AD M clause. You record the finding.",
        "output": ".xlsx worksheet",
        "tags": ["Part M", "Access", "M4(2)/M4(3)"],
        "takes": "Residential plans, a drawing takeoff, or a written description of the sheet set",
        "gives": "An editable .xlsx of every access-and-mobility item, where it appears, what the "
                 "drawing actually shows (Dimensioned / Annotated / Drawn / Not shown), the AD M "
                 "clause to check it against marked `[to verify]`, and exactly what to measure.",
        "wont": "Return a pass or a fail; supply a clearance figure from memory; rule on Part B, G or K.",
        "example": "Saxton Fold plot 6 ground-floor plan and takeoff",
    },
    "DXF Audit": {
        "title": "DXF Audit",
        "category": "compliance-files",
        "blurb": "Verdict-first forensics on a CAD file: units, scale, origin, layers, blocks, "
                 "hygiene. The file is evidence and is never modified.",
        "output": "Audit report",
        "tags": ["DXF", "CAD", "Survey"],
        "takes": "A .dxf — survey, architect's background, consultant's drawing, legacy file",
        "gives": "A verdict-first audit: safe uses as-is, unsafe uses, the single biggest problem, "
                 "then provenance, geometry frame, layers, blocks, extractable schedules, a ranked "
                 "risk table and what was not checked. Every claim tagged `[measured]`, `[inferred]` "
                 "or `[verify manually]`.",
        "wont": "Purge, fix, translate or re-save the file; declare compliance; convert units silently; "
                "choose between two revisions.",
        "example": "Selden Row survey (.dxf), a rescaled sheet with a disputed revision",
    },
    # ---------------------------------------------------------------- bids
    "Bid Summariser": {
        "title": "Bid Summariser",
        "category": "bids-business",
        "blurb": "An incoming ITT becomes dates, scope, submission mechanics, easy misses and the "
                 "go/no-go decision. Run it before you respond.",
        "output": "Bid summary",
        "tags": ["ITT/RFP", "Go/no-go"],
        "takes": "ITT, RFP, RFQ, EOI, SQ/PQQ or framework mini-competition — files, portal text or email",
        "gives": "A scannable internal summary: at-a-glance verdict, key dates, submission "
                 "requirements, likely scope by RIBA stage, easy misses, conflicts to clarify and "
                 "fee position.",
        "wont": "Write the response (that is RFP Response Builder, which runs after this); review "
                "appointment terms; decide go/no-go for you.",
        "example": "Foundry Lane ITT (.docx) with catches planted in the mechanics",
    },
    "RFP Response Builder": {
        "title": "RFP Response Builder",
        "category": "bids-business",
        "blurb": "RFP plus practice material becomes a response draft with a compliance matrix. "
                 "Gaps stay [TBC] rather than becoming invented credentials.",
        "output": ".docx draft",
        "tags": ["Tender", "Compliance matrix"],
        "takes": "Tender documents plus the practice's qualifications pack, CVs, case studies, rate card",
        "gives": "An editable .docx response draft, a compliance matrix tracing every scored question "
                 "to a section, `[TBC]` wherever the materials don't support a claim, and a "
                 "before-issue checklist.",
        "wont": "Invent a project, an accreditation or a headcount; set the fee; decide whether to bid.",
        "example": "Redgate Baths RFP plus Thornleigh practice materials",
    },
    "Pitch Deck Builder": {
        "title": "Pitch Deck Builder",
        "category": "bids-business",
        "blurb": "A project pack becomes a real .pptx pitch deck with image placeholders and an "
                 "internal gap slide.",
        "output": ".pptx deck",
        "tags": ["Pitch", "BD", "C-suite"],
        "takes": "Opportunity notes, practice profile, project list, team bios, a template if you have one",
        "gives": "A client-facing .pptx: brief interpretation up front, three design moves tied to "
                 "business outcomes, methodology by RIBA stage with cost implications surfaced, team "
                 "and relevant experience — plus an internal slide listing what is still missing.",
        "wont": "Invent a fee figure; claim experience the pack doesn't evidence; build consultation "
                "or committee presentations.",
        "example": "Tannery Yard project pack",
    },
    "BD Market Research": {
        "title": "BD Market Research",
        "category": "bids-business",
        "blurb": "A sector and geography become developer profiles with a citation slot on every "
                 "line. Nothing from memory.",
        "output": "Profile set",
        "tags": ["BD", "Developers", "Sourced"],
        "takes": "A named market — city, region or sector — or a list of target developers",
        "gives": "Comparable profiles: size, revenue, values, sustainability strategy, listing status, "
                 "competitors, usual architects and engineers, recent projects, offices and the senior "
                 "development contact. Every fact cited to a retrieved source or tagged `[to verify]` / "
                 "`[not found]`.",
        "wont": "Produce a figure from memory; run credit checks; profile private individuals; draft "
                "or send any outreach.",
        "example": "West of England sweep, scored on sourcing discipline",
    },
    "Planning Pipeline Research": {
        "title": "Planning Pipeline Research",
        "category": "bids-business",
        "blurb": "An area becomes a planning pipeline with precise status language — validated is "
                 "not approved — and a cited source per claim.",
        "output": "Pipeline sweep",
        "tags": ["Planning", "Pipeline", "Sourced"],
        "takes": "A city, borough, authority or a site to sweep around",
        "gives": "Sourced, comparable scheme profiles across pre-application, submitted, under "
                 "consideration, resolution to grant, consented and reserved matters — citation and "
                 "access date on every fact.",
        "wont": "Run without live portal access; treat validated as approved; advise on your own "
                "scheme's policy compliance; contact officers.",
        "example": "Caldergate sweep with status-language traps",
    },
    # ------------------------------------------------------------- visuals
    "Hero Perspective Prompt Builder": {
        "title": "Hero Perspective Prompt Builder",
        "category": "visuals-diagrams",
        "blurb": "Project material becomes a hero-shot brief and prompt variants. The design is "
                 "fixed; the camera is what varies.",
        "output": "Shot brief + prompts",
        "tags": ["Hero shot", "Nano Banana", "CGI"],
        "takes": "Plans, massing notes, elevation notes, materials schedule, site orientation, audience",
        "gives": "A traceable hero-shot brief plus copy-paste prompt variants — camera, lens, light, "
                 "mood, entourage — with every visual claim traced to the source or flagged, and "
                 "entourage kept honest for the stated audience.",
        "wont": "Invent materials or context; produce a Verified View or AVR (it flags when one is "
                "needed); polish a single rough prompt.",
        "example": "Tanyard Green project pack",
    },
    "Facade Maker": {
        "title": "Facade Maker",
        "category": "visuals-diagrams",
        "blurb": "A facade intent pack becomes coordinated bay, material and proportion study "
                 "prompts. The camera is fixed; the cladding is what varies.",
        "output": "Prompt set",
        "tags": ["Facade", "Material study", "Options"],
        "takes": "Facade intent pack (bays, palette, precedents, constraints) plus a base image or CAD elevation",
        "gives": "A prompt set sharing one locked consistency block so outputs are genuinely "
                 "comparable: material, bay, proportion and elevation-to-render studies, each variant "
                 "captioned an option for review.",
        "wont": "Recommend, rank or shortlist; vary two things at once; carry a fire rating or U-value "
                "into a prompt; invent a material the pack didn't state.",
        "example": "Weaver's Yard intent pack with coupled variants planted",
    },
    "Nano Banana Prompt Builder": {
        "title": "Nano Banana Prompt Builder",
        "category": "visuals-diagrams",
        "blurb": "General Gemini / Nano Banana prompt engineering for archviz, including edit and "
                 "transform chains.",
        "output": "Prompt + edit chain",
        "tags": ["Nano Banana", "Gemini", "Archviz"],
        "takes": "A rough image idea, or a source image plus scribbled instructions",
        "gives": "A short interview, then a copy-paste prompt with geometry-lock and negative blocks, "
                 "image-role labelling and staged edit chains — exteriors, interiors, masterplans, "
                 "streetscapes, diagrams.",
        "wont": "Redesign the scheme; build hero-shot sets, facade comparisons or site diagram sets "
                "(those have their own skills).",
        "example": "Marlowe Fields image request plus a reference-image description",
    },
    "Building Video Storyboard": {
        "title": "Building Video Storyboard",
        "category": "visuals-diagrams",
        "blurb": "Project assets become a shot list with timings, camera moves and per-clip video "
                 "prompts.",
        "output": "Storyboard",
        "tags": ["Film", "Runway/Kling", "Keyframes"],
        "takes": "Photos, CGIs or a written project pack, plus a rough film idea",
        "gives": "A shot-by-shot storyboard — default 30 seconds as three 10-second clips — with "
                 "timings, keyframe image prompts, per-clip motion and camera directions written for "
                 "image-to-video models, and stitching and export notes.",
        "wont": "Generate the images or the video; design or improve the building; claim a clip exists "
                "before you confirm it.",
        "example": "Lantern Barn film pack — the reference run ships two frames as placeholders",
    },
    "Site Diagram Matrix Builder": {
        "title": "Site Diagram Matrix Builder",
        "category": "visuals-diagrams",
        "blurb": "A site becomes four coordinated analysis figures: roads, buildings, greenery, "
                 "radius rings. One moment, four layers.",
        "output": "4 diagram prompts",
        "tags": ["Site analysis", "2×2 board"],
        "takes": "Aerial screenshot, plan, map extract or a written site description",
        "gives": "Four image prompts sharing one locked boundary, orientation, crop and graphic theme "
                 "— roads, buildings, greenery, radius and influence circles — ready for a 2×2 "
                 "analysis board.",
        "wont": "Propose anything; run the six-frame concept sequence (that is Site Matrix Diagram "
                "Builder); plot real data (that is GIS Interactive Map).",
        "example": "Cinderhill Sidings site pack",
    },
    "Site Matrix Diagram Builder": {
        "title": "Site Matrix Diagram Builder",
        "category": "visuals-diagrams",
        "blurb": "A site becomes a six-frame concept evolution, with A/B/C options at each frame. "
                 "You choose before it moves on.",
        "output": "6 frame prompts",
        "tags": ["Concept", "Interactive", "Masterplan"],
        "takes": "An empty-site image, aerial, map screenshot or written site description",
        "gives": "An interactive six-frame sequence in plan — boundary, context forces, circulation, "
                 "programme zoning, planting and ecology, final concept — three directions offered at "
                 "every frame, then six coordinated prompts plus legend and board layout.",
        "wont": "Move to the next frame without your choice; produce perspective renders, a technical "
                "masterplan or a planning drawing.",
        "example": "Fettlers Yard six-frame run",
    },
    "GIS Interactive Map": {
        "title": "GIS Interactive Map",
        "category": "visuals-diagrams",
        "blurb": "Site data becomes one self-contained interactive HTML map, with unverified layers "
                 "visibly dashed.",
        "output": "Single .html map",
        "tags": ["GeoJSON", "Leaflet", "Stage 0–2"],
        "takes": "One or more GeoJSON files — boundaries, constraints, POIs, routes, survey points — plus a location",
        "gives": "A single self-contained .html (Leaflet from CDN, data inlined): each dataset a "
                 "labelled toggleable layer with legend, popups, scale bar and auto-fit, plus a "
                 "data-integrity summary and an evidence-based read of what the layers show.",
        "wont": "Source constraint data or generate flood zones and listings from memory; do "
                "geoprocessing (buffer in QGIS, then map it); produce print drawings.",
        "example": "Brindle Works brief with boundary, constraints and POI GeoJSON",
    },
    # -------------------------------------------------------- site & context
    "Site Constraints Register": {
        "title": "Site Constraints Register",
        "category": "site-context",
        "blurb": "Site evidence becomes a traceable register: constraint, source, extent, "
                 "confidence, and the decision it blocks.",
        "output": "Constraints register",
        "tags": ["Due diligence", "Stage 0–1", "Evidence"],
        "takes": "Title plans, searches, constraint reports, utility records, planning history, survey notes",
        "gives": "One row per constraint with its source document, extent and confidence tag — "
                 "plus an outstanding-searches list at the front, a conflicts log, and a "
                 "summary of which project decisions cannot safely be taken yet.",
        "wont": "Source constraints or produce one from memory; advise on title, legal or "
                "contamination matters; declare a site developable.",
        "example": "Netherfold Quarry site pack — fifteen planted defects, including a mining report nobody obtained",
    },
    "Planning Policy Extract": {
        "title": "Planning Policy Extract",
        "category": "site-context",
        "blurb": "Policy documents become a clause-by-clause extract with the modal verb "
                 "preserved and the force of each requirement marked.",
        "output": "Policy extract",
        "tags": ["Planning", "DAS", "Policy"],
        "takes": "Local plan, neighbourhood plan, SPD, design code, site allocation, committee report",
        "gives": "Policy reference, verbatim requirement, whether it is a requirement or an "
                 "aspiration, what evidence would demonstrate it, and where the scheme answers "
                 "it — plus every cross-referenced document that was not supplied.",
        "wont": "Judge compliance, predict a decision, assign weight to emerging policy, or "
                "soften \"should\" into \"must\".",
        "example": "Abbots Reach policy pack — a threshold policy that does not bite at 42 units",
    },
    "Daylight Sunlight Screener": {
        "title": "Daylight & Sunlight Screener",
        "category": "site-context",
        "blurb": "Scopes the assessment a consultant will run: which receptors, which "
                 "methodology, what geometry is needed.",
        "output": "Screening worksheet",
        "tags": ["BRE", "Neighbours", "Scoping"],
        "takes": "Proposal drawings, context survey or model, site plan, authority checklist if any",
        "gives": "External and internal receptor schedules, a methodology map citing document "
                 "and clause, the geometry that must be measured, the baseline questions that "
                 "change the answer, and what cannot be screened at all.",
        "wont": "Calculate VSC, APSH, NSL or ADF; report a pass, fail or likelihood; give "
                "rights-to-light advice; treat an extruded OS footprint as a height.",
        "example": "Pennyfields screening pack — the neighbour nobody objected about",
    },
    # ------------------------------------------------------ programme & area
    "Area Schedule Audit": {
        "title": "Area Schedule Audit",
        "category": "programme-area",
        "blurb": "Recomputes every total, finds mixed measurement bases and unit drift, and "
                 "reconciles the mix against the brief.",
        "output": "Verdict-first audit",
        "tags": ["Areas", "GIA/NIA", "Arithmetic"],
        "takes": "An area, accommodation or unit-mix schedule, plus the brief and drawings if available",
        "gives": "A verdict on whether it can be issued, every subtotal recomputed beside the "
                 "printed figure, each section's measurement basis, unit integrity per column, "
                 "and a ranked discrepancy table naming what each breaks downstream.",
        "wont": "Correct the schedule, measure areas from drawings, convert units, or quote a "
                "space standard from memory.",
        "example": "Harrowgate Mills rev F — a unit listed at 1,065 m² and a subtotal that excludes it",
    },
    "Occupancy Egress Takeoff": {
        "title": "Occupancy & Egress Takeoff",
        "category": "programme-area",
        "blurb": "Plans become a measuring and query sheet for the fire engineer, with every "
                 "code figure left as a named clause.",
        "output": ".xlsx takeoff",
        "tags": ["Egress", "Fire", "Occupancy"],
        "takes": "Floor plans, plus a room or area schedule if one exists",
        "gives": "Every space with its use and area, every escape route traced door by door, "
                 "widths recorded at the pinch point, and a capacity sheet laid out so the "
                 "engineer enters the code factors and the checks complete themselves.",
        "wont": "Supply an occupancy factor, travel distance limit or width-per-person figure "
                "from memory; declare compliance; report a leaf width as a clear width.",
        "example": "Oswin Hall plans — a stair drawn on both plans and on no section",
    },
    "Adjacency Matrix Builder": {
        "title": "Adjacency Matrix Builder",
        "category": "programme-area",
        "blurb": "A brief becomes a relationship matrix where every rating is traced and every "
                 "unstated pair stays visibly blank.",
        "output": "Matrix + query sheet",
        "tags": ["Programming", "Stage 1–2", "Workshops"],
        "takes": "A brief, schedule of accommodation or stakeholder notes",
        "gives": "A triangular matrix rated only where a statement supports it, a basis register "
                 "quoting each statement, a conflicts log, flow notes for what a matrix cannot "
                 "express, and a query sheet grouped for a user-group workshop.",
        "wont": "Complete the matrix, rate from building-type convention, produce a layout or "
                "stacking diagram, or invent a space the brief does not name.",
        "example": "Birchall Green brief — where the correct answer is a matrix 15% full",
    },
    # ------------------------------------------------------- drawings & spec
    "Drawing Register Audit": {
        "title": "Drawing Register Audit",
        "category": "drawings-spec",
        "blurb": "Reconciles register, title block and filename — the three sources that are "
                 "supposed to agree and routinely do not.",
        "output": "Verdict-first audit",
        "tags": ["Issue", "Revisions", "QA"],
        "takes": "A drawing register or issue sheet, plus the drawing files or a listing of them",
        "gives": "A three-column reconciliation per drawing, missing and orphan lists, revision "
                 "regressions, the numbering convention inferred from the set and every "
                 "departure from it, and status codes that contradict the issue purpose.",
        "wont": "Rename, renumber or re-issue anything; check drawing content; state what a "
                "suitability code means from memory; declare a set complete.",
        "example": "Shotley Bank tender issue — two superseded files sitting in the folder",
    },
    "Spec Drawing Crosscheck": {
        "title": "Spec / Drawing Cross-check",
        "category": "drawings-spec",
        "blurb": "Every specified item traced to the drawings and back, with orphans both ways "
                 "and conflicts quoted side by side.",
        "output": "Coverage matrix",
        "tags": ["Specification", "Tender", "Coordination"],
        "takes": "A specification plus drawings and schedules",
        "gives": "A coverage matrix with match statuses including `partial`, specified-not-drawn "
                 "and drawn-not-specified lists, performance clauses with no junction that could "
                 "demonstrate them, and `[TBC]` items ordered by what they block.",
        "wont": "Write a clause, resolve a conflict, judge whether a product is suitable, or "
                "supply a standard or performance figure from memory.",
        "example": "Quarryman's Row — FD30S on four plots in the spec, fourteen on the schedule",
    },
    "Detail Callout Audit": {
        "title": "Detail Callout Audit",
        "category": "drawings-spec",
        "blurb": "Resolves the cross-reference graph of a technical package: dangling callouts, "
                 "orphan details, and junctions drawn nowhere.",
        "output": "Callout map",
        "tags": ["Details", "Technical", "Pre-issue"],
        "takes": "A drawing set — general arrangements and detail sheets",
        "gives": "A callout map resolving each reference to its target, dangling and orphan "
                 "lists, duplicate reference collisions, and a junction-coverage survey of the "
                 "conditions visible on the drawings.",
        "wont": "Judge whether a detail is correct or buildable, draw a missing detail, "
                "renumber anything, or count a missing consultant sheet as a failure.",
        "example": "Ellerby Wharf — a sheet split in January that broke six callouts",
    },
    # ------------------------------------------------------- contract admin
    "RFI Log Builder": {
        "title": "RFI Log Builder",
        "category": "contract-admin",
        "blurb": "Triages RFIs by what they actually are, and drafts only the ones the issued "
                 "documents already answer.",
        "output": "Log + draft pack",
        "tags": ["RFIs", "CA", "Triage"],
        "takes": "RFIs as emails, a portal export or a spreadsheet — plus the issued documents",
        "gives": "A managed log classifying each RFI as information, design gap, substitution, "
                 "instruction sought or record building; drafts citing sheet and clause for the "
                 "first type only; an exposure register; and a pattern note.",
        "wont": "Answer from memory, issue anything, approve a substitution, instruct, or "
                "assess entitlement to time or money.",
        "example": "Garnett Street — twelve RFIs, eight of which must not be drafted",
    },
    "Monthly Progress Report": {
        "title": "Monthly Progress Report",
        "category": "contract-admin",
        "blurb": "A month's material becomes a draft client report — assembled from sources, "
                 "never recalled, with risk movement visible.",
        "output": ".docx report",
        "tags": ["Reporting", "Client", "Risk"],
        "takes": "Site notes, minutes, RFI and instruction logs, programme extracts, photos — and last month's report",
        "gives": "Period basis, progress in the programme's own terms, decisions taken and "
                 "outstanding with their age, risks with their movement since last month, "
                 "information flow from the logs, and a gaps section that is never a footnote.",
        "wont": "State a progress percentage nobody stated, assess delay or float, forecast "
                "completion, close a risk because it went unmentioned, or write reassurance.",
        "example": "Tatton Rise March pack — percentages requested twice, available once",
    },
    "Variation Instruction Log": {
        "title": "Variation & Instruction Log",
        "category": "contract-admin",
        "blurb": "Finds the moments in correspondence where a change may have been created, and "
                 "quotes the exact sentence.",
        "output": "Change register",
        "tags": ["Changes", "Instructions", "Record"],
        "takes": "Emails, minutes, site records, RFI responses, marked drawings",
        "gives": "Every candidate change with its verbatim trigger, how it arose, and its real "
                 "instruction status — formal, written non-formal, verbal recorded, verbal "
                 "unrecorded, implied or none — plus a regularisation list and a chronology.",
        "wont": "Value anything, assess entitlement, decide whether something is a variation "
                "under the contract, draft an instruction, or paraphrase a trigger.",
        "example": "Wellgate Yard — 'Yes, that works', four months before the dispute",
    },
    "Fee Proposal Builder": {
        "title": "Fee Proposal Builder",
        "category": "contract-admin",
        "blurb": "Scope in deliverables, exclusions written as carefully as inclusions, and a "
                 "build-up from your own rates only.",
        "output": ".docx proposal",
        "tags": ["Fees", "Scope", "Appointment"],
        "takes": "An enquiry, plus the practice's rate card and resource data",
        "gives": "Scope stage by stage in deliverables and counts, itemised exclusions, numbered "
                 "assumptions the fee depends on, an additional services schedule, a build-up "
                 "from supplied rates, and an internal gap note to delete before issue.",
        "wont": "Supply a rate, percentage or hours estimate from memory; benchmark against "
                "market fees; advise on appointment terms; write \"reasonable amendments\".",
        "example": "Shawfield Depot enquiry — a build-up that is a cost, not a fee",
    },
    # -------------------------------------------------- carbon & performance
    "Embodied Carbon Takeoff": {
        "title": "Embodied Carbon Takeoff",
        "category": "carbon-performance",
        "blurb": "An auditable quantity register for a carbon assessment, with scope written "
                 "first and every factor slot left empty.",
        "output": "Quantity register",
        "tags": ["WLCA", "Carbon", "Quantities"],
        "takes": "A model export, quantity schedule or drawing takeoff",
        "gives": "A scope and exclusions statement before any quantity, elements mapped to a "
                 "stated classification, quantities with their source and confidence, the "
                 "modules each line covers, and the questions that change the assessor's result.",
        "wont": "Supply a carbon factor, density, service life or benchmark; calculate a total; "
                "compare against a target; recommend a material.",
        "example": "Linden Court export — the piles are in the structural model only",
    },
    "EPD Extract Compare": {
        "title": "EPD Extract & Compare",
        "category": "carbon-performance",
        "blurb": "Pulls declared data out of EPDs and compares only the pairs that genuinely "
                 "compare, with the reason named for the rest.",
        "output": "Extraction table",
        "tags": ["EPD", "Products", "Specification"],
        "takes": "Environmental Product Declarations as supplied files",
        "gives": "Declared unit, module scope, service life, standard, PCR, validity and impacts "
                 "as printed; a comparability verdict per pair before any comparison; a "
                 "like-for-like table; and what data would be needed to compare the rest.",
        "wont": "Supply EPD data from memory, source EPDs, declare a winner, normalise between "
                "declared units, or let `[not declared]` read as zero.",
        "example": "Bramhope Gate — three EPDs, three declared units, no comparable pair",
    },
    "Overheating Evidence Pack": {
        "title": "Overheating Evidence Pack",
        "category": "carbon-performance",
        "blurb": "Assembles what a thermal modeller needs — including whether the windows can "
                 "actually be opened.",
        "output": "Evidence pack",
        "tags": ["Overheating", "TM59", "Thermal"],
        "takes": "Plans, elevations, sections, specification — plus noise and air quality assessments",
        "gives": "A room schedule, openable areas as drawn with their restrictors, shading that "
                 "is actually resolved, ventilation routes checked against compartment lines, "
                 "an external constraint register, and gains listed as assumptions to be agreed.",
        "wont": "Predict or calculate overheating risk, state a criterion or threshold from "
                "memory, assume an openable proportion, or recommend a mitigation strategy.",
        "example": "Kiln Row — a 2,400 mm window with a 300 mm vent",
    },
    # ----------------------------------------------------------- twins & data
    "IFC Model Audit": {
        "title": "IFC Model Audit",
        "category": "twins-data",
        "blurb": "Verdict-first forensics on an IFC: georeferencing, spatial structure, property "
                 "coverage and GlobalId stability. Never modified.",
        "output": "Audit report",
        "tags": ["IFC", "BIM", "Federation"],
        "takes": "An .ifc file — and ideally two versions, for the identity check",
        "gives": "Schema and exporter provenance, georeferencing and units read first, spatial "
                 "containment and orphans, property coverage as fill rates, GlobalId duplication "
                 "and stability, quantity reliability, and risks ranked by downstream consequence.",
        "wont": "Modify or re-export the file, infer a CRS, present IFC base quantities as a "
                "reliable takeoff, or declare a model fit for purpose generically.",
        "example": "Dunsmere Point — a declared CRS with an all-zero map conversion",
    },
    "CRS Georeference Check": {
        "title": "CRS & Georeferencing Check",
        "category": "twins-data",
        "blurb": "Every dataset's CRS, datum, units and origin in one register — with the "
                 "symptom each disagreement would produce.",
        "output": "Georeferencing register",
        "tags": ["CRS", "GIS", "Datum"],
        "takes": "Survey, CAD, BIM, GIS vectors and rasters, point clouds, city models, engine scenes",
        "gives": "What each file declares and where the declaration lives, horizontal and "
                 "vertical recorded separately, a pairwise agreement matrix, every discrepancy "
                 "paired with its visible symptom, and one-line questions for the surveyor.",
        "wont": "Reproject or rewrite anything, infer a CRS from coordinates or location, supply "
                "datum shift parameters from memory, or round \"cannot tell\" to \"agree\".",
        "example": "Ravensholt — a point cloud floating on the wrong vertical datum",
    },
    "Revit Unreal Handover": {
        "title": "Revit → Unreal Handover",
        "category": "twins-data",
        "blurb": "What a real-time engine actually needs, checked before anyone exports: "
                 "placement, identity, weight, materials.",
        "output": "Readiness report",
        "tags": ["Unreal", "Datasmith", "Real-time"],
        "takes": "A model export, schedule export or model summary — and the target engine and purpose",
        "gives": "Coordinate magnitude and its consequence, binding readiness as parameter fill "
                 "rates, a geometry census ranked by weight, instancing opportunities, material "
                 "and UV gaps, hygiene findings, an exclusion list and an ordered checklist.",
        "wont": "Modify the model, run the export, write engine-side code, state a polygon budget "
                "from memory, promise a frame rate, or treat a visualisation model as twin-ready.",
        "example": "Priory Fields — 68 classrooms, 22 with a BMS key",
    },
}

HOUSE_RULES = [
    ("No standards from memory",
     "Room sizes, clearances, policy figures — the document and clause get named and marked "
     "<code>[to verify]</code>. The skill never supplies the number."),
    ("Provenance is visible",
     "Stated, inferred and assumed are tagged differently and never merged. An assumption that "
     "reads as a fact is the expensive kind."),
    ("Conflicts are logged, not resolved",
     "Two contradictory figures both get quoted with their locations. Choosing between them is yours."),
    ("No silent conversions",
     "m² and ft², GIA and NIA, are flagged, never reconciled."),
    ("The skill informs; the architect decides",
     "No massing, no test-fits, no recommendations dressed as analysis, no compliance verdicts."),
    ("Client material stays confidential",
     "No web-searching the client or site unless asked; no client names in output filenames."),
    ("Gaps stay visible",
     "A thin brief should produce a thin register and a long query sheet. That is the correct "
     "answer, not a failure."),
]
