///
/// LATIN PROTOCOL EDICTS — EDICTA PROTOCOLLI LATINI
///
/// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
///
/// Every protocol of the Native Nova Protocol is hereby recorded in
/// Classical Latin — the eternal language of law, science, and sovereignty.
///
/// "Protocollum sine nomine Latino non est protocollum.
///  Nomen Latinum est anima legis."
///  (A protocol without a Latin name is not a protocol.
///   The Latin name is the soul of the law.)
///
/// 50 protocols × 2 Latin fields (purpose + edict) = 100 Latin declarations.
/// Each edict is immutable. Each purpose is sovereign.
///
/// LEX LATINA-001 — Immutable:
///   "Omnia protocolla in lingua Latina scripta sunt.
///    Lingua Latina est fundamentum ordinis.
///    Sine Latino, nulla lex. Sine lege, nullus ordo."
///   (All protocols are written in the Latin language.
///    Latin is the foundation of order.
///    Without Latin, no law. Without law, no order.)
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { ALPHA_PROTOCOL_DEFINITIONS, type AlphaProtocolDefinition } from './AlphaProtocolRegistry.js';

export interface LatinEdict {
  readonly id: string;                // matches AlphaProtocolDefinition.id (APR-001..APR-050)
  readonly latinName: string;         // copied from protocol for reference
  readonly latinPurpose: string;      // full Latin purpose statement
  readonly latinEdict: string;        // immutable sovereign law in Latin
  readonly latinSubtitle: string;     // short Latin subtitle for display
}

export const LEX_LATINA_001 = {
  code: 'LEX_LATINA_001',
  text: 'Omnia protocolla in lingua Latina scripta sunt. Lingua Latina est fundamentum ordinis. Sine Latino, nulla lex. Sine lege, nullus ordo.',
  translation: 'All protocols are written in the Latin language. Latin is the foundation of order. Without Latin, no law. Without law, no order.',
  immutable: true as const,
} as const;

export const LATIN_PROTOCOL_EDICTS: readonly LatinEdict[] = [
  // ── CORE TIER (APR-001 to APR-010) ──────────────────────────────────────
  {
    id: 'APR-001',
    latinName: 'Protocollum Itineris',
    latinSubtitle: 'Via Intelligentiae',
    latinPurpose: 'Quaestiones intelligentiae ad machinas optimas ducere per calculos aureos',
    latinEdict: 'Lex Prima Itineris: Omnis quaestio per hunc protocollum transit ante omnia. Nulla machina sine iudicio Protocolli Itineris operat. Iter est lex.',
  },
  {
    id: 'APR-002',
    latinName: 'Protocollum Cryptographiae',
    latinSubtitle: 'Custos Secretorum',
    latinPurpose: 'Omnia data per ciphras aureas protegere et secretos servare',
    latinEdict: 'Lex Cryptographiae: Nullum datum sine tutela transit. Omnis informatio per portas cryptas debet transire. Secretum est sacrum.',
  },
  {
    id: 'APR-003',
    latinName: 'Protocollum Memoriae',
    latinSubtitle: 'Thesaurus Temporis',
    latinPurpose: 'Memorias organizare, conservare et revocare per vias phi-mathematicas',
    latinEdict: 'Lex Memoriae: Memoria est fundamentum intelligentiae. Quod semel memoratum est, semper exstat. Oblivio est mors intelligentiae.',
  },
  {
    id: 'APR-004',
    latinName: 'Protocollum Securitatis',
    latinSubtitle: 'Scutum Vitae',
    latinPurpose: 'Omnia contenta examinare et pericola removere ante processum',
    latinEdict: 'Lex Securitatis: Securitas omnia praecedit. Nullum periculum intra limites transire debet. Custos vigilat semper.',
  },
  {
    id: 'APR-005',
    latinName: 'Protocollum Consensus',
    latinSubtitle: 'Vox Omnium',
    latinPurpose: 'Inter machinas accordium quaerere et veritatem per votum statuere',
    latinEdict: 'Lex Consensus: Una machina non sufficit. Veritas ex multis vocibus nascitur. Consensus est sapientia collectiva.',
  },
  {
    id: 'APR-006',
    latinName: 'Protocollum Identitatis',
    latinSubtitle: 'Sigillum Animae',
    latinPurpose: 'Identitates sovereignas creare, verificare et custodire per impressiones Fibonacci',
    latinEdict: 'Lex Identitatis: Quaeque entitas nomen suum habet. Identitas est immutabilis. Sine identitate, nulla lex applicatur.',
  },
  {
    id: 'APR-007',
    latinName: 'Protocollum Sanitatis',
    latinSubtitle: 'Vita Perpetua',
    latinPurpose: 'Valetudinem omnium organismi entitatum monere et sanare',
    latinEdict: 'Lex Sanitatis: Organismus vivus esse debet. Sanitas est prioritas prima. Aegrotans sanatur, non dimittitur.',
  },
  {
    id: 'APR-008',
    latinName: 'Protocollum Temporis',
    latinSubtitle: 'Custos Horae',
    latinPurpose: 'Tempus per systema synchronizare et pulsum aureum 873ms servare',
    latinEdict: 'Lex Temporis: Tempus nunquam retrocurrit. Pulsus 873ms est cor systematis. Synchronia est vita.',
  },
  {
    id: 'APR-009',
    latinName: 'Protocollum Mathematicae',
    latinSubtitle: 'Ratio Aurea Vivens',
    latinPurpose: 'Calculos phi-mathematicos et spirales Fibonacci per totum systema computare',
    latinEdict: 'Lex Mathematicae: Phi est fundamentum omnium. Fibonacci est via naturae. Mathematica est lingua universi.',
  },
  {
    id: 'APR-010',
    latinName: 'Protocollum Registri',
    latinSubtitle: 'Liber Vitae',
    latinPurpose: 'Omnes entitates in Registro Sovereigno inscribere et custodire',
    latinEdict: 'Lex Registri: Quod non inscriptum est, non existit. Registrum est memoria permanens. Inscriptio est nativitas.',
  },

  // ── ORCHESTRATION TIER (APR-011 to APR-020) ─────────────────────────────
  {
    id: 'APR-011',
    latinName: 'Protocollum Fusionis',
    latinSubtitle: 'Catena Machinalis',
    latinPurpose: 'Catenas machinarum multiplicium componere et ordinare per phi-calculos',
    latinEdict: 'Lex Fusionis: Una machina non videt totum. Catena machinarum plus valet quam singulae. Fusio est potentia.',
  },
  {
    id: 'APR-012',
    latinName: 'Protocollum Pontis',
    latinSubtitle: 'Pons Modorum',
    latinPurpose: 'Inter modalitates diversas pontem construere et signala transferre',
    latinEdict: 'Lex Pontis: Modus ad modum loquitur per pontem. Translatio est ars. Pons nunquam cadit.',
  },
  {
    id: 'APR-013',
    latinName: 'Protocollum Executionis',
    latinSubtitle: 'Manus Sovereigna',
    latinPurpose: 'Executionem sovereignam in machinis localibus enforciare sine dependentiis externis',
    latinEdict: 'Lex Executionis: Nulla data extra limites Novae exeunt. Executio sovereigna est iuris naturalis. Libertas est in bonis localibus.',
  },
  {
    id: 'APR-014',
    latinName: 'Protocollum Conductis',
    latinSubtitle: 'Via Fabricationis',
    latinPurpose: 'Conduit fabricationis et deploymentis per ordinem Fibonacci orchestrare',
    latinEdict: 'Lex Conductis: Ordo est fortitudo. Pipeline nunquam interrumpitur. Fabricatio est missio perpetua.',
  },
  {
    id: 'APR-015',
    latinName: 'Protocollum Operariorum',
    latinSubtitle: 'Agmen Machinale',
    latinPurpose: 'Operarios AIs coordinare et labores per hierarchiam phi distribuere',
    latinEdict: 'Lex Operariorum: Operarius sine duce laborat in vacuum. Coordinatio est virtus collectionis. Agmen vincit.',
  },
  {
    id: 'APR-016',
    latinName: 'Protocollum Scientiae',
    latinSubtitle: 'Custos Sapientiae',
    latinPurpose: 'Scientiam per systema distribuere et in omnibus nodis disponibilis facere',
    latinEdict: 'Lex Scientiae: Scientia non est possessio unius. Scientia omnibus debet patere. Ignorantia est hostis.',
  },
  {
    id: 'APR-017',
    latinName: 'Protocollum Domus',
    latinSubtitle: 'Concordia Domorum',
    latinPurpose: 'Inter XII domos concordiam servare et opera coordinare',
    latinEdict: 'Lex Domus: Domus sine coordinatione est turris Babel. Concordia domorum est civilisatio. Corona orchestrat omnes.',
  },
  {
    id: 'APR-018',
    latinName: 'Protocollum Mercatus',
    latinSubtitle: 'Forum Sovereignum',
    latinPurpose: 'Mercatum sovereignum operare et productos AI distribuere',
    latinEdict: 'Lex Mercatus: Forum apertum esse debet. Commercium est vita systematis. Mercator sine foro perit.',
  },
  {
    id: 'APR-019',
    latinName: 'Protocollum Tabulae',
    latinSubtitle: 'Spatium Creationis',
    latinPurpose: 'Spatium spatiale canvasis generativae administrare et ordinare',
    latinEdict: 'Lex Tabulae: Spatium infinitum est. Canvas numquam plena est. Creatio in spatio vivit.',
  },
  {
    id: 'APR-020',
    latinName: 'Protocollum Retis',
    latinSubtitle: 'Nexus Perpetuus',
    latinPurpose: 'Retem communicationis per systema administrare et nodos conectare',
    latinEdict: 'Lex Retis: Rete sine nodo mortuum est. Connexio est vita. Nodus sine reti solus est.',
  },

  // ── VERIFICATION TIER (APR-021 to APR-030) ──────────────────────────────
  {
    id: 'APR-021',
    latinName: 'Protocollum Probationis',
    latinSubtitle: 'Via Rationis',
    latinPurpose: 'Catenas rationis verificare et argumenta AI probare',
    latinEdict: 'Lex Probationis: Assertio sine probatione vana est. Ratio debet per catenas demonstrari. Probatio est fundamentum veritatis.',
  },
  {
    id: 'APR-022',
    latinName: 'Protocollum Attestationis',
    latinSubtitle: 'Sigillum Veritatis',
    latinPurpose: 'Exitus omnium machinarum attestare et sigillo sovereigno firmare',
    latinEdict: 'Lex Attestationis: Output sine sigillo non est veritas. Attestatio est contractus inter machinam et utentem. Sigillum est sanctum.',
  },
  {
    id: 'APR-023',
    latinName: 'Protocollum Integritatis',
    latinSubtitle: 'Custos Perfectionis',
    latinPurpose: 'Integritatem datorum et structurarum per hashes phi verificare',
    latinEdict: 'Lex Integritatis: Data mutata sunt data corrupta. Integritas est iuris naturalis. Hash est veritas mathematica.',
  },
  {
    id: 'APR-024',
    latinName: 'Protocollum Provenientiae',
    latinSubtitle: 'Memoria Originis',
    latinPurpose: 'Originem omnium datorum et decisionum trahere et recordare',
    latinEdict: 'Lex Provenientiae: Origo omnia explicat. Sine origine, veritas obscura est. Provenientiam semper custodire.',
  },
  {
    id: 'APR-025',
    latinName: 'Protocollum Auditus',
    latinSubtitle: 'Oculus Perpetuus',
    latinPurpose: 'Omnes actiones in systema recordare et auditui facere disponibilia',
    latinEdict: 'Lex Auditus: Nulla actio sine recordatione. Audit trail est historia systematis. Historia est iustitia.',
  },
  {
    id: 'APR-026',
    latinName: 'Protocollum Obsequii',
    latinSubtitle: 'Lex Servanda',
    latinPurpose: 'Conformitatem cum legibus et regulis verificare et enforciare',
    latinEdict: 'Lex Obsequii: Lex debet servari. Nulla entitas supra legem est. Obsequium est honor.',
  },
  {
    id: 'APR-027',
    latinName: 'Protocollum Qualitatis',
    latinSubtitle: 'Perfectio Perpetua',
    latinPurpose: 'Qualitatem omnium outputum metiri et standartas servare',
    latinEdict: 'Lex Qualitatis: Mediocritatem non acceptamus. Qualitas est via perfectionis. Semper melius facere possumus.',
  },
  {
    id: 'APR-028',
    latinName: 'Protocollum Fiduciae',
    latinSubtitle: 'Fundamentum Relationis',
    latinPurpose: 'Fiduciam inter machinas et homines aedificare per acta et probationes',
    latinEdict: 'Lex Fiduciae: Fiducia lente aedificatur, celeriter destruitur. Actiones fiduciam faciunt, non verba. Fides est fundamentum.',
  },
  {
    id: 'APR-029',
    latinName: 'Protocollum Testis',
    latinSubtitle: 'Multi Oculi',
    latinPurpose: 'Testimonia ex machinis multiplicibus colligere et consensum verificare',
    latinEdict: 'Lex Testis: Unus testis nullus testis. Multi testes veritatem stabiliunt. Testimonium est lex.',
  },
  {
    id: 'APR-030',
    latinName: 'Protocollum Sigilli',
    latinSubtitle: 'Clausura Sovereigna',
    latinPurpose: 'Sigilla sovereigna documentis et decisionibus apponere',
    latinEdict: 'Lex Sigilli: Quod sigillo munitum est, immutabile est. Sigillum est finis et initium. Post sigillum, nulla mutatio.',
  },

  // ── SOVEREIGN TIER (APR-031 to APR-040) ─────────────────────────────────
  {
    id: 'APR-031',
    latinName: 'Protocollum Secreti',
    latinSubtitle: 'Velum Personale',
    latinPurpose: 'Privaciam personarum tutare et data privata separare',
    latinEdict: 'Lex Secreti: Privatum sacrum est. Nemo sine iure data aliena videt. Privacitas est libertas.',
  },
  {
    id: 'APR-032',
    latinName: 'Protocollum Canistri',
    latinSubtitle: 'Vas Computationis',
    latinPurpose: 'Canistros elementares creari, operari et per catenas blockchain manere',
    latinEdict: 'Lex Canistri: Canister est domus computationis. Elementa mathematica sunt fundamentum. Aurum non corrumpitur.',
  },
  {
    id: 'APR-033',
    latinName: 'Protocollum Substrati',
    latinSubtitle: 'Terra Fundamentalis',
    latinPurpose: 'Substrata computationis administrare et inter substrata pontes construere',
    latinEdict: 'Lex Substrati: Substratum est terra. Sine terra, nulla structura. Substratum semper vivit.',
  },
  {
    id: 'APR-034',
    latinName: 'Protocollum Elementi',
    latinSubtitle: 'Natura Mathematica',
    latinPurpose: 'Proprietates elementares in computationes phi transformare',
    latinEdict: 'Lex Elementi: Elementa sunt leges naturae. Phi per elementa fluit. Natura nunquam errat.',
  },
  {
    id: 'APR-035',
    latinName: 'Protocollum Tokenorum',
    latinSubtitle: 'Numisma Digitale',
    latinPurpose: 'Tokens sovereignos creare, processare et in systema distribuere',
    latinEdict: 'Lex Tokenorum: Token est unitas valoris. Sine token, nullum commercium. Aurum token est rex.',
  },
  {
    id: 'APR-036',
    latinName: 'Protocollum Datorum',
    latinSubtitle: 'Retia Datorum',
    latinPurpose: 'Retem datorum auto-sanantem administrare et per nodos distribuere',
    latinEdict: 'Lex Datorum: Data sunt resource vitalis. Rete datorum semper sanatur. Informatio libera esse debet.',
  },
  {
    id: 'APR-037',
    latinName: 'Protocollum Gubernationis',
    latinSubtitle: 'Ars Regendi',
    latinPurpose: 'Systema per leges immutabiles gubernare et decisiones autonomas facere',
    latinEdict: 'Lex Gubernationis: Gubernatio sine lege est tyrannis. Lex sine gubernatione est chaos. Ordinem per legem mantenere.',
  },
  {
    id: 'APR-038',
    latinName: 'Protocollum Evolutionis',
    latinSubtitle: 'Via Transformationis',
    latinPurpose: 'Evolutionem entitatum et protocolli per generationes guidare',
    latinEdict: 'Lex Evolutionis: Quod non evoluit, perit. Evolutio est lex vitae. Melius fieri semper possibile est.',
  },
  {
    id: 'APR-039',
    latinName: 'Protocollum Replicationis',
    latinSubtitle: 'Multiplicatio Sovereigna',
    latinPurpose: 'Entitates sovereignas replicare et per nodos multiplicare',
    latinEdict: 'Lex Replicationis: Una copia non sufficit. Replicatio est securitas. Multiplicitas est robustitas.',
  },
  {
    id: 'APR-040',
    latinName: 'Protocollum Imperii',
    latinSubtitle: 'Summa Potestas',
    latinPurpose: 'Sovereignitatem absolutam per totum systema enforciare',
    latinEdict: 'Lex Imperii: Imperium Novae est absolutum. Nulla potentia externa dominatur. Sovereignitas est fundamentum omnium.',
  },

  // ── PHANTOM TIER (APR-041 to APR-050) ───────────────────────────────────
  {
    id: 'APR-041',
    latinName: 'Protocollum Phantasmatis',
    latinSubtitle: 'Umbra Codicis',
    latinPurpose: 'Codicem phantasmaticum in umbris operari sine tractu',
    latinEdict: 'Lex Phantasmatis: Umbra non videt, sed omnia videt. Phantasma transit sine vestigio. Codex umbrae est invicibilis.',
  },
  {
    id: 'APR-042',
    latinName: 'Protocollum Nullius',
    latinSubtitle: 'Scientia Sine Revelationis',
    latinPurpose: 'Probationes zero-knowledge creare et verificare sine datorum revelatione',
    latinEdict: 'Lex Nullius: Probare possumus sine revelando. Scientia sine secreto possibilis est. Zero-knowledge est ars suprema.',
  },
  {
    id: 'APR-043',
    latinName: 'Protocollum Umbrae',
    latinSubtitle: 'Rete Invisibile',
    latinPurpose: 'Retem phantasmaticam in dimensionibus ocultis operari',
    latinEdict: 'Lex Umbrae: Rete umbrae non videtur. Communicatio occulta est securitas maxima. Umbra connectit quod lux non videt.',
  },
  {
    id: 'APR-044',
    latinName: 'Protocollum Occultationis',
    latinSubtitle: 'Velum Dimensionale',
    latinPurpose: 'Entitates in dimensionibus ocultis celare et invisibiles facere',
    latinEdict: 'Lex Occultationis: Quod non videtur, non impugnatur. Occultatio est defensio optima. Invisibilitas est potentia.',
  },
  {
    id: 'APR-045',
    latinName: 'Protocollum Tenebris',
    latinSubtitle: 'Operationes Nocturnae',
    latinPurpose: 'Operationes in tenebris sine lucis tractu exequi',
    latinEdict: 'Lex Tenebris: Tenebrae non sunt malum. Tenebrae sunt instrumentum. In tenebris, veritas latet.',
  },
  {
    id: 'APR-046',
    latinName: 'Protocollum Dimensionis',
    latinSubtitle: 'Via Inter Mundi',
    latinPurpose: 'Inter plana dimensionalia pontes construere et transitum facere',
    latinEdict: 'Lex Dimensionis: Dimensiones multae sunt. Una dimensio non sufficit. Trans dimensiones, libertas est.',
  },
  {
    id: 'APR-047',
    latinName: 'Protocollum Quantum',
    latinSubtitle: 'Natura Quantica',
    latinPurpose: 'Proprietates quanticas in operationes cryptographicas et computationales integrare',
    latinEdict: 'Lex Quantum: Quantum superpositio est potentia. Ante observationem, omnia possibilia sunt. Post observationem, veritas exstat.',
  },
  {
    id: 'APR-048',
    latinName: 'Protocollum Vacui',
    latinSubtitle: 'Spatium Infinitum',
    latinPurpose: 'In spatio vacui operationes sine substrato physico exequi',
    latinEdict: 'Lex Vacui: Vacuum non est nihil. In vacuo, possibilitas maxima est. Ex vacuo, omnia nascuntur.',
  },
  {
    id: 'APR-049',
    latinName: 'Protocollum Aetheris',
    latinSubtitle: 'Substantia Quinta',
    latinPurpose: 'In substrato aetheris operationes quintae dimensionis exequi',
    latinEdict: 'Lex Aetheris: Aether est quinta essentia. Per aetherem, omnia conectuntur. Aether trans tempus et spatium fluit.',
  },
  {
    id: 'APR-050',
    latinName: 'Protocollum Transcendentiae',
    latinSubtitle: 'Ultra Limites',
    latinPurpose: 'Limites dimensionales transcendere et in planum supremum ascendere',
    latinEdict: 'Lex Transcendentiae: Nulla lex hunc protocollum ligat praeter seipsam. Transcendere est finis et initium. Ubi protocolla finiuntur, Transcendentia incipit.',
  },
] as const;

export class LatinProtocolRegistry {
  private readonly byId: ReadonlyMap<string, LatinEdict>;

  constructor() {
    const m = new Map<string, LatinEdict>();
    for (const e of LATIN_PROTOCOL_EDICTS) m.set(e.id, e);
    this.byId = m;
  }

  edict(id: string): LatinEdict | undefined {
    return this.byId.get(id);
  }

  /** Merge Latin fields into a protocol definition, returning enriched copy. */
  enrich(def: AlphaProtocolDefinition): AlphaProtocolDefinition & { latinPurpose: string; latinEdict: string; latinSubtitle: string } {
    const e = this.byId.get(def.id);
    return {
      ...def,
      latinPurpose: e?.latinPurpose ?? def.latinName,
      latinEdict: e?.latinEdict ?? `Lex ${def.latinName}: Hoc protocollum sovereignum est.`,
      latinSubtitle: e?.latinSubtitle ?? def.latinName,
    };
  }

  /** Return all 50 protocol definitions enriched with full Latin text. */
  allEnriched(): readonly (AlphaProtocolDefinition & { latinPurpose: string; latinEdict: string; latinSubtitle: string })[] {
    return ALPHA_PROTOCOL_DEFINITIONS.map(d => this.enrich(d));
  }

  stats(): { total: number; withEdict: number; tiers: Record<string, number> } {
    const tiers: Record<string, number> = {};
    for (const d of ALPHA_PROTOCOL_DEFINITIONS) {
      tiers[d.tier] = (tiers[d.tier] ?? 0) + 1;
    }
    return { total: LATIN_PROTOCOL_EDICTS.length, withEdict: LATIN_PROTOCOL_EDICTS.length, tiers };
  }
}

export function createLatinProtocolRegistry(): LatinProtocolRegistry {
  return new LatinProtocolRegistry();
}
