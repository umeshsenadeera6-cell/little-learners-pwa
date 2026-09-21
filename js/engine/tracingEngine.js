/* -------------------------- TRACING ENGINE -----------------------------
   Pointer Event-driven validation & real-time path matching engine.
   Normalized coordinates (0 to 100).
   Child-friendly, forgiving tolerance tailored for ages 3-6.
   ------------------------------------------------------------------------ */

export class TracingEngine {
  constructor(svgElement, template, callbacks) {
    this.svg = svgElement;
    this.template = template || { strokes: [] };
    this.callbacks = callbacks || {};

    this.currentStrokeIndex = 0;
    this.userPoints = []; // [{x, y}] for current stroke
    this.completedStrokes = []; // Array of user point arrays
    this.isDrawing = false;

    this.tolerance = template.tolerance || 18; // forgiving distance threshold in normalized 0..100 units
    this.minCoverage = template.minimumCoverage || 0.65; // 65-70% coverage requirement

    this.samplePoints = []; // target points along SVG path
    this.coveredSamples = [];

    this._onPointerDown = this.handlePointerDown.bind(this);
    this._onPointerMove = this.handlePointerMove.bind(this);
    this._onPointerUp = this.handlePointerUp.bind(this);

    this.init();
  }

  init() {
    this.svg.addEventListener("pointerdown", this._onPointerDown);
    this.svg.addEventListener("pointermove", this._onPointerMove);
    window.addEventListener("pointerup", this._onPointerUp);
    window.addEventListener("pointercancel", this._onPointerUp);
    this.prepareCurrentStrokeSamples();
  }

  destroy() {
    this.svg.removeEventListener("pointerdown", this._onPointerDown);
    this.svg.removeEventListener("pointermove", this._onPointerMove);
    window.removeEventListener("pointerup", this._onPointerUp);
    window.removeEventListener("pointercancel", this._onPointerUp);
  }

  setTemplate(template) {
    this.template = template || { strokes: [] };
    this.currentStrokeIndex = 0;
    this.completedStrokes = [];
    this.userPoints = [];
    this.isDrawing = false;
    this.prepareCurrentStrokeSamples();
  }

  prepareCurrentStrokeSamples() {
    this.samplePoints = [];
    this.coveredSamples = [];
    var stroke = this.template.strokes && this.template.strokes[this.currentStrokeIndex];
    if (!stroke) return;

    // Create a temporary SVG path to sample points along the curve
    var pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEl.setAttribute("d", stroke.path);
    var totalLen = pathEl.getTotalLength ? pathEl.getTotalLength() : 100;
    var numSamples = 30;

    for (var i = 0; i <= numSamples; i++) {
      var len = (i / numSamples) * totalLen;
      var pt = pathEl.getPointAtLength ? pathEl.getPointAtLength(len) : { x: 50, y: 50 };
      this.samplePoints.push({ x: pt.x, y: pt.y });
      this.coveredSamples.push(false);
    }
  }

  getNormalizedPoint(e) {
    var rect = this.svg.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / rect.width) * 100;
    var y = ((e.clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  }

  distance(p1, p2) {
    var dx = p1.x - p2.x;
    var dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  handlePointerDown(e) {
    e.preventDefault();
    if (this.currentStrokeIndex >= this.template.strokes.length) return;

    var pt = this.getNormalizedPoint(e);
    var stroke = this.template.strokes[this.currentStrokeIndex];

    // Forgiving start check: user must start near stroke start point or anywhere along the path
    var distStart = this.distance(pt, stroke.start);
    var nearPath = distStart < this.tolerance * 1.5;

    if (!nearPath) {
      // Check if near any target sample point
      for (var i = 0; i < this.samplePoints.length; i++) {
        if (this.distance(pt, this.samplePoints[i]) < this.tolerance) {
          nearPath = true;
          break;
        }
      }
    }

    if (nearPath) {
      this.isDrawing = true;
      this.userPoints = [pt];
      this.checkSampleCoverage(pt);
      if (this.callbacks.onStart) this.callbacks.onStart(pt);
    } else {
      if (this.callbacks.onOffPath) this.callbacks.onOffPath("Follow the dots 😊");
    }
  }

  handlePointerMove(e) {
    if (!this.isDrawing) return;
    e.preventDefault();
    var pt = this.getNormalizedPoint(e);

    this.userPoints.push(pt);
    var isOnPath = this.checkSampleCoverage(pt);

    if (this.callbacks.onTrace) {
      this.callbacks.onTrace(pt, this.userPoints, isOnPath);
    }

    // Check if stroke completed during drag
    var coverage = this.getCoverageRatio();
    if (coverage >= this.minCoverage) {
      this.finishCurrentStroke();
    }
  }

  handlePointerUp(e) {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    var coverage = this.getCoverageRatio();
    if (coverage >= this.minCoverage) {
      this.finishCurrentStroke();
    } else {
      if (this.callbacks.onStrokeIncomplete) {
        this.callbacks.onStrokeIncomplete();
      }
    }
  }

  checkSampleCoverage(pt) {
    var isOnPath = false;
    for (var i = 0; i < this.samplePoints.length; i++) {
      if (this.distance(pt, this.samplePoints[i]) <= this.tolerance) {
        this.coveredSamples[i] = true;
        isOnPath = true;
      }
    }
    return isOnPath;
  }

  getCoverageRatio() {
    if (!this.coveredSamples.length) return 0;
    var covered = 0;
    for (var i = 0; i < this.coveredSamples.length; i++) {
      if (this.coveredSamples[i]) covered++;
    }
    return covered / this.coveredSamples.length;
  }

  finishCurrentStroke() {
    this.isDrawing = false;
    this.completedStrokes.push([...this.userPoints]);
    this.userPoints = [];

    var finishedIndex = this.currentStrokeIndex;
    this.currentStrokeIndex++;

    if (this.callbacks.onStrokeComplete) {
      this.callbacks.onStrokeComplete(finishedIndex, this.currentStrokeIndex, this.template.strokes.length);
    }

    if (this.currentStrokeIndex < this.template.strokes.length) {
      this.prepareCurrentStrokeSamples();
    } else {
      // Entire letter/number/shape complete!
      var score = this.calculateFinalScore();
      if (this.callbacks.onComplete) {
        this.callbacks.onComplete(score);
      }
    }
  }

  calculateFinalScore() {
    // Return friendly score 85 - 100 for completed tracing
    return Math.floor(88 + Math.random() * 12);
  }
}
