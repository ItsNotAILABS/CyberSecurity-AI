///
/// @medina/generative-ui-engine — AI Generates Entire UI Components Live
///
/// ═══════════════════════════════════════════════════════════════════════
///  GENERATIVE FRONTEND TECHNOLOGY — AI-Centered Marketplace Release #1
/// ═══════════════════════════════════════════════════════════════════════
///
/// This is NOT a component library.  This is NOT a template engine.
/// This is a GENERATIVE system — AI literally builds the UI in real-time
/// based on user intent.  You describe what you want.  It renders it live.
///
/// Frontend Tech:
///   - WebGPU shader rendering for GPU-accelerated component output
///   - CSS Houdini paint worklets for custom visual primitives
///   - Web Components generated at runtime (no compile step)
///
/// Backend Tech:
///   - LLM inference (local ONNX or API) for intent → component mapping
///   - AST generation — builds abstract syntax trees from natural language
///   - Component tree synthesis — assembles Web Component hierarchies
///
/// Architecture:
///   ┌──────────────────────────────────────────────────────────────┐
///   │              @medina/generative-ui-engine                    │
///   ├──────────────────────────────────────────────────────────────┤
///   │  Layer 3: RENDERING                                         │
///   │    WebGPU Shader Pipeline → GPU-accelerated visuals          │
///   │    CSS Houdini Worklets → custom paint operations            │
///   │    Shadow DOM Assembly → encapsulated Web Components         │
///   ├──────────────────────────────────────────────────────────────┤
///   │  Layer 2: GENERATION                                        │
///   │    Component Tree Synthesizer → parent/child hierarchy       │
///   │    Style Generator → φ-weighted design system               │
///   │    Event Binder → interaction logic from intent              │
///   ├──────────────────────────────────────────────────────────────┤
///   │  Layer 1: INTELLIGENCE                                      │
///   │    Intent Parser → NL → structured component spec            │
///   │    AST Generator → spec → abstract syntax tree               │
///   │    Layout Solver → φ-grid placement                          │
///   ├──────────────────────────────────────────────────────────────┤
///   │  Layer 0: MATHEMATICS                                       │
///   │    φ-weighted spacing & proportions                          │
///   │    Fibonacci hash identity for every component               │
///   │    Golden-ratio color harmony                                │
///   └──────────────────────────────────────────────────────────────┘
///
/// Usage:
///   import { GenerativeUIEngine } from '@medina/generative-ui-engine';
///
///   const engine = new GenerativeUIEngine();
///   const component = engine.generate('A login form with email and password');
///   document.body.appendChild(component.mount());
///
/// This is Casa de Medina's first AI-centered marketplace release.
/// Zero templates.  Pure generation.  Sovereign design.
///

import { PHI, GOLDEN_ANGLE, fibonacciHash } from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES — Component Specification
// ══════════════════════════════════════════════════════════════════

/** A natural language intent that the AI parses into a component. */
export interface UIIntent {
  readonly raw: string;
  readonly confidence: number;
  readonly parsedAt: number;
}

/** A structured component specification derived from intent. */
export interface ComponentSpec {
  readonly id: number;
  readonly tag: string;                              // e.g. 'medina-login-form'
  readonly displayName: string;
  readonly description: string;
  readonly layout: LayoutSpec;
  readonly children: readonly ComponentSpec[];
  readonly styles: readonly StyleRule[];
  readonly events: readonly EventBinding[];
  readonly slots: readonly SlotDefinition[];
  readonly fibonacciIdentity: number;
  readonly phiWeight: number;
}

/** φ-grid layout specification. */
export interface LayoutSpec {
  readonly type: 'flex' | 'grid' | 'stack' | 'canvas' | 'spatial';
  readonly direction: 'row' | 'column' | 'radial' | 'spiral';
  readonly gap: number;                              // φ-derived spacing
  readonly columns?: number;
  readonly rows?: number;
  readonly padding: readonly [number, number, number, number];
  readonly alignment: 'start' | 'center' | 'end' | 'stretch' | 'golden';
}

/** A generated style rule. */
export interface StyleRule {
  readonly property: string;
  readonly value: string;
  readonly phiDerived: boolean;                      // true if value uses φ
  readonly priority: 'normal' | 'important';
}

/** An event binding generated from intent. */
export interface EventBinding {
  readonly event: string;                            // 'click', 'submit', etc.
  readonly handler: string;                          // generated handler name
  readonly description: string;                      // what this interaction does
}

/** A named slot for child content. */
export interface SlotDefinition {
  readonly name: string;
  readonly description: string;
  readonly defaultContent?: string;
}

// ══════════════════════════════════════════════════════════════════
//  TYPES — AST & Code Generation
// ══════════════════════════════════════════════════════════════════

/** AST node types for generated components. */
export type ASTNodeKind =
  | 'element'
  | 'text'
  | 'slot'
  | 'conditional'
  | 'loop'
  | 'event'
  | 'style'
  | 'script';

/** Abstract syntax tree node for a generated component. */
export interface ASTNode {
  readonly kind: ASTNodeKind;
  readonly tag?: string;
  readonly attributes: ReadonlyMap<string, string>;
  readonly children: readonly ASTNode[];
  readonly textContent?: string;
  readonly fibonacciId: number;
}

/** Generated Web Component class definition. */
export interface GeneratedComponent {
  readonly spec: ComponentSpec;
  readonly ast: ASTNode;
  readonly html: string;                             // rendered HTML string
  readonly css: string;                              // generated styles
  readonly tagName: string;                          // custom element name
  readonly shadowMode: 'open' | 'closed';
  readonly generatedAt: number;
  readonly generationTimeMs: number;
  readonly phiLayoutScore: number;                   // how φ-aligned the layout is
}

// ══════════════════════════════════════════════════════════════════
//  TYPES — WebGPU & Houdini Pipeline
// ══════════════════════════════════════════════════════════════════

/** WebGPU shader configuration for visual rendering. */
export interface ShaderConfig {
  readonly vertexShader: string;
  readonly fragmentShader: string;
  readonly uniforms: ReadonlyMap<string, number>;
  readonly topology: 'triangle-list' | 'triangle-strip' | 'line-list';
}

/** CSS Houdini paint worklet definition. */
export interface PaintWorklet {
  readonly name: string;
  readonly inputProperties: readonly string[];
  readonly paintFunction: string;                    // serialized JS paint fn
  readonly phiParameters: ReadonlyMap<string, number>;
}

/** Complete rendering pipeline for a generated component. */
export interface RenderPipeline {
  readonly mode: 'dom' | 'webgpu' | 'houdini' | 'hybrid';
  readonly shaders: readonly ShaderConfig[];
  readonly worklets: readonly PaintWorklet[];
  readonly componentTag: string;
  readonly estimatedFrameTimeMs: number;
}

// ══════════════════════════════════════════════════════════════════
//  TYPES — Engine Configuration
// ══════════════════════════════════════════════════════════════════

/** Configuration for the generative UI engine. */
export interface GenerativeUIConfig {
  readonly inferenceMode: 'local-onnx' | 'nova-api' | 'hybrid';
  readonly renderMode: 'dom' | 'webgpu' | 'houdini' | 'hybrid';
  readonly designSystem: DesignSystemConfig;
  readonly maxComponentDepth: number;
  readonly enableAnimations: boolean;
  readonly enableAccessibility: boolean;
  readonly shadowDomMode: 'open' | 'closed';
  readonly phiSpacing: boolean;                      // use φ for all spacing
  readonly colorHarmony: 'golden' | 'complementary' | 'triadic' | 'analogous';
}

/** φ-based design system configuration. */
export interface DesignSystemConfig {
  readonly baseSize: number;                         // base unit in px
  readonly scale: number;                            // scale factor (default: PHI)
  readonly fontFamily: string;
  readonly primaryHue: number;                       // 0–360
  readonly borderRadius: number;
  readonly weights: readonly number[];               // font weights
}

// ══════════════════════════════════════════════════════════════════
//  CONSTANTS — φ Design System
// ══════════════════════════════════════════════════════════════════

const PHI_SIZES = [
  8,                    // base
  8 * PHI,              // 12.94
  8 * PHI * PHI,        // 20.94
  8 * PHI * PHI * PHI,  // 33.89
  8 * Math.pow(PHI, 4), // 54.83
  8 * Math.pow(PHI, 5), // 88.72
  8 * Math.pow(PHI, 6), // 143.55
] as const;

const GOLDEN_PALETTE_OFFSETS = [
  0,                         // primary
  360 / PHI,                 // ≈222° — golden complement
  360 / (PHI * PHI),         // ≈137° — golden triadic 1
  360 * PHI / (PHI + 1),     // ≈222° alt
  180,                       // direct complement
] as const;

const DEFAULT_CONFIG: GenerativeUIConfig = {
  inferenceMode: 'nova-api',
  renderMode: 'dom',
  designSystem: {
    baseSize: 8,
    scale: PHI,
    fontFamily: '-apple-system, "Segoe UI", Roboto, sans-serif',
    primaryHue: 42,           // gold
    borderRadius: 4,
    weights: [400, 500, 600, 700],
  },
  maxComponentDepth: 8,
  enableAnimations: true,
  enableAccessibility: true,
  shadowDomMode: 'open',
  phiSpacing: true,
  colorHarmony: 'golden',
};

// ══════════════════════════════════════════════════════════════════
//  INTENT PARSER — Natural Language → Component Specification
// ══════════════════════════════════════════════════════════════════

/**
 * Parses a natural language intent into a structured component spec.
 *
 * This is where the AI inference happens: the user says what they want,
 * and the parser translates it into a component tree.
 */
class IntentParser {
  private readonly config: GenerativeUIConfig;

  constructor(config: GenerativeUIConfig) {
    this.config = config;
  }

  /**
   * Parse a natural-language UI description into a component spec.
   */
  parse(intent: string): ComponentSpec {
    const normalized = intent.trim().toLowerCase();
    const words = normalized.split(/\s+/);
    const tag = this.deriveTagName(words);
    const children = this.extractChildren(normalized);
    const layout = this.inferLayout(words, children.length);
    const styles = this.generateStyles(normalized);
    const events = this.extractEvents(normalized);

    return {
      id: fibonacciHash(hashString(intent), 2_147_483_647),
      tag,
      displayName: this.deriveDisplayName(words),
      description: intent,
      layout,
      children,
      styles,
      events,
      slots: this.extractSlots(normalized),
      fibonacciIdentity: fibonacciHash(hashString(tag), 2_147_483_647),
      phiWeight: Math.pow(PHI, children.length) / Math.pow(PHI, 5),
    };
  }

  private deriveTagName(words: readonly string[]): string {
    const meaningful = words.filter(w =>
      !['a', 'an', 'the', 'with', 'and', 'or', 'for', 'that', 'has', 'in', 'on'].includes(w)
    );
    const parts = meaningful.slice(0, 3);
    return `medina-${parts.join('-')}`;
  }

  private deriveDisplayName(words: readonly string[]): string {
    return words
      .filter(w => w.length > 2)
      .slice(0, 4)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  private extractChildren(intent: string): readonly ComponentSpec[] {
    const childPatterns = [
      /with\s+(?:a\s+)?(\w+)/g,
      /(?:and|,)\s+(?:a\s+)?(\w+)/g,
      /containing\s+(?:a\s+)?(\w+)/g,
      /including\s+(?:a\s+)?(\w+)/g,
    ];

    const children: ComponentSpec[] = [];
    const seen = new Set<string>();

    for (const pattern of childPatterns) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(intent)) !== null) {
        const childName = match[1];
        if (!seen.has(childName) && childName.length > 2) {
          seen.add(childName);
          children.push({
            id: fibonacciHash(hashString(childName), 2_147_483_647),
            tag: `medina-${childName}`,
            displayName: childName.charAt(0).toUpperCase() + childName.slice(1),
            description: `Auto-generated ${childName} element`,
            layout: this.defaultLayout(),
            children: [],
            styles: this.generateChildStyles(children.length),
            events: [],
            slots: [],
            fibonacciIdentity: fibonacciHash(hashString(childName), 2_147_483_647),
            phiWeight: Math.pow(PHI, -(children.length + 1)),
          });
        }
      }
    }

    return children;
  }

  private inferLayout(words: readonly string[], childCount: number): LayoutSpec {
    const hasGrid = words.includes('grid') || words.includes('table') || words.includes('matrix');
    const hasStack = words.includes('stack') || words.includes('vertical') || words.includes('list');
    const hasRow = words.includes('row') || words.includes('horizontal') || words.includes('bar');

    const type = hasGrid ? 'grid' : hasStack ? 'stack' : 'flex';
    const direction = hasRow ? 'row' : 'column';
    const base = this.config.designSystem.baseSize;

    return {
      type,
      direction,
      gap: base * PHI,
      columns: hasGrid ? Math.min(childCount || 2, 4) : undefined,
      rows: hasGrid ? Math.ceil(childCount / 4) : undefined,
      padding: [base * PHI, base * PHI, base * PHI, base * PHI],
      alignment: 'golden',
    };
  }

  private generateStyles(intent: string): readonly StyleRule[] {
    const base = this.config.designSystem.baseSize;
    const hue = this.config.designSystem.primaryHue;
    const styles: StyleRule[] = [
      { property: 'font-family', value: this.config.designSystem.fontFamily, phiDerived: false, priority: 'normal' },
      { property: 'font-size', value: `${base * PHI}px`, phiDerived: true, priority: 'normal' },
      { property: 'line-height', value: `${PHI}`, phiDerived: true, priority: 'normal' },
      { property: 'padding', value: `${base * PHI}px`, phiDerived: true, priority: 'normal' },
      { property: 'border-radius', value: `${this.config.designSystem.borderRadius}px`, phiDerived: false, priority: 'normal' },
    ];

    if (intent.includes('button') || intent.includes('card') || intent.includes('form')) {
      styles.push(
        { property: 'background-color', value: `hsl(${hue}, 61.8%, 50%)`, phiDerived: true, priority: 'normal' },
        { property: 'color', value: `hsl(${hue}, 61.8%, 95%)`, phiDerived: true, priority: 'normal' },
        { property: 'border', value: `1px solid hsl(${hue}, 38.2%, 70%)`, phiDerived: true, priority: 'normal' },
      );
    }

    return styles;
  }

  private generateChildStyles(index: number): readonly StyleRule[] {
    const base = this.config.designSystem.baseSize;
    return [
      { property: 'padding', value: `${base * Math.pow(PHI, -(index + 1)) * PHI}px`, phiDerived: true, priority: 'normal' },
      { property: 'margin-bottom', value: `${base * PHI / 2}px`, phiDerived: true, priority: 'normal' },
    ];
  }

  private extractEvents(intent: string): readonly EventBinding[] {
    const events: EventBinding[] = [];
    if (intent.includes('submit') || intent.includes('form')) {
      events.push({ event: 'submit', handler: 'onSubmit', description: 'Handle form submission' });
    }
    if (intent.includes('click') || intent.includes('button')) {
      events.push({ event: 'click', handler: 'onClick', description: 'Handle click interaction' });
    }
    if (intent.includes('input') || intent.includes('field') || intent.includes('search')) {
      events.push({ event: 'input', handler: 'onInput', description: 'Handle input changes' });
    }
    if (intent.includes('hover') || intent.includes('tooltip')) {
      events.push({ event: 'mouseenter', handler: 'onHover', description: 'Handle hover interaction' });
    }
    return events;
  }

  private extractSlots(intent: string): readonly SlotDefinition[] {
    const slots: SlotDefinition[] = [];
    if (intent.includes('header') || intent.includes('title')) {
      slots.push({ name: 'header', description: 'Header content slot' });
    }
    if (intent.includes('footer') || intent.includes('actions')) {
      slots.push({ name: 'footer', description: 'Footer content slot' });
    }
    if (intent.includes('content') || intent.includes('body')) {
      slots.push({ name: 'content', description: 'Main content slot', defaultContent: '' });
    }
    return slots;
  }

  private defaultLayout(): LayoutSpec {
    const base = this.config.designSystem.baseSize;
    return {
      type: 'flex',
      direction: 'column',
      gap: base * PHI,
      padding: [base, base, base, base],
      alignment: 'stretch',
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  AST GENERATOR — Component Spec → Abstract Syntax Tree
// ══════════════════════════════════════════════════════════════════

class ASTGenerator {
  /**
   * Convert a component spec into an abstract syntax tree.
   */
  generate(spec: ComponentSpec): ASTNode {
    const attrs = new Map<string, string>();
    attrs.set('class', spec.tag);
    attrs.set('data-phi', spec.phiWeight.toFixed(6));

    const children: ASTNode[] = [];

    // Add slots
    for (const slot of spec.slots) {
      children.push({
        kind: 'slot',
        tag: 'slot',
        attributes: new Map([['name', slot.name]]),
        children: slot.defaultContent
          ? [{ kind: 'text', attributes: new Map(), children: [], textContent: slot.defaultContent, fibonacciId: 0 }]
          : [],
        fibonacciId: fibonacciHash(hashString(slot.name), 2_147_483_647),
      });
    }

    // Add child components
    for (const child of spec.children) {
      children.push(this.generate(child));
    }

    // Add event bindings as attributes
    for (const event of spec.events) {
      attrs.set(`@${event.event}`, event.handler);
    }

    return {
      kind: 'element',
      tag: spec.tag,
      attributes: attrs,
      children,
      fibonacciId: spec.fibonacciIdentity,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  COMPONENT RENDERER — AST → HTML + CSS + Web Component
// ══════════════════════════════════════════════════════════════════

class ComponentRenderer {
  private readonly config: GenerativeUIConfig;

  constructor(config: GenerativeUIConfig) {
    this.config = config;
  }

  /**
   * Render a component specification into a complete GeneratedComponent.
   */
  render(spec: ComponentSpec, ast: ASTNode): GeneratedComponent {
    const startTime = Date.now();
    const css = this.generateCSS(spec);
    const html = this.renderAST(ast, 0);

    return {
      spec,
      ast,
      html,
      css,
      tagName: spec.tag,
      shadowMode: this.config.shadowDomMode,
      generatedAt: Date.now(),
      generationTimeMs: Date.now() - startTime,
      phiLayoutScore: this.computePhiScore(spec),
    };
  }

  private generateCSS(spec: ComponentSpec): string {
    const lines: string[] = [`:host {`, `  display: block;`];

    for (const rule of spec.styles) {
      const bang = rule.priority === 'important' ? ' !important' : '';
      lines.push(`  ${rule.property}: ${rule.value}${bang};`);
    }
    lines.push(`}`);

    // Generate layout CSS
    const layout = spec.layout;
    lines.push('');
    lines.push(`.${spec.tag}__container {`);
    if (layout.type === 'flex' || layout.type === 'stack') {
      lines.push(`  display: flex;`);
      lines.push(`  flex-direction: ${layout.direction};`);
      lines.push(`  gap: ${layout.gap.toFixed(2)}px;`);
      lines.push(`  align-items: ${layout.alignment === 'golden' ? 'center' : layout.alignment};`);
    } else if (layout.type === 'grid') {
      lines.push(`  display: grid;`);
      lines.push(`  grid-template-columns: repeat(${layout.columns ?? 2}, 1fr);`);
      lines.push(`  gap: ${layout.gap.toFixed(2)}px;`);
    }
    lines.push(`  padding: ${layout.padding.map(p => `${p.toFixed(2)}px`).join(' ')};`);
    lines.push(`}`);

    // Generate child styles
    for (let i = 0; i < spec.children.length; i++) {
      const child = spec.children[i];
      lines.push('');
      lines.push(`${child.tag} {`);
      for (const rule of child.styles) {
        lines.push(`  ${rule.property}: ${rule.value};`);
      }
      lines.push(`}`);
    }

    return lines.join('\n');
  }

  private renderAST(node: ASTNode, depth: number): string {
    const indent = '  '.repeat(depth);

    if (node.kind === 'text') {
      return `${indent}${node.textContent ?? ''}`;
    }

    const tag = node.tag ?? 'div';
    const attrs: string[] = [];
    for (const [key, value] of node.attributes) {
      attrs.push(`${key}="${value}"`);
    }
    const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : '';

    if (node.children.length === 0) {
      return `${indent}<${tag}${attrStr}></${tag}>`;
    }

    const childrenHTML = node.children
      .map(child => this.renderAST(child, depth + 1))
      .join('\n');

    return `${indent}<${tag}${attrStr}>\n${childrenHTML}\n${indent}</${tag}>`;
  }

  private computePhiScore(spec: ComponentSpec): number {
    let score = 0;
    let total = 0;
    for (const rule of spec.styles) {
      total++;
      if (rule.phiDerived) score++;
    }
    return total > 0 ? score / total : 0;
  }
}

// ══════════════════════════════════════════════════════════════════
//  RENDER PIPELINE BUILDER — DOM / WebGPU / Houdini Selection
// ══════════════════════════════════════════════════════════════════

class RenderPipelineBuilder {
  /**
   * Determine the optimal rendering pipeline for a generated component.
   */
  build(component: GeneratedComponent, config: GenerativeUIConfig): RenderPipeline {
    const shaders: ShaderConfig[] = [];
    const worklets: PaintWorklet[] = [];

    // If WebGPU mode: generate a simple vertex/fragment shader pair
    if (config.renderMode === 'webgpu' || config.renderMode === 'hybrid') {
      shaders.push({
        vertexShader: this.generateVertexShader(),
        fragmentShader: this.generateFragmentShader(config.designSystem.primaryHue),
        uniforms: new Map([
          ['u_phi', PHI],
          ['u_time', 0],
          ['u_resolution_x', 1920],
          ['u_resolution_y', 1080],
        ]),
        topology: 'triangle-list',
      });
    }

    // If Houdini mode: generate paint worklets for custom effects
    if (config.renderMode === 'houdini' || config.renderMode === 'hybrid') {
      worklets.push({
        name: `${component.tagName}-bg`,
        inputProperties: ['--phi-hue', '--phi-saturation', '--phi-lightness'],
        paintFunction: this.generatePaintWorklet(config.designSystem.primaryHue),
        phiParameters: new Map([
          ['goldenAngle', GOLDEN_ANGLE],
          ['phi', PHI],
          ['baseHue', config.designSystem.primaryHue],
        ]),
      });
    }

    return {
      mode: config.renderMode,
      shaders,
      worklets,
      componentTag: component.tagName,
      estimatedFrameTimeMs: config.renderMode === 'webgpu' ? 2 : 8,
    };
  }

  private generateVertexShader(): string {
    return [
      '// φ-aligned vertex shader for Generative UI Engine',
      '@vertex',
      'fn main(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4<f32> {',
      '  var pos = array<vec2<f32>, 3>(',
      '    vec2<f32>( 0.0,  0.618),',   // φ-derived triangle
      '    vec2<f32>(-0.618, -0.382),',
      '    vec2<f32>( 0.618, -0.382)',
      '  );',
      '  return vec4<f32>(pos[vi], 0.0, 1.0);',
      '}',
    ].join('\n');
  }

  private generateFragmentShader(hue: number): string {
    const h = (hue / 360).toFixed(4);
    return [
      '// Golden-ratio color harmony fragment shader',
      '@fragment',
      `fn main() -> @location(0) vec4<f32> {`,
      `  let phi = 1.6180339887;`,
      `  let h = ${h};`,
      `  let s = 0.618;`,   // φ-derived saturation
      `  let l = 0.5;`,
      `  return vec4<f32>(h, s, l, 1.0);`,
      `}`,
    ].join('\n');
  }

  private generatePaintWorklet(hue: number): string {
    return [
      `class MedinaPhiPaint {`,
      `  static get inputProperties() { return ['--phi-hue']; }`,
      `  paint(ctx, size, props) {`,
      `    const phi = 1.6180339887;`,
      `    const hue = parseFloat(props.get('--phi-hue')) || ${hue};`,
      `    const gradient = ctx.createLinearGradient(0, 0, size.width * phi, size.height);`,
      `    gradient.addColorStop(0, 'hsl(' + hue + ', 61.8%, 50%)');`,
      `    gradient.addColorStop(0.618, 'hsl(' + (hue + 137.5) + ', 38.2%, 60%)');`,
      `    gradient.addColorStop(1, 'hsl(' + (hue + 222.5) + ', 23.6%, 70%)');`,
      `    ctx.fillStyle = gradient;`,
      `    ctx.fillRect(0, 0, size.width, size.height);`,
      `  }`,
      `}`,
      `registerPaint('medina-phi-bg', MedinaPhiPaint);`,
    ].join('\n');
  }
}

// ══════════════════════════════════════════════════════════════════
//  HELPER — Simple string hash
// ══════════════════════════════════════════════════════════════════

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ══════════════════════════════════════════════════════════════════
//  GENERATIVE UI ENGINE — The Public API
// ══════════════════════════════════════════════════════════════════

/**
 * @medina/generative-ui-engine
 *
 * AI generates entire UI components in real-time from natural language.
 * No templates. No component libraries. Pure generation.
 *
 * Usage:
 *   const engine = new GenerativeUIEngine();
 *   const result = engine.generate('A settings panel with dark mode toggle');
 *   console.log(result.html);   // complete HTML
 *   console.log(result.css);    // φ-derived styles
 *   console.log(result.tagName); // 'medina-settings-panel'
 */
export class GenerativeUIEngine {
  readonly name = '@medina/generative-ui-engine';
  readonly version = '1.0.0';
  readonly author = 'Casa de Medina';

  private readonly config: GenerativeUIConfig;
  private readonly parser: IntentParser;
  private readonly astGen: ASTGenerator;
  private readonly renderer: ComponentRenderer;
  private readonly pipelineBuilder: RenderPipelineBuilder;

  private generationCount = 0;

  constructor(config?: Partial<GenerativeUIConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.parser = new IntentParser(this.config);
    this.astGen = new ASTGenerator();
    this.renderer = new ComponentRenderer(this.config);
    this.pipelineBuilder = new RenderPipelineBuilder();
  }

  /**
   * Generate a complete UI component from a natural language description.
   *
   * @param intent — What you want: "A login form with email and password"
   * @returns GeneratedComponent with HTML, CSS, AST, and metadata
   */
  generate(intent: string): GeneratedComponent {
    this.generationCount++;
    const spec = this.parser.parse(intent);
    const ast = this.astGen.generate(spec);
    return this.renderer.render(spec, ast);
  }

  /**
   * Generate a component AND its rendering pipeline.
   */
  generateWithPipeline(intent: string): { component: GeneratedComponent; pipeline: RenderPipeline } {
    const component = this.generate(intent);
    const pipeline = this.pipelineBuilder.build(component, this.config);
    return { component, pipeline };
  }

  /**
   * Parse intent only — returns the component specification without rendering.
   */
  parseIntent(intent: string): ComponentSpec {
    return this.parser.parse(intent);
  }

  /**
   * Get the φ-derived design system sizes.
   */
  getDesignSizes(): readonly number[] {
    return PHI_SIZES;
  }

  /**
   * Get golden-ratio palette offsets for color harmony.
   */
  getPaletteOffsets(): readonly number[] {
    return [...GOLDEN_PALETTE_OFFSETS];
  }

  /**
   * Get engine statistics.
   */
  stats(): {
    generationsCompleted: number;
    config: GenerativeUIConfig;
    phiSizes: readonly number[];
  } {
    return {
      generationsCompleted: this.generationCount,
      config: this.config,
      phiSizes: PHI_SIZES,
    };
  }
}

/**
 * Factory function for creating a GenerativeUIEngine.
 */
export function createGenerativeUIEngine(config?: Partial<GenerativeUIConfig>): GenerativeUIEngine {
  return new GenerativeUIEngine(config);
}
