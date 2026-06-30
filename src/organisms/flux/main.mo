///
/// FLUX — State Transition Management Organism
///
/// "All things flow. FLUX manages the eternal dance of states,
///  ensuring smooth transitions and maintaining equilibrium."
///
/// FLUX implements state machine management and transition dynamics
/// using φ-weighted transition probabilities and Markov chain
/// mathematics for predicting and controlling state evolution.
///
/// Sub-models hosted:
///   TRANSITOR — State machine definition and execution
///   EQUILIBRIUM — Steady-state analysis and balancing
///
/// Mathematical Foundation:
///   - Markov transition: P(X_{n+1}|X_n) = T_{ij}
///   - Stationary distribution: πT = π
///   - Ergodic theorem: lim_{n→∞} T^n = Π (steady state)
///   - Entropy rate: H(X) = -Σπ_i Σ T_ij log(T_ij)
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Iter   "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Array  "mo:base/Array";

persistent actor Flux {

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

  // ── Sacred Constants ───────────────────────────────────────────────

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_INVERSE : Float = 0.6180339887498948482;
  transient let E : Float = 2.71828182845904523536;
  transient let LN2 : Float = 0.693147180559945309417;

  // ── Types ──────────────────────────────────────────────────────────

  public type StateType = {
    #Initial;       // Starting state
    #Intermediate;  // Regular state
    #Absorbing;     // Terminal/final state
    #Transient;     // Temporary state
    #Recurrent;     // Revisitable state
  };

  /// A state in a state machine
  public type State = {
    id          : Nat;
    machineId   : Nat;
    name        : Text;
    stateType   : StateType;
    data        : ?Text;        // Associated data
    entryCount  : Nat;          // Times entered
    totalTime   : Int;          // Total time spent (ns)
    active      : Bool;
    timestamp   : Int;
  };

  /// A transition between states
  public type Transition = {
    id          : Nat;
    machineId   : Nat;
    fromState   : Nat;
    toState     : Nat;
    probability : Float;        // Transition probability (0-1)
    weight      : Float;        // φ-weighted priority
    condition   : ?Text;        // Guard condition
    action      : ?Text;        // Action on transition
    count       : Nat;          // Times traversed
    active      : Bool;
  };

  /// A state machine
  public type StateMachine = {
    id            : Nat;
    name          : Text;
    states        : [Nat];      // State IDs
    transitions   : [Nat];      // Transition IDs
    currentState  : Nat;        // Current state ID
    history       : [Nat];      // Recent state history
    generation    : Nat;        // Evolution generation
    timestamp     : Int;
    active        : Bool;
  };

  /// Transition matrix (for Markov analysis)
  public type TransitionMatrix = {
    machineId    : Nat;
    stateCount   : Nat;
    matrix       : [[Float]];   // T[i][j] = P(j|i)
    stationary   : ?[Float];    // Stationary distribution π
    entropyRate  : Float;
  };

  /// Equilibrium analysis result
  public type EquilibriumAnalysis = {
    machineId        : Nat;
    isErgodic        : Bool;
    stationaryDist   : [Float];
    meanRecurrence   : [Float];  // Mean recurrence times
    entropyRate      : Float;
    convergenceRate  : Float;
  };

  /// State history entry
  public type HistoryEntry = {
    machineId   : Nat;
    fromState   : Nat;
    toState     : Nat;
    transitionId: Nat;
    timestamp   : Int;
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextMachineId    : Nat = 0;
  stable var nextStateId      : Nat = 0;
  stable var nextTransitionId : Nat = 0;
  stable var fluxEpoch        : Nat = 0;

  transient let machines    = Buffer.Buffer<StateMachine>(16);
  transient let states      = Buffer.Buffer<State>(64);
  transient let transitions = Buffer.Buffer<Transition>(128);
  transient let history     = Buffer.Buffer<HistoryEntry>(256);
  transient let fluxLog     = Buffer.Buffer<Text>(256);

  // ── SUB-MODEL: TRANSITOR ───────────────────────────────────────────

  /// Create a new state machine
  public func create_machine(name : Text) : async StateMachine {
    let id = nextMachineId;
    nextMachineId += 1;

    let machine : StateMachine = {
      id;
      name;
      states = [];
      transitions = [];
      currentState = 0;  // Will be set when states are added
      history = [];
      generation = 0;
      timestamp = Time.now();
      active = true;
    };

    machines.add(machine);
    fluxLog.add("TRANSITOR: Created machine '" # name # "' #" # Nat.toText(id));

    machine
  };

  /// Add a state to a machine
  public func add_state(
    machineId : Nat,
    name      : Text,
    stateType : StateType,
    data      : ?Text
  ) : async ?State {
    var machineIdx : ?Nat = null;
    for (i in Iter.range(0, machines.size() - 1)) {
      if (machines.get(i).id == machineId and machines.get(i).active) {
        machineIdx := ?i;
      };
    };

    switch (machineIdx) {
      case null { return null };
      case (?idx) {
        let stateId = nextStateId;
        nextStateId += 1;

        let state : State = {
          id = stateId;
          machineId;
          name;
          stateType;
          data;
          entryCount = 0;
          totalTime = 0;
          active = true;
          timestamp = Time.now();
        };

        states.add(state);

        // Update machine
        let m = machines.get(idx);
        let newStates = Buffer.fromArray<Nat>(m.states);
        newStates.add(stateId);

        // Set as current if initial or first state
        let newCurrent = if (stateType == #Initial or m.states.size() == 0) {
          stateId
        } else { m.currentState };

        machines.put(idx, {
          id = m.id;
          name = m.name;
          states = Buffer.toArray(newStates);
          transitions = m.transitions;
          currentState = newCurrent;
          history = m.history;
          generation = m.generation;
          timestamp = Time.now();
          active = true;
        });

        fluxLog.add("TRANSITOR: Added state '" # name # "' to machine #" #
                    Nat.toText(machineId));

        ?state
      };
    }
  };

  /// Add a transition between states
  public func add_transition(
    machineId   : Nat,
    fromState   : Nat,
    toState     : Nat,
    probability : Float,
    condition   : ?Text,
    action      : ?Text
  ) : async ?Transition {
    var machineIdx : ?Nat = null;
    for (i in Iter.range(0, machines.size() - 1)) {
      if (machines.get(i).id == machineId and machines.get(i).active) {
        machineIdx := ?i;
      };
    };

    switch (machineIdx) {
      case null { return null };
      case (?idx) {
        let transId = nextTransitionId;
        nextTransitionId += 1;

        // φ-weight based on probability
        let weight = probability * PHI_INVERSE + (1.0 - probability) * PHI_INVERSE * PHI_INVERSE;

        let trans : Transition = {
          id = transId;
          machineId;
          fromState;
          toState;
          probability = Float.min(1.0, Float.max(0.0, probability));
          weight;
          condition;
          action;
          count = 0;
          active = true;
        };

        transitions.add(trans);

        // Update machine
        let m = machines.get(idx);
        let newTrans = Buffer.fromArray<Nat>(m.transitions);
        newTrans.add(transId);

        machines.put(idx, {
          id = m.id;
          name = m.name;
          states = m.states;
          transitions = Buffer.toArray(newTrans);
          currentState = m.currentState;
          history = m.history;
          generation = m.generation;
          timestamp = Time.now();
          active = true;
        });

        fluxLog.add("TRANSITOR: Added transition " # Nat.toText(fromState) #
                    " → " # Nat.toText(toState) # " p=" # Float.toText(probability));

        ?trans
      };
    }
  };

  /// Execute a transition on a machine
  public func transition(machineId : Nat, transitionId : ?Nat) : async ?{
    fromState  : Nat;
    toState    : Nat;
    transition : Nat;
  } {
    var machineIdx : ?Nat = null;
    for (i in Iter.range(0, machines.size() - 1)) {
      if (machines.get(i).id == machineId and machines.get(i).active) {
        machineIdx := ?i;
      };
    };

    switch (machineIdx) {
      case null { return null };
      case (?idx) {
        let m = machines.get(idx);

        // Find valid transitions from current state
        let validTrans = Buffer.Buffer<Transition>(8);
        for (t in transitions.vals()) {
          if (t.machineId == machineId and t.fromState == m.currentState and t.active) {
            switch (transitionId) {
              case (?tid) { if (t.id == tid) { validTrans.add(t) } };
              case null { validTrans.add(t) };
            };
          };
        };

        if (validTrans.size() == 0) { return null };

        // Select transition (weighted by probability and φ)
        var selected : Transition = validTrans.get(0);
        var maxWeight : Float = 0.0;

        for (t in validTrans.vals()) {
          let effectiveWeight = t.probability * t.weight;
          if (effectiveWeight > maxWeight) {
            maxWeight := effectiveWeight;
            selected := t;
          };
        };

        // Execute transition
        let fromState = m.currentState;
        let toState = selected.toState;

        // Update transition count
        for (i in Iter.range(0, transitions.size() - 1)) {
          let t = transitions.get(i);
          if (t.id == selected.id) {
            transitions.put(i, {
              id = t.id;
              machineId = t.machineId;
              fromState = t.fromState;
              toState = t.toState;
              probability = t.probability;
              weight = t.weight;
              condition = t.condition;
              action = t.action;
              count = t.count + 1;
              active = true;
            });
          };
        };

        // Update state entry count
        for (i in Iter.range(0, states.size() - 1)) {
          let s = states.get(i);
          if (s.id == toState) {
            states.put(i, {
              id = s.id;
              machineId = s.machineId;
              name = s.name;
              stateType = s.stateType;
              data = s.data;
              entryCount = s.entryCount + 1;
              totalTime = s.totalTime;
              active = true;
              timestamp = Time.now();
            });
          };
        };

        // Update machine
        let newHistory = Buffer.fromArray<Nat>(m.history);
        newHistory.add(fromState);
        // Keep history bounded
        while (newHistory.size() > 100) {
          ignore newHistory.remove(0);
        };

        machines.put(idx, {
          id = m.id;
          name = m.name;
          states = m.states;
          transitions = m.transitions;
          currentState = toState;
          history = Buffer.toArray(newHistory);
          generation = m.generation + 1;
          timestamp = Time.now();
          active = true;
        });

        // Record in global history
        history.add({
          machineId;
          fromState;
          toState;
          transitionId = selected.id;
          timestamp = Time.now();
        });

        fluxLog.add("TRANSITOR: Machine #" # Nat.toText(machineId) #
                    " transitioned " # Nat.toText(fromState) # " → " # Nat.toText(toState));

        ?{
          fromState;
          toState;
          transition = selected.id;
        }
      };
    }
  };

  // ── SUB-MODEL: EQUILIBRIUM ─────────────────────────────────────────

  /// Build transition matrix for a machine
  public func build_matrix(machineId : Nat) : async ?TransitionMatrix {
    var machine : ?StateMachine = null;
    for (m in machines.vals()) {
      if (m.id == machineId and m.active) { machine := ?m };
    };

    switch (machine) {
      case null { return null };
      case (?m) {
        let n = m.states.size();
        if (n == 0) { return null };

        // Build state index mapping
        let stateToIdx = Buffer.Buffer<{state: Nat; idx: Nat}>(n);
        var idx : Nat = 0;
        for (sid in m.states.vals()) {
          stateToIdx.add({state = sid; idx});
          idx += 1;
        };

        // Initialize matrix with zeros
        let matrix = Array.init<[Float]>(n, Array.freeze(Array.init<Float>(n, 0.0)));

        // Fill in transition probabilities
        for (t in transitions.vals()) {
          if (t.machineId == machineId and t.active) {
            var fromIdx : ?Nat = null;
            var toIdx : ?Nat = null;
            for (si in stateToIdx.vals()) {
              if (si.state == t.fromState) { fromIdx := ?si.idx };
              if (si.state == t.toState) { toIdx := ?si.idx };
            };

            switch (fromIdx, toIdx) {
              case (?fi, ?ti) {
                let row = Array.thaw<Float>(matrix[fi]);
                row[ti] := t.probability;
                matrix[fi] := Array.freeze(row);
              };
              case _ {};
            };
          };
        };

        // Normalize rows
        for (i in Iter.range(0, n - 1)) {
          let row = Array.thaw<Float>(matrix[i]);
          var sum : Float = 0.0;
          for (v in row.vals()) { sum += v };
          if (sum > 0.0) {
            for (j in Iter.range(0, n - 1)) {
              row[j] := row[j] / sum;
            };
          };
          matrix[i] := Array.freeze(row);
        };

        // Calculate entropy rate
        var entropyRate : Float = 0.0;
        for (i in Iter.range(0, n - 1)) {
          for (j in Iter.range(0, n - 1)) {
            let p = matrix[i][j];
            if (p > 0.0) {
              entropyRate -= (1.0 / Float.fromInt(n)) * p * Float.log(p) / LN2;
            };
          };
        };

        ?{
          machineId;
          stateCount = n;
          matrix = Array.freeze(matrix);
          stationary = null;  // Calculated separately
          entropyRate;
        }
      };
    }
  };

  /// Analyze equilibrium/steady state
  public func analyze_equilibrium(machineId : Nat) : async ?EquilibriumAnalysis {
    let matrixResult = await build_matrix(machineId);

    switch (matrixResult) {
      case null { return null };
      case (?tm) {
        let n = tm.stateCount;
        if (n == 0) { return null };

        // Power iteration to find stationary distribution
        var pi = Array.init<Float>(n, 1.0 / Float.fromInt(n));  // Start uniform
        let maxIter : Nat = 100;
        var iter : Nat = 0;
        var converged = false;

        while (iter < maxIter and not converged) {
          let newPi = Array.init<Float>(n, 0.0);

          // π' = πT
          for (j in Iter.range(0, n - 1)) {
            var sum : Float = 0.0;
            for (i in Iter.range(0, n - 1)) {
              sum += pi[i] * tm.matrix[i][j];
            };
            newPi[j] := sum;
          };

          // Check convergence
          var maxDiff : Float = 0.0;
          for (i in Iter.range(0, n - 1)) {
            let diff = Float.abs(newPi[i] - pi[i]);
            if (diff > maxDiff) { maxDiff := diff };
          };

          if (maxDiff < 0.0001) { converged := true };

          pi := newPi;
          iter += 1;
        };

        // Check ergodicity (all states reachable from all states)
        var isErgodic = true;
        for (i in Iter.range(0, n - 1)) {
          var hasOutgoing = false;
          for (j in Iter.range(0, n - 1)) {
            if (tm.matrix[i][j] > 0.0) { hasOutgoing := true };
          };
          if (not hasOutgoing) { isErgodic := false };
        };

        // Calculate mean recurrence times: 1/π_i
        let meanRecurrence = Array.init<Float>(n, 0.0);
        for (i in Iter.range(0, n - 1)) {
          meanRecurrence[i] := if (pi[i] > 0.0) { 1.0 / pi[i] } else { 0.0 };
        };

        // Convergence rate (second largest eigenvalue approximation)
        let convergenceRate = Float.pow(PHI_INVERSE, Float.fromInt(iter));

        ?{
          machineId;
          isErgodic;
          stationaryDist = Array.freeze(pi);
          meanRecurrence = Array.freeze(meanRecurrence);
          entropyRate = tm.entropyRate;
          convergenceRate;
        }
      };
    }
  };

  // ── Queries ────────────────────────────────────────────────────────

  public query func list_machines() : async [StateMachine] {
    let active = Buffer.Buffer<StateMachine>(machines.size());
    for (m in machines.vals()) { if (m.active) { active.add(m) } };
    Buffer.toArray(active)
  };

  public query func list_states(machineId : Nat) : async [State] {
    let result = Buffer.Buffer<State>(states.size());
    for (s in states.vals()) {
      if (s.machineId == machineId and s.active) { result.add(s) };
    };
    Buffer.toArray(result)
  };

  public query func list_transitions(machineId : Nat) : async [Transition] {
    let result = Buffer.Buffer<Transition>(transitions.size());
    for (t in transitions.vals()) {
      if (t.machineId == machineId and t.active) { result.add(t) };
    };
    Buffer.toArray(result)
  };

  public query func get_current_state(machineId : Nat) : async ?State {
    for (m in machines.vals()) {
      if (m.id == machineId and m.active) {
        for (s in states.vals()) {
          if (s.id == m.currentState and s.active) { return ?s };
        };
      };
    };
    null
  };

  public query func flux_state() : async {
    machines    : Nat;
    states      : Nat;
    transitions : Nat;
    totalFlux   : Nat;
    epoch       : Nat;
  } {
    var activeMachines : Nat = 0;
    var activeStates : Nat = 0;
    var activeTransitions : Nat = 0;

    for (m in machines.vals()) { if (m.active) { activeMachines += 1 } };
    for (s in states.vals()) { if (s.active) { activeStates += 1 } };
    for (t in transitions.vals()) { if (t.active) { activeTransitions += 1 } };

    {
      machines = activeMachines;
      states = activeStates;
      transitions = activeTransitions;
      totalFlux = history.size();
      epoch = fluxEpoch;
    }
  };

  public query func get_flux_log() : async [Text] {
    Buffer.toArray(fluxLog)
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "FLUX" };

  public query func designation() : async Text {
    "State Transition Management — All things flow"
  };

  public func register() : async Text {
    "FLUX registered. Capabilities: [state-machines, transitions, markov-analysis, equilibrium]."
  };

  public query func diag() : async {
    status      : Text;
    health      : Float;
    machines    : Nat;
    transitions : Nat;
    timestamp   : Int;
  } {
    var activeMachines : Nat = 0;
    for (m in machines.vals()) { if (m.active) { activeMachines += 1 } };

    let health = if (activeMachines > 0) { PHI_INVERSE + 0.3 } else { 0.5 };

    {
      status = if (activeMachines > 0) "FLUX_FLOWING" else "FLUX_STATIC";
      health;
      machines = activeMachines;
      transitions = transitions.size();
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    fluxEpoch += 1;
    "FLUX heal: Flux epoch advanced to " # Nat.toText(fluxEpoch) # "."
  };

  public query func report_status() : async Text {
    var am : Nat = 0; var as_ : Nat = 0; var at : Nat = 0;
    for (m in machines.vals()) { if (m.active) { am += 1 } };
    for (s in states.vals()) { if (s.active) { as_ += 1 } };
    for (t in transitions.vals()) { if (t.active) { at += 1 } };

    "FLUX | machines=" # Nat.toText(am) #
    " states=" # Nat.toText(as_) #
    " transitions=" # Nat.toText(at) #
    " history=" # Nat.toText(history.size())
  };
};
