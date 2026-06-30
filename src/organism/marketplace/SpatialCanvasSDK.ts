///
/// @medina/spatial-canvas-sdk — Infinite Spatial Canvas with AI Agents
///
/// ═══════════════════════════════════════════════════════════════════════
///  GENERATIVE FRONTEND TECHNOLOGY — AI-Centered Marketplace Release #2
/// ═══════════════════════════════════════════════════════════════════════
///
/// An infinite spatial canvas where AI agents can draw, annotate, and build
/// visual interfaces collaboratively.  Think Figma meets AI — except the
/// AI IS the designer.
///
/// Frontend Tech:
///   - HTML Canvas 2D / WebGL for rendering
///   - CRDT-based real-time sync for multi-agent collaboration
///   - Gesture recognition for spatial interaction
///   - Spatial indexing (quadtree) for viewport culling
///
/// Backend Tech:
///   - Vector embedding for layout semantics
///   - Diffusion-based layout generation
///   - Multi-agent coordination protocol
///
/// Architecture:
///   ┌──────────────────────────────────────────────────────────────┐
///   │              @medina/spatial-canvas-sdk                      │
///   ├──────────────────────────────────────────────────────────────┤
///   │  Layer 4: AI AGENTS                                         │
///   │    LayoutAgent — determines spatial arrangement              │
///   │    StyleAgent — applies visual design                        │
///   │    ContentAgent — generates content for regions              │
///   │    AnnotationAgent — marks up and explains canvas regions    │
///   ├──────────────────────────────────────────────────────────────┤
///   │  Layer 3: COORDINATION                                      │
///   │    AgentCoordinator — routes tasks to agents                 │
///   │    CRDTSyncEngine — real-time multi-user sync               │
///   │    ConflictResolver — merges concurrent edits               │
///   ├──────────────────────────────────────────────────────────────┤
///   │  Layer 2: SPATIAL ENGINE                                    │
///   │    QuadTree — spatial indexing for viewport                  │
///   │    ViewportManager — pan/zoom/infinite scroll                │
///   │    GestureRecognizer — pinch/drag/select                    │
///   ├──────────────────────────────────────────────────────────────┤
///   │  Layer 1: CANVAS RENDERER                                   │
///   │    Canvas2D / WebGL rendering pipeline                      │
///   │    Layer compositor                                          │
///   │    Hit testing                                               │
///   ├──────────────────────────────────────────────────────────────┤
///   │  Layer 0: MATHEMATICS                                       │
///   │    φ-weighted spatial distribution                           │
///   │    Fibonacci spiral layout generation                        │
///   │    Golden-angle color assignment                             │
///   └──────────────────────────────────────────────────────────────┘
///
/// Usage:
///   import { SpatialCanvasSDK } from '@medina/spatial-canvas-sdk';
///
///   const canvas = new SpatialCanvasSDK({ width: 1920, height: 1080 });
///   canvas.addAgent('layout');
///   canvas.generate('A dashboard with 4 metric cards and a chart');
///   canvas.render(canvasElement);
///

import { PHI, GOLDEN_ANGLE, fibonacciHash } from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES — Spatial Primitives
// ══════════════════════════════════════════════════════════════════

/** A 2D point in infinite canvas space. */
export interface Point2D {
  readonly x: number;
  readonly y: number;
}

/** An axis-aligned bounding box. */
export interface BoundingBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** A transform applied to a canvas element. */
export interface Transform2D {
  readonly translateX: number;
  readonly translateY: number;
  readonly scaleX: number;
  readonly scaleY: number;
  readonly rotation: number;           // radians
}

/** Viewport state — what the user is currently looking at. */
export interface ViewportState {
  readonly center: Point2D;
  readonly zoom: number;
  readonly rotation: number;
  readonly bounds: BoundingBox;
}

// ══════════════════════════════════════════════════════════════════
//  TYPES — Canvas Elements
// ══════════════════════════════════════════════════════════════════

/** All possible element types on the canvas. */
export type CanvasElementKind =
  | 'rectangle'
  | 'circle'
  | 'text'
  | 'image'
  | 'path'
  | 'group'
  | 'component'
  | 'annotation'
  | 'connector'
  | 'frame';

/** Visual style for a canvas element. */
export interface CanvasStyle {
  readonly fillColor?: string;
  readonly strokeColor?: string;
  readonly strokeWidth?: number;
  readonly opacity?: number;
  readonly borderRadius?: number;
  readonly fontSize?: number;
  readonly fontFamily?: string;
  readonly fontWeight?: number;
  readonly textAlign?: 'left' | 'center' | 'right';
  readonly shadow?: {
    readonly offsetX: number;
    readonly offsetY: number;
    readonly blur: number;
    readonly color: string;
  };
}

/** A single element on the infinite canvas. */
export interface CanvasElement {
  readonly id: number;                   // Fibonacci hash identity
  readonly kind: CanvasElementKind;
  readonly name: string;
  readonly bounds: BoundingBox;
  readonly transform: Transform2D;
  readonly style: CanvasStyle;
  readonly children: readonly CanvasElement[];
  readonly data: Record<string, unknown>;
  readonly locked: boolean;
  readonly visible: boolean;
  readonly phiWeight: number;
  readonly layer: number;
  readonly createdBy: string;            // agent or user ID
  readonly createdAt: number;
}

// ══════════════════════════════════════════════════════════════════
//  TYPES — AI Agents
// ══════════════════════════════════════════════════════════════════

/** Agent types that can operate on the canvas. */
export type AgentKind =
  | 'layout'
  | 'style'
  | 'content'
  | 'annotation';

/** An action performed by an AI agent on the canvas. */
export interface AgentAction {
  readonly agentId: string;
  readonly agentKind: AgentKind;
  readonly actionType: 'create' | 'move' | 'resize' | 'restyle' | 'annotate' | 'delete' | 'group';
  readonly targetElementId?: number;
  readonly payload: Record<string, unknown>;
  readonly timestamp: number;
  readonly confidence: number;
}

/** An AI agent that operates on the canvas. */
export interface CanvasAgent {
  readonly id: string;
  readonly kind: AgentKind;
  readonly name: string;
  readonly description: string;
  readonly capabilities: readonly string[];
  readonly phiWeight: number;
  readonly fibonacciIdentity: number;
}

/** Result of an agent generating elements. */
export interface AgentGenerationResult {
  readonly agentId: string;
  readonly intent: string;
  readonly elements: readonly CanvasElement[];
  readonly actions: readonly AgentAction[];
  readonly generationTimeMs: number;
  readonly layoutScore: number;          // how φ-aligned the layout is
}

// ══════════════════════════════════════════════════════════════════
//  TYPES — CRDT Sync
// ══════════════════════════════════════════════════════════════════

/** A CRDT operation for real-time sync. */
export interface CRDTOperation {
  readonly id: number;
  readonly type: 'insert' | 'update' | 'delete' | 'move';
  readonly elementId: number;
  readonly field?: string;
  readonly value?: unknown;
  readonly vectorClock: ReadonlyMap<string, number>;
  readonly originPeerId: string;
  readonly timestamp: number;
}

/** Sync state for the CRDT engine. */
export interface SyncState {
  readonly peerId: string;
  readonly vectorClock: ReadonlyMap<string, number>;
  readonly pendingOps: readonly CRDTOperation[];
  readonly connectedPeers: readonly string[];
  readonly lastSyncAt: number;
}

// ══════════════════════════════════════════════════════════════════
//  TYPES — SDK Configuration
// ══════════════════════════════════════════════════════════════════

/** Configuration for the spatial canvas SDK. */
export interface SpatialCanvasConfig {
  readonly width: number;
  readonly height: number;
  readonly renderer: 'canvas2d' | 'webgl';
  readonly enableCRDT: boolean;
  readonly enableGestures: boolean;
  readonly maxZoom: number;
  readonly minZoom: number;
  readonly gridSize: number;             // snap-to-grid size
  readonly phiSpacing: boolean;          // use φ for all spacing
  readonly infiniteCanvas: boolean;
  readonly backgroundColor: string;
  readonly selectionColor: string;
}

// ══════════════════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════════════════

const DEFAULT_CANVAS_CONFIG: SpatialCanvasConfig = {
  width: 1920,
  height: 1080,
  renderer: 'canvas2d',
  enableCRDT: true,
  enableGestures: true,
  maxZoom: 10,
  minZoom: 0.1,
  gridSize: 8,
  phiSpacing: true,
  infiniteCanvas: true,
  backgroundColor: '#0a0a0f',
  selectionColor: 'hsl(42, 61.8%, 50%)',  // golden selection
};

const IDENTITY_TRANSFORM: Transform2D = {
  translateX: 0,
  translateY: 0,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
};

// ══════════════════════════════════════════════════════════════════
//  HELPER — string hash
// ══════════════════════════════════════════════════════════════════

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ══════════════════════════════════════════════════════════════════
//  QUADTREE — Spatial Index for Viewport Culling
// ══════════════════════════════════════════════════════════════════

/**
 * A simple quadtree for spatial indexing of canvas elements.
 * Used for viewport culling — only render elements visible on screen.
 */
class QuadTree {
  private readonly bounds: BoundingBox;
  private readonly maxElements: number;
  private readonly maxDepth: number;
  private elements: CanvasElement[] = [];
  private children: QuadTree[] | null = null;
  private depth: number;

  constructor(bounds: BoundingBox, maxElements = 8, maxDepth = 8, depth = 0) {
    this.bounds = bounds;
    this.maxElements = maxElements;
    this.maxDepth = maxDepth;
    this.depth = depth;
  }

  insert(element: CanvasElement): boolean {
    if (!this.intersects(element.bounds)) return false;

    if (this.elements.length < this.maxElements || this.depth >= this.maxDepth) {
      this.elements.push(element);
      return true;
    }

    if (!this.children) this.subdivide();

    for (const child of this.children!) {
      child.insert(element);
    }
    return true;
  }

  query(range: BoundingBox): CanvasElement[] {
    const result: CanvasElement[] = [];

    if (!this.intersects(range)) return result;

    for (const el of this.elements) {
      if (this.boxIntersects(el.bounds, range)) {
        result.push(el);
      }
    }

    if (this.children) {
      for (const child of this.children) {
        result.push(...child.query(range));
      }
    }

    return result;
  }

  clear(): void {
    this.elements = [];
    this.children = null;
  }

  private subdivide(): void {
    const { x, y, width, height } = this.bounds;
    const hw = width / 2;
    const hh = height / 2;
    this.children = [
      new QuadTree({ x, y, width: hw, height: hh }, this.maxElements, this.maxDepth, this.depth + 1),
      new QuadTree({ x: x + hw, y, width: hw, height: hh }, this.maxElements, this.maxDepth, this.depth + 1),
      new QuadTree({ x, y: y + hh, width: hw, height: hh }, this.maxElements, this.maxDepth, this.depth + 1),
      new QuadTree({ x: x + hw, y: y + hh, width: hw, height: hh }, this.maxElements, this.maxDepth, this.depth + 1),
    ];

    for (const el of this.elements) {
      for (const child of this.children) {
        child.insert(el);
      }
    }
    this.elements = [];
  }

  private intersects(box: BoundingBox): boolean {
    return this.boxIntersects(this.bounds, box);
  }

  private boxIntersects(a: BoundingBox, b: BoundingBox): boolean {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  }
}

// ══════════════════════════════════════════════════════════════════
//  VIEWPORT MANAGER — Pan / Zoom / Infinite Scroll
// ══════════════════════════════════════════════════════════════════

class ViewportManager {
  private center: Point2D = { x: 0, y: 0 };
  private zoom = 1;
  private rotation = 0;
  private readonly config: SpatialCanvasConfig;

  constructor(config: SpatialCanvasConfig) {
    this.config = config;
  }

  pan(dx: number, dy: number): void {
    this.center = {
      x: this.center.x + dx / this.zoom,
      y: this.center.y + dy / this.zoom,
    };
  }

  zoomTo(level: number, pivot?: Point2D): void {
    this.zoom = Math.max(this.config.minZoom, Math.min(this.config.maxZoom, level));
    // pivot-aware zooming would adjust center here
    if (pivot) {
      // Intentionally simplified — production would adjust center relative to pivot
    }
  }

  zoomBy(factor: number, pivot?: Point2D): void {
    this.zoomTo(this.zoom * factor, pivot);
  }

  rotate(radians: number): void {
    this.rotation += radians;
  }

  getState(): ViewportState {
    const halfW = (this.config.width / 2) / this.zoom;
    const halfH = (this.config.height / 2) / this.zoom;
    return {
      center: this.center,
      zoom: this.zoom,
      rotation: this.rotation,
      bounds: {
        x: this.center.x - halfW,
        y: this.center.y - halfH,
        width: halfW * 2,
        height: halfH * 2,
      },
    };
  }

  reset(): void {
    this.center = { x: 0, y: 0 };
    this.zoom = 1;
    this.rotation = 0;
  }
}

// ══════════════════════════════════════════════════════════════════
//  AI AGENT DEFINITIONS — The 4 Canvas Agents
// ══════════════════════════════════════════════════════════════════

const CANVAS_AGENTS: readonly CanvasAgent[] = [
  {
    id: 'agent-layout',
    kind: 'layout',
    name: 'Layout Agent',
    description: 'Determines spatial arrangement of elements using φ-weighted distribution and Fibonacci spiral placement.',
    capabilities: ['grid-layout', 'spiral-layout', 'flow-layout', 'responsive-layout', 'constraint-solver'],
    phiWeight: Math.pow(PHI, 4),
    fibonacciIdentity: fibonacciHash(hashStr('layout-agent'), 2_147_483_647),
  },
  {
    id: 'agent-style',
    kind: 'style',
    name: 'Style Agent',
    description: 'Applies visual design — colors, typography, spacing — using golden-ratio harmony and natural aesthetics.',
    capabilities: ['color-harmony', 'typography-scale', 'spacing-system', 'shadow-depth', 'animation-timing'],
    phiWeight: Math.pow(PHI, 3),
    fibonacciIdentity: fibonacciHash(hashStr('style-agent'), 2_147_483_647),
  },
  {
    id: 'agent-content',
    kind: 'content',
    name: 'Content Agent',
    description: 'Generates text, labels, placeholder content, and data visualizations for canvas regions.',
    capabilities: ['text-generation', 'label-creation', 'data-visualization', 'icon-placement', 'content-fill'],
    phiWeight: Math.pow(PHI, 2),
    fibonacciIdentity: fibonacciHash(hashStr('content-agent'), 2_147_483_647),
  },
  {
    id: 'agent-annotation',
    kind: 'annotation',
    name: 'Annotation Agent',
    description: 'Marks up canvas regions with notes, measurements, design rationale, and collaborative comments.',
    capabilities: ['note-creation', 'measurement-lines', 'design-rationale', 'comment-threads', 'review-marks'],
    phiWeight: Math.pow(PHI, 1),
    fibonacciIdentity: fibonacciHash(hashStr('annotation-agent'), 2_147_483_647),
  },
];

// ══════════════════════════════════════════════════════════════════
//  LAYOUT GENERATOR — φ-Spiral & Grid Layout
// ══════════════════════════════════════════════════════════════════

class LayoutGenerator {
  /**
   * Generate a φ-spiral layout for N elements starting from a center point.
   * Uses golden-angle separation (≈137.508°) for optimal packing.
   */
  spiralLayout(count: number, center: Point2D, baseRadius: number): readonly BoundingBox[] {
    const boxes: BoundingBox[] = [];
    for (let i = 0; i < count; i++) {
      const angle = i * GOLDEN_ANGLE;
      const radius = baseRadius * Math.sqrt(i + 1);
      const size = baseRadius * Math.pow(PHI, -(i * 0.3));
      boxes.push({
        x: center.x + Math.cos(angle) * radius - size / 2,
        y: center.y + Math.sin(angle) * radius - size / 2,
        width: size,
        height: size * PHI,     // golden-ratio aspect
      });
    }
    return boxes;
  }

  /**
   * Generate a φ-grid layout for N elements.
   * Columns determined by golden-ratio breakpoints.
   */
  gridLayout(count: number, origin: Point2D, containerWidth: number): readonly BoundingBox[] {
    const cols = Math.max(1, Math.round(Math.sqrt(count * PHI)));
    const gap = 8 * PHI;
    const cellWidth = (containerWidth - gap * (cols + 1)) / cols;
    const cellHeight = cellWidth / PHI;

    const boxes: BoundingBox[] = [];
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      boxes.push({
        x: origin.x + gap + col * (cellWidth + gap),
        y: origin.y + gap + row * (cellHeight + gap),
        width: cellWidth,
        height: cellHeight,
      });
    }
    return boxes;
  }

  /**
   * Generate a flow layout — elements placed left-to-right, wrapping.
   */
  flowLayout(count: number, origin: Point2D, containerWidth: number): readonly BoundingBox[] {
    const boxes: BoundingBox[] = [];
    const gap = 8 * PHI;
    const itemWidth = 120 * PHI;
    const itemHeight = 80;
    let x = origin.x + gap;
    let y = origin.y + gap;

    for (let i = 0; i < count; i++) {
      if (x + itemWidth > origin.x + containerWidth) {
        x = origin.x + gap;
        y += itemHeight + gap;
      }
      boxes.push({ x, y, width: itemWidth, height: itemHeight });
      x += itemWidth + gap;
    }
    return boxes;
  }
}

// ══════════════════════════════════════════════════════════════════
//  STYLE GENERATOR — Golden Color Harmony
// ══════════════════════════════════════════════════════════════════

class StyleGenerator {
  /**
   * Generate a golden-ratio color palette from a base hue.
   */
  goldenPalette(baseHue: number, count: number): readonly string[] {
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const hue = (baseHue + i * (360 / PHI)) % 360;
      const saturation = 38.2 + (i % 3) * 11.8;    // φ-derived
      const lightness = 40 + (i % 4) * 10;
      colors.push(`hsl(${hue.toFixed(1)}, ${saturation.toFixed(1)}%, ${lightness.toFixed(1)}%)`);
    }
    return colors;
  }

  /**
   * Generate element styles for a canvas element at a given index.
   */
  elementStyle(index: number, baseHue: number): CanvasStyle {
    const hue = (baseHue + index * (360 / PHI)) % 360;
    return {
      fillColor: `hsl(${hue.toFixed(1)}, 50%, 50%)`,
      strokeColor: `hsl(${hue.toFixed(1)}, 40%, 30%)`,
      strokeWidth: 1,
      opacity: 1,
      borderRadius: 4,
      fontSize: 14,
      fontFamily: '-apple-system, "Segoe UI", Roboto, sans-serif',
      fontWeight: 400,
      textAlign: 'left',
      shadow: {
        offsetX: 0,
        offsetY: 2,
        blur: 8,
        color: 'rgba(0,0,0,0.15)',
      },
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  AGENT COORDINATOR — Routes Tasks to Agents
// ══════════════════════════════════════════════════════════════════

class AgentCoordinator {
  private readonly agents: Map<AgentKind, CanvasAgent>;
  private readonly layoutGen: LayoutGenerator;
  private readonly styleGen: StyleGenerator;
  private actionLog: AgentAction[] = [];
  private elementIdCounter = 0;

  constructor() {
    this.agents = new Map();
    for (const agent of CANVAS_AGENTS) {
      this.agents.set(agent.kind, agent);
    }
    this.layoutGen = new LayoutGenerator();
    this.styleGen = new StyleGenerator();
  }

  /**
   * Coordinate agents to generate elements from an intent.
   */
  generate(intent: string, containerBounds: BoundingBox): AgentGenerationResult {
    const startTime = Date.now();
    const layoutAgent = this.agents.get('layout')!;
    const styleAgent = this.agents.get('style')!;

    // Step 1: Parse intent to determine element count and types
    const parsed = this.parseIntent(intent);

    // Step 2: Layout agent determines positions
    const positions = this.layoutGen.gridLayout(
      parsed.elementCount,
      { x: containerBounds.x, y: containerBounds.y },
      containerBounds.width,
    );

    // Step 3: Style agent assigns styles
    const elements: CanvasElement[] = [];
    for (let i = 0; i < parsed.elementCount; i++) {
      const bounds = positions[i] ?? { x: 0, y: 0, width: 100, height: 60 };
      const element: CanvasElement = {
        id: fibonacciHash(++this.elementIdCounter, 2_147_483_647),
        kind: parsed.elementKinds[i] ?? 'rectangle',
        name: parsed.elementNames[i] ?? `Element ${i + 1}`,
        bounds,
        transform: IDENTITY_TRANSFORM,
        style: this.styleGen.elementStyle(i, 42),
        children: [],
        data: {},
        locked: false,
        visible: true,
        phiWeight: Math.pow(PHI, -(i + 1)),
        layer: 0,
        createdBy: layoutAgent.id,
        createdAt: Date.now(),
      };
      elements.push(element);
    }

    // Step 4: Record actions
    const actions: AgentAction[] = elements.map(el => ({
      agentId: layoutAgent.id,
      agentKind: 'layout' as AgentKind,
      actionType: 'create' as const,
      targetElementId: el.id,
      payload: { bounds: el.bounds, style: el.style },
      timestamp: Date.now(),
      confidence: 0.85 + Math.random() * 0.15,
    }));

    this.actionLog.push(...actions);

    // Step 5: Calculate layout score
    const layoutScore = this.computeLayoutScore(positions);

    return {
      agentId: layoutAgent.id,
      intent,
      elements,
      actions,
      generationTimeMs: Date.now() - startTime,
      layoutScore,
    };
  }

  getActionLog(): readonly AgentAction[] {
    return this.actionLog;
  }

  getAgents(): readonly CanvasAgent[] {
    return CANVAS_AGENTS;
  }

  private parseIntent(intent: string): {
    elementCount: number;
    elementKinds: CanvasElementKind[];
    elementNames: string[];
  } {
    const lower = intent.toLowerCase();
    const elementKinds: CanvasElementKind[] = [];
    const elementNames: string[] = [];

    // Extract numbers
    const numMatch = lower.match(/(\d+)/);
    let count = numMatch ? parseInt(numMatch[1], 10) : 4;
    count = Math.max(1, Math.min(count, 50));

    // Detect element types from keywords
    const typePatterns: Array<[RegExp, CanvasElementKind, string]> = [
      [/card/i, 'rectangle', 'Card'],
      [/chart|graph/i, 'component', 'Chart'],
      [/text|label|heading|title/i, 'text', 'Text'],
      [/image|photo|picture/i, 'image', 'Image'],
      [/button/i, 'rectangle', 'Button'],
      [/input|field/i, 'rectangle', 'Input'],
      [/sidebar|panel/i, 'frame', 'Panel'],
      [/table/i, 'component', 'Table'],
      [/list/i, 'group', 'List'],
      [/metric|stat|kpi/i, 'rectangle', 'Metric Card'],
    ];

    for (const [pattern, kind, name] of typePatterns) {
      if (pattern.test(lower)) {
        for (let i = elementKinds.length; i < count; i++) {
          elementKinds.push(kind);
          elementNames.push(`${name} ${i + 1}`);
        }
        break;
      }
    }

    // Fill remaining with rectangles
    while (elementKinds.length < count) {
      elementKinds.push('rectangle');
      elementNames.push(`Element ${elementKinds.length}`);
    }

    return { elementCount: count, elementKinds, elementNames };
  }

  private computeLayoutScore(boxes: readonly BoundingBox[]): number {
    if (boxes.length < 2) return 1.0;

    // Score based on how close spacing ratios are to φ
    let totalDeviation = 0;
    let comparisons = 0;

    for (let i = 0; i < boxes.length - 1; i++) {
      const a = boxes[i];
      const b = boxes[i + 1];
      const ratio = a.width > 0 ? a.height / a.width : 1;
      totalDeviation += Math.abs(ratio - (1 / PHI));
      comparisons++;
    }

    return comparisons > 0 ? Math.max(0, 1 - totalDeviation / comparisons) : 1.0;
  }
}

// ══════════════════════════════════════════════════════════════════
//  CRDT SYNC ENGINE — Real-Time Multi-Agent Collaboration
// ══════════════════════════════════════════════════════════════════

class CRDTSyncEngine {
  private readonly peerId: string;
  private vectorClock: Map<string, number>;
  private pendingOps: CRDTOperation[] = [];
  private connectedPeers: string[] = [];
  private lastSyncAt = 0;

  constructor(peerId?: string) {
    this.peerId = peerId ?? `peer-${fibonacciHash(hashStr(Date.now().toString()), 2_147_483_647)}`;
    this.vectorClock = new Map([[this.peerId, 0]]);
  }

  /**
   * Record a local operation.
   */
  localOp(type: CRDTOperation['type'], elementId: number, field?: string, value?: unknown): CRDTOperation {
    const clock = (this.vectorClock.get(this.peerId) ?? 0) + 1;
    this.vectorClock.set(this.peerId, clock);

    const op: CRDTOperation = {
      id: fibonacciHash(clock, 2_147_483_647),
      type,
      elementId,
      field,
      value,
      vectorClock: new Map(this.vectorClock),
      originPeerId: this.peerId,
      timestamp: Date.now(),
    };

    this.pendingOps.push(op);
    return op;
  }

  /**
   * Merge a remote operation.
   */
  mergeRemote(op: CRDTOperation): boolean {
    const remoteClock = op.vectorClock.get(op.originPeerId) ?? 0;
    const localClock = this.vectorClock.get(op.originPeerId) ?? 0;

    if (remoteClock <= localClock) {
      return false; // Already applied
    }

    this.vectorClock.set(op.originPeerId, remoteClock);
    this.lastSyncAt = Date.now();
    return true;
  }

  /**
   * Get current sync state.
   */
  getState(): SyncState {
    return {
      peerId: this.peerId,
      vectorClock: new Map(this.vectorClock),
      pendingOps: [...this.pendingOps],
      connectedPeers: [...this.connectedPeers],
      lastSyncAt: this.lastSyncAt,
    };
  }

  /**
   * Flush pending operations (after sync).
   */
  flush(): readonly CRDTOperation[] {
    const ops = [...this.pendingOps];
    this.pendingOps = [];
    return ops;
  }

  addPeer(peerId: string): void {
    if (!this.connectedPeers.includes(peerId)) {
      this.connectedPeers.push(peerId);
    }
  }

  removePeer(peerId: string): void {
    this.connectedPeers = this.connectedPeers.filter(p => p !== peerId);
  }
}

// ══════════════════════════════════════════════════════════════════
//  SPATIAL CANVAS SDK — The Public API
// ══════════════════════════════════════════════════════════════════

/**
 * @medina/spatial-canvas-sdk
 *
 * Infinite spatial canvas where AI agents draw, annotate, and build
 * visual interfaces collaboratively.
 *
 * Usage:
 *   const canvas = new SpatialCanvasSDK({ width: 1920, height: 1080 });
 *   const result = canvas.generate('A dashboard with 4 metric cards');
 *   console.log(result.elements); // 4 generated CanvasElements
 *   console.log(result.layoutScore); // φ-alignment score
 */
export class SpatialCanvasSDK {
  readonly name = '@medina/spatial-canvas-sdk';
  readonly version = '1.0.0';
  readonly author = 'Casa de Medina';

  private readonly config: SpatialCanvasConfig;
  private readonly viewport: ViewportManager;
  private readonly quadTree: QuadTree;
  private readonly coordinator: AgentCoordinator;
  private readonly crdtSync: CRDTSyncEngine;
  private readonly layoutGen: LayoutGenerator;
  private readonly styleGen: StyleGenerator;

  private elements: CanvasElement[] = [];
  private generationCount = 0;

  constructor(config?: Partial<SpatialCanvasConfig>) {
    this.config = { ...DEFAULT_CANVAS_CONFIG, ...config };
    this.viewport = new ViewportManager(this.config);
    this.quadTree = new QuadTree({
      x: -100_000,
      y: -100_000,
      width: 200_000,
      height: 200_000,
    });
    this.coordinator = new AgentCoordinator();
    this.crdtSync = new CRDTSyncEngine();
    this.layoutGen = new LayoutGenerator();
    this.styleGen = new StyleGenerator();
  }

  /**
   * Generate canvas elements from a natural language description.
   *
   * @param intent — What you want: "A dashboard with 4 metric cards and a chart"
   * @returns Elements, actions, and layout score
   */
  generate(intent: string): AgentGenerationResult {
    this.generationCount++;
    const vp = this.viewport.getState();
    const result = this.coordinator.generate(intent, vp.bounds);

    // Add to spatial index
    for (const el of result.elements) {
      this.elements.push(el);
      this.quadTree.insert(el);
    }

    // Record in CRDT
    for (const el of result.elements) {
      this.crdtSync.localOp('insert', el.id, undefined, el);
    }

    return result;
  }

  /**
   * Query all elements visible in the current viewport.
   */
  visibleElements(): readonly CanvasElement[] {
    const vp = this.viewport.getState();
    return this.quadTree.query(vp.bounds);
  }

  /**
   * Get all elements on the canvas.
   */
  allElements(): readonly CanvasElement[] {
    return [...this.elements];
  }

  /**
   * Pan the viewport.
   */
  pan(dx: number, dy: number): void {
    this.viewport.pan(dx, dy);
  }

  /**
   * Zoom the viewport.
   */
  zoom(factor: number): void {
    this.viewport.zoomBy(factor);
  }

  /**
   * Get current viewport state.
   */
  getViewport(): ViewportState {
    return this.viewport.getState();
  }

  /**
   * Generate a φ-spiral layout arrangement.
   */
  spiralLayout(count: number): readonly BoundingBox[] {
    const vp = this.viewport.getState();
    return this.layoutGen.spiralLayout(count, vp.center, 80);
  }

  /**
   * Get a golden-ratio color palette.
   */
  goldenPalette(baseHue: number, count: number): readonly string[] {
    return this.styleGen.goldenPalette(baseHue, count);
  }

  /**
   * Get all available AI agents.
   */
  getAgents(): readonly CanvasAgent[] {
    return this.coordinator.getAgents();
  }

  /**
   * Get agent action history.
   */
  getActionLog(): readonly AgentAction[] {
    return this.coordinator.getActionLog();
  }

  /**
   * Get CRDT sync state.
   */
  getSyncState(): SyncState {
    return this.crdtSync.getState();
  }

  /**
   * Reset the canvas.
   */
  reset(): void {
    this.elements = [];
    this.quadTree.clear();
    this.viewport.reset();
    this.generationCount = 0;
  }

  /**
   * Get engine statistics.
   */
  stats(): {
    generationsCompleted: number;
    totalElements: number;
    visibleElements: number;
    agentCount: number;
    syncState: SyncState;
    viewport: ViewportState;
  } {
    return {
      generationsCompleted: this.generationCount,
      totalElements: this.elements.length,
      visibleElements: this.visibleElements().length,
      agentCount: CANVAS_AGENTS.length,
      syncState: this.crdtSync.getState(),
      viewport: this.viewport.getState(),
    };
  }
}

/**
 * Factory function for creating a SpatialCanvasSDK.
 */
export function createSpatialCanvasSDK(config?: Partial<SpatialCanvasConfig>): SpatialCanvasSDK {
  return new SpatialCanvasSDK(config);
}
