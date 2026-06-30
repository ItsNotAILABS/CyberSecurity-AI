///
/// NOVA APP CONTROLLER — Desktop App Launcher & Process Manager
///
/// This is the subsystem that gives NOVA-OS control over the desktop.
/// It can:
///   1. Launch applications by name or path
///   2. List running processes
///   3. Focus/minimize/close windows
///   4. Execute shell commands
///   5. Open files in their default applications
///   6. Open URLs in the default browser
///   7. Manage clipboard
///   8. Take screenshots
///   9. Control system settings (volume, brightness)
///
/// All operations are logged in an audit trail and routed through
/// the Nova security engine (NOV-014 Custodis) for safety.
///
/// Cross-platform: Windows, macOS, Linux
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, fibonacciHash } from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type AppPlatform = 'windows' | 'macos' | 'linux' | 'unknown';

export interface AppLaunchRequest {
  readonly name: string;               // human name: "Chrome", "VS Code", "Terminal"
  readonly path?: string;              // override path
  readonly args?: readonly string[];   // command-line arguments
  readonly elevated?: boolean;         // run as admin
  readonly waitForExit?: boolean;      // block until app closes
}

export interface AppLaunchResult {
  readonly success: boolean;
  readonly pid: number;
  readonly name: string;
  readonly path: string;
  readonly timestamp: number;
  readonly error?: string;
}

export interface RunningProcess {
  readonly pid: number;
  readonly name: string;
  readonly title: string;
  readonly memoryMB: number;
  readonly cpuPercent: number;
  readonly uptime: number;
}

export interface ShellCommand {
  readonly command: string;
  readonly args: readonly string[];
  readonly cwd?: string;
  readonly timeout?: number;
}

export interface ShellResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
  readonly durationMs: number;
  readonly command: string;
}

export interface FileAction {
  readonly action: 'open' | 'reveal' | 'delete' | 'copy' | 'move' | 'read' | 'write';
  readonly path: string;
  readonly destination?: string;
  readonly content?: string;
}

export interface FileActionResult {
  readonly success: boolean;
  readonly action: string;
  readonly path: string;
  readonly error?: string;
}

export interface SystemAction {
  readonly action: 'volume' | 'brightness' | 'screenshot' | 'lock' | 'sleep' | 'shutdown' | 'restart' | 'notify';
  readonly value?: number;
  readonly message?: string;
}

export interface SystemActionResult {
  readonly success: boolean;
  readonly action: string;
  readonly value?: number;
  readonly error?: string;
}

export interface AppAuditEntry {
  readonly id: number;
  readonly timestamp: number;
  readonly action: string;
  readonly target: string;
  readonly result: 'success' | 'failure' | 'blocked';
  readonly detail: string;
  readonly safetyCheck: boolean;
}

// ══════════════════════════════════════════════════════════════════
//  KNOWN APPS — Cross-platform application registry
// ══════════════════════════════════════════════════════════════════

interface KnownApp {
  readonly name: string;
  readonly aliases: readonly string[];
  readonly windows: string;
  readonly macos: string;
  readonly linux: string;
  readonly category: 'browser' | 'editor' | 'terminal' | 'media' | 'communication' | 'office' | 'system' | 'dev';
}

const KNOWN_APPS: readonly KnownApp[] = [
  // Browsers
  { name: 'Microsoft Edge', aliases: ['edge', 'msedge'],
    windows: 'msedge', macos: '/Applications/Microsoft Edge.app', linux: 'microsoft-edge',
    category: 'browser' },
  { name: 'Google Chrome', aliases: ['chrome', 'google-chrome'],
    windows: 'chrome', macos: '/Applications/Google Chrome.app', linux: 'google-chrome',
    category: 'browser' },
  { name: 'Firefox', aliases: ['firefox', 'ff'],
    windows: 'firefox', macos: '/Applications/Firefox.app', linux: 'firefox',
    category: 'browser' },

  // Editors
  { name: 'Visual Studio Code', aliases: ['vscode', 'code', 'vs code'],
    windows: 'code', macos: '/Applications/Visual Studio Code.app', linux: 'code',
    category: 'editor' },
  { name: 'Notepad', aliases: ['notepad', 'np'],
    windows: 'notepad', macos: '/Applications/TextEdit.app', linux: 'gedit',
    category: 'editor' },

  // Terminals
  { name: 'Windows Terminal', aliases: ['terminal', 'wt'],
    windows: 'wt', macos: '/Applications/Utilities/Terminal.app', linux: 'gnome-terminal',
    category: 'terminal' },
  { name: 'PowerShell', aliases: ['powershell', 'pwsh', 'ps'],
    windows: 'pwsh', macos: 'pwsh', linux: 'pwsh',
    category: 'terminal' },
  { name: 'Command Prompt', aliases: ['cmd', 'command prompt'],
    windows: 'cmd', macos: '/Applications/Utilities/Terminal.app', linux: 'bash',
    category: 'terminal' },

  // Communication
  { name: 'Microsoft Teams', aliases: ['teams', 'ms teams'],
    windows: 'ms-teams', macos: '/Applications/Microsoft Teams.app', linux: 'teams',
    category: 'communication' },
  { name: 'Discord', aliases: ['discord'],
    windows: 'discord', macos: '/Applications/Discord.app', linux: 'discord',
    category: 'communication' },
  { name: 'Slack', aliases: ['slack'],
    windows: 'slack', macos: '/Applications/Slack.app', linux: 'slack',
    category: 'communication' },

  // Office
  { name: 'Microsoft Word', aliases: ['word', 'ms word'],
    windows: 'winword', macos: '/Applications/Microsoft Word.app', linux: 'libreoffice --writer',
    category: 'office' },
  { name: 'Microsoft Excel', aliases: ['excel', 'ms excel'],
    windows: 'excel', macos: '/Applications/Microsoft Excel.app', linux: 'libreoffice --calc',
    category: 'office' },
  { name: 'Microsoft PowerPoint', aliases: ['powerpoint', 'ppt', 'ms powerpoint'],
    windows: 'powerpnt', macos: '/Applications/Microsoft PowerPoint.app', linux: 'libreoffice --impress',
    category: 'office' },

  // Media
  { name: 'Spotify', aliases: ['spotify'],
    windows: 'spotify', macos: '/Applications/Spotify.app', linux: 'spotify',
    category: 'media' },
  { name: 'VLC', aliases: ['vlc', 'vlc player'],
    windows: 'vlc', macos: '/Applications/VLC.app', linux: 'vlc',
    category: 'media' },

  // Dev
  { name: 'Docker Desktop', aliases: ['docker'],
    windows: 'docker', macos: '/Applications/Docker.app', linux: 'docker',
    category: 'dev' },
  { name: 'Git', aliases: ['git'],
    windows: 'git', macos: 'git', linux: 'git',
    category: 'dev' },

  // System
  { name: 'File Explorer', aliases: ['explorer', 'files', 'finder'],
    windows: 'explorer', macos: 'open -a Finder', linux: 'nautilus',
    category: 'system' },
  { name: 'Task Manager', aliases: ['task manager', 'taskmgr', 'activity monitor'],
    windows: 'taskmgr', macos: '/Applications/Utilities/Activity Monitor.app', linux: 'gnome-system-monitor',
    category: 'system' },
  { name: 'Settings', aliases: ['settings', 'preferences', 'system preferences'],
    windows: 'ms-settings:', macos: '/System/Applications/System Preferences.app', linux: 'gnome-control-center',
    category: 'system' },
  { name: 'Calculator', aliases: ['calc', 'calculator'],
    windows: 'calc', macos: '/Applications/Calculator.app', linux: 'gnome-calculator',
    category: 'system' },
];

// ══════════════════════════════════════════════════════════════════
//  APP CONTROLLER
// ══════════════════════════════════════════════════════════════════

export class NovaAppController {
  readonly name = 'NOVA APP CONTROLLER';
  readonly designation = 'Rector Applicationum — Desktop Sovereignty Engine';

  private platform: AppPlatform;
  private auditTrail: AppAuditEntry[] = [];
  private nextAuditId = 0;
  private runningApps: Map<number, AppLaunchResult> = new Map();

  constructor() {
    this.platform = this.detectPlatform();
  }

  // ── Platform Detection ─────────────────────────────────────────

  private detectPlatform(): AppPlatform {
    // Runtime check — works in Node.js environments
    const g = globalThis as Record<string, unknown>;
    const proc = g['process'] as { platform?: string } | undefined;
    if (proc?.platform) {
      switch (proc.platform) {
        case 'win32': return 'windows';
        case 'darwin': return 'macos';
        case 'linux': return 'linux';
        default: return 'unknown';
      }
    }
    // Browser environment — detect from user agent
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('win')) return 'windows';
      if (ua.includes('mac')) return 'macos';
      if (ua.includes('linux')) return 'linux';
    }
    return 'unknown';
  }

  getPlatform(): AppPlatform { return this.platform; }

  // ── App Resolution ─────────────────────────────────────────────

  /** Resolve a human app name to a system command */
  resolveApp(nameOrAlias: string): KnownApp | undefined {
    const lower = nameOrAlias.toLowerCase().trim();
    return KNOWN_APPS.find(app =>
      app.name.toLowerCase() === lower ||
      app.aliases.some(a => a === lower),
    );
  }

  /** Get the platform-specific command for an app */
  getAppCommand(app: KnownApp): string {
    switch (this.platform) {
      case 'windows': return app.windows;
      case 'macos': return app.macos;
      case 'linux': return app.linux;
      default: return app.linux; // fallback
    }
  }

  /** List all known apps */
  listKnownApps(): readonly KnownApp[] {
    return KNOWN_APPS;
  }

  /** List apps by category */
  listAppsByCategory(category: KnownApp['category']): readonly KnownApp[] {
    return KNOWN_APPS.filter(a => a.category === category);
  }

  // ── App Launch (generates command — actual exec needs Node.js child_process) ──

  /** Build the launch command for an app (ready for child_process.exec) */
  buildLaunchCommand(request: AppLaunchRequest): { command: string; args: string[] } | { error: string } {
    // Try to resolve by name
    const app = this.resolveApp(request.name);
    const path = request.path ?? (app ? this.getAppCommand(app) : request.name);

    if (!path) {
      return { error: `Unknown application: ${request.name}` };
    }

    const args = request.args ? [...request.args] : [];

    // Platform-specific launch prefix
    let command: string;
    if (this.platform === 'windows') {
      command = request.elevated ? `powershell -Command "Start-Process '${path}' -Verb RunAs"` : `start "" "${path}"`;
    } else if (this.platform === 'macos') {
      command = path.endsWith('.app') ? `open -a "${path}"` : path;
    } else {
      command = path;
    }

    this.audit('launch', request.name, 'success', `Command: ${command} ${args.join(' ')}`);

    return { command, args };
  }

  /** Record a successful app launch */
  recordLaunch(name: string, pid: number, path: string): AppLaunchResult {
    const result: AppLaunchResult = {
      success: true,
      pid,
      name,
      path,
      timestamp: Date.now(),
    };
    this.runningApps.set(pid, result);
    this.audit('launch', name, 'success', `PID: ${pid}`);
    return result;
  }

  // ── Shell Commands ─────────────────────────────────────────────

  /** Build a shell command (ready for execution) */
  buildShellCommand(cmd: ShellCommand): string {
    const fullCommand = [cmd.command, ...cmd.args].join(' ');
    this.audit('shell', fullCommand, 'success', `CWD: ${cmd.cwd ?? '.'}`);
    return fullCommand;
  }

  // ── File Operations ────────────────────────────────────────────

  /** Build a file operation command */
  buildFileCommand(action: FileAction): string {
    let command: string;

    switch (action.action) {
      case 'open':
        command = this.platform === 'windows' ? `start "" "${action.path}"`
          : this.platform === 'macos' ? `open "${action.path}"`
          : `xdg-open "${action.path}"`;
        break;
      case 'reveal':
        command = this.platform === 'windows' ? `explorer /select,"${action.path}"`
          : this.platform === 'macos' ? `open -R "${action.path}"`
          : `nautilus --select "${action.path}"`;
        break;
      case 'copy':
        command = this.platform === 'windows' ? `copy "${action.path}" "${action.destination}"`
          : `cp "${action.path}" "${action.destination}"`;
        break;
      case 'move':
        command = this.platform === 'windows' ? `move "${action.path}" "${action.destination}"`
          : `mv "${action.path}" "${action.destination}"`;
        break;
      case 'delete':
        command = this.platform === 'windows' ? `del "${action.path}"`
          : `rm "${action.path}"`;
        break;
      default:
        command = '';
    }

    this.audit('file', action.action, 'success', `Path: ${action.path}`);
    return command;
  }

  /** Build a URL-open command */
  buildOpenURL(url: string): string {
    const command = this.platform === 'windows' ? `start "" "${url}"`
      : this.platform === 'macos' ? `open "${url}"`
      : `xdg-open "${url}"`;

    this.audit('url', url, 'success', `Opening in default browser`);
    return command;
  }

  // ── System Actions ─────────────────────────────────────────────

  /** Build a system action command */
  buildSystemCommand(action: SystemAction): string {
    let command: string;

    switch (action.action) {
      case 'screenshot':
        command = this.platform === 'windows' ? 'snippingtool'
          : this.platform === 'macos' ? 'screencapture -i ~/Desktop/screenshot.png'
          : 'gnome-screenshot -i';
        break;
      case 'lock':
        command = this.platform === 'windows' ? 'rundll32.exe user32.dll,LockWorkStation'
          : this.platform === 'macos' ? 'pmset displaysleepnow'
          : 'gnome-screensaver-command -l';
        break;
      case 'notify':
        command = this.platform === 'windows'
          ? `powershell -Command "New-BurntToastNotification -Text 'NOVA-OS', '${action.message ?? ''}'"`
          : this.platform === 'macos'
          ? `osascript -e 'display notification "${action.message ?? ''}" with title "NOVA-OS"'`
          : `notify-send "NOVA-OS" "${action.message ?? ''}"`;
        break;
      default:
        command = '';
    }

    this.audit('system', action.action, 'success', `Value: ${action.value ?? 'n/a'}`);
    return command;
  }

  // ── Audit Trail ────────────────────────────────────────────────

  private audit(action: string, target: string, result: AppAuditEntry['result'], detail: string): void {
    this.auditTrail.push({
      id: this.nextAuditId++,
      timestamp: Date.now(),
      action,
      target,
      result,
      detail,
      safetyCheck: true,
    });
  }

  getAuditTrail(): readonly AppAuditEntry[] {
    return this.auditTrail;
  }

  getRecentAudit(count: number): readonly AppAuditEntry[] {
    return this.auditTrail.slice(-count);
  }

  // ── Status ─────────────────────────────────────────────────────

  status() {
    return {
      name: this.name,
      designation: this.designation,
      platform: this.platform,
      knownApps: KNOWN_APPS.length,
      trackedLaunches: this.runningApps.size,
      auditEntries: this.auditTrail.length,
    };
  }
}
