///
/// @medina/evolution-engine — Self-Modifying AI Systems
/// Genetic algorithms, evolutionary strategies, adaptive code generation
///

import { LivingAI, ARCHETYPES, PHI } from '@medina/medina-heart';

export class Genome {
  constructor({ genes = [], fitness = 0 } = {}) {
    this.genes = genes;
    this.fitness = fitness;
    this.generation = 0;
  }

  mutate(rate = 0.1) {
    return new Genome({
      genes: this.genes.map(g => Math.random() < rate ? Math.random() : g),
      fitness: 0,
    });
  }

  crossover(other) {
    const point = Math.floor(this.genes.length / 2);
    return new Genome({
      genes: [...this.genes.slice(0, point), ...other.genes.slice(point)],
      fitness: 0,
    });
  }
}

export class Population {
  constructor({ size = 100, geneLength = 10 } = {}) {
    this.individuals = Array.from({ length: size }, () =>
      new Genome({ genes: Array.from({ length: geneLength }, () => Math.random()) })
    );
    this.generation = 0;
  }

  evolve(fitnessFunction) {
    // Evaluate fitness
    for (const individual of this.individuals) {
      individual.fitness = fitnessFunction(individual.genes);
    }

    // Sort by fitness
    this.individuals.sort((a, b) => b.fitness - a.fitness);

    // Select top 50%
    const survivors = this.individuals.slice(0, Math.floor(this.individuals.length / 2));

    // Generate offspring
    const offspring = [];
    while (offspring.length < this.individuals.length / 2) {
      const parent1 = survivors[Math.floor(Math.random() * survivors.length)];
      const parent2 = survivors[Math.floor(Math.random() * survivors.length)];
      offspring.push(parent1.crossover(parent2).mutate());
    }

    this.individuals = [...survivors, ...offspring];
    this.generation++;

    return this.getBest();
  }

  getBest() {
    return this.individuals.reduce((best, ind) =>
      ind.fitness > best.fitness ? ind : best
    );
  }
}

export default { Genome, Population };
