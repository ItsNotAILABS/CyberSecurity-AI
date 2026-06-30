///
/// NOVA CONTENT SCRIPT — Injected into every page
///
/// Provides:
///   1. Alt+N sidebar toggle
///   2. Text selection → AI action menu
///   3. Page context bridge to background worker
///

(function() {
  'use strict';

  const SIDEBAR_ID = 'nova-ai-sidebar';
  const MENU_ID = 'nova-action-menu';
  let sidebarVisible = false;
  let sidebarEl = null;

  // ══════════════════════════════════════════════════════════════
  //  SIDEBAR
  // ══════════════════════════════════════════════════════════════

  function createSidebar() {
    if (document.getElementById(SIDEBAR_ID)) return;

    const sidebar = document.createElement('div');
    sidebar.id = SIDEBAR_ID;
    sidebar.innerHTML = `
      <div id="nova-sb-header">
        <span>✦ NOVA AI</span>
        <button id="nova-sb-close" title="Close (Alt+N)">&times;</button>
      </div>
      <div id="nova-sb-chat"></div>
      <div id="nova-sb-input-area">
        <textarea id="nova-sb-input" placeholder="Ask NOVA anything..." rows="2"></textarea>
        <button id="nova-sb-send">▶</button>
      </div>
    `;
    sidebar.style.display = 'none';
    document.body.appendChild(sidebar);
    sidebarEl = sidebar;

    document.getElementById('nova-sb-close').addEventListener('click', toggleSidebar);
    document.getElementById('nova-sb-send').addEventListener('click', () => sendFromSidebar());
    document.getElementById('nova-sb-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendFromSidebar();
      }
    });
  }

  function toggleSidebar() {
    sidebarVisible = !sidebarVisible;
    if (sidebarEl) {
      sidebarEl.style.display = sidebarVisible ? 'flex' : 'none';
    }
  }

  function addSidebarMsg(role, text) {
    const chat = document.getElementById('nova-sb-chat');
    if (!chat) return;
    const div = document.createElement('div');
    div.className = 'nova-sb-msg nova-sb-' + role;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function sendFromSidebar() {
    const input = document.getElementById('nova-sb-input');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = '';
    addSidebarMsg('user', text);

    chrome.runtime.sendMessage({
      type: 'NOVA_CHAT_REQUEST',
      payload: {
        messages: [{ role: 'user', content: text }],
        pageContext: getPageContext(),
      },
    }, (res) => {
      if (res?.content) {
        addSidebarMsg('assistant', res.content);
      } else if (res?.error) {
        addSidebarMsg('assistant', '⚠️ ' + res.error);
      }
    });
  }

  // ══════════════════════════════════════════════════════════════
  //  TEXT SELECTION ACTION MENU
  // ══════════════════════════════════════════════════════════════

  function showActionMenu(selectedText) {
    hideActionMenu();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const menu = document.createElement('div');
    menu.id = MENU_ID;
    menu.innerHTML = `
      <button class="nova-am-btn" data-action="explain">💡 Explain</button>
      <button class="nova-am-btn" data-action="summarize">📋 Summarize</button>
      <button class="nova-am-btn" data-action="translate">🌐 Translate</button>
      <button class="nova-am-btn" data-action="code">💻 Code</button>
      <button class="nova-am-btn" data-action="factcheck">✅ Fact Check</button>
    `;
    menu.style.cssText = `position:fixed;top:${rect.bottom + 8}px;left:${rect.left}px;z-index:2147483647;`;
    document.body.appendChild(menu);

    menu.querySelectorAll('.nova-am-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        executeAction(btn.dataset.action, selectedText);
        hideActionMenu();
      });
    });
  }

  function hideActionMenu() {
    const el = document.getElementById(MENU_ID);
    if (el) el.remove();
  }

  function executeAction(action, text) {
    const prompts = {
      explain: `Explain this clearly:\n\n${text}`,
      summarize: `Summarize this concisely:\n\n${text}`,
      translate: `Translate this to English (or detect language and translate):\n\n${text}`,
      code: `Analyze this code and suggest improvements:\n\n${text}`,
      factcheck: `Fact-check this claim:\n\n${text}`,
    };

    if (!sidebarVisible) toggleSidebar();
    addSidebarMsg('user', prompts[action] || text);

    chrome.runtime.sendMessage({
      type: 'NOVA_CHAT_REQUEST',
      payload: {
        messages: [{ role: 'user', content: prompts[action] || text }],
        action,
        selectedText: text,
        pageContext: getPageContext(),
      },
    }, (res) => {
      if (res?.content) {
        addSidebarMsg('assistant', res.content);
      }
    });
  }

  // ══════════════════════════════════════════════════════════════
  //  PAGE CONTEXT
  // ══════════════════════════════════════════════════════════════

  function getPageContext() {
    return {
      url: window.location.href,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      textLength: document.body?.innerText?.length || 0,
      language: document.documentElement?.lang || 'en',
    };
  }

  // ══════════════════════════════════════════════════════════════
  //  EVENT LISTENERS
  // ══════════════════════════════════════════════════════════════

  // Text selection
  document.addEventListener('mouseup', () => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (text && text.length > 3) {
      showActionMenu(text);
    } else {
      hideActionMenu();
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'n') {
      e.preventDefault();
      toggleSidebar();
    }
  });

  // Click outside menu
  document.addEventListener('mousedown', (e) => {
    const menu = document.getElementById(MENU_ID);
    if (menu && !menu.contains(e.target)) {
      hideActionMenu();
    }
  });

  // ══════════════════════════════════════════════════════════════
  //  INIT
  // ══════════════════════════════════════════════════════════════

  createSidebar();
  console.log('[NOVA] Content script loaded. Alt+N to toggle sidebar. Select text for AI actions.');
})();
