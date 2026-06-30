///
/// SCRIBE INTELLIGENCE — The Document Organism
///
/// TypeScript organism intelligence for SCRIBE.
/// Mirrors the Motoko canister (src/organisms/scribe/main.mo).
/// Lives in the documents.  Classifies, synthesizes, journals.
///
/// Sub-models: CLASSIFIER, SYNTHESIZER
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, GOLDEN_ANGLE } from './ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type DocumentCategory =
  | 'Research'
  | 'Architecture'
  | 'Theory'
  | 'Vision'
  | 'Implementation'
  | 'Synthesis'
  | 'Chronicle'
  | 'Genesis';

export interface ClassifiedDocument {
  readonly id: number;
  readonly title: string;
  readonly content: string;
  readonly category: DocumentCategory;
  readonly generation: number;
  readonly goldenWeight: number;
  readonly timestamp: number;
}

export interface SynthesizedPaper {
  readonly id: number;
  readonly title: string;
  readonly abstract: string;
  readonly categories: DocumentCategory[];
  readonly sourceCount: number;
  readonly generation: number;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  SCRIBE INTELLIGENCE
// ══════════════════════════════════════════════════════════════════

export class ScribeIntelligence {
  readonly name = 'SCRIBE';
  readonly designation = 'The Document Organism — He legitimately lives in the documents';

  private documents: ClassifiedDocument[] = [];
  private papers: SynthesizedPaper[] = [];
  private nextDocId = 0;
  private nextPaperId = 0;
  private generation = 0;

  /** Major categories (φ proportion) */
  private readonly majorCategories: DocumentCategory[] =
    ['Research', 'Architecture', 'Theory', 'Vision'];
  /** Minor categories (1/φ proportion) */
  private readonly minorCategories: DocumentCategory[] =
    ['Implementation', 'Synthesis', 'Chronicle', 'Genesis'];

  // ── SUB-MODEL: CLASSIFIER ──────────────────────────────────────

  classify(title: string, content: string): ClassifiedDocument {
    const hash = this.simpleHash(content);
    const categoryIdx = hash % 8;
    const allCats = [...this.majorCategories, ...this.minorCategories];
    const category = allCats[categoryIdx];

    const isMajor = categoryIdx < 4;
    const goldenWeight = isMajor ? PHI : 1 / PHI;

    const doc: ClassifiedDocument = {
      id: this.nextDocId++,
      title,
      content,
      category,
      generation: this.generation,
      goldenWeight,
      timestamp: Date.now(),
    };

    this.documents.push(doc);

    // Advance generation at Fibonacci thresholds
    if (this.isFibonacci(this.documents.length)) {
      this.generation++;
    }

    return doc;
  }

  // ── SUB-MODEL: SYNTHESIZER ─────────────────────────────────────

  synthesize(category?: DocumentCategory): SynthesizedPaper {
    const sources = category
      ? this.documents.filter(d => d.category === category)
      : this.documents;

    const categories = [...new Set(sources.map(d => d.category))];

    const paper: SynthesizedPaper = {
      id: this.nextPaperId++,
      title: `Synthesis: ${category ?? 'All Categories'} — Generation ${this.generation}`,
      abstract: `Research paper synthesized from ${sources.length} documents ` +
        `across ${categories.length} categories at generation ${this.generation}. ` +
        `Golden weight distribution: major=${PHI.toFixed(4)}, minor=${(1 / PHI).toFixed(4)}.`,
      categories,
      sourceCount: sources.length,
      generation: this.generation,
      timestamp: Date.now(),
    };

    this.papers.push(paper);
    return paper;
  }

  // ── Status ─────────────────────────────────────────────────────

  status() {
    return {
      name: this.name,
      designation: this.designation,
      total_documents: this.documents.length,
      total_papers: this.papers.length,
      generation: this.generation,
      sub_models: ['CLASSIFIER', 'SYNTHESIZER'],
    };
  }

  // ── Helpers ────────────────────────────────────────────────────

  private simpleHash(s: string): number {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  }

  private isFibonacci(n: number): boolean {
    if (n === 0) return true;
    const n2 = n * n;
    const a = 5 * n2 + 4;
    const b = 5 * n2 - 4;
    const sqA = Math.round(Math.sqrt(a));
    const sqB = Math.round(Math.sqrt(b));
    return sqA * sqA === a || sqB * sqB === b;
  }
}
