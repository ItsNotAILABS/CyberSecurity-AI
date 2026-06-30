///
/// DIGITAL QUIPU v2 — Journal Substrate Types
///
/// "The quipu was memory, structure, narrative, protocol, synchronization,
///  reflection, and computation all in one."
///
/// This module implements the Digital Quipu system for Parallax — the
/// reflective journal substrate where raw thought, pattern, and emergence
/// are captured before they become structure.
///
/// Based on Inca quipu system:
///   — ROOT NODE (main cord): entry identity
///   — PENDANT NODES: primary fields (intent, observation, pattern, etc.)
///   — SUBSIDIARY NODES: nested structures
///   — KNOT TYPES: operators (single, long, figure-eight, loop, cluster, spiral)
///   — KNOT POSITION: decimal positional system
///   — COLOR SEMANTICS: type system (red=conflict, blue=data, yellow=insight, etc.)
///   — TWIST DIRECTION: metadata (S-twist=agent, Z-twist=human, etc.)
///
/// The Digital Quipu is:
///   — Readable:  Query entries by ID, agent, time range
///   — Writable:  Record new entries (agents, engines, humans)
///   — Mergeable: Combine related entries
///   — Auditable: Track all modifications
///   — Executable: Entries can trigger actions
///

import Time   "mo:base/Time";
import Nat    "mo:base/Nat";
import Float  "mo:base/Float";
import Text   "mo:base/Text";
import Array  "mo:base/Array";

module {

  // ══════════════════════════════════════════════════════════════════
  //  KNOT TYPES (Operators)
  // ══════════════════════════════════════════════════════════════════

  /// Knot type encodes the operation or structure of the data
  public type KnotType = {
    #Single;        // Simple value (scalar)
    #Long;          // List/array (multiple values)
    #FigureEight;   // Conflict/contradiction (two opposing values)
    #Loop;          // Recursion/cycle (self-referential)
    #Cluster;       // Synthesis (multiple values combined)
    #Spiral;        // Void insight (emerging pattern not yet structured)
  };

  // ══════════════════════════════════════════════════════════════════
  //  COLOR SEMANTICS (Type System)
  // ══════════════════════════════════════════════════════════════════

  /// Color encodes the semantic type of information
  public type ColorSemantic = {
    #Red;       // Conflict, error, anomaly
    #Blue;      // Data, observation, fact
    #Yellow;    // Insight, understanding, pattern
    #Green;     // Resolution, success, completion
    #Black;     // Anomaly, unknown, void
    #White;     // Synthesis, integration, whole
    #Violet;    // Void-layer signal (pre-structural emergence)
  };

  // ══════════════════════════════════════════════════════════════════
  //  TWIST DIRECTION (Metadata)
  // ══════════════════════════════════════════════════════════════════

  /// Twist direction encodes the source/origin of the data
  public type TwistDirection = {
    #S;      // S-twist: agent-generated
    #Z;      // Z-twist: human-generated
    #SZ;     // SZ-twist: hybrid (agent + human)
    #SSZ;    // SSZ-twist: Engine-generated (Architectonic, Julia, etc.)
  };

  // ══════════════════════════════════════════════════════════════════
  //  KNOT (Atomic Data Unit)
  // ══════════════════════════════════════════════════════════════════

  /// A knot is the atomic unit of data in the quipu
  /// It encodes value, position, color, and twist direction
  public type Knot = {
    knotType  : KnotType;
    position  : Nat;            // Decimal position (1=units, 2=tens, 3=hundreds, etc.)
    value     : Text;           // Encoded value (JSON string for complex types)
    color     : ColorSemantic;
    twist     : TwistDirection;
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUBSIDIARY NODE (Nested Structure)
  // ══════════════════════════════════════════════════════════════════

  /// Subsidiary nodes hang from pendant nodes to encode nested structures
  public type SubsidiaryNode = {
    field  : Text;              // Field name (e.g., "sub_pattern", "sub_error")
    knots  : [Knot];            // Knots encoding the subsidiary data
  };

  // ══════════════════════════════════════════════════════════════════
  //  PENDANT NODE (Primary Field)
  // ══════════════════════════════════════════════════════════════════

  /// Pendant nodes are the primary fields of a quipu entry
  /// Each pendant node can have subsidiary nodes for nested structures
  public type PendantNode = {
    field        : Text;              // Field name (intent, observation, pattern, etc.)
    knots        : [Knot];            // Knots encoding the field value
    subsidiaries : [SubsidiaryNode];  // Nested structures
  };

  // ══════════════════════════════════════════════════════════════════
  //  ROOT NODE (Main Cord / Entry Identity)
  // ══════════════════════════════════════════════════════════════════

  /// The root node is the main cord from which all pendant nodes hang
  /// It represents the identity and context of a single quipu entry
  public type RootNode = {
    entry_id       : Text;            // Unique identifier (e.g., "quipu-2026-05-03-1234567890")
    agent_cluster  : Text;            // Which agent/organism created this (e.g., "terminal", "architect")
    engine_state   : Text;            // Which engine was active (e.g., "julia/biorhythm", "julia/law")
    timestamp      : Int;             // Nanoseconds since epoch
    context        : Text;            // High-level context (e.g., "governance_review", "build_observation")
    version        : Nat;             // Quipu schema version
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUIPU ENTRY (Complete Structure)
  // ══════════════════════════════════════════════════════════════════

  /// A complete quipu entry is a root node with pendant nodes
  /// This is the journal substrate record
  public type QuipuEntry = {
    root     : RootNode;
    pendants : [PendantNode];
    phi_weight : Float;           // φ-weighting for importance (0.0 to 1.0)
    biorhythm  : Float;           // Biorhythm at time of creation (0.0 to 1.0)
    merged_from : [Text];         // IDs of entries merged into this one
    audit_trail : [AuditRecord];  // Modification history
  };

  // ══════════════════════════════════════════════════════════════════
  //  AUDIT RECORD (Modification History)
  // ══════════════════════════════════════════════════════════════════

  /// Audit records track all modifications to a quipu entry
  public type AuditRecord = {
    timestamp     : Int;
    operation     : AuditOperation;
    principal     : Text;           // Who made the change
    agent_cluster : Text;           // Which agent made the change (if applicable)
    description   : Text;           // Human-readable description
  };

  public type AuditOperation = {
    #Created;
    #Modified;
    #Merged;
    #Executed;
    #Archived;
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERY FILTERS
  // ══════════════════════════════════════════════════════════════════

  /// Filter for querying quipu entries
  public type QuipuFilter = {
    agent_cluster  : ?Text;           // Filter by agent (e.g., "terminal")
    engine_state   : ?Text;           // Filter by engine (e.g., "julia/biorhythm")
    context        : ?Text;           // Filter by context (e.g., "governance_review")
    color          : ?ColorSemantic;  // Filter by dominant color
    twist          : ?TwistDirection; // Filter by source type
    time_start     : ?Int;            // Start timestamp (inclusive)
    time_end       : ?Int;            // End timestamp (inclusive)
    phi_min        : ?Float;          // Min φ-weight
    phi_max        : ?Float;          // Max φ-weight
  };

  // ══════════════════════════════════════════════════════════════════
  //  EXECUTION CONTEXT
  // ══════════════════════════════════════════════════════════════════

  /// Context for executing a quipu entry
  /// Some quipu entries are executable (e.g., "decision" entries that trigger actions)
  public type ExecutionContext = {
    executor       : Text;            // Principal executing the entry
    dry_run        : Bool;            // If true, don't actually execute (simulation)
    parameters     : [(Text, Text)];  // Key-value parameters for execution
  };

  public type ExecutionResult = {
    success        : Bool;
    output         : Text;            // Execution output (JSON or text)
    modifications  : [Text];          // List of quipu entry IDs modified by execution
    errors         : [Text];          // Error messages (if any)
    timestamp      : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  MERGE STRATEGY
  // ══════════════════════════════════════════════════════════════════

  /// Strategy for merging multiple quipu entries
  public type MergeStrategy = {
    #Append;        // Append pendant nodes from all entries
    #Synthesize;    // Create a new synthesis entry (cluster knot)
    #Latest;        // Keep only the latest values per field
    #PhiWeighted;   // Weight values by φ-weight
  };

  // ══════════════════════════════════════════════════════════════════
  //  HELPER FUNCTIONS
  // ══════════════════════════════════════════════════════════════════

  public func knotTypeText(kt : KnotType) : Text {
    switch kt {
      case (#Single)       "single";
      case (#Long)         "long";
      case (#FigureEight)  "figure_eight";
      case (#Loop)         "loop";
      case (#Cluster)      "cluster";
      case (#Spiral)       "spiral";
    }
  };

  public func colorSemanticText(c : ColorSemantic) : Text {
    switch c {
      case (#Red)     "red";
      case (#Blue)    "blue";
      case (#Yellow)  "yellow";
      case (#Green)   "green";
      case (#Black)   "black";
      case (#White)   "white";
      case (#Violet)  "violet";
    }
  };

  public func twistDirectionText(t : TwistDirection) : Text {
    switch t {
      case (#S)   "S";
      case (#Z)   "Z";
      case (#SZ)  "SZ";
      case (#SSZ) "SSZ";
    }
  };

  public func auditOperationText(op : AuditOperation) : Text {
    switch op {
      case (#Created)  "created";
      case (#Modified) "modified";
      case (#Merged)   "merged";
      case (#Executed) "executed";
      case (#Archived) "archived";
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  PENDANT NODE BUILDERS (Convenience Constructors)
  // ══════════════════════════════════════════════════════════════════

  /// Create a simple pendant node with a single knot (no subsidiaries)
  public func simplePendant(
    field : Text,
    value : Text,
    color : ColorSemantic,
    twist : TwistDirection
  ) : PendantNode {
    {
      field;
      knots = [{
        knotType  = #Single;
        position  = 1;
        value;
        color;
        twist;
      }];
      subsidiaries = [];
    }
  };

  /// Create a list pendant node (long knot)
  public func listPendant(
    field  : Text,
    values : [Text],
    color  : ColorSemantic,
    twist  : TwistDirection
  ) : PendantNode {
    {
      field;
      knots = [{
        knotType  = #Long;
        position  = 1;
        value     = Text.join(", ", values.vals());
        color;
        twist;
      }];
      subsidiaries = [];
    }
  };

  /// Create a conflict pendant node (figure-eight knot)
  public func conflictPendant(
    field   : Text,
    value1  : Text,
    value2  : Text,
    color   : ColorSemantic,
    twist   : TwistDirection
  ) : PendantNode {
    {
      field;
      knots = [{
        knotType  = #FigureEight;
        position  = 1;
        value     = value1 # " ⟷ " # value2;
        color;
        twist;
      }];
      subsidiaries = [];
    }
  };

  /// Create a void signal pendant node (spiral knot)
  public func voidSignalPendant(
    field : Text,
    value : Text,
    twist : TwistDirection
  ) : PendantNode {
    {
      field;
      knots = [{
        knotType  = #Spiral;
        position  = 1;
        value;
        color     = #Violet;
        twist;
      }];
      subsidiaries = [];
    }
  };

}
