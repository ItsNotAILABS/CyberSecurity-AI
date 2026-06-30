#!/usr/bin/env python3
"""
CPL — Catalan Protocol Language Interpreter

Catalan Protocol Language is a domain-specific language for defining
and executing protocols in the NOVA organism network. It combines:
  - Ancient mathematical principles (Catalan numbers, golden ratio)
  - Protocol orchestration primitives
  - Sovereign organism routing
  - φ-weighted adaptation

Syntax inspired by Catalan numbers (balanced parentheses sequences)
and golden-ratio mathematical structures.

Example CPL Program:
    PROTOCOL PRT-001 {
        ROUTE φ-hash("input") TO [ARCHITECT, CHRYSALIS];
        ADAPT threshold BY φ^(-decay) WITH feedback;
        EXECUTE Golden.sequence(n);
        ATTEST Fibonacci.hash(result);
    }

Casa de Medina — Architectos de Architectura Inteligente
"""

import re
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
from enum import Enum
import math

# ══════════════════════════════════════════════════════════════════
#  CONSTANTS
# ══════════════════════════════════════════════════════════════════

PHI = 1.6180339887498948482
PHI_INV = 0.6180339887498948482

# ══════════════════════════════════════════════════════════════════
#  AST NODES
# ══════════════════════════════════════════════════════════════════

class NodeType(Enum):
    PROTOCOL = "PROTOCOL"
    ROUTE = "ROUTE"
    ADAPT = "ADAPT"
    EXECUTE = "EXECUTE"
    ATTEST = "ATTEST"
    FIBONACCI_CALL = "FIBONACCI"
    GOLDEN_CALL = "GOLDEN"
    PHI_HASH = "PHI_HASH"
    IDENTIFIER = "IDENTIFIER"
    NUMBER = "NUMBER"
    STRING = "STRING"
    LIST = "LIST"

@dataclass
class ASTNode:
    node_type: NodeType
    value: Any
    children: List['ASTNode']
    metadata: Dict[str, Any]

# ══════════════════════════════════════════════════════════════════
#  LEXER
# ══════════════════════════════════════════════════════════════════

class TokenType(Enum):
    KEYWORD = "KEYWORD"
    IDENTIFIER = "IDENTIFIER"
    NUMBER = "NUMBER"
    STRING = "STRING"
    LBRACE = "{"
    RBRACE = "}"
    LBRACKET = "["
    RBRACKET = "]"
    LPAREN = "("
    RPAREN = ")"
    SEMICOLON = ";"
    COMMA = ","
    DOT = "."
    CARET = "^"
    ARROW = "→"
    EOF = "EOF"

@dataclass
class Token:
    token_type: TokenType
    value: str
    line: int
    column: int

class CPLLexer:
    KEYWORDS = {
        "PROTOCOL", "ROUTE", "ADAPT", "EXECUTE", "ATTEST",
        "TO", "BY", "WITH", "Fibonacci", "Golden", "Catalan"
    }

    def __init__(self, source: str):
        self.source = source
        self.pos = 0
        self.line = 1
        self.column = 1

    def tokenize(self) -> List[Token]:
        tokens = []
        while self.pos < len(self.source):
            if self._current().isspace():
                if self._current() == '\n':
                    self.line += 1
                    self.column = 1
                else:
                    self.column += 1
                self.pos += 1
                continue

            if self._current() == '/' and self._peek() == '/':
                self._skip_comment()
                continue

            token = self._next_token()
            if token:
                tokens.append(token)

        tokens.append(Token(TokenType.EOF, "", self.line, self.column))
        return tokens

    def _current(self) -> str:
        if self.pos >= len(self.source):
            return '\0'
        return self.source[self.pos]

    def _peek(self, offset: int = 1) -> str:
        pos = self.pos + offset
        if pos >= len(self.source):
            return '\0'
        return self.source[pos]

    def _advance(self):
        self.pos += 1
        self.column += 1

    def _skip_comment(self):
        while self._current() not in ('\n', '\0'):
            self._advance()

    def _next_token(self) -> Optional[Token]:
        start_col = self.column

        c = self._current()

        # Single-character tokens
        single_chars = {
            '{': TokenType.LBRACE,
            '}': TokenType.RBRACE,
            '[': TokenType.LBRACKET,
            ']': TokenType.RBRACKET,
            '(': TokenType.LPAREN,
            ')': TokenType.RPAREN,
            ';': TokenType.SEMICOLON,
            ',': TokenType.COMMA,
            '.': TokenType.DOT,
            '^': TokenType.CARET,
        }

        if c in single_chars:
            self._advance()
            return Token(single_chars[c], c, self.line, start_col)

        # Arrow
        if c == '-' and self._peek() == '>':
            self._advance()
            self._advance()
            return Token(TokenType.ARROW, "->", self.line, start_col)

        # String literal
        if c == '"':
            return self._read_string()

        # Number
        if c.isdigit():
            return self._read_number()

        # Identifier or keyword
        if c.isalpha() or c == '_':
            return self._read_identifier()

        # Unknown character - skip
        self._advance()
        return None

    def _read_string(self) -> Token:
        start_col = self.column
        self._advance()  # skip opening quote
        value = ""
        while self._current() != '"' and self._current() != '\0':
            value += self._current()
            self._advance()
        self._advance()  # skip closing quote
        return Token(TokenType.STRING, value, self.line, start_col)

    def _read_number(self) -> Token:
        start_col = self.column
        value = ""
        while self._current().isdigit() or self._current() == '.':
            value += self._current()
            self._advance()
        return Token(TokenType.NUMBER, value, self.line, start_col)

    def _read_identifier(self) -> Token:
        start_col = self.column
        value = ""
        while self._current().isalnum() or self._current() in ('_', '-'):
            value += self._current()
            self._advance()

        token_type = TokenType.KEYWORD if value in self.KEYWORDS else TokenType.IDENTIFIER
        return Token(token_type, value, self.line, start_col)

# ══════════════════════════════════════════════════════════════════
#  PARSER
# ══════════════════════════════════════════════════════════════════

class CPLParser:
    def __init__(self, tokens: List[Token]):
        self.tokens = tokens
        self.pos = 0

    def parse(self) -> ASTNode:
        """Parse a CPL program into an AST"""
        protocols = []
        while not self._is_at_end():
            if self._current().value == "PROTOCOL":
                protocols.append(self._parse_protocol())
            else:
                self._advance()

        return ASTNode(NodeType.PROTOCOL, "PROGRAM", protocols, {})

    def _parse_protocol(self) -> ASTNode:
        self._consume("PROTOCOL")
        protocol_id = self._consume(TokenType.IDENTIFIER).value
        self._consume(TokenType.LBRACE)

        statements = []
        while self._current().token_type != TokenType.RBRACE:
            stmt = self._parse_statement()
            if stmt:
                statements.append(stmt)

        self._consume(TokenType.RBRACE)

        return ASTNode(NodeType.PROTOCOL, protocol_id, statements, {})

    def _parse_statement(self) -> Optional[ASTNode]:
        keyword = self._current().value

        if keyword == "ROUTE":
            return self._parse_route()
        elif keyword == "ADAPT":
            return self._parse_adapt()
        elif keyword == "EXECUTE":
            return self._parse_execute()
        elif keyword == "ATTEST":
            return self._parse_attest()
        else:
            self._advance()
            return None

    def _parse_route(self) -> ASTNode:
        self._consume("ROUTE")
        expr = self._parse_expression()
        self._consume("TO")
        targets = self._parse_list()
        self._consume(TokenType.SEMICOLON)
        return ASTNode(NodeType.ROUTE, None, [expr, targets], {})

    def _parse_adapt(self) -> ASTNode:
        self._consume("ADAPT")
        param = self._consume(TokenType.IDENTIFIER).value
        self._consume("BY")
        expr = self._parse_expression()
        self._consume("WITH")
        feedback = self._consume(TokenType.IDENTIFIER).value
        self._consume(TokenType.SEMICOLON)
        return ASTNode(NodeType.ADAPT, param, [expr], {"feedback": feedback})

    def _parse_execute(self) -> ASTNode:
        self._consume("EXECUTE")
        expr = self._parse_expression()
        self._consume(TokenType.SEMICOLON)
        return ASTNode(NodeType.EXECUTE, None, [expr], {})

    def _parse_attest(self) -> ASTNode:
        self._consume("ATTEST")
        expr = self._parse_expression()
        self._consume(TokenType.SEMICOLON)
        return ASTNode(NodeType.ATTEST, None, [expr], {})

    def _parse_expression(self) -> ASTNode:
        # Function call: Module.function(args)
        if self._current().token_type == TokenType.IDENTIFIER:
            module = self._current().value
            self._advance()

            if self._current().token_type == TokenType.DOT:
                self._advance()
                func = self._consume(TokenType.IDENTIFIER).value
                self._consume(TokenType.LPAREN)
                args = []
                while self._current().token_type != TokenType.RPAREN:
                    args.append(self._parse_atom())
                    if self._current().token_type == TokenType.COMMA:
                        self._advance()
                self._consume(TokenType.RPAREN)

                if module == "Fibonacci":
                    return ASTNode(NodeType.FIBONACCI_CALL, func, args, {})
                elif module == "Golden":
                    return ASTNode(NodeType.GOLDEN_CALL, func, args, {})

        return self._parse_atom()

    def _parse_atom(self) -> ASTNode:
        token = self._current()

        if token.token_type == TokenType.NUMBER:
            self._advance()
            return ASTNode(NodeType.NUMBER, float(token.value), [], {})

        if token.token_type == TokenType.STRING:
            self._advance()
            return ASTNode(NodeType.STRING, token.value, [], {})

        if token.token_type == TokenType.IDENTIFIER:
            self._advance()
            return ASTNode(NodeType.IDENTIFIER, token.value, [], {})

        self._advance()
        return ASTNode(NodeType.IDENTIFIER, "unknown", [], {})

    def _parse_list(self) -> ASTNode:
        self._consume(TokenType.LBRACKET)
        items = []
        while self._current().token_type != TokenType.RBRACKET:
            items.append(self._parse_atom())
            if self._current().token_type == TokenType.COMMA:
                self._advance()
        self._consume(TokenType.RBRACKET)
        return ASTNode(NodeType.LIST, None, items, {})

    def _current(self) -> Token:
        return self.tokens[self.pos]

    def _advance(self):
        if not self._is_at_end():
            self.pos += 1

    def _consume(self, expected):
        if isinstance(expected, str):
            if self._current().value != expected:
                raise SyntaxError(f"Expected '{expected}', got '{self._current().value}'")
        elif isinstance(expected, TokenType):
            if self._current().token_type != expected:
                raise SyntaxError(f"Expected {expected}, got {self._current().token_type}")
        token = self._current()
        self._advance()
        return token

    def _is_at_end(self) -> bool:
        return self._current().token_type == TokenType.EOF

# ══════════════════════════════════════════════════════════════════
#  INTERPRETER
# ══════════════════════════════════════════════════════════════════

class CPLInterpreter:
    def __init__(self):
        self.env = {}

    def interpret(self, ast: ASTNode) -> Any:
        """Execute a CPL AST"""
        if ast.node_type == NodeType.PROTOCOL:
            if ast.value == "PROGRAM":
                results = []
                for child in ast.children:
                    results.append(self.interpret(child))
                return results
            else:
                # Single protocol
                protocol_results = []
                for stmt in ast.children:
                    result = self.interpret(stmt)
                    protocol_results.append(result)
                return {
                    "protocol_id": ast.value,
                    "results": protocol_results
                }

        elif ast.node_type == NodeType.EXECUTE:
            return self.interpret(ast.children[0])

        elif ast.node_type == NodeType.FIBONACCI_CALL:
            func = ast.value
            if func == "hash":
                arg = self.interpret(ast.children[0])
                return self._fibonacci_hash(str(arg))
            elif func == "sequence":
                n = int(self.interpret(ast.children[0]))
                return [self._fibonacci(i) for i in range(n)]

        elif ast.node_type == NodeType.GOLDEN_CALL:
            func = ast.value
            if func == "sequence":
                n = int(self.interpret(ast.children[0]))
                return [PHI ** i for i in range(n)]

        elif ast.node_type == NodeType.NUMBER:
            return ast.value

        elif ast.node_type == NodeType.STRING:
            return ast.value

        elif ast.node_type == NodeType.IDENTIFIER:
            return ast.value

        return None

    def _fibonacci(self, n: int) -> int:
        """Fast Fibonacci"""
        if n <= 1:
            return n
        a, b = 0, 1
        for _ in range(n):
            a, b = b, a + b
        return a

    def _fibonacci_hash(self, text: str) -> int:
        """Fibonacci hash"""
        h = 0
        for c in text:
            h = ((h << 5) - h + ord(c)) & 0xFFFFFFFF
        PHI_FRAC_U32 = 0x9e3779b9
        h = abs(h) * PHI_FRAC_U32
        return (h & 0xFFFFFFFF) % 131072

# ══════════════════════════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════════════════════════

def run_cpl(source: str) -> Any:
    """Execute a CPL program"""
    lexer = CPLLexer(source)
    tokens = lexer.tokenize()

    parser = CPLParser(tokens)
    ast = parser.parse()

    interpreter = CPLInterpreter()
    result = interpreter.interpret(ast)

    return result

if __name__ == "__main__":
    # Example CPL program
    program = """
    PROTOCOL PRT-001 {
        EXECUTE Fibonacci.sequence(10);
        EXECUTE Golden.sequence(5);
        ATTEST Fibonacci.hash("test");
    }
    """

    print("═" * 70)
    print("CPL — Catalan Protocol Language Interpreter")
    print("Casa de Medina — Architectos de Architectura Inteligente")
    print("═" * 70)
    print("\nExecuting program:")
    print(program)
    print("\n" + "─" * 70)
    result = run_cpl(program)
    print("\nResult:")
    print(result)
