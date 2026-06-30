.PHONY: all install test clean engine-test engine-install

# Default target
all: install

# Install Julia dependencies
install:
	@echo "Installing Julia engine dependencies..."
	cd engines/julia && julia --project=. -e 'using Pkg; Pkg.add(["YAML", "JSON3", "ArgParse"]); Pkg.instantiate()'
	@echo "Julia engines ready"

# Install engines (alias)
engine-install: install

# Run engine tests
engine-test:
	@echo "Testing NOVA Cognitive Engines..."
	@echo ""
	@echo "=== Test 1: Biorhythm Calculation ==="
	cd engines/julia && ./nova-engine organism biorhythm
	@echo ""
	@echo "=== Test 2: Law Evaluation ==="
	cd engines/julia && ./nova-engine law evaluate \
		--entity-id "atlas://terminal/meridian" \
		--event-type "governance_check" \
		--laws-dir ./examples/laws
	@echo ""
	@echo "=== Test 3: Pipeline Execution ==="
	cd engines/julia && ./nova-engine pipeline run \
		--pipeline ./examples/pipelines/governance.cpl-p \
		--context '{"salience":0.8,"urgency":0.6}'
	@echo ""
	@echo "All engine tests passed ✓"

# Run comprehensive tests
test: engine-test
	@echo "Running Motoko canister type-check..."
	./scripts/nova check

# Clean build artifacts
clean:
	rm -f engines/julia/Manifest.toml
	rm -rf engines/julia/examples/logs/*
	rm -rf engines/julia/examples/incidents/*
	@echo "Cleaned Julia build artifacts"

# Help target
help:
	@echo "NOVA Cognitive Engine Makefile"
	@echo ""
	@echo "Targets:"
	@echo "  make install        - Install Julia dependencies"
	@echo "  make engine-test    - Test all Julia engines"
	@echo "  make test           - Run engine tests + Motoko type-check"
	@echo "  make clean          - Clean build artifacts"
	@echo ""
	@echo "Engine Commands:"
	@echo "  cd engines/julia && ./nova-engine law evaluate ..."
	@echo "  cd engines/julia && ./nova-engine pipeline run ..."
	@echo "  cd engines/julia && ./nova-engine organism task ..."
	@echo "  cd engines/julia && ./nova-engine governance cycle ..."
