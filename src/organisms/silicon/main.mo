///
/// SILICON (SI-14) — Silicon Canister — Compute Substrate
///
/// Silicon IS computing. Every processor, every chip, every
/// semiconductor is silicon. This canister IS silicon — it provides
/// the raw computational substrate for all digital intelligence.
///
/// Element Properties:
///   Atomic Number: 14
///   Atomic Weight: 28.086
///   Density: 2.33 g/cm³
///   Electron Config: [Ne] 3s2 3p2
///   Orbitals: 3
///   Conductivity: 0.00001 (semiconductor)
///   Melting Point: 1687 K
///
/// Canister Type: COMPUTE
/// φ-Weight: 28.086 × φ^3 = 118.88
/// Fibonacci Identity: fib(14 mod 20) = 377
///
/// Mathematical Formula:
///   E(x) = Z × φ^orbitals × density × log(gates)
///   E(x) = 14 × φ^3 × 2.33 × log(gates)
///
/// Purpose: Raw computation substrate. Gate-level operations.
///          The silicon that makes everything think.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";

persistent actor Silicon {

  // ── Element Constants ──────────────────────────────────────────────

  transient let ATOMIC_NUMBER : Nat = 14;
  transient let ATOMIC_WEIGHT : Float = 28.086;
  transient let DENSITY : Float = 2.33;
  transient let ORBITALS : Nat = 3;
  transient let CONDUCTIVITY : Float = 0.00001;  // Semiconductor
  transient let MELTING_POINT : Float = 1687.0;

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_WEIGHT : Float = 118.88;
  transient let FIB_IDENTITY : Nat = 377;

  // ── Types ──────────────────────────────────────────────────────────

  public type ComputeJob = {
    jobId       : Nat;
    operation   : Text;
    input       : Text;
    gateCount   : Nat;       // Number of logical gates used
    cyclesUsed  : Nat;
    result      : ?Text;
    startTime   : Int;
    endTime     : ?Int;
    status      : JobStatus;
  };

  public type JobStatus = {
    #Queued;
    #Computing;
    #Complete;
    #Failed;
  };

  public type ComputeMetrics = {
    total_jobs       : Nat;
    total_gates      : Nat;
    total_cycles     : Nat;
    avg_gate_per_job : Float;
    compute_efficiency: Float;
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextJobId    : Nat = 0;
  stable var totalJobs    : Nat = 0;
  stable var totalGates   : Nat = 0;
  stable var totalCycles  : Nat = 0;

  transient let jobQueue    = Buffer.Buffer<ComputeJob>(256);
  transient let completedJobs = Buffer.Buffer<ComputeJob>(512);

  // ── Core Functions ─────────────────────────────────────────────────

  /// Submit compute job
  public func submit_job(
    operation : Text,
    input     : Text,
    gateCount : Nat
  ) : async ComputeJob {
    let jobId = nextJobId;
    nextJobId += 1;
    totalJobs += 1;
    totalGates += gateCount;

    let job : ComputeJob = {
      jobId;
      operation;
      input;
      gateCount;
      cyclesUsed = 0;
      result = null;
      startTime = Time.now();
      endTime = null;
      status = #Queued;
    };

    jobQueue.add(job);
    job
  };

  /// Execute compute job
  public func execute_job(jobId : Nat, result : Text, cycles : Nat) : async Bool {
    let size = jobQueue.size();
    var i : Nat = 0;
    while (i < size) {
      let job = jobQueue.get(i);
      if (job.jobId == jobId) {
        totalCycles += cycles;

        let completed : ComputeJob = {
          jobId       = job.jobId;
          operation   = job.operation;
          input       = job.input;
          gateCount   = job.gateCount;
          cyclesUsed  = cycles;
          result      = ?result;
          startTime   = job.startTime;
          endTime     = ?Time.now();
          status      = #Complete;
        };

        completedJobs.add(completed);
        jobQueue.put(i, completed);
        return true;
      };
      i += 1;
    };
    false
  };

  /// Calculate compute energy
  public func compute_energy(input : Text, gates : Nat) : async Float {
    let inputFactor = Float.fromInt(input.size());
    let gateFactor = Float.log(Float.fromInt(gates + 1));
    // E(x) = Z × φ^orbitals × density × log(gates) × inputFactor
    let energy = Float.fromInt(ATOMIC_NUMBER) * Float.pow(PHI, Float.fromInt(ORBITALS)) *
                 DENSITY * gateFactor * inputFactor;
    energy
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// Get job by ID
  public query func get_job(id : Nat) : async ?ComputeJob {
    let qSize = jobQueue.size();
    var i : Nat = 0;
    while (i < qSize) {
      let job = jobQueue.get(i);
      if (job.jobId == id) { return ?job };
      i += 1;
    };

    let cSize = completedJobs.size();
    i := 0;
    while (i < cSize) {
      let job = completedJobs.get(i);
      if (job.jobId == id) { return ?job };
      i += 1;
    };

    null
  };

  /// Get pending jobs
  public query func pending_jobs() : async [ComputeJob] {
    let buf = Buffer.Buffer<ComputeJob>(jobQueue.size());
    let size = jobQueue.size();
    var i : Nat = 0;
    while (i < size) {
      let job = jobQueue.get(i);
      switch (job.status) {
        case (#Queued) { buf.add(job) };
        case (#Computing) { buf.add(job) };
        case _ {};
      };
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// Compute metrics
  public query func compute_metrics() : async ComputeMetrics {
    let avgGates = if (totalJobs > 0) {
      Float.fromInt(totalGates) / Float.fromInt(totalJobs)
    } else { 0.0 };

    let efficiency = if (totalCycles > 0) {
      Float.fromInt(totalGates) / Float.fromInt(totalCycles)
    } else { 0.0 };

    {
      total_jobs        = totalJobs;
      total_gates       = totalGates;
      total_cycles      = totalCycles;
      avg_gate_per_job  = avgGates;
      compute_efficiency= efficiency;
    }
  };

  /// Element properties
  public query func element_properties() : async {
    atomicNumber : Nat;
    atomicWeight : Float;
    density      : Float;
    orbitals     : Nat;
    conductivity : Float;
    phiWeight    : Float;
    fibIdentity  : Nat;
  } {
    {
      atomicNumber = ATOMIC_NUMBER;
      atomicWeight = ATOMIC_WEIGHT;
      density      = DENSITY;
      orbitals     = ORBITALS;
      conductivity = CONDUCTIVITY;
      phiWeight    = PHI_WEIGHT;
      fibIdentity  = FIB_IDENTITY;
    }
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "SILICON" };
  public query func symbol() : async Text { "SI" };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    name      : Text;
    timestamp : Int;
  } {
    {
      status    = "COMPUTING";
      health    = 1.0;
      name      = "SILICON (SI-14)";
      timestamp = Time.now();
    }
  };

  public query func designation() : async Text {
    "Silicon Canister — Compute Substrate — The Element That Makes Computers Think"
  };
};
