///
/// FOUNDER WORKSPACE — The Founder's Sovereign Toolkit
///
/// Everything a sovereign founder needs for research, theory talks,
/// and deep analytical work — built natively into the protocol.
///
/// Modules:
///   SovereignNotepad         — persistent notes with tags and search
///   AnalyticalFrameworks     — SWOT, First Principles, Socratic, Fermi,
///                              Second Order, Inversion, Mental Models,
///                              Decision Matrix, Pre-Mortem, Futures Cone
///   ThinkingPatterns         — convergent, divergent, lateral, systems,
///                              critical, analogical, abductive
///   FounderToolbar           — AI tools the founder can activate
///   QueryBlueprints          — reusable query templates wired to SovereignQueryEngine
///   FounderWorkspace         — orchestrates everything
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, fibonacciHash } from './ObserverIntelligence.js';
import { SovereignQueryEngine, SovereignQuery, QueryResult } from './SovereignQueryEngine.js';

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN NOTEPAD
// ══════════════════════════════════════════════════════════════════

export interface Note {
  readonly id: number;
  title: string;
  body: string;
  tags: string[];
  readonly createdAt: number;
  updatedAt: number;
  /** Fibonacci-attested note signature */
  readonly signature: number;
}

export class SovereignNotepad {
  readonly name = 'SOVEREIGN NOTEPAD';
  private readonly notes: Note[] = [];
  private nextId = 0;

  /** Create a new note and return it. */
  write(title: string, body: string, tags: string[] = []): Note {
    const id = this.nextId++;
    const now = Date.now();
    const note: Note = {
      id,
      title,
      body,
      tags,
      createdAt: now,
      updatedAt: now,
      signature: fibonacciHash(id * 1000 + body.length, Number.MAX_SAFE_INTEGER),
    };
    this.notes.push(note);
    return note;
  }

  /** Edit an existing note's title, body, or tags. */
  edit(id: number, updates: Partial<Pick<Note, 'title' | 'body' | 'tags'>>): Note | undefined {
    const note = this.notes.find(n => n.id === id);
    if (!note) return undefined;
    if (updates.title !== undefined) note.title = updates.title;
    if (updates.body  !== undefined) note.body  = updates.body;
    if (updates.tags  !== undefined) note.tags  = updates.tags;
    note.updatedAt = Date.now();
    return note;
  }

  /** Full-text search across title, body, and tags. */
  search(query: string): Note[] {
    const q = query.toLowerCase();
    return this.notes.filter(
      n =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q)),
    );
  }

  /** Filter notes by tag. */
  byTag(tag: string): Note[] {
    return this.notes.filter(n => n.tags.includes(tag));
  }

  /** Return all notes sorted by most recent. */
  all(): readonly Note[] {
    return [...this.notes].sort((a, b) => b.updatedAt - a.updatedAt);
  }

  /** Delete a note. Returns true if deleted. */
  delete(id: number): boolean {
    const idx = this.notes.findIndex(n => n.id === id);
    if (idx === -1) return false;
    this.notes.splice(idx, 1);
    return true;
  }

  get count(): number { return this.notes.length; }
}

// ══════════════════════════════════════════════════════════════════
//  ANALYTICAL FRAMEWORKS
// ══════════════════════════════════════════════════════════════════

export type FrameworkId =
  | 'swot'
  | 'first-principles'
  | 'socratic'
  | 'fermi'
  | 'second-order'
  | 'inversion'
  | 'mental-models'
  | 'decision-matrix'
  | 'pre-mortem'
  | 'futures-cone'
  | 'five-whys'
  | 'jobs-to-be-done'
  | 'blue-ocean'
  | 'wardley-map'
  | 'double-diamond';

export interface FrameworkDefinition {
  readonly id: FrameworkId;
  readonly name: string;
  readonly latinName: string;
  readonly description: string;
  readonly steps: readonly string[];
  readonly questions: readonly string[];
  readonly output: string;
  readonly bestFor: readonly string[];
}

export const ANALYTICAL_FRAMEWORKS: Record<FrameworkId, FrameworkDefinition> = {
  'swot': {
    id: 'swot',
    name: 'SWOT Analysis',
    latinName: 'Vires Debilitates Opportunitates Minae',
    description: 'Map internal strengths/weaknesses and external opportunities/threats.',
    steps: [
      '1. List internal Strengths that give competitive advantage.',
      '2. List internal Weaknesses that constrain execution.',
      '3. List external Opportunities you can exploit now.',
      '4. List external Threats that require mitigation.',
      '5. Generate SO, WO, ST, WT strategic pairs.',
    ],
    questions: [
      'What do we do better than anyone else?',
      'What resources do we lack?',
      'What market gaps can we exploit in the next 90 days?',
      'What external forces could destroy us?',
    ],
    output: 'Four-quadrant strategic map with action pairs.',
    bestFor: ['strategic planning', 'product decisions', 'market entry'],
  },
  'first-principles': {
    id: 'first-principles',
    name: 'First Principles Decomposition',
    latinName: 'Principia Prima Analytica',
    description: 'Break a problem to irreducible atomic truths and rebuild from scratch.',
    steps: [
      '1. State the problem clearly.',
      '2. Identify all assumptions embedded in the current framing.',
      '3. Decompose each assumption — is it actually true or inherited convention?',
      '4. Identify the irreducible atomic truths that remain.',
      '5. Rebuild the solution from those truths only.',
    ],
    questions: [
      'What do we know for certain is true?',
      'What are we assuming because "that\'s how it\'s done"?',
      'If I were building this from scratch with unlimited resources, what would I build?',
      'What is the actual physical/mathematical constraint?',
    ],
    output: 'Reconstructed solution free of inherited assumptions.',
    bestFor: ['innovation', 'cost reduction', 'architecture design', 'strategy'],
  },
  'socratic': {
    id: 'socratic',
    name: 'Socratic Method',
    latinName: 'Methodus Socratica',
    description: 'Expose the truth through systematic questioning that reveals contradictions.',
    steps: [
      '1. Accept the initial claim.',
      '2. Ask for clarification — what exactly does the claim mean?',
      '3. Probe for assumptions — what must be true for this to hold?',
      '4. Request evidence — what proof supports this?',
      '5. Explore implications — if true, what else must be true?',
      '6. Challenge the counter-position — what if the opposite were true?',
    ],
    questions: [
      'What do you mean by that exactly?',
      'How do you know that is true?',
      'What would change your mind?',
      'What is the strongest argument against your position?',
    ],
    output: 'Refined, contradiction-free position or explicit knowledge gap map.',
    bestFor: ['theory validation', 'debate preparation', 'research', 'hypothesis testing'],
  },
  'fermi': {
    id: 'fermi',
    name: 'Fermi Estimation',
    latinName: 'Aestimatio Fermiana',
    description: 'Order-of-magnitude estimation using decomposition and observable anchors.',
    steps: [
      '1. Define the unknown quantity precisely.',
      '2. Identify quantities you know or can estimate from observation.',
      '3. Build a chain of multiplications from known → unknown.',
      '4. Compute the order of magnitude.',
      '5. Apply φ-confidence bounds (×φ above, ÷φ below).',
    ],
    questions: [
      'What is the largest quantity I can anchor to directly?',
      'What conversion factors connect what I know to what I need?',
      'Which estimate is most uncertain — where should I double-check?',
    ],
    output: `Numerical estimate with φ-confidence interval (×${PHI.toFixed(2)} / ÷${PHI.toFixed(2)}).`,
    bestFor: ['market sizing', 'resource planning', 'feasibility', 'investor prep'],
  },
  'second-order': {
    id: 'second-order',
    name: 'Second-Order Thinking',
    latinName: 'Cogitatio Ordinis Secundi',
    description: 'Think beyond immediate effects to the consequences of consequences.',
    steps: [
      '1. Identify the first-order effect of the decision.',
      '2. Ask: "And then what?" to derive second-order effects.',
      '3. Repeat for third-order if critical.',
      '4. Identify which second-order effects benefit or harm you.',
      '5. Re-evaluate the original decision in light of the full effect chain.',
    ],
    questions: [
      'What happens immediately after this decision?',
      'What happens after that?',
      'Who benefits from the second-order effects?',
      'Are there second-order effects that nullify the first-order benefit?',
    ],
    output: 'Effect chain map revealing hidden leverage points and traps.',
    bestFor: ['policy decisions', 'product launches', 'incentive design', 'negotiations'],
  },
  'inversion': {
    id: 'inversion',
    name: 'Inversion',
    latinName: 'Inversio Cogitationis',
    description: 'Solve the opposite problem to find the path to your goal.',
    steps: [
      '1. Define the goal clearly.',
      '2. Invert it: what would guarantee failure?',
      '3. List all the ways to achieve the failure state.',
      '4. Eliminate or avoid those failure paths.',
      '5. What remains is the path to success.',
    ],
    questions: [
      'What would guarantee we fail at this?',
      'What habits, decisions, or conditions always produce the opposite of what we want?',
      'Who has failed at this before, and how?',
    ],
    output: 'Failure map that, when negated, becomes the success blueprint.',
    bestFor: ['risk management', 'system design', 'competitive strategy'],
  },
  'mental-models': {
    id: 'mental-models',
    name: 'Mental Model Stack',
    latinName: 'Bibliotheca Mentis',
    description: 'Apply a curated stack of cross-disciplinary mental models to a problem.',
    steps: [
      '1. State the problem.',
      '2. Apply: Occam\'s Razor — what is the simplest explanation?',
      '3. Apply: Hanlon\'s Razor — don\'t attribute to malice what can be explained by error.',
      '4. Apply: Map vs Territory — is your model the territory?',
      '5. Apply: Pareto Principle — which 20% of inputs drive 80% of output?',
      '6. Apply: Lindy Effect — what has survived longest is most likely to survive.',
      '7. Synthesise the outputs across models.',
    ],
    questions: [
      'Which model am I over-relying on right now?',
      'What does each model suggest independently?',
      'Where do the models agree? That is the high-confidence zone.',
    ],
    output: 'Multi-model synthesis with confidence-weighted recommendation.',
    bestFor: ['complex decisions', 'research', 'architecture', 'theory formation'],
  },
  'decision-matrix': {
    id: 'decision-matrix',
    name: 'Weighted Decision Matrix',
    latinName: 'Matrix Decisionis Ponderatae',
    description: 'Score options against weighted criteria to make the choice explicit.',
    steps: [
      '1. List all viable options as rows.',
      '2. Define evaluation criteria as columns.',
      '3. Assign φ-weighted importance score to each criterion (sum to 1).',
      '4. Score each option against each criterion (0–10).',
      '5. Multiply scores × weights and sum rows.',
      '6. Select the highest-scoring option.',
    ],
    questions: [
      'What criteria must any acceptable option satisfy?',
      'Which criterion is non-negotiable (weight ≥ φ⁻¹)?',
      'What bias am I applying by my choice of criteria?',
    ],
    output: 'Ranked options table with φ-weighted composite scores.',
    bestFor: ['vendor selection', 'architecture choices', 'hiring', 'feature prioritisation'],
  },
  'pre-mortem': {
    id: 'pre-mortem',
    name: 'Pre-Mortem Analysis',
    latinName: 'Mors Anticipata',
    description: 'Imagine failure has already occurred and work backwards to its causes.',
    steps: [
      '1. Assume it is one year from now and the project has completely failed.',
      '2. Write a detailed story of how it failed.',
      '3. Identify the top 5 root causes in the story.',
      '4. Design preventive actions for each root cause.',
      '5. Assign ownership and timeline for each preventive action.',
    ],
    questions: [
      'If this failed, what would we say was the most obvious cause in hindsight?',
      'What assumption are we most likely to be wrong about?',
      'What would we wish we had done differently?',
    ],
    output: 'Risk register with pre-assigned mitigations.',
    bestFor: ['project planning', 'product launches', 'strategy', 'investment decisions'],
  },
  'futures-cone': {
    id: 'futures-cone',
    name: 'Futures Cone',
    latinName: 'Conus Futurum',
    description: 'Map possible, plausible, probable, and preferable futures.',
    steps: [
      '1. Define the present state and the future horizon (1, 5, 20 years).',
      '2. Map Possible futures — everything not ruled out by physics or logic.',
      '3. Map Plausible futures — consistent with trends and known dynamics.',
      '4. Map Probable futures — the most likely given current trajectories.',
      '5. Define Preferable futures — what you are building toward.',
      '6. Identify the path from Probable to Preferable.',
    ],
    questions: [
      'What weak signals today indicate which future is arriving?',
      'What would have to be true for the preferable future to occur?',
      'Which actors benefit from which future?',
    ],
    output: 'Four-tier future map with strategic path to the preferable.',
    bestFor: ['long-term strategy', 'R&D planning', 'narrative building', 'investor decks'],
  },
  'five-whys': {
    id: 'five-whys',
    name: 'Five Whys',
    latinName: 'Quinque Cur',
    description: 'Iterative root-cause analysis by asking "why" five times.',
    steps: [
      '1. State the observable problem.',
      '2. Ask "Why did this happen?" — record the answer.',
      '3. Ask "Why did THAT happen?" — 4 more times.',
      '4. The fifth answer is typically the root cause.',
      '5. Design a fix at the root, not the symptom.',
    ],
    questions: [
      'Are we treating the symptom or the cause?',
      'At which "why" does the cause become actionable?',
      'Is this root cause systemic or isolated?',
    ],
    output: 'Root-cause chain with actionable fix at the deepest level.',
    bestFor: ['incident response', 'quality issues', 'team problems', 'product bugs'],
  },
  'jobs-to-be-done': {
    id: 'jobs-to-be-done',
    name: 'Jobs To Be Done',
    latinName: 'Opera Facienda',
    description: 'Identify the underlying job the customer is hiring your product to do.',
    steps: [
      '1. Observe or interview customers in context of use.',
      '2. Identify the functional job: what task does the product accomplish?',
      '3. Identify the emotional job: how do they want to feel?',
      '4. Identify the social job: how do they want to be perceived?',
      '5. Reframe your product as the best possible hire for that job.',
    ],
    questions: [
      'What were they doing before they found our product?',
      'What is the real progress they are trying to make?',
      'What would cause them to fire us?',
    ],
    output: 'Job statement: "When [situation], I want to [motivation], so I can [outcome]."',
    bestFor: ['product strategy', 'marketing', 'feature prioritisation', 'positioning'],
  },
  'blue-ocean': {
    id: 'blue-ocean',
    name: 'Blue Ocean Strategy',
    latinName: 'Strategia Oceani Caerulei',
    description: 'Create uncontested market space by value innovation across a ERRC grid.',
    steps: [
      '1. Map the current competitive factors in your industry.',
      '2. Eliminate factors the industry competes on but customers don\'t value.',
      '3. Reduce factors below industry standard.',
      '4. Raise factors above industry standard.',
      '5. Create factors the industry has never offered.',
    ],
    questions: [
      'Which competitive factors do customers actually pay for?',
      'What would we create if we ignored all competitors?',
      'Who are the non-customers we could convert?',
    ],
    output: 'ERRC grid + strategy canvas showing the new value curve.',
    bestFor: ['market creation', 'positioning', 'product strategy', 'differentiation'],
  },
  'wardley-map': {
    id: 'wardley-map',
    name: 'Wardley Map',
    latinName: 'Mappa Wardleiana',
    description: 'Map capabilities by evolution stage to reveal strategic opportunities.',
    steps: [
      '1. Define the user and their need at the top.',
      '2. List the value chain: capabilities required to meet that need.',
      '3. Place each capability on the x-axis: Genesis → Custom → Product → Commodity.',
      '4. Draw dependencies between capabilities.',
      '5. Identify: what to build, buy, or outsource based on evolution stage.',
    ],
    questions: [
      'Which of our capabilities are becoming commodity?',
      'Where is the next evolutionary leap in our stack?',
      'What are competitors treating as genesis that we could productise?',
    ],
    output: 'Wardley Map with strategic annotations and build/buy/outsource recommendations.',
    bestFor: ['technology strategy', 'make/buy decisions', 'competitive positioning'],
  },
  'double-diamond': {
    id: 'double-diamond',
    name: 'Double Diamond',
    latinName: 'Duplex Adamas',
    description: 'Design process: discover the right problem, then define and develop the right solution.',
    steps: [
      '1. DISCOVER: Diverge — explore the problem space widely.',
      '2. DEFINE: Converge — synthesise into a clear problem statement.',
      '3. DEVELOP: Diverge — generate multiple solution concepts.',
      '4. DELIVER: Converge — prototype, test, and ship the best solution.',
    ],
    questions: [
      'Are we solving the right problem before jumping to solutions?',
      'Have we talked to enough users in the Discover phase?',
      'Are we converging too early?',
    ],
    output: 'Problem statement + validated solution prototype.',
    bestFor: ['product design', 'innovation sprints', 'user research'],
  },
};

// ══════════════════════════════════════════════════════════════════
//  THINKING PATTERNS
// ══════════════════════════════════════════════════════════════════

export type ThinkingPatternId =
  | 'convergent'
  | 'divergent'
  | 'lateral'
  | 'systems'
  | 'critical'
  | 'analogical'
  | 'abductive'
  | 'counterfactual'
  | 'probabilistic';

export interface ThinkingPattern {
  readonly id: ThinkingPatternId;
  readonly name: string;
  readonly when: string;
  readonly howTo: string;
  readonly antiPattern: string;
  readonly phiPrinciple: string;
}

export const THINKING_PATTERNS: Record<ThinkingPatternId, ThinkingPattern> = {
  convergent: {
    id: 'convergent',
    name: 'Convergent Thinking',
    when: 'You have many options and need to select the best one.',
    howTo: 'Apply weighted criteria. Eliminate dominated options. Score survivors.',
    antiPattern: 'Using convergent thinking to generate options — that kills creativity.',
    phiPrinciple: 'Converge to the golden ratio of options: keep the top φ⁻¹ (≈38%) of candidates.',
  },
  divergent: {
    id: 'divergent',
    name: 'Divergent Thinking',
    when: 'You need more options than you currently have.',
    howTo: 'Defer judgment. Generate wildly. Build on others\' ideas. Reverse constraints.',
    antiPattern: 'Evaluating ideas during divergent phase — kills the generative state.',
    phiPrinciple: 'Target φ² (≈2.618×) more ideas than you think you need before converging.',
  },
  lateral: {
    id: 'lateral',
    name: 'Lateral Thinking',
    when: 'The direct path is blocked or has been exhausted.',
    howTo: 'Approach from an unrelated domain. Use random provocation. Reverse the problem.',
    antiPattern: 'Staying in the same domain for the lateral stimulus.',
    phiPrinciple: 'Borrow from a domain φ orders of magnitude different from your own.',
  },
  systems: {
    id: 'systems',
    name: 'Systems Thinking',
    when: 'The problem has feedback loops and emergent behaviour.',
    howTo: 'Map stocks, flows, and feedback loops. Identify leverage points. Simulate.',
    antiPattern: 'Linear cause-effect analysis in a non-linear system.',
    phiPrinciple: 'The highest leverage point is always φ orders of magnitude upstream of the symptom.',
  },
  critical: {
    id: 'critical',
    name: 'Critical Thinking',
    when: 'You need to evaluate the quality of reasoning or evidence.',
    howTo: 'Identify the claim. Examine the evidence. Assess the logic. Check for bias.',
    antiPattern: 'Applying critical thinking to your own position only — apply it symmetrically.',
    phiPrinciple: 'Your argument is only as strong as its weakest premise multiplied by φ.',
  },
  analogical: {
    id: 'analogical',
    name: 'Analogical Reasoning',
    when: 'You are in an unfamiliar domain with a familiar structure.',
    howTo: 'Identify the structural similarity. Map concepts across domains. Transfer the solution.',
    antiPattern: 'Treating the analogy as the territory — it\'s a map, not the thing.',
    phiPrinciple: 'The best analogies come from domains φ² steps removed — close enough to map, far enough to surprise.',
  },
  abductive: {
    id: 'abductive',
    name: 'Abductive Reasoning',
    when: 'You have incomplete data and need the best explanation.',
    howTo: 'Observe the anomaly. Generate hypotheses that would explain it. Select the most parsimonious.',
    antiPattern: 'Confusing abduction with deduction — an abductive conclusion is a best guess, not a proof.',
    phiPrinciple: 'The correct abductive hypothesis is usually the one that explains the most with the fewest assumptions.',
  },
  counterfactual: {
    id: 'counterfactual',
    name: 'Counterfactual Thinking',
    when: 'You need to understand causality or evaluate a decision after the fact.',
    howTo: 'Change one variable. Re-run the scenario mentally. Compare the outcome.',
    antiPattern: 'Changing multiple variables simultaneously — you lose the causal signal.',
    phiPrinciple: 'The φ counterfactual: what would have happened if the single most important variable had been φ times larger or smaller?',
  },
  probabilistic: {
    id: 'probabilistic',
    name: 'Probabilistic Thinking',
    when: 'You are dealing with uncertainty and need to reason about likelihood.',
    howTo: 'Assign explicit probabilities. Update on evidence (Bayes). Make decisions by expected value.',
    antiPattern: 'Binary thinking in a probabilistic world — "will it work or not" instead of "what is the probability it works."',
    phiPrinciple: 'Calibrated confidence: assign probability φ⁻¹ (≈61.8%) to scenarios you would bet on with your own capital.',
  },
};

// ══════════════════════════════════════════════════════════════════
//  FOUNDER TOOLBAR — AI Tools
// ══════════════════════════════════════════════════════════════════

export type ToolId =
  | 'query'
  | 'analyze'
  | 'synthesize'
  | 'challenge'
  | 'expand'
  | 'compress'
  | 'translate'
  | 'timeline'
  | 'network'
  | 'simulate';

export interface ToolDefinition {
  readonly id: ToolId;
  readonly name: string;
  readonly icon: string;       // unicode or emoji icon
  readonly description: string;
  readonly shortcut: string;
  readonly inputType: 'text' | 'number' | 'payload';
  readonly outputDimension: string;
}

export const FOUNDER_TOOLS: Record<ToolId, ToolDefinition> = {
  query: {
    id: 'query',
    name: 'Sovereign Query',
    icon: '⚡',
    description: 'Run a full multi-dimensional query through all substrate engines.',
    shortcut: 'Ctrl+Q',
    inputType: 'text',
    outputDimension: 'all',
  },
  analyze: {
    id: 'analyze',
    name: 'Deep Analyze',
    icon: '🔬',
    description: 'Apply all analytical frameworks to a problem and synthesise outputs.',
    shortcut: 'Ctrl+A',
    inputType: 'text',
    outputDimension: 'framework-synthesis',
  },
  synthesize: {
    id: 'synthesize',
    name: 'Synthesize',
    icon: '🧬',
    description: 'Combine multiple notes, queries, or frameworks into one coherent output.',
    shortcut: 'Ctrl+S',
    inputType: 'text',
    outputDimension: 'synthesis',
  },
  challenge: {
    id: 'challenge',
    name: 'Socratic Challenge',
    icon: '🏛',
    description: 'Apply Socratic method to any claim — expose assumptions and contradictions.',
    shortcut: 'Ctrl+H',
    inputType: 'text',
    outputDimension: 'socratic',
  },
  expand: {
    id: 'expand',
    name: 'Expand',
    icon: '🌐',
    description: 'Diverge — generate all possible angles, analogies, and implications.',
    shortcut: 'Ctrl+E',
    inputType: 'text',
    outputDimension: 'divergent',
  },
  compress: {
    id: 'compress',
    name: 'Compress',
    icon: '💎',
    description: 'Converge — distil a complex input to its irreducible first-principles core.',
    shortcut: 'Ctrl+K',
    inputType: 'text',
    outputDimension: 'first-principles',
  },
  translate: {
    id: 'translate',
    name: 'Translate',
    icon: '🗝',
    description: 'Render any concept in five different registers: technical, executive, investor, public, founding team.',
    shortcut: 'Ctrl+T',
    inputType: 'text',
    outputDimension: 'registers',
  },
  timeline: {
    id: 'timeline',
    name: 'Timeline Builder',
    icon: '📅',
    description: 'Build a Futures Cone timeline from present state to multiple horizons.',
    shortcut: 'Ctrl+L',
    inputType: 'text',
    outputDimension: 'futures-cone',
  },
  network: {
    id: 'network',
    name: 'Network Map',
    icon: '🕸',
    description: 'Map relationships, dependencies, and influence flows across entities.',
    shortcut: 'Ctrl+N',
    inputType: 'text',
    outputDimension: 'graph',
  },
  simulate: {
    id: 'simulate',
    name: 'Simulate',
    icon: '🔮',
    description: 'Run a Lotka-Volterra + Kuramoto simulation and return the state after n ticks.',
    shortcut: 'Ctrl+M',
    inputType: 'payload',
    outputDimension: 'simulation',
  },
};

// ══════════════════════════════════════════════════════════════════
//  QUERY BLUEPRINTS
// ══════════════════════════════════════════════════════════════════

export interface QueryBlueprint {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly query: SovereignQuery;
}

export const QUERY_BLUEPRINTS: readonly QueryBlueprint[] = [
  {
    id: 'daily-sweep',
    name: 'Daily Sovereign Sweep',
    description: 'Full multi-dimensional morning check across all engines.',
    query: { question: 'daily sovereign sweep', dimensions: ['all'] },
  },
  {
    id: 'fear-check',
    name: 'Fear Calibration',
    description: 'Check current prediction error and chronic fear level.',
    query: { question: 'fear calibration', dimensions: ['fear', 'antifragility'] },
  },
  {
    id: 'sovereignty-audit',
    name: 'Sovereignty Audit',
    description: 'Check Kuramoto synchrony and sovereignty floor at all scales.',
    query: { question: 'sovereignty audit', dimensions: ['sovereignty', 'sync'] },
  },
  {
    id: 'flow-check',
    name: 'Flow State Check',
    description: 'Verify founder is in flow: skill ≈ challenge.',
    query: {
      question: 'flow state check',
      dimensions: ['flow'],
      payload: { skill: 0.8, challenge: 0.75 },
    },
  },
  {
    id: 'reward-calibration',
    name: 'Reward Signal Calibration',
    description: 'Compute reward signal for current dimensional scalar.',
    query: {
      question: 'reward calibration',
      dimensions: ['reward'],
      payload: { base: 1, scalar: 0.618 },
    },
  },
  {
    id: 'ecology-status',
    name: 'Ecology Status',
    description: 'Check expansion vs threat dynamics in the Lotka-Volterra ecology.',
    query: { question: 'ecology status', dimensions: ['ecology', 'antifragility'] },
  },
  {
    id: 'temporal-value',
    name: 'Temporal Value Check',
    description: 'Compute present value of a future reward with φ⁻¹ patience correction.',
    query: {
      question: 'temporal value',
      dimensions: ['time'],
      payload: { reward: 100, delay: 5, k: 0.1 },
    },
  },
  {
    id: 'phi-convergence',
    name: 'Phi Convergence',
    description: 'Verify Fibonacci convergence to φ at n=20 terms.',
    query: {
      question: 'phi convergence',
      dimensions: ['phi'],
      payload: { n: 20 },
    },
  },
] as const;

// ══════════════════════════════════════════════════════════════════
//  TOOL INVOCATION RESULT
// ══════════════════════════════════════════════════════════════════

export interface ToolResult {
  readonly toolId: ToolId;
  readonly toolName: string;
  readonly input: string;
  readonly output: string;
  readonly queryResult?: QueryResult;
  readonly framework?: FrameworkDefinition;
  readonly pattern?: ThinkingPattern;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  FOUNDER WORKSPACE — Master Orchestrator
// ══════════════════════════════════════════════════════════════════

export class FounderWorkspace {
  readonly name = 'FOUNDER WORKSPACE';
  readonly designation = 'Sovereign Founder Toolkit — Notepad · Frameworks · Tools · Queries';

  readonly notepad = new SovereignNotepad();
  readonly queryEngine: SovereignQueryEngine;

  private readonly toolLog: ToolResult[] = [];

  constructor(queryEngine?: SovereignQueryEngine) {
    this.queryEngine = queryEngine ?? new SovereignQueryEngine();
  }

  // ── TOOL INVOCATION ──────────────────────────────────────────

  /**
   * Activate a tool from the founder toolbar.
   * Every activation is logged and returns a `ToolResult`.
   */
  activateTool(toolId: ToolId, input: string, payload?: Record<string, number>): ToolResult {
    const tool = FOUNDER_TOOLS[toolId];
    const timestamp = Date.now();

    switch (toolId) {
      case 'query': {
        const qr = this.queryEngine.query({ question: input, dimensions: ['all'], payload });
        const result: ToolResult = {
          toolId, toolName: tool.name, input, timestamp,
          output: qr.synthesis,
          queryResult: qr,
        };
        this.toolLog.push(result);
        return result;
      }

      case 'analyze': {
        const frameworks = Object.values(ANALYTICAL_FRAMEWORKS);
        const output = frameworks.map(f =>
          `[${f.name}] ${f.steps[0] ?? ''} … Key Q: ${f.questions[0] ?? ''}`,
        ).join('\n');
        const result: ToolResult = { toolId, toolName: tool.name, input, timestamp, output };
        this.toolLog.push(result);
        return result;
      }

      case 'synthesize': {
        const recent = this.notepad.search(input).slice(0, 3);
        const output = recent.length > 0
          ? `Synthesised from ${recent.length} note(s):\n` +
            recent.map(n => `• [${n.title}] ${n.body.slice(0, 120)}`).join('\n')
          : `No notes matching "${input}". Write notes first with the Notepad.`;
        const result: ToolResult = { toolId, toolName: tool.name, input, timestamp, output };
        this.toolLog.push(result);
        return result;
      }

      case 'challenge': {
        const f = ANALYTICAL_FRAMEWORKS['socratic'];
        const output = [
          `Socratic challenge on: "${input}"`,
          ...f.questions.map((q, i) => `${i + 1}. ${q}`),
        ].join('\n');
        const result: ToolResult = {
          toolId, toolName: tool.name, input, timestamp,
          output,
          framework: f,
        };
        this.toolLog.push(result);
        return result;
      }

      case 'expand': {
        const p = THINKING_PATTERNS['divergent'];
        const output = [
          `Divergent expansion on: "${input}"`,
          `HOW: ${p.howTo}`,
          `ANTI-PATTERN: ${p.antiPattern}`,
          `φ-PRINCIPLE: ${p.phiPrinciple}`,
        ].join('\n');
        const result: ToolResult = {
          toolId, toolName: tool.name, input, timestamp,
          output,
          pattern: p,
        };
        this.toolLog.push(result);
        return result;
      }

      case 'compress': {
        const f = ANALYTICAL_FRAMEWORKS['first-principles'];
        const output = [
          `First-principles compression of: "${input}"`,
          ...f.steps.map(s => s),
          `Key: ${f.questions[0] ?? ''}`,
        ].join('\n');
        const result: ToolResult = {
          toolId, toolName: tool.name, input, timestamp,
          output,
          framework: f,
        };
        this.toolLog.push(result);
        return result;
      }

      case 'translate': {
        const registers: Record<string, string> = {
          'Technical':      `[TECH] ${input} — specify the architectural primitives, interfaces, and invariants.`,
          'Executive':      `[EXEC] ${input} — frame as business outcome, risk, and timeline.`,
          'Investor':       `[INV]  ${input} — frame as TAM, moat, traction, and return multiple.`,
          'Public':         `[PUB]  ${input} — plain language, no jargon, why it matters to daily life.`,
          'Founding Team':  `[TEAM] ${input} — honest constraints, tradeoffs, and what we need to do next.`,
        };
        const output = Object.entries(registers).map(([k, v]) => `${k}:\n  ${v}`).join('\n');
        const result: ToolResult = { toolId, toolName: tool.name, input, timestamp, output };
        this.toolLog.push(result);
        return result;
      }

      case 'timeline': {
        const f = ANALYTICAL_FRAMEWORKS['futures-cone'];
        const output = [
          `Futures Cone for: "${input}"`,
          `POSSIBLE:   Everything not ruled out by physics or logic.`,
          `PLAUSIBLE:  Consistent with current trends and dynamics.`,
          `PROBABLE:   Most likely given today's trajectory.`,
          `PREFERABLE: The future we are building. Path: ${f.steps[4] ?? ''}`,
        ].join('\n');
        const result: ToolResult = {
          toolId, toolName: tool.name, input, timestamp,
          output,
          framework: f,
        };
        this.toolLog.push(result);
        return result;
      }

      case 'network': {
        const output = [
          `Network map for: "${input}"`,
          `1. Identify all entities related to: "${input}"`,
          `2. Map directed dependencies (A → B means A depends on B).`,
          `3. Identify hubs (high in-degree) and bridges (high betweenness).`,
          `4. Mark φ-critical nodes: removal would break ≥ φ⁻¹ (38%) of paths.`,
          `5. Recommend: strengthen bridges, diversify hubs.`,
        ].join('\n');
        const result: ToolResult = { toolId, toolName: tool.name, input, timestamp, output };
        this.toolLog.push(result);
        return result;
      }

      case 'simulate': {
        const qr = this.queryEngine.query({
          question: `simulation: ${input}`,
          dimensions: ['ecology', 'sync', 'antifragility'],
          payload,
        });
        const result: ToolResult = {
          toolId, toolName: tool.name, input, timestamp,
          output: qr.synthesis,
          queryResult: qr,
        };
        this.toolLog.push(result);
        return result;
      }

      default: {
        const result: ToolResult = {
          toolId, toolName: toolId, input, timestamp,
          output: `Unknown tool: ${toolId}`,
        };
        this.toolLog.push(result);
        return result;
      }
    }
  }

  // ── FRAMEWORK RUNNER ─────────────────────────────────────────

  /** Return the full framework definition for a given ID. */
  framework(id: FrameworkId): FrameworkDefinition {
    return ANALYTICAL_FRAMEWORKS[id];
  }

  /** List all framework IDs with name + description. */
  listFrameworks(): Array<{ id: FrameworkId; name: string; description: string }> {
    return Object.values(ANALYTICAL_FRAMEWORKS).map(f => ({
      id: f.id,
      name: f.name,
      description: f.description,
    }));
  }

  // ── THINKING PATTERN RUNNER ───────────────────────────────────

  pattern(id: ThinkingPatternId): ThinkingPattern {
    return THINKING_PATTERNS[id];
  }

  listPatterns(): Array<{ id: ThinkingPatternId; name: string; when: string }> {
    return Object.values(THINKING_PATTERNS).map(p => ({
      id: p.id,
      name: p.name,
      when: p.when,
    }));
  }

  // ── BLUEPRINTS ───────────────────────────────────────────────

  runBlueprint(blueprintId: string): QueryResult | undefined {
    const bp = QUERY_BLUEPRINTS.find(b => b.id === blueprintId);
    if (!bp) return undefined;
    return this.queryEngine.query(bp.query);
  }

  get blueprints(): readonly QueryBlueprint[] {
    return QUERY_BLUEPRINTS;
  }

  // ── TOOLBAR ──────────────────────────────────────────────────

  listTools(): ReadonlyArray<ToolDefinition> {
    return Object.values(FOUNDER_TOOLS);
  }

  toolHistory(n = 20): readonly ToolResult[] {
    return this.toolLog.slice(-n);
  }

  // ── WORKSPACE STATUS ─────────────────────────────────────────

  status() {
    return {
      name: this.name,
      notes: this.notepad.count,
      totalToolActivations: this.toolLog.length,
      queryEngineStatus: this.queryEngine.status(),
      availableTools: Object.keys(FOUNDER_TOOLS).length,
      availableFrameworks: Object.keys(ANALYTICAL_FRAMEWORKS).length,
      availablePatterns: Object.keys(THINKING_PATTERNS).length,
      availableBlueprints: QUERY_BLUEPRINTS.length,
      phi: PHI,
    };
  }
}
