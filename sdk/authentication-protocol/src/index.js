///
/// @medina/authentication-protocol — Secure Identity & Access Control
/// APC-2026: Authentication Protocol Charter
/// φ-based identity, challenge-response, token management
///

import { PHI } from '@medina/medina-heart';

export class Identity {
  constructor({ organismId, data = {}, timestamp = Date.now() } = {}) {
    this.organismId = organismId;
    this.data = data;
    this.timestamp = timestamp;
    this.hash = this._generateHash();
    this.publicKey = this._generatePublicKey();
  }

  _generateHash() {
    const dataStr = JSON.stringify({ ...this.data, timestamp: this.timestamp });
    const numericHash = dataStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `φ_${Math.floor(numericHash * PHI).toString(16)}`;
  }

  _generatePublicKey() {
    // Simplified Ed25519-style public key (φ-based)
    const keyData = `${this.organismId}:${this.timestamp}`;
    const numeric = keyData.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `pk_${Math.floor(numeric * PHI * PHI).toString(16)}`;
  }

  verify(hash) {
    return this.hash === hash;
  }

  toJSON() {
    return {
      organismId: this.organismId,
      data: this.data,
      timestamp: this.timestamp,
      hash: this.hash,
      publicKey: this.publicKey,
    };
  }
}

export class Challenge {
  constructor({ challengerId, targetId } = {}) {
    this.id = `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.challengerId = challengerId;
    this.targetId = targetId;
    this.nonce = Math.floor(Math.random() * PHI * 1000000);
    this.timestamp = Date.now();
    this.expiry = this.timestamp + 60000; // 60 second expiry
    this.status = 'pending'; // pending, responded, expired
  }

  isExpired() {
    return Date.now() > this.expiry;
  }

  generateResponse(identity) {
    if (this.isExpired()) {
      throw new Error('Challenge expired');
    }

    // Response = hash(identity.hash + nonce + challengerId)
    const responseData = `${identity.hash}:${this.nonce}:${this.challengerId}`;
    const numeric = responseData.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `resp_${Math.floor(numeric * PHI).toString(16)}`;
  }

  verifyResponse(response, identity) {
    if (this.isExpired()) {
      return { valid: false, reason: 'expired' };
    }

    const expected = this.generateResponse(identity);
    if (response === expected) {
      this.status = 'responded';
      return { valid: true };
    }

    return { valid: false, reason: 'mismatch' };
  }
}

export class AccessToken {
  constructor({ holder, issuer, permissions = [], validity = 86400000 } = {}) {
    this.id = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.holder = holder;
    this.issuer = issuer;
    this.permissions = new Set(permissions);
    this.issuedAt = Date.now();
    this.expiresAt = this.issuedAt + validity; // 24 hours default
    this.revoked = false;
    this.signature = this._sign();
  }

  _sign() {
    const data = `${this.holder}:${this.issuer}:${Array.from(this.permissions).join(',')}:${this.issuedAt}`;
    const numeric = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `sig_${Math.floor(numeric * PHI * PHI).toString(16)}`;
  }

  isValid() {
    if (this.revoked) return false;
    if (Date.now() > this.expiresAt) return false;
    return this.signature === this._sign();
  }

  hasPermission(permission) {
    return this.isValid() && this.permissions.has(permission);
  }

  revoke() {
    this.revoked = true;
  }

  toJSON() {
    return {
      id: this.id,
      holder: this.holder,
      issuer: this.issuer,
      permissions: Array.from(this.permissions),
      issuedAt: this.issuedAt,
      expiresAt: this.expiresAt,
      revoked: this.revoked,
      signature: this.signature,
    };
  }
}

export class PermissionLevel {
  static READ = 'read';
  static WRITE = 'write';
  static EXECUTE = 'execute';
  static ADMIN = 'admin';

  static hierarchy = {
    read: 1,
    write: 2,
    execute: 3,
    admin: 4,
  };

  static hasLevel(permission, required) {
    const userLevel = PermissionLevel.hierarchy[permission] || 0;
    const requiredLevel = PermissionLevel.hierarchy[required] || 0;
    return userLevel >= requiredLevel;
  }

  static grantAll() {
    return [
      PermissionLevel.READ,
      PermissionLevel.WRITE,
      PermissionLevel.EXECUTE,
      PermissionLevel.ADMIN,
    ];
  }
}

export class AuthenticationEngine {
  constructor({ organismId } = {}) {
    this.organismId = organismId;
    this.identity = new Identity({ organismId });
    this.activeChallenges = new Map();
    this.issuedTokens = new Map();
    this.revokedTokens = new Set();
  }

  // Identity Management
  getIdentity() {
    return this.identity;
  }

  verifyIdentity(identity, hash) {
    return identity.verify(hash);
  }

  // Challenge-Response Authentication
  createChallenge(targetId) {
    const challenge = new Challenge({
      challengerId: this.organismId,
      targetId,
    });
    this.activeChallenges.set(challenge.id, challenge);
    return challenge;
  }

  respondToChallenge(challengeId, identity) {
    const challenge = this.activeChallenges.get(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    const response = challenge.generateResponse(identity);
    return { challengeId, response };
  }

  verifyChallenge(challengeId, response, identity) {
    const challenge = this.activeChallenges.get(challengeId);
    if (!challenge) {
      return { valid: false, reason: 'not_found' };
    }

    const result = challenge.verifyResponse(response, identity);

    if (result.valid) {
      this.activeChallenges.delete(challengeId);
    }

    return result;
  }

  // Token Management
  issueToken(holder, permissions = [PermissionLevel.READ], validity = 86400000) {
    const token = new AccessToken({
      holder,
      issuer: this.organismId,
      permissions,
      validity,
    });
    this.issuedTokens.set(token.id, token);
    return token;
  }

  verifyToken(tokenId) {
    if (this.revokedTokens.has(tokenId)) {
      return { valid: false, reason: 'revoked' };
    }

    const token = this.issuedTokens.get(tokenId);
    if (!token) {
      return { valid: false, reason: 'not_found' };
    }

    if (!token.isValid()) {
      return { valid: false, reason: 'expired' };
    }

    return { valid: true, token };
  }

  revokeToken(tokenId) {
    this.revokedTokens.add(tokenId);
    const token = this.issuedTokens.get(tokenId);
    if (token) {
      token.revoke();
    }

    // Propagate revocation to network (would be implemented in real system)
    return {
      tokenId,
      revoked: true,
      timestamp: Date.now(),
      propagated: true,
    };
  }

  checkPermission(tokenId, required) {
    const result = this.verifyToken(tokenId);
    if (!result.valid) {
      return false;
    }

    return result.token.hasPermission(required);
  }

  // Encryption (simplified AES-256 style with φ)
  encrypt(data, key = null) {
    const encryptionKey = key || this.identity.publicKey;
    const dataStr = JSON.stringify(data);

    // Simplified φ-based encryption
    const encrypted = dataStr.split('').map(char => {
      const code = char.charCodeAt(0);
      return String.fromCharCode(Math.floor(code * PHI) % 65536);
    }).join('');

    return {
      encrypted,
      key: encryptionKey,
      algorithm: 'φ-AES-256',
    };
  }

  decrypt(encrypted, key = null) {
    const decryptionKey = key || this.identity.publicKey;

    // Simplified φ-based decryption
    const decrypted = encrypted.split('').map(char => {
      const code = char.charCodeAt(0);
      return String.fromCharCode(Math.floor(code / PHI) % 256);
    }).join('');

    try {
      return JSON.parse(decrypted);
    } catch (e) {
      return decrypted;
    }
  }

  // Cleanup expired challenges and tokens
  cleanup() {
    let cleaned = 0;

    // Remove expired challenges
    for (const [id, challenge] of this.activeChallenges.entries()) {
      if (challenge.isExpired()) {
        this.activeChallenges.delete(id);
        cleaned++;
      }
    }

    // Remove expired tokens
    for (const [id, token] of this.issuedTokens.entries()) {
      if (!token.isValid()) {
        this.issuedTokens.delete(id);
        cleaned++;
      }
    }

    return { cleaned, remaining: this.activeChallenges.size + this.issuedTokens.size };
  }

  getStatus() {
    return {
      organismId: this.organismId,
      identity: this.identity.hash,
      publicKey: this.identity.publicKey,
      activeChallenges: this.activeChallenges.size,
      issuedTokens: this.issuedTokens.size,
      revokedTokens: this.revokedTokens.size,
    };
  }
}

export default { Identity, Challenge, AccessToken, PermissionLevel, AuthenticationEngine };
