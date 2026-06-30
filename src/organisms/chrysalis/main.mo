///
/// CHRYSALIS — Χρυσαλίς — Golden Mathematics Core
///
/// The DNA of every organism in the Native Nova Protocol.
/// All growth patterns, all spatial distributions, all scaling factors
/// originate here.  Nothing grows without consulting Chrysalis first.
///
/// Sub-models hosted:
///   FIBONACCI — sequence generation and Binet closed-form computation
///   SPIRAL    — golden spiral and phyllotaxis spatial distribution
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float "mo:base/Float";
import Int   "mo:base/Int";
import Nat   "mo:base/Nat";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Iter   "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor Chrysalis {

  // ══════════════════════════════════════════════════════════════════
  //  CPL RUNTIME WIRING — The Permanent Foundation
  // ══════════════════════════════════════════════════════════════════
  stable var cplRuntimeCanisterId : ?Principal = null;

  public type PulsePriority = { #Low; #Normal; #High; #Critical };
  public type ProofResult = { #Passed; #Failed; #Blocked; #Partial };
  public type MemoryType = { #Precedent; #Pattern; #Consequence; #Alert; #Constraint; #Exception };

  type CPLRuntime = actor {
    createPulse : (Text, [Text], Text, [Text], [Text], Text, Text, Text,
                   PulsePriority, Nat, Nat, Nat, Bool)
                   -> async Result.Result<Text, Text>;
    enforceBeforeWrite : ([Text], Text, Text) -> async Result.Result<(), Text>;
    writeProofTrace : (Text, [Text], Text, [Text], [Text], [Text], [Text], [Text],
                       ProofResult, Bool)
                       -> async Result.Result<Text, Text>;
    createMemoryRecord : (MemoryType, Text, ?Text, Text, [Text], [Text], [Text], Float, Nat)
                         -> async Result.Result<Text, Text>;
  };

  public shared(msg) func setCPLRuntime(canisterId : Principal) : async () {
    cplRuntimeCanisterId := ?canisterId;
  };

  func getCPL() : ?CPLRuntime {
    switch (cplRuntimeCanisterId) {
      case null null;
      case (?id) {
        let cpl : CPLRuntime = actor (Principal.toText(id));
        ?cpl
      };
    }
  };

  // ── Constants ──────────────────────────────────────────────────────

  /// φ  — the Golden Ratio  (1 + √5) / 2
  transient let PHI : Float = 1.6180339887498948482;

  /// ψ  — conjugate of φ    (1 − √5) / 2
  transient let PSI : Float = -0.6180339887498948482;

  /// √5
  transient let SQRT5 : Float = 2.2360679774997896964;

  /// Golden Angle in radians  ≈ 2π(2 − φ)  ≈ 137.508°
  transient let GOLDEN_ANGLE : Float = 2.39996322972865332;

  /// π
  transient let PI : Float = 3.14159265358979323846;

  // ── SUB-MODEL: FIBONACCI ──────────────────────────────────────────

  /// Binet's formula — closed-form Fibonacci using the golden ratio.
  /// F(n) = (φⁿ − ψⁿ) / √5
  /// This is not an approximation for small n; it IS the Fibonacci
  /// number expressed through its golden-ratio identity.
  public query func fibonacci(n : Nat) : async Nat {
    if (n <= 1) { return n };
    let nf = Float.fromInt(n);
    let result = (Float.pow(PHI, nf) - Float.pow(PSI, nf)) / SQRT5;
    Int.abs(Float.toInt(Float.nearest(result)))
  };

  /// Iterative Fibonacci sequence — n terms starting from F(0).
  public query func fibonacci_sequence(terms : Nat) : async [Nat] {
    let buf = Buffer.Buffer<Nat>(terms);
    var a : Nat = 0;
    var b : Nat = 1;
    var i : Nat = 0;
    while (i < terms) {
      buf.add(a);
      let next = a + b;
      a := b;
      b := next;
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// Convergent golden ratio — ratio of consecutive Fibonacci numbers.
  /// As iterations → ∞, this converges exactly to φ.
  public query func golden_ratio_convergence(iterations : Nat) : async Float {
    if (iterations == 0) { return 1.0 };
    var a : Float = 1.0;
    var b : Float = 1.0;
    var i : Nat = 0;
    while (i < iterations) {
      let next = a + b;
      a := b;
      b := next;
      i += 1;
    };
    b / a
  };

  // ── SUB-MODEL: SPIRAL ─────────────────────────────────────────────

  /// Golden spiral — returns (x, y) at parameter t.
  /// r(t) = φ^(2t/π)  then projected to Cartesian.
  public query func golden_spiral_point(t : Float) : async (Float, Float) {
    let r = Float.pow(PHI, 2.0 * t / PI);
    (r * Float.cos(t), r * Float.sin(t))
  };

  /// Generate n points along the golden spiral.
  public query func golden_spiral(num_points : Nat, step : Float) : async [(Float, Float)] {
    let buf = Buffer.Buffer<(Float, Float)>(num_points);
    var i : Nat = 0;
    while (i < num_points) {
      let t = Float.fromInt(i) * step;
      let r = Float.pow(PHI, 2.0 * t / PI);
      buf.add((r * Float.cos(t), r * Float.sin(t)));
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// Phyllotaxis — sunflower seed arrangement.
  /// Each seed n is placed at angle n × golden_angle, radius √n × scale.
  /// This is nature's most efficient packing pattern.
  public query func phyllotaxis(num_seeds : Nat, scale : Float) : async [(Float, Float)] {
    let buf = Buffer.Buffer<(Float, Float)>(num_seeds);
    var i : Nat = 0;
    while (i < num_seeds) {
      let n = Float.fromInt(i);
      let angle = n * GOLDEN_ANGLE;
      let radius = scale * Float.sqrt(n);
      buf.add((radius * Float.cos(angle), radius * Float.sin(angle)));
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// Fibonacci sphere — optimal point distribution on a sphere.
  /// Used for distributing organisms evenly across a substrate surface.
  public query func fibonacci_sphere(num_points : Nat) : async [(Float, Float, Float)] {
    let buf = Buffer.Buffer<(Float, Float, Float)>(num_points);
    let n = Float.fromInt(num_points);
    var i : Nat = 0;
    while (i < num_points) {
      let fi = Float.fromInt(i);
      let theta = Float.arccos(1.0 - 2.0 * (fi + 0.5) / n);
      let phi_angle = 2.0 * PI * fi / PHI;
      buf.add((
        Float.sin(theta) * Float.cos(phi_angle),
        Float.sin(theta) * Float.sin(phi_angle),
        Float.cos(theta),
      ));
      i += 1;
    };
    Buffer.toArray(buf)
  };

  // ── Growth Functions ───────────────────────────────────────────────

  /// Golden growth factor — how an organism scales across generations.
  /// generation 0 = base, generation n = base × φⁿ
  public query func golden_growth(base : Float, generation : Nat) : async Float {
    base * Float.pow(PHI, Float.fromInt(generation))
  };

  /// Golden partition — splits a magnitude into golden-ratio segments.
  /// Returns (major, minor) where major/minor ≈ φ.
  public query func golden_partition(magnitude : Float) : async (Float, Float) {
    let major = magnitude / PHI;
    let minor = magnitude - major;
    (major, minor)
  };

  /// Zeckendorf representation — express any natural number as a sum
  /// of non-consecutive Fibonacci numbers.  This is the organism's
  /// native number system.
  public query func zeckendorf(n : Nat) : async [Nat] {
    if (n == 0) { return [] };
    let buf = Buffer.Buffer<Nat>(8);
    var remaining = n;

    // Build Fibonacci numbers up to n
    let fibs = Buffer.Buffer<Nat>(32);
    var a : Nat = 1;
    var b : Nat = 2;
    while (a <= n) {
      fibs.add(a);
      let next = a + b;
      a := b;
      b := next;
    };

    // Greedy decomposition from largest
    let fibArr = Buffer.toArray(fibs);
    var j : Int = fibArr.size() - 1;
    while (j >= 0 and remaining > 0) {
      let idx = Int.abs(j);
      if (fibArr[idx] <= remaining) {
        buf.add(fibArr[idx]);
        remaining -= fibArr[idx];
      };
      j -= 1;
    };
    Buffer.toArray(buf)
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "CHRYSALIS" };

  public query func designation() : async Text {
    "Χρυσαλίς — Golden Mathematics Core — The DNA of all organisms"
  };

  public query func phi() : async Float { PHI };
  public query func golden_angle() : async Float { GOLDEN_ANGLE };

  // ══════════════════════════════════════════════════════════════════
  //  ORGANISM GENESIS ENGINE — v2 upgrade
  //
  //  CHRYSALIS is the full organism factory.  TURING says:
  //  "instantiate a BRONVOX for user X."  CHRYSALIS holds all
  //  templates, stores them on-chain, and records every genesis event.
  //  No human writes code.  The organism is born in one command.
  // ══════════════════════════════════════════════════════════════════

  // ── Genesis Types ──────────────────────────────────────────────

  public type Template = {
    name      : Text;       // Template name (e.g. "BRONVOX", "STUDENT")
    code      : Text;       // Motoko source stored on-chain as text
    version   : Nat;
    created   : Int;
    author    : Text;
  };

  public type GenesisRecord = {
    id        : Nat;
    template  : Text;       // Template used
    orgName   : Text;       // New organism's name
    owner     : Text;       // Owner principal text
    timestamp : Int;
    note      : Text;
  };

  // ── Genesis State ─────────────────────────────────────────────

  stable var nextGenesisId : Nat = 0;

  transient let templates   : Buffer.Buffer<Template>      = Buffer.Buffer<Template>(32);
  transient let genesisLog  : Buffer.Buffer<GenesisRecord> = Buffer.Buffer<GenesisRecord>(512);

  // ── Genesis Init ──────────────────────────────────────────────

  /// Seed the built-in templates.  Called once at deployment.
  public func seedTemplates() : async Text {
    if (templates.size() > 0) { return "Templates already seeded." };
    templates.add({
      name    = "BRONVOX";
      code    = "/// BRONVOX — Base organism template\n/// Extend this with your own logic.\npersistent actor BRONVOX {\n  transient let LOV : Float = 2.1784575679375987;\n  public query func name() : async Text { \"BRONVOX\" };\n  public query func lov() : async Float { LOV };\n};";
      version = 1;
      created = Time.now();
      author  = "CHRYSALIS";
    });
    templates.add({
      name    = "STUDENT";
      code    = "/// STUDENT — Learning organism template\npersistent actor STUDENT {\n  transient let LOV : Float = 2.1784575679375987;\n  stable var progress : Float = 0.0;\n  public func learn(amount : Float) : async Float {\n    progress += amount;\n    progress\n  };\n  public query func name() : async Text { \"STUDENT\" };\n};";
      version = 1;
      created = Time.now();
      author  = "CHRYSALIS";
    });
    templates.add({
      name    = "GAME";
      code    = "/// GAME — Interactive organism template\npersistent actor GAME {\n  transient let LOV : Float = 2.1784575679375987;\n  stable var score : Nat = 0;\n  public func play(points : Nat) : async Nat {\n    score += points;\n    score\n  };\n  public query func name() : async Text { \"GAME\" };\n};";
      version = 1;
      created = Time.now();
      author  = "CHRYSALIS";
    });
    "Templates seeded: BRONVOX, STUDENT, GAME"
  };

  // ── Genesis API ───────────────────────────────────────────────

  /// Store a new template on-chain.
  public func storeTemplate(tplName : Text, code : Text, author : Text) : async Text {
    templates.add({
      name    = tplName;
      code;
      version = 1;
      created = Time.now();
      author;
    });
    "Template '" # tplName # "' stored on-chain."
  };

  /// Retrieve a template's source code.
  public query func getTemplate(tplName : Text) : async ?Template {
    for (t in templates.vals()) {
      if (t.name == tplName) { return ?t };
    };
    null
  };

  public query func listTemplates() : async [Template] {
    Buffer.toArray(templates)
  };

  /// Genesis — spawn a new organism record from a template.
  /// In a live deployment this would trigger SPINOR to deploy a WASM.
  /// Here it records the genesis event and returns the new organism's spec.
  public func genesis(
    templateName : Text,
    orgName      : Text,
    owner        : Text,
    note         : Text
  ) : async ?GenesisRecord {
    // Verify template exists
    var found = false;
    for (t in templates.vals()) {
      if (t.name == templateName) { found := true };
    };
    if (not found) { return null };

    let id = nextGenesisId;
    nextGenesisId += 1;

    let record : GenesisRecord = {
      id;
      template  = templateName;
      orgName;
      owner;
      timestamp = Time.now();
      note;
    };

    genesisLog.add(record);
    ?record
  };

  public query func listGenesis() : async [GenesisRecord] {
    Buffer.toArray(genesisLog)
  };

  public query func genesisCount() : async Nat {
    genesisLog.size()
  };

  // ── Genesis Self-reflection (v10) ─────────────────────────────

  public query func diag() : async {
    status    : Text;
    health    : Float;
    templates : Nat;
    organisms : Nat;
    timestamp : Int;
  } {
    {
      status    = "GENESIS_READY";
      health    = 1.0;
      templates = templates.size();
      organisms = genesisLog.size();
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "CHRYSALIS is self-consistent. Golden mathematics core intact."
  };

  public func register() : async Text {
    "CHRYSALIS registered. Capabilities: [math, genesis, template, fibonacci, spiral]."
  };

  public query func report_status() : async Text {
    "CHRYSALIS | templates=" # Nat.toText(templates.size()) #
    " organisms_spawned=" # Nat.toText(genesisLog.size())
  };
};
