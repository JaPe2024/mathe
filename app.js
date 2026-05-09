const colors = {
  ink: "#18202f",
  grid: "#dce3ed",
  teal: "#087f8c",
  red: "#c43e4f",
  amber: "#b97912",
  green: "#287d4f",
};

const unitCanvas = document.querySelector("#unitCircleCanvas");
const derivativeCanvas = document.querySelector("#derivativeCanvas");
const sineCanvas = document.querySelector("#sineCanvas");
const canvasAspects = new Map(
  [unitCanvas, derivativeCanvas, sineCanvas]
    .filter(Boolean)
    .map((canvas) => [
      canvas,
      Number(canvas.getAttribute("height")) / Number(canvas.getAttribute("width")),
    ]),
);

function setupCanvas(canvas, ctx) {
  const ratio = window.devicePixelRatio || 1;
  const cssWidth = canvas.getBoundingClientRect().width;
  const cssHeight = cssWidth * canvasAspects.get(canvas);
  canvas.width = Math.round(cssWidth * ratio);
  canvas.height = Math.round(cssHeight * ratio);
  canvas.style.height = `${cssHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function clearCanvas(ctx, canvas) {
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.width / ratio;
  const height = canvas.height / ratio;
  ctx.clearRect(0, 0, width, height);
  return { width, height };
}

function drawAxes(ctx, width, height, scale, originX = width / 2, originY = height / 2) {
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = originX % scale; x <= width; x += scale) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = originY % scale; y <= height; y += scale) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  ctx.strokeStyle = colors.ink;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, originY);
  ctx.lineTo(width, originY);
  ctx.moveTo(originX, 0);
  ctx.lineTo(originX, height);
  ctx.stroke();
}

function drawLabel(ctx, text, x, y, color = colors.ink) {
  ctx.fillStyle = color;
  ctx.font = "700 14px system-ui, sans-serif";
  ctx.fillText(text, x, y);
}

function initUnitCircle() {
  if (!unitCanvas) return;

  const ctx = unitCanvas.getContext("2d");
  const angleSlider = document.querySelector("#angleSlider");
  const animateToggle = document.querySelector("#animateToggle");
  const showTangentToggle = document.querySelector("#showTangentToggle");
  const angleDegrees = document.querySelector("#angleDegrees");
  const angleRadians = document.querySelector("#angleRadians");
  const sinValue = document.querySelector("#sinValue");
  const cosValue = document.querySelector("#cosValue");
  const tanValue = document.querySelector("#tanValue");
  let angle = Number(angleSlider.value);
  let lastFrame = 0;

  function drawWave(left, top, width, height, fn, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= width; i++) {
      const t = (i / width) * Math.PI * 2;
      const y = top + height / 2 - fn(t) * (height * 0.38);
      if (i === 0) ctx.moveTo(left + i, y);
      else ctx.lineTo(left + i, y);
    }
    ctx.stroke();
  }

  function drawPreview(width, height, rad) {
    const left = width * 0.64;
    const top = height * 0.16;
    const graphWidth = width * 0.31;
    const graphHeight = height * 0.64;
    const midY = top + graphHeight / 2;

    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.strokeRect(left, top, graphWidth, graphHeight);
    ctx.beginPath();
    ctx.moveTo(left, midY);
    ctx.lineTo(left + graphWidth, midY);
    ctx.stroke();

    drawWave(left, top, graphWidth, graphHeight, Math.sin, colors.red);
    drawWave(left, top, graphWidth, graphHeight, Math.cos, colors.green);

    const markerX = left + (rad / (Math.PI * 2)) * graphWidth;
    ctx.strokeStyle = colors.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(markerX, top);
    ctx.lineTo(markerX, top + graphHeight);
    ctx.stroke();
    drawLabel(ctx, "sin", left + 10, top + 22, colors.red);
    drawLabel(ctx, "cos", left + 54, top + 22, colors.green);
  }

  function draw() {
    setupCanvas(unitCanvas, ctx);
    const { width, height } = clearCanvas(ctx, unitCanvas);
    const radius = Math.min(width * 0.46, height * 0.72) / 2;
    const originX = width * 0.32;
    const originY = height * 0.5;
    const rad = (angle * Math.PI) / 180;
    const x = Math.cos(rad);
    const y = Math.sin(rad);
    const px = originX + x * radius;
    const py = originY - y * radius;

    drawAxes(ctx, width * 0.62, height, radius / 2, originX, originY);
    ctx.strokeStyle = colors.teal;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(originX, originY, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = colors.ink;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(px, py);
    ctx.stroke();

    ctx.setLineDash([7, 6]);
    ctx.strokeStyle = colors.red;
    ctx.beginPath();
    ctx.moveTo(px, originY);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.strokeStyle = colors.green;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(px, originY);
    ctx.stroke();
    ctx.setLineDash([]);

    if (showTangentToggle.checked && Math.abs(x) > 0.04) {
      const tx = originX + radius;
      const ty = originY - Math.tan(rad) * radius;
      ctx.strokeStyle = colors.amber;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tx, originY - radius * 1.2);
      ctx.lineTo(tx, originY + radius * 1.2);
      ctx.moveTo(originX, originY);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      drawLabel(ctx, "tan", tx + 8, ty, colors.amber);
    }

    ctx.fillStyle = colors.ink;
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fill();

    drawLabel(ctx, "cos", (originX + px) / 2 - 12, originY + 24, colors.green);
    drawLabel(ctx, "sin", px + 10, (originY + py) / 2, colors.red);
    drawPreview(width, height, rad);

    angleDegrees.textContent = `${Math.round(angle)} deg`;
    angleRadians.textContent = `${rad.toFixed(2)} rad`;
    sinValue.textContent = y.toFixed(3);
    cosValue.textContent = x.toFixed(3);
    tanValue.textContent = Math.abs(x) < 0.02 ? "nicht def." : Math.tan(rad).toFixed(3);
  }

  function tick(time) {
    if (animateToggle.checked) {
      const delta = Math.min(40, time - lastFrame);
      angle = (angle + delta * 0.035) % 360;
      angleSlider.value = angle;
      draw();
    }
    lastFrame = time;
    requestAnimationFrame(tick);
  }

  angleSlider.addEventListener("input", () => {
    angle = Number(angleSlider.value);
    draw();
  });
  showTangentToggle.addEventListener("change", draw);
  window.addEventListener("resize", draw);
  draw();
  requestAnimationFrame(tick);
}

function initSineUnitCircle() {
  if (!sineCanvas) return;

  const ctx = sineCanvas.getContext("2d");
  const playBtn = document.querySelector("#sinePlayBtn");
  const resetBtn = document.querySelector("#sineResetBtn");
  const modeBtn = document.querySelector("#sineModeBtn");
  const angleSlider = document.querySelector("#sineAngleSlider");
  const speedSlider = document.querySelector("#sineSpeedSlider");
  const angleLabel = document.querySelector("#sineAngleLabel");
  const speedLabel = document.querySelector("#sineSpeedLabel");
  const statAngle = document.querySelector("#sineStatAngle");
  const statSin = document.querySelector("#sineStatSin");
  const statCos = document.querySelector("#sineStatCos");
  const steps = [
    { rad: 0, deg: "0 deg", radLabel: "0" },
    { rad: Math.PI / 2, deg: "90 deg", radLabel: "pi/2" },
    { rad: Math.PI, deg: "180 deg", radLabel: "pi" },
    { rad: (3 * Math.PI) / 2, deg: "270 deg", radLabel: "3pi/2" },
    { rad: 2 * Math.PI, deg: "360 deg", radLabel: "2pi" },
  ];

  let angle = 0;
  let playing = false;
  let raf = null;
  let last = null;
  let showDeg = true;

  function palette() {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return {
      bg: dark ? "#1a1a1a" : "#ffffff",
      grid: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
      axis: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
      text: dark ? "#aaa" : "#555",
      blue: "#378ADD",
      coral: "#D85A30",
      teal: "#1D9E75",
      dot: dark ? "#fff" : "#111",
    };
  }

  function dimensions() {
    const { width, height } = clearCanvas(ctx, sineCanvas);
    const scale = width / 800;
    return {
      width,
      height,
      cx: 175 * scale,
      cy: height * 0.487,
      radius: 130 * scale,
      gx: 365 * scale,
      gw: width - 385 * scale,
      gy: height * 0.487,
      gh: 130 * scale,
      scale,
    };
  }

  function drawCircle(theta, d, col) {
    const px = d.cx + d.radius * Math.cos(theta);
    const py = d.cy - d.radius * Math.sin(theta);

    ctx.strokeStyle = col.grid;
    ctx.lineWidth = 0.5;
    for (const value of [-d.radius, -d.radius / 2, d.radius / 2, d.radius]) {
      ctx.beginPath();
      ctx.moveTo(20 * d.scale, d.cy + value);
      ctx.lineTo(d.cx + d.radius + 22 * d.scale, d.cy + value);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(d.cx + value, 30 * d.scale);
      ctx.lineTo(d.cx + value, d.height - 30 * d.scale);
      ctx.stroke();
    }

    ctx.strokeStyle = col.axis;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20 * d.scale, d.cy);
    ctx.lineTo(d.cx + d.radius + 22 * d.scale, d.cy);
    ctx.moveTo(d.cx, 30 * d.scale);
    ctx.lineTo(d.cx, d.height - 30 * d.scale);
    ctx.stroke();

    ctx.strokeStyle = col.blue;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(d.cx, d.cy, d.radius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = col.text;
    ctx.font = `${11 * d.scale}px sans-serif`;
    ctx.fillText("1", d.cx + d.radius + 5 * d.scale, d.cy - 3 * d.scale);
    ctx.fillText("-1", d.cx - d.radius - 18 * d.scale, d.cy - 3 * d.scale);
    ctx.fillText("1", d.cx + 3 * d.scale, d.cy - d.radius - 6 * d.scale);
    ctx.fillText("-1", d.cx + 3 * d.scale, d.cy + d.radius + 14 * d.scale);

    ctx.strokeStyle = col.teal;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(d.cx, d.cy);
    ctx.lineTo(px, py);
    ctx.stroke();

    ctx.strokeStyle = col.coral;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(d.cx, py);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = col.coral;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(d.cx, d.cy);
    ctx.lineTo(d.cx, py);
    ctx.stroke();

    ctx.fillStyle = col.coral;
    ctx.beginPath();
    ctx.arc(d.cx, py, 4 * d.scale, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = col.dot;
    ctx.beginPath();
    ctx.arc(px, py, 6 * d.scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = col.teal;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const arcR = 26 * d.scale;
    ctx.strokeStyle = col.teal;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(d.cx, d.cy, arcR, 0, -theta, theta < 0);
    ctx.stroke();

    ctx.fillStyle = col.teal;
    ctx.font = `${12 * d.scale}px sans-serif`;
    ctx.fillText("theta", d.cx + (arcR + 9 * d.scale) * Math.cos(theta / 2) - 4 * d.scale, d.cy - (arcR + 9 * d.scale) * Math.sin(theta / 2) + 4 * d.scale);
    ctx.fillStyle = col.coral;
    ctx.font = `700 ${11 * d.scale}px sans-serif`;
    ctx.fillText("sin(theta)", d.cx - 52 * d.scale, (d.cy + py) / 2 + 4 * d.scale);
  }

  function drawGraph(theta, d, col) {
    ctx.strokeStyle = col.grid;
    ctx.lineWidth = 0.5;
    for (const value of [-d.gh, -d.gh / 2, d.gh / 2, d.gh]) {
      ctx.beginPath();
      ctx.moveTo(d.gx, d.gy + value);
      ctx.lineTo(d.gx + d.gw, d.gy + value);
      ctx.stroke();
    }

    ctx.strokeStyle = col.axis;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(d.gx, d.gy - d.gh - 20 * d.scale);
    ctx.lineTo(d.gx, d.gy + d.gh + 40 * d.scale);
    ctx.moveTo(d.gx, d.gy);
    ctx.lineTo(d.gx + d.gw, d.gy);
    ctx.stroke();

    ctx.fillStyle = col.text;
    ctx.font = `${11 * d.scale}px sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText("1", d.gx - 6 * d.scale, d.gy - d.gh + 4 * d.scale);
    ctx.fillText("-1", d.gx - 6 * d.scale, d.gy + d.gh + 4 * d.scale);

    for (const step of steps) {
      const x = d.gx + (step.rad / (2 * Math.PI)) * d.gw;
      ctx.strokeStyle = col.axis;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(x, d.gy - 3 * d.scale);
      ctx.lineTo(x, d.gy + 3 * d.scale);
      ctx.stroke();
      ctx.fillStyle = col.text;
      ctx.textAlign = "center";
      ctx.fillText(showDeg ? step.deg : step.radLabel, x, d.gy + d.gh + 24 * d.scale);
    }

    ctx.strokeStyle = col.blue;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= d.gw; i++) {
      const t = (i / d.gw) * 2 * Math.PI;
      const y = d.gy - Math.sin(t) * d.gh;
      if (i === 0) ctx.moveTo(d.gx + i, y);
      else ctx.lineTo(d.gx + i, y);
    }
    ctx.stroke();

    const tx = ((theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const dotX = d.gx + (tx / (2 * Math.PI)) * d.gw;
    const dotY = d.gy - Math.sin(theta) * d.gh;
    ctx.strokeStyle = col.coral;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(dotX, d.gy);
    ctx.lineTo(dotX, dotY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = col.coral;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 6 * d.scale, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = col.blue;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const labelY = dotY < d.gy ? d.gy + d.gh + 40 * d.scale : d.gy - d.gh - 12 * d.scale;
    ctx.fillStyle = col.coral;
    ctx.font = `700 ${11 * d.scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(showDeg ? `${Math.round((tx * 180) / Math.PI)} deg` : tx.toFixed(2), dotX, labelY);
    ctx.textAlign = "left";
  }

  function drawProjection(theta, d, col) {
    const py = d.cy - d.radius * Math.sin(theta);
    const tx = ((theta % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const dotX = d.gx + (tx / (2 * Math.PI)) * d.gw;
    const dotY = d.gy - Math.sin(theta) * d.gh;
    ctx.strokeStyle = col.coral;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(d.cx, py);
    ctx.lineTo(dotX, dotY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function draw() {
    setupCanvas(sineCanvas, ctx);
    const col = palette();
    const d = dimensions();
    ctx.fillStyle = col.bg;
    ctx.fillRect(0, 0, d.width, d.height);
    drawCircle(angle, d, col);
    drawGraph(angle, d, col);
    drawProjection(angle, d, col);
  }

  function updateUI() {
    const deg = (((angle * 180) / Math.PI) % 360).toFixed(1);
    angleLabel.textContent = `${deg} deg`;
    angleSlider.value = Math.round(angle * 100);
    speedLabel.textContent = speedSlider.value;
    statAngle.textContent = `${deg} deg`;
    statSin.textContent = Math.sin(angle).toFixed(3);
    statCos.textContent = Math.cos(angle).toFixed(3);
  }

  function stop() {
    playing = false;
    playBtn.textContent = "Abspielen";
    if (raf) cancelAnimationFrame(raf);
  }

  function render(ts) {
    if (!playing) return;
    if (last === null) last = ts;
    const dt = (ts - last) / 1000;
    last = ts;
    angle += dt * Number(speedSlider.value) * 0.1;
    if (angle > 2 * Math.PI) angle -= 2 * Math.PI;
    updateUI();
    draw();
    raf = requestAnimationFrame(render);
  }

  playBtn.addEventListener("click", () => {
    playing = !playing;
    playBtn.textContent = playing ? "Pause" : "Abspielen";
    if (playing) {
      last = null;
      raf = requestAnimationFrame(render);
    } else if (raf) {
      cancelAnimationFrame(raf);
    }
  });

  resetBtn.addEventListener("click", () => {
    stop();
    angle = 0;
    updateUI();
    draw();
  });

  modeBtn.addEventListener("click", () => {
    showDeg = !showDeg;
    modeBtn.textContent = `Anzeige: ${showDeg ? "Grad" : "Bogenmass"}`;
    draw();
  });

  angleSlider.addEventListener("input", () => {
    stop();
    angle = Number(angleSlider.value) / 100;
    updateUI();
    draw();
  });

  speedSlider.addEventListener("input", updateUI);
  window.addEventListener("resize", draw);
  updateUI();
  draw();
}

function initDerivative() {
  if (!derivativeCanvas) return;

  const ctx = derivativeCanvas.getContext("2d");
  const derivativeSlider = document.querySelector("#derivativeSlider");
  const slopeValue = document.querySelector("#slopeValue");

  function draw() {
    setupCanvas(derivativeCanvas, ctx);
    const { width, height } = clearCanvas(ctx, derivativeCanvas);
    const originX = width / 2;
    const originY = height * 0.58;
    const scale = Math.min(width / 8, height / 7);
    const x0 = Number(derivativeSlider.value);
    const y0 = x0 ** 2 - 1;
    const slope = 2 * x0;

    drawAxes(ctx, width, height, scale, originX, originY);
    ctx.strokeStyle = colors.teal;
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let px = 0; px <= width; px++) {
      const x = (px - originX) / scale;
      const py = originY - (x ** 2 - 1) * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.strokeStyle = colors.red;
    ctx.lineWidth = 3;
    ctx.beginPath();
    const xA = x0 - 2.2;
    const xB = x0 + 2.2;
    ctx.moveTo(originX + xA * scale, originY - (y0 + slope * (xA - x0)) * scale);
    ctx.lineTo(originX + xB * scale, originY - (y0 + slope * (xB - x0)) * scale);
    ctx.stroke();

    ctx.fillStyle = colors.ink;
    ctx.beginPath();
    ctx.arc(originX + x0 * scale, originY - y0 * scale, 7, 0, Math.PI * 2);
    ctx.fill();
    drawLabel(ctx, "f(x)=x^2-1", 22, 32, colors.teal);
    drawLabel(ctx, "Tangente", 22, 56, colors.red);
    slopeValue.textContent = `Steigung: ${slope.toFixed(2)}`;
  }

  derivativeSlider.addEventListener("input", draw);
  window.addEventListener("resize", draw);
  draw();
}

function initBodySimulations() {
  const root = document.querySelector("#bodySimulations");
  if (!root) return;

  function setupLocalCanvas(canvas) {
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.getBoundingClientRect().width;
    const height = Math.max(230, width * 0.58);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    return { ctx, width, height };
  }

  function text(ctx, value, x, y, color = colors.ink) {
    ctx.fillStyle = color;
    ctx.font = "700 14px system-ui, sans-serif";
    ctx.fillText(value, x, y);
  }

  function box(ctx, x, y, w, h, d, color) {
    ctx.fillStyle = `${color}18`;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.moveTo(x, y);
    ctx.lineTo(x + d, y - d);
    ctx.lineTo(x + w + d, y - d);
    ctx.lineTo(x + w, y);
    ctx.moveTo(x + w, y + h);
    ctx.lineTo(x + w + d, y + h - d);
    ctx.lineTo(x + w + d, y - d);
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + d, y + h - d);
    ctx.lineTo(x + w + d, y + h - d);
    ctx.stroke();
    ctx.fillRect(x, y, w, h);
  }

  function cylinder(ctx, x, y, w, h, color) {
    ctx.fillStyle = `${color}18`;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y, w / 2, 16, 0, 0, Math.PI * 2);
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + h);
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.ellipse(x + w / 2, y + h, w / 2, 16, 0, 0, Math.PI);
    ctx.stroke();
    ctx.fillRect(x, y, w, h);
  }

  function cone(ctx, x, y, w, h, color) {
    ctx.fillStyle = `${color}18`;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x, y + h);
    ctx.ellipse(x + w / 2, y + h, w / 2, 15, 0, 0, Math.PI);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function pyramid(ctx, x, y, w, h, color) {
    const d = 26;
    ctx.fillStyle = `${color}18`;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + d, y + h - d);
    ctx.lineTo(x + w + d, y + h - d);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x, y + h);
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + d, y + h - d);
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w + d, y + h - d);
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w, y + h);
    ctx.fill();
    ctx.stroke();
  }

  function sphere(ctx, x, y, r, color) {
    ctx.fillStyle = `${color}18`;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.32, 0, 0, Math.PI * 2);
    ctx.moveTo(x + r * 0.32, y - r);
    ctx.ellipse(x, y, r * 0.32, r, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  function values(card) {
    return Object.fromEntries(
      [...card.querySelectorAll("input")].map((input) => [input.dataset.param, Number(input.value)]),
    );
  }

  function draw(card) {
    const canvas = card.querySelector("canvas");
    const result = card.querySelector(".solid-result");
    const { ctx, width, height } = setupLocalCanvas(canvas);
    const data = values(card);
    const centerX = width / 2;
    const baseY = height * 0.7;
    const kind = card.dataset.solid;

    if (kind === "cube") {
      const size = 54 + data.a * 7;
      box(ctx, centerX - size / 2, baseY - size, size, size, size * 0.32, colors.teal);
      text(ctx, "a", centerX - 6, baseY + 22, colors.teal);
      result.innerHTML = `V = a³ = ${data.a ** 3}<br>O = 6a² = ${6 * data.a ** 2}`;
    }

    if (kind === "cuboid") {
      const w = 45 + data.a * 9;
      const h = 35 + data.c * 7;
      const d = 14 + data.b * 3;
      box(ctx, centerX - w / 2, baseY - h, w, h, d, colors.green);
      text(ctx, "a", centerX - 6, baseY + 22, colors.green);
      ctx.strokeStyle = colors.amber;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX + w / 2, baseY - h);
      ctx.lineTo(centerX + w / 2 + d, baseY - h - d);
      ctx.stroke();
      text(ctx, "b", centerX + w / 2 + d + 10, baseY - h - d + 6, colors.amber);
      text(ctx, "c", centerX - w / 2 - 22, baseY - h / 2, colors.red);
      result.innerHTML = `V = a · b · c = ${data.a * data.b * data.c}<br>O = ${2 * data.a * data.b + 2 * data.a * data.c + 2 * data.b * data.c}`;
    }

    if (kind === "prism") {
      const side = Math.sqrt(data.g) * 13;
      const depth = 24 + data.h * 5;
      const x = centerX - side / 2;
      const y = baseY - side * 0.55;
      ctx.strokeStyle = colors.amber;
      ctx.fillStyle = "rgba(185,121,18,0.12)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + side, y);
      ctx.lineTo(x + side * 0.5, y - side * 0.55);
      ctx.closePath();
      ctx.moveTo(x + depth, y - depth);
      ctx.lineTo(x + side + depth, y - depth);
      ctx.lineTo(x + side * 0.5 + depth, y - side * 0.55 - depth);
      ctx.closePath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + depth, y - depth);
      ctx.moveTo(x + side, y);
      ctx.lineTo(x + side + depth, y - depth);
      ctx.moveTo(x + side * 0.5, y - side * 0.55);
      ctx.lineTo(x + side * 0.5 + depth, y - side * 0.55 - depth);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = colors.red;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + side + 10, y + 8);
      ctx.lineTo(x + side + depth + 10, y - depth + 8);
      ctx.stroke();
      text(ctx, "G", x + side * 0.45, y - 10, colors.amber);
      text(ctx, "h", x + side + depth + 18, y - depth / 2 + 8, colors.red);
      result.innerHTML = `V = G · h = ${data.g * data.h}`;
    }

    if (kind === "pyramid") {
      const side = Math.sqrt(data.g) * 15;
      const h = 45 + data.h * 8;
      pyramid(ctx, centerX - side / 2, baseY - h, side, h, colors.red);
      text(ctx, "G", centerX - 8, baseY - 12, colors.red);
      text(ctx, "h", centerX + side / 2 + 28, baseY - h / 2, colors.red);
      result.innerHTML = `V = G · h / 3 = ${(data.g * data.h / 3).toFixed(2)}`;
    }

    if (kind === "cylinder") {
      const w = 42 + data.r * 12;
      const h = 45 + data.h * 8;
      cylinder(ctx, centerX - w / 2, baseY - h, w, h, colors.teal);
      text(ctx, "r", centerX - 4, baseY - h - 22, colors.red);
      text(ctx, "h", centerX + w / 2 + 14, baseY - h / 2, colors.red);
      result.innerHTML = `V = πr²h = ${(Math.PI * data.r ** 2 * data.h).toFixed(2)}<br>O = ${(2 * Math.PI * data.r ** 2 + 2 * Math.PI * data.r * data.h).toFixed(2)}`;
    }

    if (kind === "cone") {
      const w = 42 + data.r * 12;
      const h = 50 + data.h * 8;
      cone(ctx, centerX - w / 2, baseY - h, w, h, colors.amber);
      text(ctx, "r", centerX - 4, baseY + 24, colors.red);
      text(ctx, "h", centerX + w / 2 + 14, baseY - h / 2, colors.red);
      result.innerHTML = `V = πr²h / 3 = ${(Math.PI * data.r ** 2 * data.h / 3).toFixed(2)}`;
    }

    if (kind === "sphere") {
      const r = 34 + data.r * 8;
      sphere(ctx, centerX, height * 0.48, r, colors.green);
      text(ctx, "r", centerX + r / 2 - 4, height * 0.48 - 8, colors.red);
      result.innerHTML = `V = 4/3 · πr³ = ${((4 / 3) * Math.PI * data.r ** 3).toFixed(2)}<br>O = 4πr² = ${(4 * Math.PI * data.r ** 2).toFixed(2)}`;
    }
  }

  root.querySelectorAll(".solid-card").forEach((card) => {
    card.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        input.nextElementSibling.textContent = input.value;
        draw(card);
      });
    });
    draw(card);
  });

  window.addEventListener("resize", () => {
    root.querySelectorAll(".solid-card").forEach(draw);
  });
}

function initDreisatzFillSimulation() {
  const board = document.querySelector(".dreisatz-board.blank");
  if (!board) return;

  board.classList.add("interactive");
  board.innerHTML = `
    <div class="dreisatz-row dreisatz-head">
      <span>Menge</span>
      <span>Wert</span>
      <span>Rechenschritt</span>
    </div>
    <div class="dreisatz-row">
      <label class="fill-input"><span class="sr-only">Gegebene Menge</span><input id="dreisatzAmount" type="number" min="1" value="4"><small>Einheiten</small></label>
      <label class="fill-input"><span class="sr-only">Gegebener Wert</span><input id="dreisatzValue" type="number" min="0.01" step="0.01" value="12"><small>Euro</small></label>
      <span class="step-note">gegeben</span>
    </div>
    <div class="dreisatz-arrow" id="dreisatzDivide">: 4</div>
    <div class="dreisatz-row">
      <span class="fill-box">1 Einheit</span>
      <span class="fill-box" id="dreisatzUnit">3 Euro</span>
      <span class="step-note">auf 1 Einheit</span>
    </div>
    <div class="dreisatz-arrow" id="dreisatzMultiply">· 10</div>
    <div class="dreisatz-row">
      <label class="fill-input accent"><span class="sr-only">Zielmenge</span><input id="dreisatzTarget" type="number" min="1" value="10"><small>Einheiten</small></label>
      <span class="fill-box accent" id="dreisatzResult">30 Euro</span>
      <span class="step-note">gesucht</span>
    </div>
    <p class="dreisatz-live" aria-live="polite"></p>
  `;

  const amountInput = board.querySelector("#dreisatzAmount");
  const valueInput = board.querySelector("#dreisatzValue");
  const targetInput = board.querySelector("#dreisatzTarget");
  const divide = board.querySelector("#dreisatzDivide");
  const multiply = board.querySelector("#dreisatzMultiply");
  const unit = board.querySelector("#dreisatzUnit");
  const result = board.querySelector("#dreisatzResult");
  const live = board.querySelector(".dreisatz-live");

  function formatNumber(number) {
    return Number(number.toFixed(2)).toLocaleString("de-DE");
  }

  function update() {
    const amount = Math.max(1, Number(amountInput.value) || 1);
    const value = Math.max(0, Number(valueInput.value) || 0);
    const target = Math.max(1, Number(targetInput.value) || 1);
    const unitValue = value / amount;
    const targetValue = unitValue * target;

    divide.textContent = `: ${formatNumber(amount)}`;
    multiply.textContent = `· ${formatNumber(target)}`;
    unit.textContent = `${formatNumber(unitValue)} Euro`;
    result.textContent = `${formatNumber(targetValue)} Euro`;
    live.textContent = `${formatNumber(amount)} Einheiten kosten ${formatNumber(value)} Euro. Eine Einheit kostet ${formatNumber(unitValue)} Euro. ${formatNumber(target)} Einheiten kosten ${formatNumber(targetValue)} Euro.`;
  }

  [amountInput, valueInput, targetInput].forEach((input) => input.addEventListener("input", update));
  update();
}

function formatMathText(value) {
  return String(value)
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/\^x/g, "ˣ")
    .replace(/\^n/g, "ⁿ")
    .replace(/\*/g, "·")
    .replace(/\+\/-/g, "±")
    .replace(/Wurzel/g, "√")
    .replace(/Delta/g, "Δ")
    .replace(/deg/g, "°")
    .replace(/pi/g, "π")
    .replace(/nicht A/g, "¬A")
    .replace(/nicht B/g, "¬B");
}

function formatFractions(value) {
  const token = String.raw`(?:-?\d+(?:\.\d+)?|[a-zA-Zα-ωΑ-Ω]+|[A-Z]\([^)]+\)|\([^()<>]+\))`;
  const fractionPattern = new RegExp(`(${token})\\s*/\\s*(${token})`, "g");
  return String(value).replace(fractionPattern, '<span class="frac"><span>$1</span><span>$2</span></span>');
}

function formatMathHtml(value) {
  return formatFractions(formatMathText(value));
}

function steppedRandom(min, max, step) {
  const count = Math.round((max - min) / step);
  return Number((min + Math.floor(Math.random() * (count + 1)) * step).toFixed(4));
}

function initMiniSimulation() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  if (page === "grundlagen-dreisatz.html") return;
  const configs = window.simulationConfigs || {};

  function formulaAnchor() {
    if (page === "grundlagen.html" || page.includes("brueche") || page.includes("negative") || page.includes("dreisatz")) return "grundlagen-brueche";
    if (page.includes("pq-formel") || page.includes("mitternachtsformel") || page.includes("quadratische") || page.includes("kurvendiskussion")) return "algebra-pq-formel";
    if (page.includes("gleichung") || page.includes("variablen") || page.includes("terme") || page.includes("potenzen") || page === "algebra.html") return "algebra-gleichungen";
    if (page.includes("kreis") || page.includes("pythagoras") || page.includes("koerper") || page === "geometrie.html") return "geometrie-pythagoras";
    if (page.includes("prozent") || page.includes("zins") || page.includes("wachstum") || page === "finanzmathe.html") return "grundlagen-prozent";
    if (page.includes("lineare") || page.includes("exponentiell") || page === "funktionen.html") return "funktionen-lineare";
    if (page.includes("trigonometrie")) return "trigonometrie-dreieck";
    if (page.includes("analysis") || page.includes("ableitung") || page.includes("integral")) return "analysis-integral";
    if (page.includes("stochastik")) return "stochastik-wahrscheinlichkeit";
    if (page.includes("vektoren")) return "vektoren-grundlagen";
    return "";
  }

  function symbolFormula(values) {
    if (page.includes("pythagoras")) return "a² + b² = c²";
    if (page.includes("kreis")) return "U = 2πr, A = πr²";
    if (page.includes("koerper")) return "Würfel, Quader, Prisma, Pyramide, Zylinder, Kegel, Kugel";
    if (page.includes("trigonometrie") || page.includes("einheitskreis")) return "sin(θ), cos(θ), tan(θ)";
    if (page.includes("ableitung") || page === "analysis.html") return "f′(x) = 2x";
    if (page.includes("integral")) return "∫₀ᵇ x² dx = b³/3";
    if (page.includes("kurvendiskussion")) return "f′(x)=0 ⇒ Extremstelle";
    if (page.includes("baumdiagramm")) return "P(B) = P(A) * P(B|A) + P(nicht A) * P(B|nicht A)";
    if (page.includes("stochastik")) return "P(E) = günstige / mögliche Fälle";
    if (page.includes("vektoren-skalarprodukt")) return "a · b = 0 ⇒ a ⊥ b";
    if (page.includes("vektoren")) return "|v| = √(x² + y² + z²)";
    if (page.includes("zins") || page.includes("wachstum") || page.includes("finanz")) return "Kₙ = K₀ · (1 + p/100)ⁿ";
    if (page.includes("pq-formel")) return "x₁,₂ = -p/2 ± √((p/2)² - q)";
    if (page.includes("mitternachtsformel")) return "x₁,₂ = (-b ± √(b² - 4ac)) / 2a";
    if (page.includes("gleichungssysteme")) return "Schnittpunkt: m₁x+b₁ = m₂x+b₂";
    if (page.includes("prozent")) return "W = G · p / 100";
    if (page.includes("brueche")) return "a/b";
    if (page.includes("negative")) return "|x| = Abstand zu 0";
    if (page.includes("dreisatz")) return "erst auf 1, dann auf Ziel";
    if (page.includes("exponentiell")) return "f(x) = a · qˣ";
    if (page.includes("quadratische")) return "f(x) = a(x - d)² + e";
    if (page.includes("lineare") || page.includes("funktionen")) return "f(x) = mx + b";
    if (page.includes("potenzen")) return "aᵐ · aⁿ = aᵐ⁺ⁿ";
    if (page.includes("terme")) return "ax + bx = (a+b)x";
    if (page.includes("algebra")) return "ax + b = c";
    return "Mathematisches Modell";
  }

  function drawMiniVisual(canvas, values) {
    const ctx = canvas.getContext("2d");
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = 280;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const pad = 34;
    const left = pad;
    const right = width - pad;
    const top = 22;
    const bottom = height - 32;
    const midX = (left + right) / 2;
    const midY = (top + bottom) / 2;
    const sx = (x) => midX + x * ((right - left) / 12);
    const sy = (y) => midY - y * ((bottom - top) / 12);

    function axes() {
      ctx.strokeStyle = colors.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = -6; x <= 6; x += 1) {
        ctx.moveTo(sx(x), top);
        ctx.lineTo(sx(x), bottom);
      }
      for (let y = -6; y <= 6; y += 1) {
        ctx.moveTo(left, sy(y));
        ctx.lineTo(right, sy(y));
      }
      ctx.stroke();
      ctx.strokeStyle = colors.ink;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(left, midY);
      ctx.lineTo(right, midY);
      ctx.moveTo(midX, top);
      ctx.lineTo(midX, bottom);
      ctx.stroke();
    }

    function plot(fn, color = colors.teal, xMin = -6, xMax = 6) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= 360; i++) {
        const x = xMin + (i / 360) * (xMax - xMin);
        const y = fn(x);
        if (i === 0) ctx.moveTo(sx(x), sy(y));
        else ctx.lineTo(sx(x), sy(y));
      }
      ctx.stroke();
    }

    function label(text, x, y, color = colors.ink) {
      ctx.fillStyle = color;
      ctx.font = "700 14px system-ui, sans-serif";
      ctx.fillText(text, x, y);
    }

    function drawTriangle(a, b) {
      const scale = Math.min((right - left - 20) / Math.max(a, b, 1.5), (bottom - top - 20) / Math.max(a, b, 1.5));
      const x0 = left + 26;
      const y0 = bottom - 18;
      const x1 = x0 + a * scale;
      const y1 = y0;
      const x2 = x0;
      const y2 = y0 - b * scale;
      ctx.fillStyle = "rgba(8,127,140,0.1)";
      ctx.strokeStyle = colors.teal;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      label("a", (x0 + x1) / 2, y0 + 20, colors.green);
      label("b", x0 - 20, (y0 + y2) / 2, colors.red);
      label("c", (x1 + x2) / 2 + 8, (y1 + y2) / 2, colors.amber);
    }

    function drawCircle(r) {
      const radius = Math.min(90, Math.max(24, r * 5));
      ctx.strokeStyle = colors.teal;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(midX, midY, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = colors.red;
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(midX + radius, midY);
      ctx.stroke();
      label("r", midX + radius / 2, midY - 8, colors.red);
      label("π", midX - 6, midY + 5, colors.teal);
    }

    function drawBars(items) {
      const max = Math.max(...items.map((item) => item.value), 1);
      const barW = (right - left) / items.length - 18;
      items.forEach((item, index) => {
        const x = left + index * ((right - left) / items.length) + 12;
        const h = ((bottom - top) * item.value) / max;
        ctx.fillStyle = item.color;
        ctx.fillRect(x, bottom - h, barW, h);
        label(item.label, x, bottom + 20, colors.ink);
      });
    }

    function drawVector(x, y, labelText = "v") {
      axes();
      ctx.strokeStyle = colors.teal;
      ctx.fillStyle = colors.teal;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(sx(x / 2), sy(y / 2));
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(sx(x / 2), sy(y / 2), 6, 0, Math.PI * 2);
      ctx.fill();
      label(labelText, sx(x / 2) + 8, sy(y / 2) - 8, colors.teal);
    }

    function drawBox(x, y, w, h, depth, title, formula, color = colors.teal) {
      ctx.fillStyle = "rgba(8,127,140,0.08)";
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.moveTo(x, y);
      ctx.lineTo(x + depth, y - depth);
      ctx.lineTo(x + w + depth, y - depth);
      ctx.lineTo(x + w, y);
      ctx.moveTo(x + w, y + h);
      ctx.lineTo(x + w + depth, y + h - depth);
      ctx.lineTo(x + w + depth, y - depth);
      ctx.moveTo(x, y + h);
      ctx.lineTo(x + depth, y + h - depth);
      ctx.lineTo(x + w + depth, y + h - depth);
      ctx.stroke();
      ctx.fillRect(x, y, w, h);
      label(title, x, y + h + 18, color);
      label(formula, x, y + h + 34, colors.ink);
    }

    function drawCylinderShape(x, y, w, h, title, formula, color = colors.teal) {
      ctx.strokeStyle = color;
      ctx.fillStyle = "rgba(8,127,140,0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y, w / 2, 14, 0, 0, Math.PI * 2);
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + h);
      ctx.ellipse(x + w / 2, y + h, w / 2, 14, 0, 0, Math.PI);
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w, y + h);
      ctx.stroke();
      ctx.fillRect(x, y, w, h);
      label(title, x, y + h + 30, color);
      label(formula, x, y + h + 46, colors.ink);
    }

    function drawConeShape(x, y, w, h, title, formula, color = colors.amber) {
      ctx.strokeStyle = color;
      ctx.fillStyle = "rgba(185,121,18,0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x, y + h);
      ctx.ellipse(x + w / 2, y + h, w / 2, 13, 0, 0, Math.PI);
      ctx.lineTo(x + w / 2, y);
      ctx.lineTo(x + w, y + h);
      ctx.stroke();
      ctx.fill();
      label(title, x, y + h + 30, color);
      label(formula, x, y + h + 46, colors.ink);
    }

    function drawPyramidShape(x, y, w, h, title, formula, color = colors.red) {
      const d = 20;
      ctx.strokeStyle = color;
      ctx.fillStyle = "rgba(196,62,79,0.09)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y + h);
      ctx.lineTo(x + d, y + h - d);
      ctx.lineTo(x + w + d, y + h - d);
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x, y + h);
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + d, y + h - d);
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w + d, y + h - d);
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w, y + h);
      ctx.stroke();
      ctx.fill();
      label(title, x, y + h + 20, color);
      label(formula, x, y + h + 36, colors.ink);
    }

    function drawSphereShape(x, y, r, title, formula, color = colors.green) {
      ctx.strokeStyle = color;
      ctx.fillStyle = "rgba(40,125,79,0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.32, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(x, y, r * 0.32, r, 0, 0, Math.PI * 2);
      ctx.stroke();
      label(title, x - r, y + r + 20, color);
      label(formula, x - r, y + r + 36, colors.ink);
    }

    if (page.includes("geometrie-pythagoras") || page === "geometrie.html") {
      drawTriangle(values[0], values[1]);
    } else if (page.includes("kreis")) {
      drawCircle(values[0]);
    } else if (page.includes("koerper")) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      const s = Math.min(width / 680, 1);
      drawBox(28 * s, 58, 58 * s, 58, 18 * s, "Würfel", "V=a^3", colors.teal);
      drawBox(138 * s, 72, 82 * s, 48, 22 * s, "Quader", "V=a*b*c", colors.green);
      drawBox(272 * s, 72, 74 * s, 48, 18 * s, "Prisma", "V=G*h", colors.amber);
      drawPyramidShape(402 * s, 48, 76 * s, 82, "Pyramide", "V=G*h/3", colors.red);
      drawCylinderShape(38 * s, 178, 72 * s, 54, "Zylinder", "V=pi*r^2*h", colors.teal);
      drawConeShape(178 * s, 166, 72 * s, 72, "Kegel", "V=pi*r^2*h/3", colors.amber);
      drawSphereShape(348 * s, 204, 38 * s, "Kugel", "V=4/3*pi*r^3", colors.green);
      label("h", 126 * s, 210, colors.red);
      label("r", 76 * s, 172, colors.red);
    } else if (page.includes("pq-formel")) {
      axes();
      const [p, q] = values;
      plot((x) => x ** 2 + p * x + q, colors.teal, -6, 6);
      const d = (p / 2) ** 2 - q;
      if (d >= 0) {
        const r = Math.sqrt(d);
        [-p / 2 + r, -p / 2 - r].forEach((root) => {
          ctx.fillStyle = colors.red;
          ctx.beginPath();
          ctx.arc(sx(root), sy(0), 5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      label("x²+px+q", right - 92, top + 20, colors.teal);
    } else if (page.includes("mitternachtsformel")) {
      axes();
      const [a, b, c] = values;
      const safeA = a === 0 ? 1 : a;
      plot((x) => safeA * x ** 2 + b * x + c, colors.teal, -6, 6);
      const d = b ** 2 - 4 * safeA * c;
      if (d >= 0) {
        const r = Math.sqrt(d);
        [(-b + r) / (2 * safeA), (-b - r) / (2 * safeA)].forEach((root) => {
          ctx.fillStyle = colors.red;
          ctx.beginPath();
          ctx.arc(sx(root), sy(0), 5, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      label("ax²+bx+c", right - 92, top + 20, colors.teal);
    } else if (page.includes("gleichungssysteme")) {
      axes();
      const [m1, b1, m2, b2] = values;
      plot((x) => m1 * x + b1, colors.teal);
      plot((x) => m2 * x + b2, colors.red);
      if (m1 !== m2) {
        const x = (b2 - b1) / (m1 - m2);
        const y = m1 * x + b1;
        ctx.fillStyle = colors.amber;
        ctx.beginPath();
        ctx.arc(sx(x), sy(y), 6, 0, Math.PI * 2);
        ctx.fill();
        label("S", sx(x) + 8, sy(y) - 8, colors.amber);
      }
    } else if (page.includes("quadratische") || page.includes("kurvendiskussion")) {
      axes();
      const [a, d, e] = values;
      plot((x) => a * (x - d) ** 2 + e, colors.teal);
      ctx.fillStyle = colors.red;
      ctx.beginPath();
      ctx.arc(sx(d), sy(e), 6, 0, Math.PI * 2);
      ctx.fill();
      label("S", sx(d) + 8, sy(e) - 8, colors.red);
    } else if (page.includes("exponentiell")) {
      axes();
      const [a, q, selectedX] = values;
      plot((x) => (a * q ** (x + 2)) / 2, colors.teal, -2, 6);
      const graphX = selectedX - 2;
      const graphY = (a * q ** selectedX) / 2;
      ctx.fillStyle = colors.red;
      ctx.beginPath();
      ctx.arc(sx(graphX), sy(graphY), 6, 0, Math.PI * 2);
      ctx.fill();
      label("a·qˣ", sx(graphX) + 8, sy(graphY) - 8, colors.red);
    } else if (page.includes("lineare") || page === "funktionen.html") {
      axes();
      const [m, b] = values;
      plot((x) => m * x + b, colors.teal);
    } else if (page.includes("trigonometrie-graphen")) {
      axes();
      const [a, b] = values;
      plot((x) => a * Math.sin(b * x), colors.teal);
    } else if (page.includes("trigonometrie")) {
      const deg = values[0];
      const hyp = values[1] || 8;
      const rad = (deg * Math.PI) / 180;
      drawTriangle(Math.cos(rad) * hyp, Math.sin(rad) * hyp);
      label("θ", left + 54, bottom - 42, colors.teal);
    } else if (page.includes("integral")) {
      axes();
      const b = values[0];
      ctx.fillStyle = "rgba(196,62,79,0.18)";
      ctx.beginPath();
      ctx.moveTo(sx(0), sy(0));
      for (let i = 0; i <= 120; i++) {
        const x = (i / 120) * b;
        ctx.lineTo(sx(x), sy((x * x) / 4));
      }
      ctx.lineTo(sx(b), sy(0));
      ctx.closePath();
      ctx.fill();
      plot((x) => (x * x) / 4, colors.teal, -1, 6);
      label("∫", sx(b / 2), sy(2), colors.red);
    } else if (page.includes("ableitung") || page === "analysis.html") {
      axes();
      const x0 = values[0] || 2;
      plot((x) => (x * x) / 3, colors.teal);
      const y0 = (x0 * x0) / 3;
      const slope = (2 * x0) / 3;
      ctx.strokeStyle = colors.red;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(sx(x0 - 2), sy(y0 - 2 * slope));
      ctx.lineTo(sx(x0 + 2), sy(y0 + 2 * slope));
      ctx.stroke();
      label("f′", sx(x0) + 10, sy(y0) - 10, colors.red);
    } else if (page.includes("stochastik-baumdiagramm")) {
      const [pA, pBgivenA, pBgivenNotA] = values;
      const pNotA = 100 - pA;
      const pNotBgivenA = 100 - pBgivenA;
      const pNotBgivenNotA = 100 - pBgivenNotA;
      const firstX = midX - 70;
      const secondX = right - 70;
      const startX = left + 52;
      const aY = top + 72;
      const notAY = bottom - 72;
      const endYs = [top + 28, top + 116, bottom - 116, bottom - 28];
      label("Start", left, midY);
      label(`A ${pA}%`, firstX - 42, top + 44, colors.teal);
      label(`nicht A ${pNotA}%`, firstX - 74, bottom - 42, colors.amber);
      label(`B ${pBgivenA}%`, secondX - 58, top + 26, colors.red);
      label(`nicht B ${pNotBgivenA}%`, secondX - 82, top + 116, colors.red);
      label(`B ${pBgivenNotA}%`, secondX - 58, bottom - 118, colors.red);
      label(`nicht B ${pNotBgivenNotA}%`, secondX - 82, bottom - 28, colors.red);
      ctx.strokeStyle = colors.teal;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, midY - 5);
      ctx.lineTo(firstX, aY);
      ctx.moveTo(startX, midY + 5);
      ctx.lineTo(firstX, notAY);
      ctx.stroke();
      ctx.strokeStyle = colors.red;
      ctx.beginPath();
      ctx.moveTo(firstX, aY);
      ctx.lineTo(secondX, endYs[0]);
      ctx.moveTo(firstX, aY);
      ctx.lineTo(secondX, endYs[1]);
      ctx.moveTo(firstX, notAY);
      ctx.lineTo(secondX, endYs[2]);
      ctx.moveTo(firstX, notAY);
      ctx.lineTo(secondX, endYs[3]);
      ctx.stroke();
    } else if (page.includes("stochastik")) {
      const first = values[0];
      const total = Math.max(values[1] || 6, first);
      drawBars([
        { label: "E", value: first, color: colors.teal },
        { label: "Ω", value: total, color: colors.amber },
      ]);
    } else if (page.includes("vektoren-geraden")) {
      axes();
      const t = values[0];
      plot((x) => (x + 1) / 3 + 2, colors.grid);
      drawVector(1 + 3 * t, 2 + t, "p+t·v");
    } else if (page.includes("vektoren-skalarprodukt")) {
      drawVector(values[0], values[1], "a");
      ctx.strokeStyle = colors.red;
      ctx.fillStyle = colors.red;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      ctx.lineTo(sx(values[2] / 2), sy(values[3] / 2));
      ctx.stroke();
      label("b", sx(values[2] / 2) + 8, sy(values[3] / 2) - 8, colors.red);
    } else if (page.includes("vektoren")) {
      drawVector(values[0], values[1], "v");
    } else if (page.includes("finanz") || page.includes("zins") || page.includes("wachstum")) {
      axes();
      const start = values[0] || 100;
      const rate = (values[1] || values[2] || 5) / 100;
      const steps = values[2] || values[1] || 10;
      const maxY = start * (1 + rate) ** steps;
      plot((x) => ((start * (1 + rate) ** (x + 6)) / maxY) * 5, colors.teal, -6, 6);
      label("Kₙ", right - 42, top + 20, colors.teal);
    } else if (page.includes("brueche")) {
      const [a, b] = values;
      drawBars([
        { label: "Zähler", value: a, color: colors.teal },
        { label: "Nenner", value: b, color: colors.amber },
      ]);
    } else if (page.includes("prozent")) {
      const [g, p] = values;
      drawBars([
        { label: "G", value: g, color: colors.amber },
        { label: "W", value: g * p / 100, color: colors.teal },
      ]);
    } else if (page.includes("negative")) {
      axes();
      const [a, b] = values;
      ctx.strokeStyle = colors.teal;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(sx(0), sy(0));
      ctx.lineTo(sx(a / 2), sy(0));
      ctx.stroke();
      label(String(a), sx(a / 2), sy(0) - 14, colors.teal);
      label(`${a} * ${b} = ${a * b}`, left, top + 24, colors.red);
    } else if (page.includes("dreisatz")) {
      const [amount, value, target] = values;
      drawBars([
        { label: String(amount), value, color: colors.teal },
        { label: String(target), value: value / amount * target, color: colors.red },
      ]);
    } else if (page.includes("potenzen")) {
      const [base, exp] = values;
      drawBars(Array.from({ length: exp + 1 }, (_, i) => ({ label: String(i), value: base ** i, color: colors.teal })));
    } else if (page.includes("terme")) {
      drawBars([
        { label: "ax", value: Math.abs(values[0]), color: colors.teal },
        { label: "bx", value: Math.abs(values[1]), color: colors.red },
        { label: "(a+b)x", value: Math.abs(values[0] + values[1]), color: colors.amber },
      ]);
    } else {
      axes();
      const [a, b, c] = values;
      const solution = (c - b) / a;
      plot((x) => a * x + b, colors.teal);
      ctx.fillStyle = colors.red;
      ctx.beginPath();
      ctx.arc(sx(solution), sy(c), 6, 0, Math.PI * 2);
      ctx.fill();
      label("x", sx(solution) + 8, sy(c) - 8, colors.red);
    }
  }

  const config = configs[page] || null;
  if (!config || document.querySelector("#autoMiniSimulation")) return;
  const formulaText = symbolFormula([]);
  const anchor = formulaAnchor();
  const formulaHref = anchor ? `formelsammlung.html#${anchor}` : "formelsammlung.html";

  const section = document.createElement("section");
  section.className = "band mini-sim";
  section.id = "autoMiniSimulation";
  section.innerHTML = `
    <div class="section-heading">
      <p class="eyebrow">Simulation</p>
      <h2>${config.title}</h2>
      <p>${config.intro}</p>
      <a class="text-link" href="${formulaHref}">Passende Formel öffnen</a>
    </div>
    <div class="mini-sim-panel">
      <div class="mini-controls"></div>
      <div class="mini-visual-wrap">
        <canvas class="mini-visual" width="680" height="280" aria-label="Graphische Simulation"></canvas>
        <div class="mini-output" aria-live="polite"></div>
        <p class="mini-summary" aria-live="polite"></p>
      </div>
    </div>
    <div class="practice-panel">
      <div>
        <p class="eyebrow">Beispielaufgabe</p>
        <h3>Rechne mit Hilfe der Simulation.</h3>
        <p class="practice-task"></p>
      </div>
      <div class="practice-actions">
        <button class="tool-button" type="button" data-practice-new>Neue Beispielaufgabe</button>
        <button class="tool-button" type="button" data-practice-solution>Beispiellösung zeigen</button>
      </div>
      <div class="practice-solution" hidden aria-live="polite"></div>
    </div>
    <div class="practice-panel exam-panel">
      <div>
        <p class="eyebrow">Prüfungsaufgabe</p>
        <h3>Teste dich ohne Simulation.</h3>
        <p class="exam-task"></p>
      </div>
      <div class="practice-actions">
        <button class="tool-button" type="button" data-exam-new>Neue Prüfungsaufgabe</button>
        <button class="tool-button" type="button" data-exam-solution>Lösung prüfen</button>
      </div>
      <div class="exam-solution" hidden aria-live="polite"></div>
    </div>
  `;
  const main = document.querySelector("main");
  const intro = main?.querySelector(".page-intro");
  if (intro) {
    intro.after(section);
  } else {
    main?.append(section);
  }

  const controls = section.querySelector(".mini-controls");
  const output = section.querySelector(".mini-output");
  const summary = section.querySelector(".mini-summary");
  const visual = section.querySelector(".mini-visual");
  const practiceTask = section.querySelector(".practice-task");
  const practiceSolution = section.querySelector(".practice-solution");
  const examTask = section.querySelector(".exam-task");
  const examSolution = section.querySelector(".exam-solution");
  const newPracticeBtn = section.querySelector("[data-practice-new]");
  const solutionPracticeBtn = section.querySelector("[data-practice-solution]");
  const newExamBtn = section.querySelector("[data-exam-new]");
  const solutionExamBtn = section.querySelector("[data-exam-solution]");
  const inputs = config.controls.map(([label, min, max, step, value], index) => {
    const row = document.createElement("label");
    row.className = "mini-control";
    row.innerHTML = `
      <span>${label}</span>
      <input type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-index="${index}">
      <input class="number-input" type="number" min="${min}" max="${max}" step="${step}" value="${value}" aria-label="${label} als Zahl">
      <strong>${value}</strong>
    `;
    controls.append(row);
    return row.querySelector("input");
  });
  const numberInputs = [...controls.querySelectorAll(".number-input")];

  function describe(values) {
    const pairs = config.controls.map(([label], index) => `${label} = ${values[index]}`).join(", ");
    return `${config.title}: ${pairs}. ${formatMathText(config.calc(values).replace(/<br>/g, ". "))}`;
  }

  function practiceText(values, mode = "practice") {
    const pairs = config.controls.map(([label], index) => `${label} = ${values[index]}`).join(", ");
    const examPrefix = mode === "exam" ? "Prüfungsaufgabe: " : "";

    if (page.includes("dreisatz")) {
      const [amount, value, target] = values;
      return `${examPrefix}${amount} Hefte kosten ${value} Euro. Wie viel kosten ${target} Hefte, wenn der Preis proportional bleibt? Begründe mit dem Rechenschritt über 1 Heft.`;
    }
    if (page.includes("brueche")) {
      return `${examPrefix}Berechne den Wert des Bruchs ${values[0]}/${values[1]} als Dezimalzahl und kürze, falls möglich.`;
    }
    if (page === "grundlagen.html") {
      return `${examPrefix}Berechne mit Zahl a = ${values[0]}, Zahl b = ${values[1]} und ${values[2]} %: a + b, a - b und den Prozentwert von a.`;
    }
    if (page.includes("prozent")) {
      return `${examPrefix}Ein Grundwert beträgt ${values[0]}. Wie groß sind ${values[1]} % davon? Notiere Formel und Ergebnis.`;
    }
    if (page.includes("negative")) {
      return `${examPrefix}Berechne ${values[0]} · ${values[1]} und gib zusätzlich den Betrag von ${values[0]} an.`;
    }
    if (page.includes("gleichungssysteme")) {
      return `${examPrefix}Bestimme den Schnittpunkt der Geraden mit ${pairs}.`;
    }
    if (page.includes("pq-formel")) {
      return `${examPrefix}Löse die Gleichung x² + ${values[0]}x + ${values[1]} = 0 mit der pq-Formel.`;
    }
    if (page.includes("mitternachtsformel")) {
      return `${examPrefix}Löse ${values[0]}x² + ${values[1]}x + ${values[2]} = 0 mit der abc-Formel.`;
    }
    if (page.includes("potenzen")) {
      return `${examPrefix}Berechne die Potenz ${values[0]}^${values[1]}.`;
    }
    if (page.includes("terme")) {
      return `${examPrefix}Fasse den Term ${values[0]}x + ${values[1]}x + ${values[2]} zusammen.`;
    }
    if (page.includes("variablen")) {
      return `${examPrefix}Setze x = ${values[2]} in den Term ${values[0]}x + ${values[1]} ein.`;
    }
    if (page.includes("pythagoras")) {
      return `${examPrefix}Ein rechtwinkliges Dreieck hat die Katheten ${values[0]} und ${values[1]}. Berechne die Hypotenuse.`;
    }
    if (page.includes("kreis")) {
      return `${examPrefix}Ein Kreis hat den Radius ${values[0]}. Berechne Umfang und Fläche.`;
    }
    if (page.includes("koerper")) {
      return `${examPrefix}Ein Würfel hat Kantenlänge ${values[0]}. Ein Prisma hat Grundfläche ${values[0]}² und Höhe ${values[1]}. Berechne die Volumen.`;
    }
    if (page.includes("einheitskreis")) {
      return `${examPrefix}Bestimme sin, cos und das Bogenmaß für einen Winkel von ${values[0]}° am Einheitskreis.`;
    }
    if (page.includes("trigonometrie-dreieck")) {
      return `${examPrefix}Berechne sin, cos und tan für einen Winkel von ${values[0]}°.`;
    }
    if (page.includes("trigonometrie-graphen")) {
      return `${examPrefix}Bestimme Amplitude und Periode der Funktion f(x) = ${values[0]} · sin(${values[1]}x).`;
    }
    if (page.includes("lineare")) {
      return `${examPrefix}Bestimme die Steigung aus Δx = ${values[0]} und Δy = ${values[1]}.`;
    }
    if (page.includes("quadratische") || page.includes("kurvendiskussion")) {
      return `${examPrefix}Bestimme den Scheitelpunkt der Funktion f(x) = ${values[0]}(x - ${values[1]})² + ${values[2]}.`;
    }
    if (page.includes("exponentiell")) {
      return `${examPrefix}Berechne den Funktionswert für Startwert ${values[0]}, Faktor ${values[1]} und x = ${values[2]}.`;
    }
    if (page.includes("ableitung") || page === "analysis.html") {
      return `${examPrefix}Berechne f(${values[0]}) und f′(${values[0]}) für f(x) = x².`;
    }
    if (page.includes("integral")) {
      return `${examPrefix}Berechne die Fläche unter f(x)=x² von 0 bis ${values[0]}.`;
    }
    if (page.includes("baumdiagramm")) {
      return `${examPrefix}Berechne die Pfadwahrscheinlichkeiten für ${pairs}.`;
    }
    if (page.includes("erwartungswert")) {
      return `${examPrefix}Ein Spiel hat ${values[0]} Euro Gewinnchance bei ${values[1]} % und kostet ${values[2]} Euro. Berechne den Erwartungswert.`;
    }
    if (page.includes("wahrscheinlichkeit")) {
      return `${examPrefix}Wie wahrscheinlich ist es, mit einem Würfel höchstens ${values[0]} zu werfen?`;
    }
    if (page.includes("vektoren-geraden")) {
      return `${examPrefix}Setze t = ${values[0]} in die Gerade p=(1|2), v=(3|1) ein.`;
    }
    if (page.includes("vektoren-skalarprodukt")) {
      return `${examPrefix}Berechne das Skalarprodukt der Vektoren a=(${values[0]}|${values[1]}) und b=(${values[2]}|${values[3]}).`;
    }
    if (page.includes("vektoren")) {
      return `${examPrefix}Berechne die Länge des Vektors mit ${pairs}.`;
    }
    if (page.includes("zins") || page.includes("finanz")) {
      return `${examPrefix}Berechne das Ergebnis für ${pairs}.`;
    }

    return `${examPrefix}Bearbeite die Aufgabe mit diesen Werten: ${pairs}.`;
  }

  function randomValues(mode = "practice") {
    return config.controls.map(([label, min, max, step, value]) => {
      const boundedMin = Math.max(min, -12);
      const cap = mode === "exam" ? 40 : 30;
      const boundedMax = max > cap && min <= cap ? cap : max;
      if (boundedMax < boundedMin) return value;
      return steppedRandom(boundedMin, boundedMax, step);
    });
  }

  function renderPractice() {
    const values = randomValues("practice");
    practiceTask.innerHTML = formatMathHtml(practiceText(values));
    practiceSolution.innerHTML = `<div class="symbol-line">${formatMathHtml(formulaText)}</div>${formatMathHtml(config.calc(values))}`;
    practiceSolution.hidden = true;
    solutionPracticeBtn.textContent = "Beispiellösung zeigen";
  }

  function renderExam() {
    const values = randomValues("exam");
    examTask.innerHTML = formatMathHtml(practiceText(values, "exam"));
    examSolution.innerHTML = `<div class="symbol-line">${formatMathHtml(formulaText)}</div>${formatMathHtml(config.calc(values))}`;
    examSolution.hidden = true;
    solutionExamBtn.textContent = "Lösung prüfen";
  }

  function update() {
    const values = inputs.map((input) => Number(input.value));
    inputs.forEach((input, index) => {
      numberInputs[index].value = input.value;
      numberInputs[index].nextElementSibling.textContent = input.value;
    });
    output.innerHTML = `<div class="symbol-line">${formatMathHtml(symbolFormula(values))}</div>${formatMathHtml(config.calc(values))}`;
    summary.textContent = describe(values);
    drawMiniVisual(visual, values);
  }

  inputs.forEach((input) => input.addEventListener("input", update));
  numberInputs.forEach((numberInput, index) => {
    numberInput.addEventListener("input", () => {
      const [label, min, max] = config.controls[index];
      const value = Number(numberInput.value);
      if (Number.isNaN(value)) return;
      inputs[index].value = Math.min(max, Math.max(min, value));
      update();
    });
  });
  newPracticeBtn.addEventListener("click", renderPractice);
  solutionPracticeBtn.addEventListener("click", () => {
    practiceSolution.hidden = !practiceSolution.hidden;
    solutionPracticeBtn.textContent = practiceSolution.hidden ? "Beispiellösung zeigen" : "Beispiellösung ausblenden";
  });
  newExamBtn.addEventListener("click", renderExam);
  solutionExamBtn.addEventListener("click", () => {
    examSolution.hidden = !examSolution.hidden;
    solutionExamBtn.textContent = examSolution.hidden ? "Lösung prüfen" : "Lösung ausblenden";
  });
  window.addEventListener("resize", update);
  renderPractice();
  renderExam();
  update();
}

function enhanceNavigation() {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  if (!nav.querySelector('a[href="formelsammlung.html"]')) {
    const formulaLink = document.createElement("a");
    formulaLink.href = "formelsammlung.html";
    formulaLink.textContent = "Formeln";
    nav.append(formulaLink);
  }

  const page = window.location.pathname.split("/").pop() || "index.html";
  nav.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active", href === page);
    if (href === page) link.setAttribute("aria-current", "page");
  });
}

function enhanceStaticFormulas() {
  document.querySelectorAll(".formula").forEach((formula) => {
    formula.innerHTML = formatMathHtml(formula.innerHTML);
  });
}

enhanceNavigation();
enhanceStaticFormulas();
initUnitCircle();
initSineUnitCircle();
initDerivative();
initBodySimulations();
initDreisatzFillSimulation();
initMiniSimulation();
