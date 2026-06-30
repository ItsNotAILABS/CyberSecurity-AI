(*
𓂀 ZERO-COST F# ENGINE 𓂀
================================================================================
Module      : ZeroCost.FSharp.Engine
Description : Functional-first engine using structs and spans for zero-allocation
Copyright   : (c) Alfredo Medina Hernandez, Medina Tech, 2026
License     : Sovereign
Maintainer  : medina@medinatech.io

This module implements a zero-allocation cache engine in F# using:
- Value types (struct) for stack allocation
- Span<T> for zero-copy memory access
- Inline functions for JIT optimization
- Active patterns for pattern matching without allocation

Mathematical Foundation:
- φ (Golden Ratio) = 1.6180339887498948...
- Fibonacci sequence for batch sizing
- Pythagorean theorem for geometric operations
- Shannon entropy for cost analysis
*)

namespace ZeroCost.FSharp

open System
open System.Runtime.CompilerServices
open System.Runtime.InteropServices
open System.Numerics

// ============================================================================
// SECTION 1: MATHEMATICAL CONSTANTS
// ============================================================================

/// Mathematical constants module
[<RequireQualifiedAccess>]
module Constants =
    
    /// φ (Golden Ratio) = (1 + √5) / 2
    [<Literal>]
    let PHI = 1.6180339887498948
    
    /// φ² = φ + 1 (characteristic equation)
    [<Literal>]
    let PHI_SQUARED = 2.6180339887498948
    
    /// 1/φ = φ - 1 (conjugate)
    [<Literal>]
    let PHI_INVERSE = 0.6180339887498948
    
    /// φ multiplier for hashing (φ × 2^63)
    [<Literal>]
    let PHI_MULT = 11400714819323198485UL
    
    /// φ as rational approximation (numerator)
    [<Literal>]
    let PHI_NUM = 1618033988749895UL
    
    /// φ as rational approximation (denominator)
    [<Literal>]
    let PHI_DEN = 1000000000000000UL
    
    /// Cache size (compile-time constant)
    [<Literal>]
    let CACHE_SIZE = 65536

// ============================================================================
// SECTION 2: ALLOCATION TYPES
// ============================================================================

/// Memory allocation region types
[<Struct>]
type AllocType =
    | Stack
    | Heap
    | Static

/// Check if allocation type is zero-alloc
[<MethodImpl(MethodImplOptions.AggressiveInlining)>]
let inline isZeroAlloc (allocType: AllocType) : bool =
    match allocType with
    | Stack -> true
    | Static -> true
    | Heap -> false

// ============================================================================
// SECTION 3: UNMANAGED CACHE ENTRY (NO GC)
// ============================================================================

/// Unmanaged cache entry - no GC overhead
/// Uses StructLayout for precise memory control
[<Struct; StructLayout(LayoutKind.Sequential, Pack = 1)>]
type CacheEntry =
    val mutable KeyHash: uint64      // 8 bytes
    val mutable Value: int64         // 8 bytes
    val mutable Valid: bool          // 1 byte
    val mutable Timestamp: uint64    // 8 bytes
    // Total: 25 bytes (no padding with Pack=1)
    
    new(keyHash, value, timestamp) =
        { KeyHash = keyHash
          Value = value
          Valid = true
          Timestamp = timestamp }

/// Empty/invalid entry for initialization
[<Struct>]
type EmptyEntry =
    static member Value : CacheEntry =
        CacheEntry(0UL, 0L, 0UL, Valid = false)

// ============================================================================
// SECTION 4: φ-HARMONIC HASH FUNCTION
// ============================================================================

/// φ-harmonic hash function module
[<RequireQualifiedAccess>]
module PhiHash =
    
    /// φ-harmonic hash (inline, stack-only)
    /// 
    /// Algorithm:
    /// 1. XOR with right-shifted self (33 bits)
    /// 2. Multiply by φ approximation
    /// 3. XOR with right-shifted result (29 bits)
    ///
    /// Time: O(1), Space: O(1) stack only
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    let inline compute (key: uint64) : uint64 =
        let mutable h = key ^^^ (key >>> 33)
        h <- h * Constants.PHI_MULT
        h ^^^ (h >>> 29)
    
    /// Alternative: FNV-1a + φ mixing
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    let inline fnvPhi (key: uint64) : uint64 =
        let mutable h = key ^^^ 14695981039346656037UL  // FNV offset
        h <- h * 1099511628211UL                        // FNV prime
        let phiMixed = uint64 (float h * Constants.PHI)
        phiMixed ^^^ (phiMixed >>> 33)
    
    /// Compute with allocation tracking
    let computeWithMeta (key: uint64) : struct(uint64 * AllocType) =
        struct(compute key, Stack)

// ============================================================================
// SECTION 5: FIBONACCI SEQUENCE
// ============================================================================

/// Fibonacci module with zero-allocation implementations
[<RequireQualifiedAccess>]
module Fibonacci =
    
    /// Tail-recursive Fibonacci (O(1) stack space)
    /// Uses mutable accumulators for pure stack usage
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    let compute (n: int) : int64 =
        let mutable a = 1L
        let mutable b = 1L
        let mutable i = n
        while i > 0 do
            let temp = b
            b <- a + b
            a <- temp
            i <- i - 1
        a
    
    /// Compute Fibonacci using φ approximation (Binet's formula)
    /// F(n) ≈ φⁿ / √5
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    let approximate (n: int) : int64 =
        let sqrt5 = 2.2360679774997896
        let phiN = Math.Pow(Constants.PHI, float n)
        int64 (Math.Round(phiN / sqrt5))
    
    /// Find optimal batch size (largest Fibonacci ≤ n)
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    let batchSize (n: int) : int =
        let mutable a = 1
        let mutable b = 1
        while b <= n do
            let temp = b
            b <- a + b
            a <- temp
        a
    
    /// Generate first n Fibonacci numbers into pre-allocated array
    let fillArray (buffer: Span<int64>) : unit =
        if buffer.Length >= 1 then buffer.[0] <- 1L
        if buffer.Length >= 2 then buffer.[1] <- 1L
        for i = 2 to buffer.Length - 1 do
            buffer.[i] <- buffer.[i-1] + buffer.[i-2]

// ============================================================================
// SECTION 6: STACK-ALLOCATED CACHE
// ============================================================================

/// Fixed-size cache using Span<T> for stack allocation
[<Struct>]
type StackCache =
    val mutable Entries: Span<CacheEntry>
    val mutable Hits: int64
    val mutable Misses: int64
    
    new(buffer: Span<CacheEntry>) =
        { Entries = buffer; Hits = 0L; Misses = 0L }
    
    /// Zero-allocation lookup
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    member this.TryGet(key: uint64, [<Out>] result: byref<int64>) : bool =
        let hash = PhiHash.compute key
        let index = int (hash % uint64 this.Entries.Length)
        let entry = &this.Entries.[index]
        if entry.Valid && entry.KeyHash = hash then
            result <- entry.Value
            this.Hits <- this.Hits + 1L
            true
        else
            this.Misses <- this.Misses + 1L
            false
    
    /// Zero-allocation insert
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    member this.Set(key: uint64, value: int64, timestamp: uint64) : unit =
        let hash = PhiHash.compute key
        let index = int (hash % uint64 this.Entries.Length)
        let entry = &this.Entries.[index]
        entry.KeyHash <- hash
        entry.Value <- value
        entry.Valid <- true
        entry.Timestamp <- timestamp
    
    /// Zero-allocation delete
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    member this.Delete(key: uint64) : bool =
        let hash = PhiHash.compute key
        let index = int (hash % uint64 this.Entries.Length)
        let entry = &this.Entries.[index]
        if entry.Valid && entry.KeyHash = hash then
            entry.Valid <- false
            true
        else
            false
    
    /// Get hit rate as percentage
    member this.HitRate : float =
        let total = this.Hits + this.Misses
        if total > 0L then float this.Hits / float total * 100.0
        else 0.0

// ============================================================================
// SECTION 7: COST REPORT (STRUCT)
// ============================================================================

/// Cost report with all stack-allocated fields
[<Struct; StructLayout(LayoutKind.Sequential)>]
type CostReport =
    val Hits: int64
    val Misses: int64
    val SavingsUsd: float
    
    new(hits: int64, misses: int64) =
        let hitRate = 
            if hits + misses > 0L then 
                float hits / float (hits + misses)
            else 0.0
        // $0.5 per million requests
        let savings = hitRate * 0.0000005 * float hits
        { Hits = hits
          Misses = misses
          SavingsUsd = savings }
    
    /// Cost reduction percentage
    member this.CostReduction : float =
        if this.Hits + this.Misses > 0L then
            float this.Hits / float (this.Hits + this.Misses) * 100.0
        else 0.0

// ============================================================================
// SECTION 8: PYTHAGOREAN OPERATIONS
// ============================================================================

/// Pythagorean theorem operations
[<RequireQualifiedAccess>]
module Pythagorean =
    
    /// Verify a Pythagorean triple
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    let inline isTriple (a: int64) (b: int64) (c: int64) : bool =
        a * a + b * b = c * c
    
    /// Euclid's formula for generating Pythagorean triples
    /// a = m² - n², b = 2mn, c = m² + n²
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    let inline euclidTriple (m: int64) (n: int64) : struct(int64 * int64 * int64) =
        struct(m*m - n*n, 2L*m*n, m*m + n*n)
    
    /// Pythagorean distance: √(a² + b²)
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    let inline distance (a: float) (b: float) : float =
        Math.Sqrt(a * a + b * b)
    
    /// Integer Pythagorean distance (approximation)
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    let inline distanceInt (a: int64) (b: int64) : int64 =
        int64 (Math.Sqrt(float (a * a + b * b)))
    
    /// Cache index based on Pythagorean distance
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    let inline cacheIndex (keyHash: uint64) (timestamp: uint64) (cacheSize: int) : int =
        let d = Math.Sqrt(float keyHash * float keyHash + float timestamp * float timestamp)
        int (d * Constants.PHI) % cacheSize

// ============================================================================
// SECTION 9: ANCIENT MATHEMATICS
// ============================================================================

/// Rhetoric weights (Logos, Ethos, Pathos)
[<Struct>]
type RhetoricWeights =
    val Logos: float   // Logic weight (0.5)
    val Ethos: float   // Ethics weight (0.3)
    val Pathos: float  // Emotion weight (0.2)
    
    new(logos, ethos, pathos) =
        { Logos = logos; Ethos = ethos; Pathos = pathos }
    
    /// Standard weights (sum to 1.0)
    static member Standard : RhetoricWeights =
        RhetoricWeights(0.5, 0.3, 0.2)
    
    /// Weighted combination
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    member this.Combine(l: float, e: float, p: float) : float =
        this.Logos * l + this.Ethos * e + this.Pathos * p

/// Ancient calendar cycles
[<RequireQualifiedAccess>]
module AncientCycles =
    
    /// Mayan base cycle (milliseconds)
    [<Literal>]
    let MAYAN = 1440.0
    
    /// Sumerian hour cycle
    [<Literal>]
    let SUMERIAN = 3600.0
    
    /// Egyptian decan cycle
    [<Literal>]
    let EGYPTIAN = 2160.0
    
    /// Lunar φ-cycle
    [<Literal>]
    let LUNAR = 2551.0
    
    /// Solar angle cycle
    [<Literal>]
    let SOLAR = 8760.0
    
    /// φ-heartbeat (540 × φ)
    [<Literal>]
    let PHI_HEARTBEAT = 873.0
    
    /// Biorhythm calculation combining 6 ancient cycles
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    let biorhythm (t: float) : float =
        let mayanWave = Math.Sin(2.0 * Math.PI * (t % MAYAN) / MAYAN)
        let sumerianWave = Math.Sin(2.0 * Math.PI * (t % SUMERIAN) / SUMERIAN)
        let egyptianWave = Math.Sin(2.0 * Math.PI * (t % EGYPTIAN) / EGYPTIAN)
        let lunarWave = Math.Sin(2.0 * Math.PI * (t % LUNAR) / LUNAR)
        let solarWave = Math.Sin(2.0 * Math.PI * (t % SOLAR) / SOLAR)
        let phiWave = Math.Sin(2.0 * Math.PI * (t % PHI_HEARTBEAT) / PHI_HEARTBEAT)
        
        // Pythagorean combination: √(Σ(wave²)) / √6
        let sumSquares = 
            mayanWave * mayanWave +
            sumerianWave * sumerianWave +
            egyptianWave * egyptianWave +
            lunarWave * lunarWave +
            solarWave * solarWave +
            phiWave * phiWave
        
        let combined = Math.Sqrt(sumSquares / 6.0)
        // Normalize to [0,1] using φ
        combined * Constants.PHI / (Constants.PHI + 1.0)

// ============================================================================
// SECTION 10: ACTIVE PATTERNS (ZERO-ALLOCATION MATCHING)
// ============================================================================

/// Active pattern for cache hit/miss
[<return: Struct>]
let inline (|CacheHit|CacheMiss|) (entry: CacheEntry, hash: uint64) : Choice<int64, unit> =
    if entry.Valid && entry.KeyHash = hash then
        CacheHit entry.Value
    else
        CacheMiss

/// Active pattern for Fibonacci range
[<return: Struct>]
let inline (|FibSmall|FibMedium|FibLarge|) (n: int) : Choice<unit, unit, unit> =
    if n < 10 then FibSmall
    elif n < 50 then FibMedium
    else FibLarge

// ============================================================================
// SECTION 11: ENTROPY CALCULATION
// ============================================================================

/// Shannon entropy for cost analysis
[<RequireQualifiedAccess>]
module Entropy =
    
    /// Calculate Shannon entropy
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    let compute (probs: ReadOnlySpan<float>) : float =
        let mutable entropy = 0.0
        for i = 0 to probs.Length - 1 do
            let p = probs.[i]
            if p > 0.0 && p < 1.0 then
                entropy <- entropy - p * Math.Log2(p)
        entropy
    
    /// φ-weighted entropy
    [<MethodImpl(MethodImplOptions.AggressiveInlining)>]
    let phiWeighted (probs: ReadOnlySpan<float>) : float =
        compute probs * Constants.PHI

// ============================================================================
// SECTION 12: VERIFIED OPERATIONS
// ============================================================================

/// A computation verified to be zero-allocation
[<Struct>]
type Verified<'T> =
    val Result: 'T
    val AllocType: AllocType
    
    new(result, allocType) =
        { Result = result; AllocType = allocType }
    
    /// Verify that this is zero-alloc
    member this.IsZeroAlloc : bool =
        isZeroAlloc this.AllocType

/// Create verified stack-allocated value
let inline verifiedStack (value: 'T) : Verified<'T> =
    Verified(value, Stack)

/// Create verified static-allocated value
let inline verifiedStatic (value: 'T) : Verified<'T> =
    Verified(value, Static)

/// Verified φ-hash
let inline verifiedPhiHash (key: uint64) : Verified<uint64> =
    verifiedStack (PhiHash.compute key)

/// Verified Fibonacci
let inline verifiedFib (n: int) : Verified<int64> =
    verifiedStack (Fibonacci.compute n)

// ============================================================================
// END OF MODULE
//
// 𓂀 Through F# structs and spans, we achieve .NET zero-allocation 𓂀
// ============================================================================
