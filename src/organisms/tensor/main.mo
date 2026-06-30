///
/// TENSOR — Multi-Dimensional Data Transformation Organism
///
/// "Data flows through dimensions. TENSOR bends and shapes
///  information across the manifold of possibility."
///
/// TENSOR implements multi-dimensional data transformations using
/// tensor calculus and linear algebra. It performs operations
/// on n-dimensional arrays with φ-optimized algorithms.
///
/// Sub-models hosted:
///   MANIFOLD — Tensor creation and manipulation
///   TRANSFORM — Linear transformations and decompositions
///
/// Mathematical Foundation:
///   - Tensor product: A ⊗ B
///   - Einstein summation: C^i_j = A^i_k B^k_j
///   - SVD: A = UΣV^T
///   - Metric tensor: ds² = g_ij dx^i dx^j
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

persistent actor Tensor {

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
  transient let PI : Float = 3.14159265358979323846;
  transient let SQRT2 : Float = 1.41421356237309504880;

  // ── Types ──────────────────────────────────────────────────────────

  public type TensorRank = {
    #Scalar;    // Rank 0
    #Vector;    // Rank 1
    #Matrix;    // Rank 2
    #Tensor3;   // Rank 3
    #TensorN;   // Rank N
  };

  /// A tensor (n-dimensional array)
  public type TensorData = {
    id        : Nat;
    name      : Text;
    rank      : TensorRank;
    shape     : [Nat];        // Dimensions
    data      : [Float];      // Flattened data
    stride    : [Nat];        // Stride for indexing
    covariant : [Bool];       // Index variance (up/down)
    timestamp : Int;
    active    : Bool;
  };

  /// A linear transformation
  public type Transform = {
    id          : Nat;
    name        : Text;
    inputShape  : [Nat];
    outputShape : [Nat];
    matrix      : [Float];    // Transformation matrix (flattened)
    inverse     : ?[Float];   // Inverse if exists
    determinant : ?Float;
    timestamp   : Int;
  };

  /// Result of tensor operation
  public type TensorResult = {
    tensorId    : Nat;
    operation   : Text;
    inputIds    : [Nat];
    outputShape : [Nat];
    timestamp   : Int;
  };

  /// Decomposition result
  public type Decomposition = {
    id          : Nat;
    tensorId    : Nat;
    method      : DecompMethod;
    components  : [Nat];      // IDs of resulting tensors
    singular    : ?[Float];   // Singular values if SVD
    timestamp   : Int;
  };

  public type DecompMethod = {
    #SVD;       // Singular Value Decomposition
    #Eigen;     // Eigendecomposition
    #QR;        // QR decomposition
    #LU;        // LU decomposition
    #Cholesky;  // Cholesky decomposition
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextTensorId    : Nat = 0;
  stable var nextTransformId : Nat = 0;
  stable var nextDecompId    : Nat = 0;
  stable var tensorEpoch     : Nat = 0;

  transient let tensors        = Buffer.Buffer<TensorData>(32);
  transient let transforms     = Buffer.Buffer<Transform>(16);
  transient let decompositions = Buffer.Buffer<Decomposition>(16);
  transient let tensorLog      = Buffer.Buffer<Text>(256);

  // ── SUB-MODEL: MANIFOLD ────────────────────────────────────────────

  /// Create a tensor from data
  public func create_tensor(
    name   : Text,
    shape  : [Nat],
    data   : [Float]
  ) : async ?TensorData {
    // Validate shape matches data
    var totalSize : Nat = 1;
    for (dim in shape.vals()) { totalSize *= dim };

    if (totalSize != data.size()) { return null };

    let id = nextTensorId;
    nextTensorId += 1;

    // Calculate strides (row-major order)
    let stride = calculateStrides(shape);

    // Determine rank
    let rank = switch (shape.size()) {
      case 0 { #Scalar };
      case 1 { #Vector };
      case 2 { #Matrix };
      case 3 { #Tensor3 };
      case _ { #TensorN };
    };

    // Default all indices as contravariant (upper)
    let covariant = Array.tabulate<Bool>(shape.size(), func(_) { false });

    let tensor : TensorData = {
      id;
      name;
      rank;
      shape;
      data;
      stride;
      covariant;
      timestamp = Time.now();
      active = true;
    };

    tensors.add(tensor);
    tensorLog.add("MANIFOLD: Created tensor '" # name # "' shape=" #
                  shapeToText(shape));

    ?tensor
  };

  /// Create identity matrix of given size
  public func create_identity(name : Text, size : Nat) : async TensorData {
    let id = nextTensorId;
    nextTensorId += 1;

    let data = Array.tabulate<Float>(size * size, func(i) {
      let row = i / size;
      let col = i % size;
      if (row == col) { 1.0 } else { 0.0 }
    });

    let tensor : TensorData = {
      id;
      name;
      rank = #Matrix;
      shape = [size, size];
      data;
      stride = [size, 1];
      covariant = [false, true];  // Mixed tensor (1 up, 1 down)
      timestamp = Time.now();
      active = true;
    };

    tensors.add(tensor);
    tensorLog.add("MANIFOLD: Created identity '" # name # "' " # Nat.toText(size) # "×" # Nat.toText(size));

    tensor
  };

  /// Create diagonal tensor
  public func create_diagonal(name : Text, values : [Float]) : async TensorData {
    let id = nextTensorId;
    nextTensorId += 1;

    let size = values.size();
    let data = Array.tabulate<Float>(size * size, func(i) {
      let row = i / size;
      let col = i % size;
      if (row == col) { values[row] } else { 0.0 }
    });

    let tensor : TensorData = {
      id;
      name;
      rank = #Matrix;
      shape = [size, size];
      data;
      stride = [size, 1];
      covariant = [false, true];
      timestamp = Time.now();
      active = true;
    };

    tensors.add(tensor);
    tensorLog.add("MANIFOLD: Created diagonal '" # name # "'");

    tensor
  };

  /// Get element at index
  public query func get_element(tensorId : Nat, indices : [Nat]) : async ?Float {
    for (t in tensors.vals()) {
      if (t.id == tensorId and t.active) {
        if (indices.size() != t.shape.size()) { return null };

        // Calculate flat index using strides
        var flatIdx : Nat = 0;
        for (i in Iter.range(0, indices.size() - 1)) {
          if (indices[i] >= t.shape[i]) { return null };
          flatIdx += indices[i] * t.stride[i];
        };

        if (flatIdx < t.data.size()) {
          return ?t.data[flatIdx];
        };
      };
    };
    null
  };

  // ── SUB-MODEL: TRANSFORM ───────────────────────────────────────────

  /// Matrix multiplication (tensor contraction)
  public func matmul(tensorId1 : Nat, tensorId2 : Nat) : async ?TensorData {
    var t1 : ?TensorData = null;
    var t2 : ?TensorData = null;

    for (t in tensors.vals()) {
      if (t.id == tensorId1 and t.active) { t1 := ?t };
      if (t.id == tensorId2 and t.active) { t2 := ?t };
    };

    switch (t1, t2) {
      case (?a, ?b) {
        // Check dimensions for multiplication
        if (a.shape.size() < 2 or b.shape.size() < 2) { return null };
        if (a.shape[a.shape.size() - 1] != b.shape[0]) { return null };

        let m = a.shape[0];
        let n = b.shape[b.shape.size() - 1];
        let k = a.shape[a.shape.size() - 1];

        // Perform multiplication
        let resultData = Array.init<Float>(m * n, 0.0);
        for (i in Iter.range(0, m - 1)) {
          for (j in Iter.range(0, n - 1)) {
            var sum : Float = 0.0;
            for (l in Iter.range(0, k - 1)) {
              sum += a.data[i * k + l] * b.data[l * n + j];
            };
            resultData[i * n + j] := sum;
          };
        };

        let id = nextTensorId;
        nextTensorId += 1;

        let result : TensorData = {
          id;
          name = a.name # " × " # b.name;
          rank = #Matrix;
          shape = [m, n];
          data = Array.freeze(resultData);
          stride = [n, 1];
          covariant = [false, true];
          timestamp = Time.now();
          active = true;
        };

        tensors.add(result);
        tensorLog.add("TRANSFORM: Matmul " # Nat.toText(tensorId1) #
                      " × " # Nat.toText(tensorId2) # " → #" # Nat.toText(id));

        ?result
      };
      case _ { null };
    }
  };

  /// Transpose a matrix (swap indices)
  public func transpose(tensorId : Nat) : async ?TensorData {
    for (t in tensors.vals()) {
      if (t.id == tensorId and t.active and t.shape.size() == 2) {
        let m = t.shape[0];
        let n = t.shape[1];

        let resultData = Array.tabulate<Float>(m * n, func(i) {
          let newRow = i / m;  // swapped
          let newCol = i % m;
          t.data[newCol * n + newRow]  // read from original position
        });

        let id = nextTensorId;
        nextTensorId += 1;

        let result : TensorData = {
          id;
          name = t.name # "ᵀ";
          rank = #Matrix;
          shape = [n, m];  // swapped
          data = resultData;
          stride = [m, 1];
          covariant = [t.covariant[1], t.covariant[0]];  // swap variance
          timestamp = Time.now();
          active = true;
        };

        tensors.add(result);
        tensorLog.add("TRANSFORM: Transposed #" # Nat.toText(tensorId) #
                      " → #" # Nat.toText(id));

        return ?result;
      };
    };
    null
  };

  /// Scale tensor by scalar
  public func scale(tensorId : Nat, scalar : Float) : async ?TensorData {
    for (t in tensors.vals()) {
      if (t.id == tensorId and t.active) {
        let resultData = Array.tabulate<Float>(t.data.size(), func(i) {
          t.data[i] * scalar
        });

        let id = nextTensorId;
        nextTensorId += 1;

        let result : TensorData = {
          id;
          name = Float.toText(scalar) # " · " # t.name;
          rank = t.rank;
          shape = t.shape;
          data = resultData;
          stride = t.stride;
          covariant = t.covariant;
          timestamp = Time.now();
          active = true;
        };

        tensors.add(result);
        tensorLog.add("TRANSFORM: Scaled #" # Nat.toText(tensorId) #
                      " by " # Float.toText(scalar));

        return ?result;
      };
    };
    null
  };

  /// Add two tensors of same shape
  public func add_tensors(tensorId1 : Nat, tensorId2 : Nat) : async ?TensorData {
    var t1 : ?TensorData = null;
    var t2 : ?TensorData = null;

    for (t in tensors.vals()) {
      if (t.id == tensorId1 and t.active) { t1 := ?t };
      if (t.id == tensorId2 and t.active) { t2 := ?t };
    };

    switch (t1, t2) {
      case (?a, ?b) {
        // Check shapes match
        if (a.shape.size() != b.shape.size()) { return null };
        for (i in Iter.range(0, a.shape.size() - 1)) {
          if (a.shape[i] != b.shape[i]) { return null };
        };

        let resultData = Array.tabulate<Float>(a.data.size(), func(i) {
          a.data[i] + b.data[i]
        });

        let id = nextTensorId;
        nextTensorId += 1;

        let result : TensorData = {
          id;
          name = a.name # " + " # b.name;
          rank = a.rank;
          shape = a.shape;
          data = resultData;
          stride = a.stride;
          covariant = a.covariant;
          timestamp = Time.now();
          active = true;
        };

        tensors.add(result);
        tensorLog.add("TRANSFORM: Added #" # Nat.toText(tensorId1) #
                      " + #" # Nat.toText(tensorId2));

        ?result
      };
      case _ { null };
    }
  };

  /// Calculate Frobenius norm
  public func frobenius_norm(tensorId : Nat) : async ?Float {
    for (t in tensors.vals()) {
      if (t.id == tensorId and t.active) {
        var sumSquares : Float = 0.0;
        for (x in t.data.vals()) {
          sumSquares += x * x;
        };
        return ?Float.sqrt(sumSquares);
      };
    };
    null
  };

  /// Calculate trace (sum of diagonal elements)
  public func trace(tensorId : Nat) : async ?Float {
    for (t in tensors.vals()) {
      if (t.id == tensorId and t.active and t.shape.size() == 2) {
        let n = Nat.min(t.shape[0], t.shape[1]);
        var tr : Float = 0.0;
        for (i in Iter.range(0, n - 1)) {
          tr += t.data[i * t.shape[1] + i];
        };
        return ?tr;
      };
    };
    null
  };

  /// Simplified SVD (power iteration for largest singular value)
  public func power_iteration_svd(tensorId : Nat, iterations : Nat) : async ?{
    largestSingular : Float;
    leftVector      : [Float];
    rightVector     : [Float];
  } {
    for (t in tensors.vals()) {
      if (t.id == tensorId and t.active and t.shape.size() == 2) {
        let m = t.shape[0];
        let n = t.shape[1];

        // Initialize random vector
        var v = Array.tabulate<Float>(n, func(i) {
          Float.sin(Float.fromInt(i + 1) * PHI)
        });

        // Normalize
        var norm : Float = 0.0;
        for (x in v.vals()) { norm += x * x };
        norm := Float.sqrt(norm);
        v := Array.tabulate<Float>(n, func(i) { v[i] / norm });

        // Power iteration
        var sigma : Float = 0.0;
        var u = Array.init<Float>(m, 0.0);

        for (_ in Iter.range(0, iterations - 1)) {
          // u = A·v
          for (i in Iter.range(0, m - 1)) {
            var sum : Float = 0.0;
            for (j in Iter.range(0, n - 1)) {
              sum += t.data[i * n + j] * v[j];
            };
            u[i] := sum;
          };

          // Normalize u
          sigma := 0.0;
          for (x in u.vals()) { sigma += x * x };
          sigma := Float.sqrt(sigma);
          if (sigma > 0.0) {
            for (i in Iter.range(0, m - 1)) {
              u[i] := u[i] / sigma;
            };
          };

          // v = Aᵀ·u
          let newV = Array.init<Float>(n, 0.0);
          for (j in Iter.range(0, n - 1)) {
            var sum : Float = 0.0;
            for (i in Iter.range(0, m - 1)) {
              sum += t.data[i * n + j] * u[i];
            };
            newV[j] := sum;
          };

          // Normalize v
          norm := 0.0;
          for (x in newV.vals()) { norm += x * x };
          norm := Float.sqrt(norm);
          if (norm > 0.0) {
            v := Array.tabulate<Float>(n, func(i) { newV[i] / norm });
          } else {
            v := Array.freeze(newV);
          };
        };

        return ?{
          largestSingular = sigma;
          leftVector = Array.freeze(u);
          rightVector = v;
        };
      };
    };
    null
  };

  // ── Helper Functions ───────────────────────────────────────────────

  func calculateStrides(shape : [Nat]) : [Nat] {
    let n = shape.size();
    if (n == 0) { return [] };

    let strides = Array.init<Nat>(n, 1);
    var i = n - 1;
    while (i > 0) {
      strides[i - 1] := strides[i] * shape[i];
      i -= 1;
    };
    Array.freeze(strides)
  };

  func shapeToText(shape : [Nat]) : Text {
    var result = "[";
    for (i in Iter.range(0, shape.size() - 1)) {
      if (i > 0) { result #= ", " };
      result #= Nat.toText(shape[i]);
    };
    result # "]"
  };

  // ── Queries ────────────────────────────────────────────────────────

  public query func list_tensors() : async [TensorData] {
    let active = Buffer.Buffer<TensorData>(tensors.size());
    for (t in tensors.vals()) { if (t.active) { active.add(t) } };
    Buffer.toArray(active)
  };

  public query func get_tensor(tensorId : Nat) : async ?TensorData {
    for (t in tensors.vals()) {
      if (t.id == tensorId and t.active) { return ?t };
    };
    null
  };

  public query func list_transforms() : async [Transform] {
    Buffer.toArray(transforms)
  };

  public query func tensor_state() : async {
    tensors   : Nat;
    transforms: Nat;
    decomps   : Nat;
    epoch     : Nat;
  } {
    var activeTensors : Nat = 0;
    for (t in tensors.vals()) { if (t.active) { activeTensors += 1 } };

    {
      tensors = activeTensors;
      transforms = transforms.size();
      decomps = decompositions.size();
      epoch = tensorEpoch;
    }
  };

  public query func get_tensor_log() : async [Text] {
    Buffer.toArray(tensorLog)
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "TENSOR" };

  public query func designation() : async Text {
    "Multi-Dimensional Data Transformation — Data flows through dimensions"
  };

  public func register() : async Text {
    "TENSOR registered. Capabilities: [tensor-ops, linear-algebra, svd, transformations]."
  };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    tensors   : Nat;
    timestamp : Int;
  } {
    var activeTensors : Nat = 0;
    for (t in tensors.vals()) { if (t.active) { activeTensors += 1 } };

    let health = if (activeTensors > 0) { PHI_INVERSE + 0.3 } else { 0.5 };

    {
      status = if (activeTensors > 0) "TENSOR_ACTIVE" else "TENSOR_IDLE";
      health;
      tensors = activeTensors;
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    tensorEpoch += 1;
    "TENSOR heal: Tensor epoch advanced to " # Nat.toText(tensorEpoch) # "."
  };

  public query func report_status() : async Text {
    var at : Nat = 0;
    for (t in tensors.vals()) { if (t.active) { at += 1 } };
    "TENSOR | tensors=" # Nat.toText(at) #
    " transforms=" # Nat.toText(transforms.size()) #
    " decomps=" # Nat.toText(decompositions.size())
  };
};
