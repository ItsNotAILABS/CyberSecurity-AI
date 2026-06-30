///
/// CULTIVAR — Crop Genetics Intelligence Organism
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
/// "Seeds carry the mathematics of millennia. We decode their equations
///  to architect the harvests of tomorrow."
///
/// CULTIVAR provides comprehensive crop genetics and breeding intelligence
/// using Mendelian mathematics, Hardy-Weinberg equilibrium, and φ-optimized
/// selection algorithms derived from natural evolutionary patterns.
///
/// Capabilities:
///   - Genotype Analysis using Punnett Square mathematics
///   - Phenotype Prediction via Polygenic Trait Modeling
///   - Breeding Program Optimization with φ-weighted selection
///   - Hybrid Vigor (Heterosis) Calculation using Fibonacci generation windows
///   - Trait Heritability Estimation via ANOVA decomposition
///   - Disease Resistance Scoring with Pythagorean multi-gene analysis
///
/// Mathematical Foundation:
///   - Mendelian Ratios: 3:1, 9:3:3:1 (classic genetics)
///   - Hardy-Weinberg: p² + 2pq + q² = 1 (population equilibrium)
///   - Heritability: H² = VG/VP (genetic/phenotypic variance)
///   - Golden Ratio: φ-weighted selection pressure
///   - Fibonacci: Generation intervals, population sizes
///

import Float   "mo:base/Float";
import Int     "mo:base/Int";
import Nat     "mo:base/Nat";
import Text    "mo:base/Text";
import Array   "mo:base/Array";
import Buffer  "mo:base/Buffer";
import Time    "mo:base/Time";
import Iter    "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result  "mo:base/Result";

persistent actor CULTIVAR {

  // ══════════════════════════════════════════════════════════════════
  //  MATHEMATICAL CONSTANTS — Genetic Mathematics
  // ══════════════════════════════════════════════════════════════════

  // Golden Ratio Constants
  transient let PHI : Float = 1.6180339887498949;
  transient let PHI_SQUARED : Float = 2.6180339887498949;
  transient let PHI_INVERSE : Float = 0.6180339887498949;
  transient let PHI_CUBED : Float = 4.2360679774997898;

  // Mendelian Ratios
  transient let DOMINANT_RATIO : Float = 0.75;    // 3/4
  transient let RECESSIVE_RATIO : Float = 0.25;   // 1/4
  transient let HETEROZYGOTE_RATIO : Float = 0.5;  // 2/4

  // Fibonacci Sequence for generations/populations
  transient let FIBONACCI : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];

  // Genetic constants
  transient let MUTATION_RATE_BASE : Float = 0.00001;  // per base pair per generation
  transient let RECOMBINATION_RATE : Float = 0.01;     // per centimorgan

  // ══════════════════════════════════════════════════════════════════
  //  TYPES — Genetic Architecture
  // ══════════════════════════════════════════════════════════════════

  public type Allele = {
    locus: Text;
    variant: Text;         // A, a, B, b, etc.
    dominance: Float;      // 0 = recessive, 1 = dominant, 0.5 = codominant
    effectSize: Float;     // contribution to quantitative trait
    frequency: Float;      // population frequency
  };

  public type Genotype = {
    cultivarId: Text;
    loci: [LocusGenotype];
    ploidy: Nat;           // 2 for diploid
    heterozygosity: Float; // proportion heterozygous loci
    inbreedingCoefficient: Float;
  };

  public type LocusGenotype = {
    locus: Text;
    allele1: Text;
    allele2: Text;
    genotypicValue: Float;
  };

  public type Phenotype = {
    cultivarId: Text;
    traits: [TraitValue];
    overallFitness: Float;
    phiPerformanceIndex: Float;
    environment: Text;
    timestamp: Int;
  };

  public type TraitValue = {
    traitName: Text;
    value: Float;
    unit: Text;
    heritability: Float;
    environmentalVariance: Float;
  };

  public type BreedingProgram = {
    programId: Text;
    targetTraits: [TargetTrait];
    parentPool: [Text];         // cultivar IDs
    generationCount: Nat;
    selectionIntensity: Float;
    currentGeneration: Nat;
    fibonacciPopulationSize: Nat;
    phiSelectionPressure: Float;
    expectedGeneticGain: Float;
  };

  public type TargetTrait = {
    traitName: Text;
    targetValue: Float;
    weight: Float;              // selection weight
    heritability: Float;
    currentMean: Float;
    variance: Float;
  };

  public type CrossPrediction = {
    parent1: Text;
    parent2: Text;
    predictedOffspring: [OffspringPrediction];
    heterosisEstimate: Float;
    mendelianRatios: [{ phenotype: Text; ratio: Float }];
    phiBreedingValue: Float;
    timestamp: Int;
  };

  public type OffspringPrediction = {
    genotype: Text;
    probability: Float;
    expectedPhenotype: [{ trait: Text; value: Float }];
    selectionIndex: Float;
  };

  public type HeterosisAnalysis = {
    crossId: Text;
    parent1Mean: Float;
    parent2Mean: Float;
    midparentValue: Float;
    f1Mean: Float;
    heterosisPercent: Float;      // (F1 - MP) / MP × 100
    bestParentHeterosis: Float;
    fibonacciGeneration: Nat;
    phiVigorIndex: Float;
  };

  public type HeritabilityEstimate = {
    traitName: Text;
    broadSenseH2: Float;          // VG/VP
    narrowSenseH2: Float;         // VA/VP
    additiveVariance: Float;      // VA
    dominanceVariance: Float;     // VD
    environmentalVariance: Float; // VE
    geneticAdvance: Float;        // expected gain
    phiReliability: Float;
  };

  public type DiseaseResistance = {
    cultivarId: Text;
    pathogen: Text;
    resistanceGenes: [ResistanceGene];
    pythagoreanResistanceScore: Float;
    resistanceCategory: Text;
    durabilityEstimate: Float;
  };

  public type ResistanceGene = {
    geneName: Text;
    geneType: Text;              // R-gene, QTL, etc.
    effectSize: Float;
    dominance: Float;
    isPresent: Bool;
  };

  public type MarkerData = {
    cultivarId: Text;
    markers: [GeneticMarker];
    genomicEstimatedBreedingValue: Float;
    markerAssistedSelectionScore: Float;
    phiGenomicIndex: Float;
  };

  public type GeneticMarker = {
    markerId: Text;
    chromosome: Nat;
    position: Float;             // centimorgan
    allelePresent: Text;
    associatedTrait: Text;
    effectSize: Float;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE — Genetic Memory
  // ══════════════════════════════════════════════════════════════════

  stable var cultivarCount : Nat = 0;
  stable var breedingProgramCount : Nat = 0;

  var genotypes = HashMap.HashMap<Text, Genotype>(10, Text.equal, Text.hash);
  var phenotypes = HashMap.HashMap<Text, Phenotype>(10, Text.equal, Text.hash);
  var breedingPrograms = HashMap.HashMap<Text, BreedingProgram>(10, Text.equal, Text.hash);

  // ══════════════════════════════════════════════════════════════════
  //  CORE FUNCTIONS — Genetic Intelligence
  // ══════════════════════════════════════════════════════════════════

  /// Register cultivar genotype with heterozygosity analysis
  public func registerGenotype(
    cultivarId: Text,
    loci: [LocusGenotype],
    ploidy: Nat
  ) : async Genotype {
    
    // Calculate heterozygosity
    var hetCount : Nat = 0;
    for (locus in loci.vals()) {
      if (locus.allele1 != locus.allele2) {
        hetCount += 1;
      };
    };
    
    let heterozygosity = Float.fromInt(hetCount) / Float.fromInt(loci.size());
    
    // Calculate inbreeding coefficient F
    // F = 1 - (observed Het / expected Het under HWE)
    let expectedHet = 2.0 * 0.5 * 0.5;  // simplified
    let inbreeding = 1.0 - (heterozygosity / expectedHet);
    
    let genotype : Genotype = {
      cultivarId = cultivarId;
      loci = loci;
      ploidy = ploidy;
      heterozygosity = heterozygosity;
      inbreedingCoefficient = Float.max(0.0, inbreeding);
    };
    
    genotypes.put(cultivarId, genotype);
    cultivarCount += 1;
    
    return genotype;
  };

  /// Predict cross outcomes using Mendelian mathematics
  /// Punnett square expansion with φ-weighted selection
  public func predictCross(
    parent1Id: Text,
    parent2Id: Text,
    targetTraits: [Text]
  ) : async CrossPrediction {
    
    let p1 = genotypes.get(parent1Id);
    let p2 = genotypes.get(parent2Id);
    
    switch (p1, p2) {
      case (?parent1, ?parent2) {
        let offspringBuffer = Buffer.Buffer<OffspringPrediction>(16);
        let ratiosBuffer = Buffer.Buffer<{ phenotype: Text; ratio: Float }>(4);
        
        // Generate Punnett square predictions for each locus
        // Simplified: assuming single locus for demonstration
        if (parent1.loci.size() > 0 and parent2.loci.size() > 0) {
          let locus1 = parent1.loci[0];
          let locus2 = parent2.loci[0];
          
          // Possible gametes
          let p1Gametes = [locus1.allele1, locus1.allele2];
          let p2Gametes = [locus2.allele1, locus2.allele2];
          
          // Punnett square
          var genotypeMap = HashMap.HashMap<Text, Nat>(10, Text.equal, Text.hash);
          
          for (g1 in p1Gametes.vals()) {
            for (g2 in p2Gametes.vals()) {
              let offspring = if (g1 < g2) { g1 # g2 } else { g2 # g1 };
              switch (genotypeMap.get(offspring)) {
                case (?count) { genotypeMap.put(offspring, count + 1); };
                case null { genotypeMap.put(offspring, 1); };
              };
            };
          };
          
          // Calculate probabilities
          for ((geno, count) in genotypeMap.entries()) {
            let prob = Float.fromInt(count) / 4.0;
            let selectionIndex = _calculateSelectionIndex(geno, targetTraits);
            
            offspringBuffer.add({
              genotype = geno;
              probability = prob;
              expectedPhenotype = [];
              selectionIndex = selectionIndex;
            });
            
            ratiosBuffer.add({
              phenotype = geno;
              ratio = prob;
            });
          };
        };
        
        // Heterosis estimate using φ-weighted midparent
        let heterosis = _estimateHeterosis(parent1, parent2);
        
        // φ-breeding value
        let phiBV = (1.0 - parent1.inbreedingCoefficient) * PHI_INVERSE +
                    (1.0 - parent2.inbreedingCoefficient) * PHI_INVERSE;
        
        return {
          parent1 = parent1Id;
          parent2 = parent2Id;
          predictedOffspring = Buffer.toArray(offspringBuffer);
          heterosisEstimate = heterosis;
          mendelianRatios = Buffer.toArray(ratiosBuffer);
          phiBreedingValue = phiBV;
          timestamp = Time.now();
        };
      };
      case _ {
        return {
          parent1 = parent1Id;
          parent2 = parent2Id;
          predictedOffspring = [];
          heterosisEstimate = 0.0;
          mendelianRatios = [];
          phiBreedingValue = 0.0;
          timestamp = Time.now();
        };
      };
    };
  };

  /// Create breeding program with Fibonacci population sizing
  public func createBreedingProgram(
    programId: Text,
    targetTraits: [TargetTrait],
    parentPool: [Text],
    generations: Nat,
    selectionIntensity: Float
  ) : async BreedingProgram {
    
    // Determine Fibonacci population size
    let popIndex = if (generations < FIBONACCI.size()) { generations } else { FIBONACCI.size() - 1 };
    let fibPopSize = FIBONACCI[popIndex] * 10;  // Scale up
    
    // φ-selection pressure calculation
    let phiPressure = PHI_INVERSE * selectionIntensity;
    
    // Calculate expected genetic gain per generation
    // ΔG = i × h² × σP (breeder's equation)
    var totalExpectedGain : Float = 0.0;
    for (trait in targetTraits.vals()) {
      let gain = selectionIntensity * trait.heritability * Float.sqrt(trait.variance);
      totalExpectedGain += gain * trait.weight;
    };
    
    let program : BreedingProgram = {
      programId = programId;
      targetTraits = targetTraits;
      parentPool = parentPool;
      generationCount = generations;
      selectionIntensity = selectionIntensity;
      currentGeneration = 0;
      fibonacciPopulationSize = fibPopSize;
      phiSelectionPressure = phiPressure;
      expectedGeneticGain = totalExpectedGain;
    };
    
    breedingPrograms.put(programId, program);
    breedingProgramCount += 1;
    
    return program;
  };

  /// Calculate heritability using variance decomposition
  /// H² = VG/VP where VP = VG + VE
  public func calculateHeritability(
    traitName: Text,
    phenotypicData: [{ cultivarId: Text; value: Float; environment: Text }],
    geneticData: [{ cultivarId: Text; breedingValue: Float }]
  ) : async HeritabilityEstimate {
    
    // Calculate phenotypic variance (VP)
    var sumP : Float = 0.0;
    var sumP2 : Float = 0.0;
    let nP = phenotypicData.size();
    
    for (data in phenotypicData.vals()) {
      sumP += data.value;
      sumP2 += data.value * data.value;
    };
    
    let meanP = sumP / Float.fromInt(nP);
    let varP = (sumP2 / Float.fromInt(nP)) - (meanP * meanP);
    
    // Calculate genetic variance (VG) from breeding values
    var sumG : Float = 0.0;
    var sumG2 : Float = 0.0;
    let nG = geneticData.size();
    
    for (data in geneticData.vals()) {
      sumG += data.breedingValue;
      sumG2 += data.breedingValue * data.breedingValue;
    };
    
    let meanG = sumG / Float.fromInt(nG);
    let varG = (sumG2 / Float.fromInt(nG)) - (meanG * meanG);
    
    // Environmental variance
    let varE = Float.max(0.0, varP - varG);
    
    // Broad-sense heritability
    let h2Broad = if (varP > 0.0) { varG / varP } else { 0.0 };
    
    // Narrow-sense heritability (assuming VA ≈ VG × 0.8 for additive traits)
    let varA = varG * 0.8;
    let varD = varG * 0.2;
    let h2Narrow = if (varP > 0.0) { varA / varP } else { 0.0 };
    
    // Genetic advance: GA = i × h² × σP
    let selectionIntensity = 1.4;  // top 20% selection
    let geneticAdvance = selectionIntensity * h2Narrow * Float.sqrt(varP);
    
    // φ-reliability based on data quality
    let phiReliability = Float.min(1.0, Float.fromInt(nP) / 100.0) * PHI_INVERSE +
                         Float.min(1.0, Float.fromInt(nG) / 50.0) * PHI_INVERSE;
    
    return {
      traitName = traitName;
      broadSenseH2 = h2Broad;
      narrowSenseH2 = h2Narrow;
      additiveVariance = varA;
      dominanceVariance = varD;
      environmentalVariance = varE;
      geneticAdvance = geneticAdvance;
      phiReliability = phiReliability;
    };
  };

  /// Analyze hybrid vigor using Fibonacci generation tracking
  public func analyzeHeterosis(
    crossId: Text,
    parent1Mean: Float,
    parent2Mean: Float,
    f1Mean: Float,
    generation: Nat
  ) : async HeterosisAnalysis {
    
    // Midparent value
    let midparent = (parent1Mean + parent2Mean) / 2.0;
    
    // Midparent heterosis
    let mpHeterosis = if (midparent > 0.0) {
      (f1Mean - midparent) / midparent * 100.0
    } else { 0.0 };
    
    // Best parent heterosis
    let bestParent = Float.max(parent1Mean, parent2Mean);
    let bpHeterosis = if (bestParent > 0.0) {
      (f1Mean - bestParent) / bestParent * 100.0
    } else { 0.0 };
    
    // Fibonacci generation index
    let fibGen = if (generation < FIBONACCI.size()) {
      FIBONACCI[generation]
    } else { FIBONACCI[FIBONACCI.size() - 1] };
    
    // φ-vigor index (heterosis × generation stability)
    let phiVigor = mpHeterosis * Float.pow(PHI_INVERSE, Float.fromInt(generation));
    
    return {
      crossId = crossId;
      parent1Mean = parent1Mean;
      parent2Mean = parent2Mean;
      midparentValue = midparent;
      f1Mean = f1Mean;
      heterosisPercent = mpHeterosis;
      bestParentHeterosis = bpHeterosis;
      fibonacciGeneration = fibGen;
      phiVigorIndex = Float.abs(phiVigor);
    };
  };

  /// Score disease resistance using Pythagorean multi-gene model
  /// R² = Σ(gene_effect_i)²
  public func scoreDiseaseResistance(
    cultivarId: Text,
    pathogen: Text,
    resistanceGenes: [ResistanceGene]
  ) : async DiseaseResistance {
    
    // Pythagorean resistance calculation
    var sumSquares : Float = 0.0;
    var presentGenes : Nat = 0;
    
    for (gene in resistanceGenes.vals()) {
      if (gene.isPresent) {
        sumSquares += Float.pow(gene.effectSize * gene.dominance, 2);
        presentGenes += 1;
      };
    };
    
    let pythagoreanScore = Float.sqrt(sumSquares);
    
    // Category classification using φ thresholds
    let category = if (pythagoreanScore >= PHI_SQUARED) { "HIGHLY_RESISTANT" }
                   else if (pythagoreanScore >= PHI) { "RESISTANT" }
                   else if (pythagoreanScore >= PHI_INVERSE) { "MODERATELY_RESISTANT" }
                   else if (pythagoreanScore >= PHI_INVERSE * PHI_INVERSE) { "SUSCEPTIBLE" }
                   else { "HIGHLY_SUSCEPTIBLE" };
    
    // Durability estimate based on gene diversity
    let durability = Float.min(1.0, Float.fromInt(presentGenes) / 5.0) * PHI_INVERSE +
                     (1.0 - PHI_INVERSE) * (pythagoreanScore / PHI_SQUARED);
    
    return {
      cultivarId = cultivarId;
      pathogen = pathogen;
      resistanceGenes = resistanceGenes;
      pythagoreanResistanceScore = pythagoreanScore;
      resistanceCategory = category;
      durabilityEstimate = durability;
    };
  };

  /// Calculate genomic breeding value using marker data
  public func calculateGenomicValue(
    cultivarId: Text,
    markers: [GeneticMarker]
  ) : async MarkerData {
    
    // Genomic Estimated Breeding Value (GEBV)
    var gebv : Float = 0.0;
    var masScore : Float = 0.0;
    
    for (marker in markers.vals()) {
      // GEBV contribution
      gebv += marker.effectSize;
      
      // MAS score weighted by position (cM)
      masScore += marker.effectSize * Float.pow(PHI, -marker.position / 100.0);
    };
    
    // Normalize
    let normalizedGEBV = gebv / Float.fromInt(markers.size());
    let normalizedMAS = masScore / Float.fromInt(markers.size());
    
    // φ-genomic index combining GEBV and MAS
    let phiIndex = normalizedGEBV * PHI_INVERSE + normalizedMAS * (1.0 - PHI_INVERSE);
    
    return {
      cultivarId = cultivarId;
      markers = markers;
      genomicEstimatedBreedingValue = normalizedGEBV;
      markerAssistedSelectionScore = normalizedMAS;
      phiGenomicIndex = phiIndex;
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERY FUNCTIONS — Genetic Memory Access
  // ══════════════════════════════════════════════════════════════════

  public query func getGenotype(cultivarId: Text) : async ?Genotype {
    return genotypes.get(cultivarId);
  };

  public query func getPhenotype(cultivarId: Text) : async ?Phenotype {
    return phenotypes.get(cultivarId);
  };

  public query func getBreedingProgram(programId: Text) : async ?BreedingProgram {
    return breedingPrograms.get(programId);
  };

  public query func getStatistics() : async { cultivars: Nat; programs: Nat } {
    return { cultivars = cultivarCount; programs = breedingProgramCount };
  };

  public query func getMendelianRatios() : async { dominant: Float; recessive: Float; heterozygote: Float } {
    return {
      dominant = DOMINANT_RATIO;
      recessive = RECESSIVE_RATIO;
      heterozygote = HETEROZYGOTE_RATIO;
    };
  };

  public query func getGeneticConstants() : async {
    phi: Float; fibonacciGenerations: [Nat]; mutationRate: Float;
  } {
    return {
      phi = PHI;
      fibonacciGenerations = FIBONACCI;
      mutationRate = MUTATION_RATE_BASE;
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  PRIVATE HELPERS — Genetic Calculations
  // ══════════════════════════════════════════════════════════════════

  private func _calculateSelectionIndex(genotype: Text, targetTraits: [Text]) : Float {
    // Selection index based on genotype composition
    var score : Float = 0.0;
    
    // Favor heterozygotes (hybrid vigor)
    if (genotype.size() == 2) {
      let chars = Iter.toArray(genotype.chars());
      if (chars[0] != chars[1]) {
        score += PHI_INVERSE;  // Heterozygote bonus
      };
    };
    
    // Add base score
    score += Float.fromInt(genotype.size()) / 10.0;
    
    return score;
  };

  private func _estimateHeterosis(parent1: Genotype, parent2: Genotype) : Float {
    // Heterosis estimate based on genetic distance
    // More different parents = higher expected heterosis
    
    var differences : Nat = 0;
    let minLoci = Nat.min(parent1.loci.size(), parent2.loci.size());
    
    for (i in Iter.range(0, minLoci - 1)) {
      let l1 = parent1.loci[i];
      let l2 = parent2.loci[i];
      
      if (l1.allele1 != l2.allele1 or l1.allele2 != l2.allele2) {
        differences += 1;
      };
    };
    
    let geneticDistance = Float.fromInt(differences) / Float.fromInt(minLoci);
    
    // Heterosis = f(genetic distance) × φ-factor
    return geneticDistance * PHI * 10.0;  // 10% heterosis per unit distance
  };
};
