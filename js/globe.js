/* Interactive 3D globe — vanilla canvas, brand teal ramp; the Manchester hub is the one red marker. */
(function () {
  var canvas = document.getElementById('ud-globe');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  var DOT = 'rgba(79,166,200,ALPHA)';      // brand teal-light
  var ARC = 'rgba(54,144,180,0.6)';        // brand teal on dark
  var MARK = 'rgba(90,205,255,1)';         // bright cyan
  var HUB = 'rgba(255,90,74,1)';           // the decoded marker: the studio hub
  var AUTO = 0.0022;

  var markers = [
    { lat: 53.48, lng: -2.24, label: 'Manchester', hub: true },
    { lat: 51.51, lng: -0.13, label: 'London' },
    { lat: 35.68, lng: 139.69, label: 'Tokyo' },
    { lat: 40.71, lng: -74.00, label: 'New York' },
    { lat: 25.20, lng: 55.27, label: 'Dubai' },
    { lat: 12.97, lng: 77.59, label: 'Bengaluru' },
    { lat: 1.35, lng: 103.82, label: 'Singapore' },
    { lat: -33.87, lng: 151.21, label: 'Sydney' },
    { lat: 30.04, lng: 31.24, label: 'Cairo' }
  ];
  var connections = [
    { from: [53.48, -2.24], to: [51.51, -0.13] },
    { from: [53.48, -2.24], to: [40.71, -74.00] },
    { from: [53.48, -2.24], to: [25.20, 55.27] },
    { from: [53.48, -2.24], to: [35.68, 139.69] },
    { from: [51.51, -0.13], to: [30.04, 31.24] },
    { from: [25.20, 55.27], to: [12.97, 77.59] },
    { from: [12.97, 77.59], to: [1.35, 103.82] },
    { from: [1.35, 103.82], to: [35.68, 139.69] },
    { from: [1.35, 103.82], to: [-33.87, 151.21] }
  ];

  var HOME_Y = 1.91, HOME_X = 0.55;     // Europe/Africa front, Manchester in frame
  var rotY = HOME_Y, rotX = HOME_X, time = 0, raf = 0;
  var zoom = 1, ZMIN = 0.6, ZMAX = 2.2;
  var fly = null;            // {p, fy, ty, fx, tx, fz, tz} camera animation
  var spinOn = true;
  var drag = { active: false, x: 0, y: 0, ry: 0, rx: 0, moved: false };
  /* Land bitmask: 360x180 @ 1 deg, row 0 = 90N, packed MSB-first.
     Rasterized from Natural Earth countries (QGIS world_map.gpkg). */
  var LAND_B64 = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8AAAf///AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////+//////6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////gAAAAAAAAAI//AAAB3gAAAAAAAAAAAAAAAAAAAAAAAAAAd/////////////8AAAAD/8cgP///AA4A/8AAAAAAAAAAAAAAAAAAAAAAAAAP9////3////////gAAAD//8gAAMDAADAA//4AAAAAAAAAAAAAAAAAAAAAAB+P//////////////gAAAD//PgAAAAAAAAAF//AAAAAAAAAAAAAAAAAAAAAB/+d/7//5/////////gAAAAfvgAAAAAAQAADZn/AAAAAAAAgAAAAAAAAAAAAP/3/////g/////////AAAAAHAwAAAAA/8AADP///AAAB+DIAAAAAAAAAAAAAH///////ADB///////gAAAAAAAAAAAf/gAHP////AAAH//gAAAAAAAAAAAAAf//wf//+AAAP//////gAAAAAwAAAAA/gAAT/////YAAH/HgAAAAAAAAAAAAAf/19////wAAH/////8AAAAAAAAAAAB+AHO///////v8GfAAAAAAAAAAAAAAA///9////8AAH/////4AAAAAAAAAAAH4APv////////8Af/AAAAA6AADwAAAA///8f9///wAD/////4AGAAAAB+AAAH4A//////////////74AADwAB///wA/wf//x+///+AD/////4AMAAAA//wAAB/g////////////////gsDAAD////////////////AB/////wAAAAAH///gA4j////////////////////8Af/////////////7//wA////+AAAAAA////+e///////////////////////wP/////////////4//8A///8AAAAAAA/////f///////////////////////+f/////////////4H/+A///4A/8AAAA////////////////////////////////////////////h//8A///gB/+AAAB////3///////////////////////Dxf/////////////9//4Af/wAB/+AAAH/9//////////////////////////APH/////////////9x/wAP/wAAfwAAAf////////////////////////////ACf////////////A///wAH/gAAAADAD//n//////////////////////////AAf///////////8AH/5wAD/AAAAABAD//H/////////////////////////wAw////////////wAB/+wAB/AAAAAAHD/////////////////////////n/+AAA///9v///////wAH/84AAGAAAAAAOB//7//////////////////////H+IAAAB/+AB///////8AB//8AAAAAAAAD8B//3///////////////////+AYf4AAAEAH8AAf///////gD//+AAAAAAAAH+Af/3///////////////////4AA/wAAACA/YAAP///////4H///AAAAAAAAD8AP+v///////////////////gAB/wAAAAD8gAAH////////3///wAAAAAAAH+AP8P///////////////////gAB/mAAAAfYAAAD////////7///4AAAAAAAf/Af/////////////////////7AB/jgAADwAAAAD////////////+AAAAAAAffj///////////////////////AB+ACAH/AAAAAB////////////+AAAAAAAf/z///////////////////////AA4AD1+AAAAAAAn///////////+AAAAAAAe/////////////////////////AA4AAHAAAAAAAAH///////////+AAAAAAAA////////////////////////7gBgAAAAAAAAAAAD//////////+fgAAAAAABn///////////////////////7gDAAAAAAAAAAAAA//////////w/wAAAAAAA////////////////////////+gGAAAAAAAAAAAAAf///////////wAAAAAAAf///////////////////////3AMAAAAAAAAAAAAAf//////////nwAAAAAAAH///////////////////////nB4AAAAAAAAAAAAAf//////////gAAAAAAAAD/////v//v//////////////OHgAAAAAAAAAAAAAf/////////+gAAAAAAAAD/////Hf/f/////////////+H8AAAAAAAAAAAAAAf////////5xgAAAAAAAP///3/+AH/P/////////////8P4AAAAAAAAAAAAAAf////////wAAAAAAAAAP/8v//+HD/n/////////////4fwAAAAAAAAAAAAAAf////////4AAAAAAAAAH/8M/f////z////////////+AdAAAAAAAAAAAAAAAf////////AAAAAAAAAAH/mMf/////7////////////8AcAAAAAAAAAAAAAAAf///////8AAAAAACYAAP/+MH/////z///////////fwAeAAAAAAAAAAAAAAAP///////8AAAAAAAYAAP/wM/P////x//////////+z4A8AAAAAAAAAAAAAAAP///////4AAAAAAACAAH/A/+P////5///////////7+D8AAAAAAAAAAAAAAAH///////4AAAAAAACAAD+//sH////////////////4834AAAAAAAAAAAAAAAD///////4AAAAAAAAAAB///oB8P//////////////g8/4AAAAAAAAAAAAAAAB///////wAAAAAAAAAAB///AA4P//////////////h//wAAAAAAAAAAAAAAAB///////gAAAAAAAAAQH///gAAB//////////////gn+QAAAAAAAAAAAAAAAAf/////+AAQAAAAAAAwP///8fgD//////////////wPwQAAAAAAAAAAAAAAAAH/////8AAAAAAAAAAAP////f////////////////wHAAAAAAAAAAAAAAAAAAH/////4AAAAAAAAAAIP/////////////////////4HAIAAAAAAAAAAAAAAAAT////z8AAAAAAAAAACf/////////v///////////4EAAAAAAAAIAAAAAAAAAT///ggcAAAAAAAAAB///////////v///////////wGAAAAAAAAAAAAAAAAAAD///AAcAAAAAAAAAB7//////////3///////////wcAKAAAAAAAAAAAAAAAAB7/+AAdgAAAAAAAAAH//////////9///////////g4ACAAAAAAAIAAAAAAAAAf/+AAPwAAAAAAAAAH///////+//8///////////cBAEAAAAAAAAAAAAAAAAAf/+AAd8AAAAAAAAAP////////f//8A//////////AAEAEAAAAAAAAAAAAAAAG/+AA++AAAAAAAAAf////////P///Af///////9wAAAAAAAAAAAAYAAAAAAAGf+Ah/vAAAAAAAAAf////////v///AP///////4wAAAAAAAAAAAAfAAAAAAAAf+B9/7gAAAAAAAA/////////////AH///////AgAAAAAAAAAAAADgAAAAAAAP/B8D/AAAAAAAAA/////////3//+AD//8P//YAYAAAwAAAAAAAABwAAAAAAEP/j4O/8AAAAAAAAf////////z//8AA//4P/+8AQAAAQAACAAAAAAgAAAAABMH//4B//8AAAAAAAf////////5//8AA//gH/+4A4AAAQAAAAAAAAAAAAAAAAAB//4gwj+AAAAADAf////////9//4AAf/AD//AA4AAAQAAAAAACAAAAAAAAAAAf/2AAAHAAAAADQf///////////gAAf+AD//gB4AAAQAAAAAAAAAAAAAAAAAADv/gAACAAAAABw/////////+/+AAAf8ADf/kB4AAAQAAAAAAAAAAAAAAAAAAAH/wAADAAAAABg///////////4AAAP4AEf/wA+AAAQAAAAAAAAAAAAAAAAAAAD/oAADgAAAAAAf//////////gAAAP4AOf/wA+AAAgAAAAAAAAAAAAAAAAAAAAPoB8CAAAAAAAf/////////8DgAAP4AMf/wB/AAAAAAAAAAAAAAAAAAAAAAAAHgH/ZAAAAAAAf/////////x8AAA3wAMc/wh/AAAAAACAAAAAAAAAAAAACAAADgP//AAAAAAAP//////////8AAA3wAIcfgz/gAAAAAAAAAAAAAAAAAAAAAAAD////AAAAAAAH//////////4AAAD4AIeOAHfgAoAAAAAAAAAAAAAAAAAAAAAA////gAAAAAAD//////////4AAAT8AEOOAOPgIABCABIAAAAAAAAAAAAAAAAAP///wAAAAAAB//////////wAAAAcAEOAAOfgIAAQAAkAAAAAAAAAAAAAAAAAA///8AAAAAAA//////////wAAAQcAEHgAO/gIABAIAWAAABAAAAAAAAAAAAIA////wAAAAAAf/z///////gAAAQIABzwA/zggAAEAwwAAAAQAAAAAAAAAAAAA////4AAAAAAPmB///////gAAAwAAB7xh/AwAAAAAAgAAAAIAAAAAAAAAAAAJ////4AAAAAAAAAP//////AAAAAAAA/3j8BhAAACAACAAAACAAAAAAAAAAAAB////8AAAAAAAAAH/////+AAAAQAAB//3+BZAAAAAABAAAACAAAAAAAAAAGAD////+AAAAAAAAAX/////8AAAAAAAAf5//75AAAAAADAAAAAAAAAAAAAAADgH////+AAAgAAAAAn/////wAAAAAAAAf5//+cIAACAADAAAAQAAAAAAAAAADgH/////wAAAAAAAAP/////gAAAAQAAAP8f98f+AAAACQgAAAAAAAAAAAAAADgH/////8AAAAAAABP/////AAAAAAAAAP+/9///yNgAAA4AIAAAAAAAAAAAAAAP//////4AAAAAAAH/////AAAAAAAAAH/v7///+N4AAAYAIAAAAAAAAAAAAAAP//////8EAAAAAAD////+AAQAAAAAAD/v79///geAAAABYAAwAAAAAAAAAAAP///////AAAAAAAB////8AAQAAAAAAA8A58F//5eAAAAAAAAgAAAAAAAAAAAP///////gAAAAAAB////8AAAAAAAAAA/KB+B5//7AAAIAAAAAAAAAAAAAAAAP///////wAAAAAAA////8AAAABAAAAAH/wiHI//zwAAEAAAAAAEAAAAAAAAAD///////wAAEAAAA////8AAIAAgAAAAD/wx/B/8B+AACAQAGAAGAAAAAAAAAD///////wAAAAAAAf///8AAAAAAAAAAAP///B/f4/gADAIAAAAHAAAAAAAAAB///////gAAAAAAA////8CAAAAAAAAAAAPngAPP8HBAAAAIwAADAAAAAAAAAB///////gAAAAAAAf///+AAIAAAAAAAEAB+AgCH4BmAAAIAACAAAAAAAAAAAA//////+AAAAAAAAf///+RQAAAAAAAAAAAAD+HAGGCAAAAAAAAAAAAAAAAAAA//////+AAAAAAAA////+cwAAAAAAAgAAAED+HAAAAgEEYAAAAAAAAAAAAAAAf/////8AAAAAAAA////+B4AAAAAAAAAAAB3+HAAADAAYOAAAXIAAAAAAAAAAf/////8AAAAAAAA////+B4AAAAAAAAAAAD/+HwAADgACgAAQfEAAAAAAAAAAP/////8AAAAAgAB////+H4AAAAAAAAAAAD//HwAADgAgAAAPnwAAAAAAAAAAH/////8AAAAAgAB////+P4AAAAAAAAAAAP///wAABgHwAAABi9AAAAAAAAAAB/////4AAAAAAAB////4/wAAAAAAAAAAAP///4AAAgHxiAIAAFwAAAAAAAAAAf////4AAAAAAAB////gPwAAAAAAAAAAAf///4AAAwHzCAGAAPAAAAAAAAAAAf////4AAAAAAAA////APwEEAAAAAAAAB////+AAQQHQAAGAABAAAAAAAAAAAf////wAgAAAAAAf///AfgUAAAAAAAAAf/////AAfQADAAKAAFYAAAAAAAAAAf////wAAAAAAAAf///AfgQAAAAAAAAB//////gAPggEAAACAAQAAAAAAAAAAf////wAAAAAAAAP///CfgAAAAAAAAAB//////gADAAAAAAAoAMAAAAAAAAAAf///+AAAAAAAAAP///AfAAAAAAAAAAB//////wAAAAAAAAAAAAEAAAAAAAAAf///wAAAAAAAAAP///AfAAAAAAAAAAB//////8AAAAAAAAAAAAQAAAAAAAAAf///gAAAAAAAAAP//+APAAAAAAAAAAD//////8AAAAAAAAAAAAAAAAAAAACAf///AAAAAAAAAAP//4AAAAAAAAAAAAB//////8AAAAAAAAABAAAAACAAAAAA////AAAAAAAAAAH//4AAAAAAAAAAAAB//////8AAAAAAAAAAAAAAAAAAAAAA////AAAAAAAAAAH//4AAAAAAAAAAAAB//////8ABAAIAAAAAAAAAAAAAAAAA///+AAAAAAAAAAD//wAAAAAAAAAAAAA//////8ABAAAAAAAAAAAAAAAAAAAA///8AAAAAAAAAAB//gAAAAAAAAAAAAA//////8AAAAAAAAAAAAAAAAAAAAAA///8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////8EAAAAAAAAAAAAAAAAAAAAA///4AAAAAAAAAAB//AAAAAAAAAAAAAAf/4///4AAAAAAAAAAAAAAAAAAAAFA///wAAAAAAAAAAB/8AAAAAAAAAAAAAA/+AP//wAAAAAAAAAAAAAAAAAAAAAB///gAAAAAAAAAAA/wAAAAAAAAAAAAAA/MAH//wAADAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAH//gAABgAAAAAAAAAAAAAAAAAD//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADf/gAABwAAAAAAAAAAAAAAAAAD//8AAAAAABAAAAAAAAAAAAAABAAAAAAAAAAf/gAAA+AAAAAAAAAAAAAAAAAD//4AAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAP8AAAA+AAAAAAAAAAAAAAAAAD/+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABuAAAB8AAAAAAAAAAAAAAAAAD/8AAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAB+AAAD4AAAAAAAAAAAAAAAAAH/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AAAH4AAAAAAAAAAAAAAAAAH/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAAAPgEAAAAAAAAAAAAAAAAH/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAAA/AEAAAAAAAAAAAAAAAAP/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8AAAAAAAAAAAAAAAAAAP/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAP/AAAAAAAAAAAAAAAAAQAMAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAP/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAAAAAAAAAAP/gAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAP8D4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8DwAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAH+AAABmAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4AAAHwAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAA/AAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAADwAAAAAID4HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAAAAAAAA/8AAAAf////4/3//AAAwAAAAAAAAAAAAAAAAAAAAPwAAAAAAAAAAAAAAAAAf///8AP//////////4AAIAAAAAAAAAAAAAAAABAABz/AAAAAAAAAAAAAAAOH////+B/////////////AAAAAAAAAAAAAAAAAAAAAN/+AAAAAAAAAAAAGAAP/////8//////////////+AAAAAAAAAAAAAAAAAAAAe//AAAAAAAAbs///////////9////////////////AAAAAAAAAAAAAAB/AAAf//AAAAAAAB//////////////////////////////4AAAAAAAAAAAAAP/7wGP//gAAAAAAX//////////////////////////////4AAAAAAAAAD/9gP///////gAAAAAMf//////////////////////////////wAAAAAAAAf///8A///////AAAAAAd//////////////////////////////8AAAAAAAH/////////////4AAAAAH///////////////////////////////gAAAAAAB//////////////AAAAAD////////////////////////////////iAAAAAH//////////////AAAD8A/////////////////////////////////7wAAAHn/////////////+/AAH+B//////////////////////////////////AAAAH8/////////////4/jgP/B/////////////////////////////////gAAAAAAb/////////////9/h/+P/////////////////////////////////AAAAAD////////////////8APz//////////////////////////////////wAAB8Dm////////////////P/////////////////////////////////////gAA//////////////////////////////////////////////////////////4////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////';
  var landBits = atob(LAND_B64);
  function isLand(lat, lng) {
    var row = Math.min(179, Math.max(0, Math.floor(90 - lat)));
    var col = Math.min(359, Math.max(0, Math.floor(lng + 180)));
    var i = row * 360 + col;
    return (landBits.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
  }

  // Fibonacci sphere, keeping only points on landmass — a dotted Earth.
  var dots = [];
  var N = 16000, gr = (1 + Math.sqrt(5)) / 2;
  for (var i = 0; i < N; i++) {
    var th = (2 * Math.PI * i) / gr, ph = Math.acos(1 - (2 * (i + 0.5)) / N);
    var vx = Math.cos(th) * Math.sin(ph), vy = Math.cos(ph), vz = Math.sin(th) * Math.sin(ph);
    var lat = 90 - ph * 180 / Math.PI;
    var lng = Math.atan2(vz, -vx) * 180 / Math.PI - 180;
    if (lng < -180) lng += 360;
    if (isLand(lat, lng)) dots.push([vx, vy, vz]);
  }

  function toXYZ(lat, lng, r) {
    var phi = (90 - lat) * Math.PI / 180, theta = (lng + 180) * Math.PI / 180;
    return [-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
  }
  function rX(x, y, z, a) { var c = Math.cos(a), s = Math.sin(a); return [x, y * c - z * s, y * s + z * c]; }
  function rY(x, y, z, a) { var c = Math.cos(a), s = Math.sin(a); return [x * c + z * s, y, -x * s + z * c]; }
  // Flipped on both axes so the globe reads north-up, east-right.
  function proj(x, y, z, cx, cy, f) { var s = f / (f + z); return [cx - x * s, cy - y * s, z]; }

  function draw() {
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.38 * zoom, fov = 620;
    if (fly) {
      fly.p = Math.min(1, fly.p + 0.028);
      var k = fly.p < 0.5 ? 4 * fly.p * fly.p * fly.p : 1 - Math.pow(-2 * fly.p + 2, 3) / 2;
      rotY = fly.fy + (fly.ty - fly.fy) * k;
      rotX = fly.fx + (fly.tx - fly.fx) * k;
      zoom = fly.fz + (fly.tz - fly.fz) * k;
      r = Math.min(w, h) * 0.38 * zoom;
      if (fly.p >= 1) fly = null;
    } else if (!drag.active && spinOn) { rotY += AUTO; }
    time += 0.015;
    ctx.clearRect(0, 0, w, h);

    // Globe body: faint shaded disc so the ocean reads as a sphere
    var body = ctx.createRadialGradient(cx, cy - r * 0.35, r * 0.15, cx, cy, r);
    body.addColorStop(0, 'rgba(54,144,180,0.10)');
    body.addColorStop(1, 'rgba(54,144,180,0.025)');
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = body; ctx.fill();
    ctx.strokeStyle = 'rgba(54,144,180,0.14)'; ctx.lineWidth = 1; ctx.stroke();

    for (var i = 0; i < dots.length; i++) {
      var p = dots[i], x = p[0] * r, y = p[1] * r, z = p[2] * r, t;
      t = rX(x, y, z, rotX); x = t[0]; y = t[1]; z = t[2];
      t = rY(x, y, z, rotY); x = t[0]; y = t[1]; z = t[2];
      if (z > 0) continue;
      var sp = proj(x, y, z, cx, cy, fov);
      var a = Math.max(0.08, 1 - (z + r) / (2 * r));
      ctx.beginPath(); ctx.arc(sp[0], sp[1], 1 + a * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = DOT.replace('ALPHA', a.toFixed(2)); ctx.fill();
    }

    for (var c = 0; c < connections.length; c++) {
      var f1 = connections[c].from, f2 = connections[c].to;
      var a1 = toXYZ(f1[0], f1[1], r), a2 = toXYZ(f2[0], f2[1], r), q;
      q = rX(a1[0], a1[1], a1[2], rotX); q = rY(q[0], q[1], q[2], rotY); a1 = q;
      q = rX(a2[0], a2[1], a2[2], rotX); q = rY(q[0], q[1], q[2], rotY); a2 = q;
      if (a1[2] > r * 0.3 && a2[2] > r * 0.3) continue;
      var s1 = proj(a1[0], a1[1], a1[2], cx, cy, fov), s2 = proj(a2[0], a2[1], a2[2], cx, cy, fov);
      var mx = (a1[0] + a2[0]) / 2, my = (a1[1] + a2[1]) / 2, mz = (a1[2] + a2[2]) / 2;
      var ml = Math.sqrt(mx * mx + my * my + mz * mz), ah = r * 1.28;
      var sc = proj(mx / ml * ah, my / ml * ah, mz / ml * ah, cx, cy, fov);
      ctx.beginPath(); ctx.moveTo(s1[0], s1[1]); ctx.quadraticCurveTo(sc[0], sc[1], s2[0], s2[1]);
      ctx.strokeStyle = ARC; ctx.lineWidth = 1.2; ctx.stroke();
      var tt = (Math.sin(time * 1.2 + f1[0] * 0.1) + 1) / 2;
      var bx = (1 - tt) * (1 - tt) * s1[0] + 2 * (1 - tt) * tt * sc[0] + tt * tt * s2[0];
      var by = (1 - tt) * (1 - tt) * s1[1] + 2 * (1 - tt) * tt * sc[1] + tt * tt * s2[1];
      ctx.beginPath(); ctx.arc(bx, by, 2, 0, Math.PI * 2); ctx.fillStyle = MARK; ctx.fill();
    }

    var placedLabels = [];   // label rects drawn this frame — hubs are first in the list, so they win
    for (var m = 0; m < markers.length; m++) {
      var mk = markers[m], v = toXYZ(mk.lat, mk.lng, r), u;
      u = rX(v[0], v[1], v[2], rotX); u = rY(u[0], u[1], u[2], rotY);
      mk._vis = u[2] <= r * 0.1;
      if (!mk._vis) continue;
      var s = proj(u[0], u[1], u[2], cx, cy, fov);
      mk._sx = s[0]; mk._sy = s[1];
      var col = mk.hub ? HUB : MARK;
      var pulse = Math.sin(time * 2 + mk.lat) * 0.5 + 0.5;
      ctx.beginPath(); ctx.arc(s[0], s[1], (mk.hub ? 5 : 4) + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = col.replace('1)', (0.2 + pulse * 0.18).toFixed(2) + ')'); ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(s[0], s[1], mk.hub ? 3.2 : 2.4, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill();
      if (mk.label) {
        ctx.font = (mk.hub ? '600 ' : '') + '11px "JetBrains Mono", ui-monospace, monospace';
        var lw = ctx.measureText(mk.label).width;
        var lrect = [s[0] + 2, s[1] - 10, lw + 14, 18], clash = false;
        for (var q = 0; q < placedLabels.length; q++) {
          var o = placedLabels[q];
          if (lrect[0] < o[0] + o[2] && lrect[0] + lrect[2] > o[0] &&
              lrect[1] < o[1] + o[3] && lrect[1] + lrect[3] > o[1]) { clash = true; break; }
        }
        if (!clash) {
          ctx.fillStyle = col.replace('1)', mk.hub ? '0.95)' : '0.6)');
          ctx.fillText(mk.label, s[0] + 8, s[1] + 3);
          placedLabels.push(lrect);
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }

  /* ---- controls: fly-to, zoom, reset, spin toggle ---------------- */
  function normAngle(a) { return ((a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; }
  function clampZ(z) { return Math.max(ZMIN, Math.min(ZMAX, z)); }

  // Rotate the globe so (lat,lng) faces the viewer, centred horizontally,
  // tilting as close to vertical centre as the ±1 rad tilt range allows.
  function flyTo(lat, lng, tz) {
    var v = toXYZ(lat, lng, 1);
    var raw = Math.atan2(v[1], v[2]), best = null, bestErr = Infinity;
    [raw, raw - Math.PI, raw + Math.PI].forEach(function (c) {
      var a = Math.max(-1, Math.min(1, normAngle(c)));
      var err = Math.abs(v[1] * Math.cos(a) - v[2] * Math.sin(a));
      if (err < bestErr) { bestErr = err; best = a; }
    });
    var zp = v[1] * Math.sin(best) + v[2] * Math.cos(best);
    var ty = Math.atan2(v[0], -zp);
    fly = { p: 0, fy: rotY, ty: rotY + normAngle(ty - rotY),
            fx: rotX, tx: best, fz: zoom, tz: clampZ(tz || zoom) };
    setSpin(false);   // hold the city in view; the spin button resumes
  }

  function markerAt(x, y) {
    var hit = null, hd = 18;
    for (var i = 0; i < markers.length; i++) {
      var mk = markers[i];
      if (!mk._vis) continue;
      var d = Math.hypot(mk._sx - x, mk._sy - y);
      if (d < hd) { hd = d; hit = mk; }
    }
    return hit;
  }
  function localXY(e) {
    var b = canvas.getBoundingClientRect();
    return [e.clientX - b.left, e.clientY - b.top];
  }

  canvas.addEventListener('pointerdown', function (e) {
    fly = null;
    drag = { active: true, x: e.clientX, y: e.clientY, ry: rotY, rx: rotX, moved: false };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!drag.active) {
      var p = localXY(e);
      canvas.style.cursor = markerAt(p[0], p[1]) ? 'pointer' : '';
      return;
    }
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 5) drag.moved = true;
    rotY = drag.ry + (e.clientX - drag.x) * 0.005;
    rotX = Math.max(-1, Math.min(1, drag.rx - (e.clientY - drag.y) * 0.005));
  });
  canvas.addEventListener('pointerup', function (e) {
    var wasClick = drag.active && !drag.moved;
    drag.active = false;
    if (!wasClick) return;
    var p = localXY(e), mk = markerAt(p[0], p[1]);
    if (mk) flyTo(mk.lat, mk.lng, Math.max(zoom, 1.25));
  });
  canvas.addEventListener('pointercancel', function () { drag.active = false; });
  canvas.addEventListener('lostpointercapture', function () { drag.active = false; });

  // Cooperative zoom (Ctrl/Cmd + wheel), so plain scrolling keeps moving the page.
  var hint = document.getElementById('globe-hint'), hintT = 0;
  canvas.addEventListener('wheel', function (e) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      fly = null;
      zoom = clampZ(zoom * (e.deltaY < 0 ? 1.12 : 0.89));
    } else if (hint) {
      hint.classList.add('is-on');
      clearTimeout(hintT);
      hintT = setTimeout(function () { hint.classList.remove('is-on'); }, 1400);
    }
  }, { passive: false });

  canvas.addEventListener('keydown', function (e) {
    var step = 0.12;
    if (e.key === 'ArrowLeft') rotY -= step;
    else if (e.key === 'ArrowRight') rotY += step;
    else if (e.key === 'ArrowUp') rotX = Math.min(1, rotX + step);
    else if (e.key === 'ArrowDown') rotX = Math.max(-1, rotX - step);
    else if (e.key === '+' || e.key === '=') zoom = clampZ(zoom * 1.12);
    else if (e.key === '-') zoom = clampZ(zoom * 0.89);
    else return;
    e.preventDefault();
  });

  function bindCtrl(id, fn) {
    var b = document.getElementById(id);
    if (b) b.addEventListener('click', fn);
    return b;
  }
  bindCtrl('globe-zin', function () { fly = { p: 0, fy: rotY, ty: rotY, fx: rotX, tx: rotX, fz: zoom, tz: clampZ(zoom * 1.35) }; });
  bindCtrl('globe-zout', function () { fly = { p: 0, fy: rotY, ty: rotY, fx: rotX, tx: rotX, fz: zoom, tz: clampZ(zoom / 1.35) }; });
  bindCtrl('globe-reset', function () {
    fly = { p: 0, fy: rotY, ty: rotY + normAngle(HOME_Y - rotY), fx: rotX, tx: HOME_X, fz: zoom, tz: 1 };
    setSpin(true);
  });
  var spinBtn = bindCtrl('globe-spin', function () { setSpin(!spinOn); });
  function setSpin(on) {
    spinOn = on;
    if (!spinBtn) return;
    spinBtn.setAttribute('aria-pressed', String(on));
    spinBtn.setAttribute('aria-label', on ? 'Pause rotation' : 'Resume rotation');
    spinBtn.title = on ? 'Pause rotation' : 'Resume rotation';
    spinBtn.innerHTML = on
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 5v14M15 5v14" stroke-linecap="round"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></svg>';
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) AUTO = 0;
  raf = requestAnimationFrame(draw);
})();
