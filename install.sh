#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────
# install.sh — Sovereign Organism Extension Installer
#
# Works anywhere: USB drive, download folder, extracted tarball.
# No git. No npm. No Node.js. Just bash + a browser.
#
# Usage:
#   bash install.sh            # install all extensions
#   bash install.sh --list     # list available extensions
#   bash install.sh --help     # show help
#   bash install.sh --only nova-cortex,nova-forge
#   bash install.sh --browser firefox
#   bash install.sh --out ~/my-extensions
# ───────────────────────────────────────────────────────────
set -euo pipefail

# ══════════════════════════════════════════════════════════════
#  GOLDEN CONSTANTS
# ══════════════════════════════════════════════════════════════

readonly VERSION="1.0.0"
readonly MANIFEST_VERSION="1.0.0"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Colors ────────────────────────────────────────────────────

if [[ -t 1 ]]; then
  GOLD=$'\033[38;5;178m'
  GREEN=$'\033[32m'
  CYAN=$'\033[36m'
  RED=$'\033[31m'
  DIM=$'\033[2m'
  BOLD=$'\033[1m'
  RESET=$'\033[0m'
else
  GOLD="" GREEN="" CYAN="" RED="" DIM="" BOLD="" RESET=""
fi

# ══════════════════════════════════════════════════════════════
#  THE 20 SOVEREIGN EXTENSIONS
#  Format: ID|SLUG|NAME|CLASS|CAPABILITY|ENGINES|ENC|CONTRACT|PERMS
# ══════════════════════════════════════════════════════════════

EXTENSIONS=(
  "EXT-001|nova-cortex|Nova Cortex|Reasoning Intelligence|Multi-engine reasoning synthesis|Nova Cognos,Nova Profundis,Nova Fusio|FIBONACCI_HASH|MULTI_MODEL_CONSENSUS|activeTab,storage,tabs,scripting,sidePanel"
  "EXT-002|nova-scholar|Nova Scholar|Reasoning Intelligence|Deep document reasoning|Nova Profundis,Nova Cognos,Nova Memoria,Nova Vector|PHI_CASCADE|CHAIN_OF_THOUGHT_PROOF|activeTab,storage,tabs,scripting,sidePanel"
  "EXT-003|nova-polyglot|Nova Polyglot|Reasoning Intelligence|Universal multilingual reasoning|Nova Lingua,Nova Stratos,Nova Harmonia|SOVEREIGN_SEAL|SOVEREIGN_EXECUTION|activeTab,storage,tabs,scripting,privacy,tabCapture,sidePanel"
  "EXT-004|nova-logic|Nova Logic|Reasoning Intelligence|Formal mathematical reasoning|Nova Formalis,Nova Cognos,Nova Codex|FIBONACCI_HASH|CHAIN_OF_THOUGHT_PROOF|activeTab,storage,tabs,scripting,sidePanel"
  "EXT-005|nova-canvas|Nova Canvas|Creative Intelligence|Sovereign multi-engine image generation|Nova Pictor,Nova Visio,Nova Segmentum,Nova Fusio|NONE|OUTPUT_ATTESTATION|activeTab,storage,tabs,downloads,sidePanel"
  "EXT-006|nova-director|Nova Director|Creative Intelligence|Sovereign multi-engine video intelligence|Nova Kinema,Nova Pictor,Nova Fusio|NONE|OUTPUT_ATTESTATION|activeTab,storage,tabs,downloads,sidePanel"
  "EXT-007|nova-composer|Nova Composer|Creative Intelligence|Sovereign multi-engine audio intelligence|Nova Harmonia,Nova Vox,Nova Cognos,Nova Fusio|NONE|OUTPUT_ATTESTATION|activeTab,storage,tabs,downloads,tabCapture,sidePanel"
  "EXT-008|nova-forge|Nova Forge|Creative Intelligence|Sovereign multi-engine code generation|Nova Codex,Nova Algorithmus,Nova Cognos,Nova Stratos|PHI_CASCADE|INTELLIGENCE_VERIFY|activeTab,storage,tabs,downloads,sidePanel"
  "EXT-009|nova-lens|Nova Lens|Analysis Intelligence|Sovereign multi-engine visual analysis|Nova Cognos,Nova Segmentum,Nova Visio,Nova Vector|FIBONACCI_HASH|OUTPUT_ATTESTATION|activeTab,storage,tabs,webNavigation,scripting,sidePanel"
  "EXT-010|nova-veritas|Nova Veritas|Analysis Intelligence|Sovereign AI-powered fact verification|Nova Scrutator,Nova Cognos,Nova Custodis,Nova Ranker|PHI_CASCADE|CHAIN_OF_THOUGHT_PROOF|activeTab,storage,tabs,webNavigation,scripting,sidePanel"
  "EXT-011|nova-datum|Nova Datum|Analysis Intelligence|Sovereign multi-engine data analysis|Nova Analytica,Nova Cognos,Nova Codex|FIBONACCI_HASH|INTELLIGENCE_VERIFY|activeTab,storage,tabs,webNavigation,scripting,sidePanel"
  "EXT-012|nova-sentinel|Nova Sentinel|Analysis Intelligence|Sovereign intelligent web monitoring|Nova Vector,Nova Scrutator,Nova Stratos|SOVEREIGN_SEAL|SOVEREIGN_EXECUTION|activeTab,storage,tabs,webNavigation,scripting,sidePanel"
  "EXT-013|nova-shield|Nova Shield|Security Intelligence|Sovereign AI encryption and privacy|Nova Custodis,Nova Stratos,Nova Cognos|PHANTOM_ZERO_KNOWLEDGE|SOVEREIGN_EXECUTION|activeTab,storage,webRequest,cookies,privacy,scripting,sidePanel"
  "EXT-014|nova-guardian|Nova Guardian|Security Intelligence|Sovereign multi-engine content safety|Nova Custodis,Nova Profundis,Nova Stratos|E8_LATTICE|MULTI_MODEL_CONSENSUS|activeTab,storage,webRequest,cookies,privacy,scripting,sidePanel"
  "EXT-015|nova-phantom|Nova Phantom|Security Intelligence|Sovereign zero-knowledge browsing intelligence|Nova Cognos,Nova Stratos|PHANTOM_ZERO_KNOWLEDGE|SOVEREIGN_EXECUTION|activeTab,storage,webRequest,cookies,privacy,scripting,sidePanel"
  "EXT-016|nova-vault|Nova Vault|Security Intelligence|Sovereign AI-powered secret management|Nova Stratos,Nova Custodis,Nova Vector|E8_LATTICE|SOVEREIGN_EXECUTION|activeTab,storage,webRequest,cookies,privacy,scripting,sidePanel"
  "EXT-017|nova-architect|Nova Architect|Workflow Intelligence|Sovereign multi-AI workflow orchestration|Nova Cognos,Nova Codex,Nova Profundis,Nova Custodis|PHI_CASCADE|INTELLIGENCE_VERIFY|activeTab,storage,tabs,alarms,notifications,scripting,sidePanel"
  "EXT-018|nova-scribe|Nova Scribe|Workflow Intelligence|Sovereign multi-engine document intelligence|Nova Profundis,Nova Cognos,Nova Structura|FIBONACCI_HASH|OUTPUT_ATTESTATION|activeTab,storage,tabs,alarms,notifications,scripting,sidePanel"
  "EXT-019|nova-nexus|Nova Nexus|Workflow Intelligence|Sovereign multi-platform social intelligence|Nova Socialis,Nova Scrutator,Nova Cognos|FIBONACCI_HASH|OUTPUT_ATTESTATION|activeTab,storage,tabs,alarms,notifications,scripting,sidePanel"
  "EXT-020|nova-empath|Nova Empath|Workflow Intelligence|Sovereign empathic AI conversation|Nova Empathos,Nova Profundis,Nova Custodis|PHANTOM_ZERO_KNOWLEDGE|SOVEREIGN_EXECUTION|activeTab,storage,tabs,alarms,notifications,scripting,privacy,sidePanel"
)

# ══════════════════════════════════════════════════════════════
#  DEFAULTS
# ══════════════════════════════════════════════════════════════

BROWSER="edge"
OUT_DIR="./nova-extensions"
ONLY=""

# ══════════════════════════════════════════════════════════════
#  USAGE / HELP
# ══════════════════════════════════════════════════════════════

usage() {
  cat <<EOF
${GOLD}╔══════════════════════════════════════════════════════════════╗
║   ${BOLD}NOVA SOVEREIGN ORGANISM EXTENSION INSTALLER${RESET}${GOLD}                ║
║   ${DIM}v${VERSION} — Casa de Medina${RESET}${GOLD}                                    ║
╚══════════════════════════════════════════════════════════════╝${RESET}

${BOLD}USAGE${RESET}
  bash install.sh ${DIM}[OPTIONS]${RESET}

${BOLD}OPTIONS${RESET}
  ${GREEN}--list${RESET}              List all 20 available extensions
  ${GREEN}--help, -h${RESET}          Show this help message
  ${GREEN}--browser${RESET} ${CYAN}TYPE${RESET}      Target browser: ${BOLD}edge${RESET} (default) | chrome | firefox | safari
  ${GREEN}--out${RESET} ${CYAN}DIR${RESET}           Output directory (default: ./nova-extensions)
  ${GREEN}--only${RESET} ${CYAN}SLUGS${RESET}        Comma-separated list of extension slugs to install
                      e.g. --only nova-cortex,nova-forge,nova-shield

${BOLD}EXAMPLES${RESET}
  ${DIM}# Install all 20 extensions for Edge${RESET}
  bash install.sh

  ${DIM}# Install for Firefox${RESET}
  bash install.sh --browser firefox

  ${DIM}# Install only security extensions${RESET}
  bash install.sh --only nova-shield,nova-guardian,nova-phantom,nova-vault

  ${DIM}# Install to a specific folder${RESET}
  bash install.sh --out ~/Desktop/nova-ext

${BOLD}LOADING INTO YOUR BROWSER${RESET}
  ${CYAN}Edge / Chrome:${RESET}
    1. Open ${BOLD}edge://extensions${RESET} (or ${BOLD}chrome://extensions${RESET})
    2. Enable ${BOLD}Developer mode${RESET} (toggle in top-right)
    3. Click ${BOLD}Load unpacked${RESET}
    4. Select the extension folder (e.g. nova-extensions/nova-cortex)

  ${CYAN}Firefox:${RESET}
    1. Open ${BOLD}about:debugging#/runtime/this-firefox${RESET}
    2. Click ${BOLD}Load Temporary Add-on${RESET}
    3. Select the ${BOLD}manifest.json${RESET} inside the extension folder

${BOLD}REQUIREMENTS${RESET}
  bash (any version)
  No git, npm, Node.js, or internet connection needed.

EOF
}

# ══════════════════════════════════════════════════════════════
#  LIST
# ══════════════════════════════════════════════════════════════

list_extensions() {
  echo ""
  echo "${GOLD}${BOLD}  NOVA SOVEREIGN EXTENSIONS — 20 AI Intelligences${RESET}"
  echo "${DIM}  ──────────────────────────────────────────────────${RESET}"
  echo ""

  local prev_class=""
  for entry in "${EXTENSIONS[@]}"; do
    IFS='|' read -r id slug name class capability engines enc contract perms <<< "$entry"

    if [[ "$class" != "$prev_class" ]]; then
      echo "  ${GOLD}${BOLD}${class}${RESET}"
      prev_class="$class"
    fi

    local engine_count
    engine_count=$(echo "$engines" | tr ',' '\n' | wc -l | tr -d ' ')
    printf "    ${GREEN}%-14s${RESET} ${BOLD}%-18s${RESET} ${DIM}%s${RESET} ${CYAN}(%s engines)${RESET}\n" \
      "$id" "$name" "$capability" "$engine_count"
  done

  echo ""
  echo "  ${DIM}Total: ${#EXTENSIONS[@]} extensions · Use ${RESET}${GREEN}bash install.sh${RESET}${DIM} to install all${RESET}"
  echo ""
}

# ══════════════════════════════════════════════════════════════
#  PARSE ARGUMENTS
# ══════════════════════════════════════════════════════════════

ACTION="install"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --list)
      ACTION="list"
      shift
      ;;
    --help|-h)
      ACTION="help"
      shift
      ;;
    --browser)
      BROWSER="${2:-edge}"
      shift 2
      ;;
    --out)
      OUT_DIR="${2:-./ nova-extensions}"
      shift 2
      ;;
    --only)
      ONLY="${2:-}"
      shift 2
      ;;
    *)
      echo "${RED}error: unknown option: $1${RESET}" >&2
      echo "Run ${GREEN}bash install.sh --help${RESET} for usage." >&2
      exit 1
      ;;
  esac
done

# Dispatch
case "$ACTION" in
  help) usage; exit 0 ;;
  list) list_extensions; exit 0 ;;
esac

# ══════════════════════════════════════════════════════════════
#  ICON GENERATOR — Creates placeholder SVG icons
# ══════════════════════════════════════════════════════════════

generate_icon_svg() {
  local name="$1"
  local size="$2"

  # Derive a hue from the name so each extension gets a unique color
  local hash=0
  for (( i=0; i<${#name}; i++ )); do
    hash=$(( (hash * 31 + $(printf '%d' "'${name:$i:1}")) % 360 ))
  done
  local hue=$hash

  cat <<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${hue},70%,55%);stop-opacity:1"/>
      <stop offset="100%" style="stop-color:hsl($(( (hue + 40) % 360 )),80%,35%);stop-opacity:1"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="$(( size / 5 ))" fill="url(#g)"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        fill="white" font-family="system-ui,sans-serif"
        font-weight="700" font-size="$(( size * 40 / 100 ))">N</text>
</svg>
SVG
}

# ══════════════════════════════════════════════════════════════
#  POPUP HTML GENERATOR
# ══════════════════════════════════════════════════════════════

generate_popup_html() {
  local name="$1"
  local slug="$2"
  local class="$3"
  local capability="$4"
  local engines="$5"

  cat <<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 380px;
      min-height: 500px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: #0d0d1a;
      color: #e0e0e0;
    }
    .header {
      background: linear-gradient(135deg, #c9a84c 0%, #8b6914 100%);
      color: white;
      padding: 16px 20px;
    }
    .header h1 { font-size: 18px; margin-bottom: 4px; }
    .header .subtitle { font-size: 12px; opacity: 0.85; }
    .tabs {
      display: flex;
      background: #1a1a2e;
      border-bottom: 1px solid #2d2d44;
    }
    .tab {
      flex: 1;
      padding: 10px;
      text-align: center;
      font-size: 12px;
      cursor: pointer;
      border: none;
      background: none;
      color: #888;
      transition: all 0.2s;
    }
    .tab.active { color: #c9a84c; border-bottom: 2px solid #c9a84c; }
    .tab:hover { color: #e0e0e0; }
    .content { padding: 16px 20px; }
    .engine-list { list-style: none; }
    .engine-list li {
      padding: 8px 12px;
      margin-bottom: 6px;
      background: #1a1a2e;
      border-radius: 8px;
      border-left: 3px solid #c9a84c;
      font-size: 13px;
    }
    .engine-name { font-weight: 600; color: #c9a84c; }
    .chat-area {
      display: flex;
      flex-direction: column;
      height: 340px;
    }
    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }
    .input-row {
      display: flex;
      gap: 8px;
      padding-top: 8px;
    }
    .input-row textarea {
      flex: 1;
      resize: none;
      border: 1px solid #2d2d44;
      border-radius: 8px;
      padding: 10px;
      font-size: 13px;
      background: #1a1a2e;
      color: #e0e0e0;
      font-family: inherit;
    }
    .input-row button {
      background: linear-gradient(135deg, #c9a84c, #8b6914);
      border: none;
      color: white;
      border-radius: 8px;
      padding: 10px 16px;
      cursor: pointer;
      font-size: 16px;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      background: #1e3a2f;
      color: #4caf50;
      margin-top: 4px;
    }
    .settings { font-size: 13px; }
    .settings label { display: block; margin-bottom: 12px; }
    .settings input[type="text"],
    .settings input[type="password"] {
      width: 100%;
      padding: 8px 10px;
      margin-top: 4px;
      border: 1px solid #2d2d44;
      border-radius: 6px;
      background: #1a1a2e;
      color: #e0e0e0;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${name}</h1>
    <div class="subtitle">${capability}</div>
    <span class="badge">${class}</span>
  </div>

  <div class="tabs">
    <button class="tab active" data-tab="chat">Chat</button>
    <button class="tab" data-tab="engines">Engines</button>
    <button class="tab" data-tab="settings">Settings</button>
  </div>

  <div class="content" id="tab-chat">
    <div class="chat-area">
      <div class="messages" id="messages">
        <div style="text-align:center;color:#666;padding:40px 0;font-size:13px;">
          Ask ${name} anything.<br>
          <span style="font-size:11px;color:#444;">Powered by Nova sovereign engines</span>
        </div>
      </div>
      <div class="input-row">
        <textarea id="chat-input" rows="2" placeholder="Ask ${name}..."></textarea>
        <button id="send-btn">&#9654;</button>
      </div>
    </div>
  </div>

  <div class="content" id="tab-engines" style="display:none;">
    <ul class="engine-list">
$(echo "$engines" | tr ',' '\n' | while read -r eng; do
  echo "      <li><span class=\"engine-name\">${eng}</span></li>"
done)
    </ul>
  </div>

  <div class="content" id="tab-settings" style="display:none;">
    <div class="settings">
      <label>
        Nova API Key
        <input type="password" id="api-key" placeholder="nova-key-...">
      </label>
      <label>
        API Base URL
        <input type="text" id="base-url" placeholder="https://api.nova-protocol.ai" value="https://api.nova-protocol.ai">
      </label>
    </div>
  </div>

  <script>
    // Tab switching
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.querySelectorAll('.content').forEach(c => c.style.display = 'none');
        const el = document.getElementById('tab-' + target);
        if (el) el.style.display = 'block';
      });
    });

    // Chat send
    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const messages = document.getElementById('messages');

    function addMessage(role, text) {
      const div = document.createElement('div');
      div.style.cssText = 'padding:8px 12px;margin:6px 0;border-radius:8px;font-size:13px;line-height:1.5;white-space:pre-wrap;word-break:break-word;' +
        (role === 'user'
          ? 'background:#2d2d44;margin-left:24px;border-bottom-right-radius:4px;'
          : 'background:#1e3a2f;margin-right:24px;border-bottom-left-radius:4px;border-left:3px solid #c9a84c;');
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function send() {
      const text = chatInput.value.trim();
      if (!text) return;
      chatInput.value = '';
      addMessage('user', text);

      // Send to background worker
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        chrome.runtime.sendMessage({
          type: 'NOVA_CHAT_REQUEST',
          payload: { messages: [{ role: 'user', content: text }] },
          requestId: 'msg-' + Date.now().toString(36),
          timestamp: Date.now()
        }, function(response) {
          if (response && response.content) {
            addMessage('assistant', response.content);
          } else if (response && response.error) {
            addMessage('assistant', '[Error] ' + response.error);
          }
        });
      } else {
        addMessage('assistant', '[${name}] Engine not connected. Load this extension in your browser to activate sovereign AI.');
      }
    }

    sendBtn.addEventListener('click', send);
    chatInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });
  </script>
</body>
</html>
HTML
}

# ══════════════════════════════════════════════════════════════
#  SIDEBAR HTML GENERATOR
# ══════════════════════════════════════════════════════════════

generate_sidebar_html() {
  local name="$1"
  local slug="$2"

  cat <<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} — Sidebar</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: #0d0d1a;
      color: #e0e0e0;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .header {
      background: linear-gradient(135deg, #c9a84c 0%, #8b6914 100%);
      color: white;
      padding: 12px 16px;
      font-weight: 600;
      font-size: 15px;
    }
    .messages { flex: 1; overflow-y: auto; padding: 12px; }
    .input-row {
      display: flex; gap: 8px; padding: 12px;
      border-top: 1px solid #2d2d44;
    }
    .input-row textarea {
      flex: 1; resize: none; border: 1px solid #2d2d44;
      border-radius: 8px; padding: 10px; font-size: 13px;
      background: #1a1a2e; color: #e0e0e0; font-family: inherit;
    }
    .input-row button {
      background: linear-gradient(135deg, #c9a84c, #8b6914);
      border: none; color: white; border-radius: 8px;
      padding: 10px 16px; cursor: pointer; font-size: 16px;
    }
  </style>
</head>
<body>
  <div class="header">${name}</div>
  <div class="messages" id="messages">
    <div style="text-align:center;color:#666;padding:40px 16px;font-size:13px;">
      ${name} sidebar is ready.<br>Select text on any page and press Alt+N.
    </div>
  </div>
  <div class="input-row">
    <textarea id="input" rows="2" placeholder="Ask ${name}..."></textarea>
    <button id="send">&#9654;</button>
  </div>
  <script>
    const msg = document.getElementById('messages');
    const inp = document.getElementById('input');
    document.getElementById('send').addEventListener('click', function() {
      const t = inp.value.trim(); if (!t) return; inp.value = '';
      const d = document.createElement('div');
      d.style.cssText = 'padding:8px 12px;margin:6px 0;border-radius:8px;font-size:13px;background:#2d2d44;margin-left:24px;';
      d.textContent = t; msg.appendChild(d); msg.scrollTop = msg.scrollHeight;
    });
  </script>
</body>
</html>
HTML
}

# ══════════════════════════════════════════════════════════════
#  BACKGROUND WORKER GENERATOR
# ══════════════════════════════════════════════════════════════

generate_background_worker() {
  local name="$1"
  local slug="$2"
  local id="$3"

  cat <<'JS'
///
/// NOVA BACKGROUND WORKER — ${NAME} (${ID})
///
/// Service worker for the ${NAME} browser extension.
/// Routes messages between content script and popup.
/// Dispatches AI calls to Nova sovereign engines.
///

const NOVA_API_BASE = 'https://api.nova-protocol.ai';
let apiKey = '';

// Load config on startup
chrome.storage.local.get(['nova-protocol-config'], (result) => {
  const config = result['nova-protocol-config'] || {};
  apiKey = config.apiKey || '';
});

// Message handler
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.type) return false;

  switch (msg.type) {
    case 'NOVA_CHAT_REQUEST':
      handleChat(msg).then(sendResponse).catch(e => sendResponse({ error: e.message }));
      return true;

    case 'NOVA_GET_CONFIG':
      chrome.storage.local.get(['nova-protocol-config'], (result) => {
        sendResponse(result['nova-protocol-config'] || {});
      });
      return true;

    case 'NOVA_SET_CONFIG':
      chrome.storage.local.get(['nova-protocol-config'], (result) => {
        const config = { ...(result['nova-protocol-config'] || {}), ...msg.payload };
        chrome.storage.local.set({ 'nova-protocol-config': config }, () => {
          if (config.apiKey) apiKey = config.apiKey;
          sendResponse({ saved: true });
        });
      });
      return true;

    case 'NOVA_ENGINE_STATUS':
      sendResponse({ status: 'active', engines: 23 });
      return true;

    default:
      sendResponse({ error: 'Unknown message type: ' + msg.type });
      return true;
  }
});

async function handleChat(msg) {
  if (!apiKey) {
    return { error: 'API key not configured. Open extension settings to set your Nova API key.' };
  }

  const messages = (msg.payload && msg.payload.messages) || [];

  try {
    const response = await fetch(NOVA_API_BASE + '/v1/engines/cognos/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      return { error: 'API error: ' + response.status };
    }

    const data = await response.json();
    return {
      content: data.content || data.choices?.[0]?.message?.content || 'No response',
      engine: 'NOV-001',
      engineName: 'Nova Cognos',
    };
  } catch (err) {
    return { error: err.message || 'Network error' };
  }
}
JS
}

# ══════════════════════════════════════════════════════════════
#  CONTENT SCRIPT GENERATOR
# ══════════════════════════════════════════════════════════════

generate_content_script() {
  local name="$1"
  local slug="$2"

  cat <<JS
///
/// NOVA CONTENT SCRIPT — ${name}
///
/// Injected into every page. Provides:
///   - Text selection → AI action menu
///   - Keyboard shortcut (Alt+N) → toggle sidebar
///   - Page context extraction for AI analysis
///

(function() {
  'use strict';

  const EXTENSION_NAME = '${name}';
  const SIDEBAR_ID = 'nova-ai-sidebar';
  const MENU_ID = 'nova-action-menu';
  let sidebarVisible = false;

  // ── Keyboard shortcut ──────────────────────────────────────
  document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 'n') {
      e.preventDefault();
      toggleSidebar();
    }
  });

  function toggleSidebar() {
    let sidebar = document.getElementById(SIDEBAR_ID);
    if (!sidebar) {
      sidebar = createSidebar();
    }
    sidebarVisible = !sidebarVisible;
    sidebar.style.display = sidebarVisible ? 'flex' : 'none';
  }

  // ── Sidebar creation ───────────────────────────────────────
  function createSidebar() {
    const sb = document.createElement('div');
    sb.id = SIDEBAR_ID;
    Object.assign(sb.style, {
      position: 'fixed', top: '0', right: '0',
      width: '360px', height: '100vh',
      background: '#0d0d1a', color: '#e0e0e0',
      borderLeft: '2px solid #c9a84c',
      display: 'none', flexDirection: 'column',
      zIndex: '2147483646',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      fontSize: '14px',
      boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
    });
    sb.innerHTML =
      '<div style="background:linear-gradient(135deg,#c9a84c,#8b6914);color:white;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;">' +
        '<span style="font-weight:600;">' + EXTENSION_NAME + '</span>' +
        '<button id="nova-close" style="background:none;border:none;color:white;font-size:20px;cursor:pointer;">&times;</button>' +
      '</div>' +
      '<div id="nova-msgs" style="flex:1;overflow-y:auto;padding:12px;"></div>' +
      '<div style="display:flex;gap:8px;padding:12px;border-top:1px solid #2d2d44;">' +
        '<textarea id="nova-inp" rows="2" placeholder="Ask ' + EXTENSION_NAME + '..." style="flex:1;resize:none;border:1px solid #2d2d44;border-radius:8px;padding:10px;font-size:13px;background:#1a1a2e;color:#e0e0e0;font-family:inherit;"></textarea>' +
        '<button id="nova-send" style="background:linear-gradient(135deg,#c9a84c,#8b6914);border:none;color:white;border-radius:8px;padding:10px 16px;cursor:pointer;font-size:16px;">&#9654;</button>' +
      '</div>';
    document.body.appendChild(sb);

    document.getElementById('nova-close').addEventListener('click', toggleSidebar);
    document.getElementById('nova-send').addEventListener('click', sendChat);
    document.getElementById('nova-inp').addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
    });

    return sb;
  }

  function sendChat() {
    var inp = document.getElementById('nova-inp');
    var text = inp.value.trim();
    if (!text) return;
    inp.value = '';
    appendMsg('user', text);

    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({
        type: 'NOVA_CHAT_REQUEST',
        payload: {
          messages: [{ role: 'user', content: text }],
          pageContext: {
            url: window.location.href,
            title: document.title,
          }
        },
        requestId: 'msg-' + Date.now().toString(36),
        timestamp: Date.now()
      }, function(response) {
        if (response && response.content) {
          appendMsg('assistant', response.content);
        } else if (response && response.error) {
          appendMsg('assistant', '[Error] ' + response.error);
        }
      });
    }
  }

  function appendMsg(role, text) {
    var container = document.getElementById('nova-msgs');
    if (!container) return;
    var div = document.createElement('div');
    div.style.cssText = 'padding:8px 12px;margin:6px 0;border-radius:8px;font-size:13px;line-height:1.5;white-space:pre-wrap;word-break:break-word;' +
      (role === 'user'
        ? 'background:#2d2d44;margin-left:24px;'
        : 'background:#1e3a2f;margin-right:24px;border-left:3px solid #c9a84c;');
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  // ── Selection action menu ──────────────────────────────────
  document.addEventListener('mouseup', function() {
    var sel = window.getSelection();
    var text = sel ? sel.toString().trim() : '';
    hideMenu();
    if (text.length > 2) showMenu(text);
  });

  function showMenu(selectedText) {
    var sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    var rect = sel.getRangeAt(0).getBoundingClientRect();

    var menu = document.createElement('div');
    menu.id = MENU_ID;
    Object.assign(menu.style, {
      position: 'fixed', top: (rect.bottom + 8) + 'px', left: rect.left + 'px',
      zIndex: '2147483647', display: 'flex', gap: '4px',
      background: '#0d0d1a', border: '1px solid #c9a84c',
      borderRadius: '8px', padding: '6px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    });

    var actions = [
      { icon: '\\u{1F4A1}', label: 'Explain', action: 'explain' },
      { icon: '\\u{1F4C4}', label: 'Summarize', action: 'summarize' },
      { icon: '\\u{1F310}', label: 'Translate', action: 'translate' },
      { icon: '\\u{1F4BB}', label: 'Code', action: 'code' },
    ];

    actions.forEach(function(a) {
      var btn = document.createElement('button');
      btn.textContent = a.icon + ' ' + a.label;
      Object.assign(btn.style, {
        background: 'none', border: '1px solid #2d2d44',
        borderRadius: '6px', padding: '6px 10px', cursor: 'pointer',
        fontSize: '12px', color: '#e0e0e0', whiteSpace: 'nowrap',
      });
      btn.addEventListener('mouseover', function() { btn.style.borderColor = '#c9a84c'; });
      btn.addEventListener('mouseout', function() { btn.style.borderColor = '#2d2d44'; });
      btn.addEventListener('click', function() {
        hideMenu();
        if (!sidebarVisible) toggleSidebar();
        var prompt = a.label + ' this:\n\n' + selectedText;
        appendMsg('user', prompt);
      });
      menu.appendChild(btn);
    });

    document.body.appendChild(menu);
  }

  function hideMenu() {
    var m = document.getElementById(MENU_ID);
    if (m) m.remove();
  }
})();
JS
}

# ══════════════════════════════════════════════════════════════
#  CONTENT SCRIPT CSS
# ══════════════════════════════════════════════════════════════

generate_content_css() {
  cat <<CSS
/* Nova sovereign content script styles — injected into pages */
/* Additional styling is done inline by the content script JS */
CSS
}

# ══════════════════════════════════════════════════════════════
#  MANIFEST.JSON GENERATOR
# ══════════════════════════════════════════════════════════════

generate_manifest() {
  local id="$1"
  local slug="$2"
  local name="$3"
  local class="$4"
  local capability="$5"
  local engines="$6"
  local enc="$7"
  local contract="$8"
  local perms_csv="$9"
  local browser="${10}"

  # Build permissions JSON array
  local perms_json=""
  IFS=',' read -ra perm_arr <<< "$perms_csv"
  for p in "${perm_arr[@]}"; do
    p="$(echo "$p" | tr -d ' ')"
    # Skip sidePanel for Firefox/Safari — not supported
    if [[ "$browser" == "firefox" || "$browser" == "safari" ]] && [[ "$p" == "sidePanel" ]]; then
      continue
    fi
    if [[ -n "$perms_json" ]]; then perms_json="${perms_json}, "; fi
    perms_json="${perms_json}\"${p}\""
  done

  # Side panel block (Edge/Chrome only)
  local side_panel_block=""
  if [[ "$browser" == "edge" || "$browser" == "chrome" ]]; then
    side_panel_block="$(cat <<SIDE
  "side_panel": {
    "default_path": "sidebar/${slug}.html"
  },
SIDE
)"
  fi

  # Firefox-specific gecko settings
  local firefox_block=""
  if [[ "$browser" == "firefox" ]]; then
    firefox_block="$(cat <<GECKO
  "browser_specific_settings": {
    "gecko": {
      "id": "${slug}@nova-protocol.ai",
      "strict_min_version": "109.0"
    }
  },
GECKO
)"
  fi

  cat <<MANIFEST
{
  "manifest_version": 3,
  "name": "${name}",
  "version": "${MANIFEST_VERSION}",
  "description": "${capability} — ${class}. Powered by Nova sovereign engines: ${engines}. Encryption: ${enc}. Contract: ${contract}.",

  "icons": {
    "16": "icons/${slug}-16.svg",
    "48": "icons/${slug}-48.svg",
    "128": "icons/${slug}-128.svg"
  },

  "action": {
    "default_popup": "popup/${slug}.html",
    "default_icon": {
      "16": "icons/${slug}-16.svg",
      "48": "icons/${slug}-48.svg",
      "128": "icons/${slug}-128.svg"
    },
    "default_title": "${name} — ${capability}"
  },

  "background": {
    "service_worker": "background/${slug}-worker.js",
    "type": "module"
  },

  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content-scripts/${slug}.js"],
      "css": ["content-scripts/${slug}.css"],
      "run_at": "document_idle"
    }
  ],

  "permissions": [${perms_json}],
  "host_permissions": ["<all_urls>"],

${side_panel_block}
${firefox_block}
  "web_accessible_resources": [
    {
      "resources": [
        "popup/${slug}.html",
        "sidebar/${slug}.html",
        "icons/*",
        "assets/*"
      ],
      "matches": ["<all_urls>"]
    }
  ],

  "commands": {
    "toggle-sidebar": {
      "suggested_key": { "default": "Alt+N" },
      "description": "Toggle ${name} sidebar"
    },
    "quick-action": {
      "suggested_key": { "default": "Alt+Shift+N" },
      "description": "${name} quick action on selection"
    }
  },

  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
MANIFEST
}

# ══════════════════════════════════════════════════════════════
#  INSTALL ONE EXTENSION
# ══════════════════════════════════════════════════════════════

install_extension() {
  local entry="$1"
  local browser="$2"
  local base_dir="$3"

  IFS='|' read -r id slug name class capability engines enc contract perms <<< "$entry"

  local ext_dir="${base_dir}/${slug}"

  # Create directory structure
  mkdir -p "${ext_dir}/icons"
  mkdir -p "${ext_dir}/popup"
  mkdir -p "${ext_dir}/sidebar"
  mkdir -p "${ext_dir}/background"
  mkdir -p "${ext_dir}/content-scripts"
  mkdir -p "${ext_dir}/assets"

  # Generate manifest.json
  generate_manifest "$id" "$slug" "$name" "$class" "$capability" "$engines" "$enc" "$contract" "$perms" "$browser" \
    > "${ext_dir}/manifest.json"

  # Generate icons (SVG placeholders)
  generate_icon_svg "$name" 16  > "${ext_dir}/icons/${slug}-16.svg"
  generate_icon_svg "$name" 48  > "${ext_dir}/icons/${slug}-48.svg"
  generate_icon_svg "$name" 128 > "${ext_dir}/icons/${slug}-128.svg"

  # Generate popup
  generate_popup_html "$name" "$slug" "$class" "$capability" "$engines" \
    > "${ext_dir}/popup/${slug}.html"

  # Generate sidebar
  generate_sidebar_html "$name" "$slug" \
    > "${ext_dir}/sidebar/${slug}.html"

  # Generate background worker
  generate_background_worker "$name" "$slug" "$id" \
    > "${ext_dir}/background/${slug}-worker.js"

  # Generate content script
  generate_content_script "$name" "$slug" \
    > "${ext_dir}/content-scripts/${slug}.js"

  # Generate content CSS
  generate_content_css > "${ext_dir}/content-scripts/${slug}.css"

  printf "  ${GREEN}✓${RESET} %-14s ${BOLD}%s${RESET}  ${DIM}→ %s${RESET}\n" "$id" "$name" "${slug}/"
}

# ══════════════════════════════════════════════════════════════
#  INSTALL ALL
# ══════════════════════════════════════════════════════════════

install_all() {
  echo ""
  echo "${GOLD}${BOLD}╔══════════════════════════════════════════════════════════════╗${RESET}"
  echo "${GOLD}${BOLD}║   NOVA SOVEREIGN ORGANISM EXTENSION INSTALLER               ║${RESET}"
  echo "${GOLD}${BOLD}║   ${RESET}${DIM}v${VERSION} — Casa de Medina${RESET}${GOLD}${BOLD}                                    ║${RESET}"
  echo "${GOLD}${BOLD}╚══════════════════════════════════════════════════════════════╝${RESET}"
  echo ""
  echo "  ${CYAN}Browser:${RESET}  ${BOLD}${BROWSER}${RESET}"
  echo "  ${CYAN}Output:${RESET}   ${BOLD}${OUT_DIR}${RESET}"

  # Parse --only filter
  local -a only_slugs=()
  if [[ -n "$ONLY" ]]; then
    IFS=',' read -ra only_slugs <<< "$ONLY"
    echo "  ${CYAN}Only:${RESET}     ${BOLD}${ONLY}${RESET}"
  fi

  echo ""
  echo "  ${DIM}Installing extensions...${RESET}"
  echo ""

  mkdir -p "${OUT_DIR}"

  local installed=0
  local skipped=0

  for entry in "${EXTENSIONS[@]}"; do
    IFS='|' read -r id slug name class capability engines enc contract perms <<< "$entry"

    # Filter check
    if [[ ${#only_slugs[@]} -gt 0 ]]; then
      local found=0
      for s in "${only_slugs[@]}"; do
        s="$(echo "$s" | tr -d ' ')"
        if [[ "$s" == "$slug" || "$s" == "$id" || "$s" == "$name" ]]; then
          found=1
          break
        fi
      done
      if [[ $found -eq 0 ]]; then
        skipped=$((skipped + 1))
        continue
      fi
    fi

    install_extension "$entry" "$BROWSER" "$OUT_DIR"
    installed=$((installed + 1))
  done

  echo ""
  echo "  ${GREEN}${BOLD}Done!${RESET}  ${installed} extensions installed"
  if [[ $skipped -gt 0 ]]; then
    echo "  ${DIM}${skipped} extensions skipped (not in --only filter)${RESET}"
  fi
  echo ""

  # Print loading instructions
  echo "  ${GOLD}${BOLD}LOAD INTO YOUR BROWSER${RESET}"
  echo ""

  case "$BROWSER" in
    edge)
      echo "  1. Open ${BOLD}edge://extensions${RESET}"
      echo "  2. Enable ${BOLD}Developer mode${RESET} (toggle top-right)"
      echo "  3. Click ${BOLD}Load unpacked${RESET}"
      echo "  4. Select a folder from ${BOLD}${OUT_DIR}/${RESET}"
      ;;
    chrome)
      echo "  1. Open ${BOLD}chrome://extensions${RESET}"
      echo "  2. Enable ${BOLD}Developer mode${RESET} (toggle top-right)"
      echo "  3. Click ${BOLD}Load unpacked${RESET}"
      echo "  4. Select a folder from ${BOLD}${OUT_DIR}/${RESET}"
      ;;
    firefox)
      echo "  1. Open ${BOLD}about:debugging#/runtime/this-firefox${RESET}"
      echo "  2. Click ${BOLD}Load Temporary Add-on${RESET}"
      echo "  3. Select ${BOLD}manifest.json${RESET} from a folder in ${BOLD}${OUT_DIR}/${RESET}"
      ;;
    safari)
      echo "  1. Open ${BOLD}Safari → Develop → Show Extension Builder${RESET}"
      echo "  2. Click ${BOLD}+${RESET} and select a folder from ${BOLD}${OUT_DIR}/${RESET}"
      ;;
  esac

  echo ""
  echo "  ${DIM}Each extension folder is a standalone browser extension.${RESET}"
  echo "  ${DIM}No build step needed — load directly into your browser.${RESET}"
  echo ""
}

# ══════════════════════════════════════════════════════════════
#  RUN
# ══════════════════════════════════════════════════════════════

install_all
