var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
__name(PerformanceEntry, "PerformanceEntry");
var PerformanceMark = /* @__PURE__ */ __name(class PerformanceMark2 extends PerformanceEntry {
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
}, "PerformanceMark");
var PerformanceMeasure = class extends PerformanceEntry {
  entryType = "measure";
};
__name(PerformanceMeasure, "PerformanceMeasure");
var PerformanceResourceTiming = class extends PerformanceEntry {
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
__name(PerformanceResourceTiming, "PerformanceResourceTiming");
var PerformanceObserverEntryList = class {
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
__name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
var Performance = class {
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
__name(Performance, "Performance");
var PerformanceObserver = class {
  __unenv__ = true;
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
__name(PerformanceObserver, "PerformanceObserver");
__publicField(PerformanceObserver, "supportedEntryTypes", []);
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var ReadStream = class extends Socket {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  isRaw = false;
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
  isTTY = false;
};
__name(ReadStream, "ReadStream");

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream = class extends Socket2 {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  columns = 80;
  rows = 24;
  isTTY = false;
};
__name(WriteStream, "WriteStream");

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class extends EventEmitter {
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return "";
  }
  get versions() {
    return {};
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  ref() {
  }
  unref() {
  }
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: () => 0 });
  mainModule = void 0;
  domain = void 0;
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
__name(Process, "Process");

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var { exit, platform, nextTick } = getBuiltinModule(
  "node:process"
);
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  nextTick
});
var {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  finalization,
  features,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  on,
  off,
  once,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
};
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
}
__name(jsonResponse, "jsonResponse");
function errorResponse(message, status = 500) {
  console.error(`API Error [${status}]:`, message);
  return jsonResponse({ error: message }, status);
}
__name(errorResponse, "errorResponse");
function getUserFromRequest(request) {
  const userId = request.headers.get("X-Encrypted-Yw-ID");
  const isLogin = request.headers.get("X-Is-Login") === "1";
  return { userId, isLogin };
}
__name(getUserFromRequest, "getUserFromRequest");
async function ensureUserExists(env2, userId) {
  if (!userId)
    return null;
  const existingUser = await env2.DB.prepare("SELECT * FROM users WHERE encrypted_yw_id = ?").bind(userId).first();
  if (existingUser) {
    await env2.DB.prepare("UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE encrypted_yw_id = ?").bind(userId).run();
    return existingUser;
  }
  await env2.DB.prepare(`
    INSERT INTO users (encrypted_yw_id, level, points, join_date, last_active)
    VALUES (?, '\u521D\u5FC3\u8005', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(userId).run();
  return await env2.DB.prepare("SELECT * FROM users WHERE encrypted_yw_id = ?").bind(userId).first();
}
__name(ensureUserExists, "ensureUserExists");
async function updateUserProfile(env2, userId, userInfo) {
  if (!userId || !userInfo)
    return;
  const { display_name, photo_url } = userInfo;
  await env2.DB.prepare(`
    UPDATE users 
    SET display_name = ?, photo_url = ?, last_active = CURRENT_TIMESTAMP
    WHERE encrypted_yw_id = ?
  `).bind(display_name, photo_url, userId).run();
}
__name(updateUserProfile, "updateUserProfile");
var src_default = {
  async fetch(request, env2) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    try {
      const { userId, isLogin } = getUserFromRequest(request);
      if (pathname === "/api/user/profile") {
        if (method === "GET") {
          if (!userId) {
            return errorResponse("\u30E6\u30FC\u30B6\u30FC\u304C\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 401);
          }
          const user = await ensureUserExists(env2, userId);
          if (!user) {
            return errorResponse("\u30E6\u30FC\u30B6\u30FC\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093", 404);
          }
          const [postCount, commentCount, totalLikes, badgeCount] = await Promise.all([
            env2.DB.prepare("SELECT COUNT(*) as count FROM posts WHERE user_id = ?").bind(userId).first(),
            env2.DB.prepare("SELECT COUNT(*) as count FROM comments WHERE user_id = ?").bind(userId).first(),
            env2.DB.prepare("SELECT SUM(likes) as total FROM posts WHERE user_id = ?").bind(userId).first(),
            env2.DB.prepare("SELECT COUNT(*) as count FROM user_badges WHERE user_id = ?").bind(userId).first()
          ]);
          const profile3 = {
            ...user,
            stats: {
              posts: postCount?.count || 0,
              comments: commentCount?.count || 0,
              likes: totalLikes?.total || 0,
              badges: badgeCount?.count || 0
            }
          };
          return jsonResponse(profile3);
        }
        if (method === "PUT") {
          if (!userId) {
            return errorResponse("\u30E6\u30FC\u30B6\u30FC\u304C\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 401);
          }
          const data = await request.json();
          const { display_name, bio, level } = data;
          await env2.DB.prepare(`
            UPDATE users 
            SET display_name = ?, bio = ?, level = ?, last_active = CURRENT_TIMESTAMP
            WHERE encrypted_yw_id = ?
          `).bind(display_name, bio, level, userId).run();
          return jsonResponse({ success: true, message: "\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u3092\u66F4\u65B0\u3057\u307E\u3057\u305F" });
        }
      }
      if (pathname === "/api/user/sync") {
        if (method === "POST") {
          if (!userId) {
            return errorResponse("\u30E6\u30FC\u30B6\u30FC\u304C\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 401);
          }
          const data = await request.json();
          await ensureUserExists(env2, userId);
          await updateUserProfile(env2, userId, data);
          return jsonResponse({ success: true, message: "\u30E6\u30FC\u30B6\u30FC\u60C5\u5831\u3092\u540C\u671F\u3057\u307E\u3057\u305F" });
        }
      }
      if (pathname === "/api/users") {
        if (method === "GET") {
          const { results } = await env2.DB.prepare(`
            SELECT encrypted_yw_id, display_name, photo_url, level, points, join_date
            FROM users 
            ORDER BY points DESC, join_date DESC
            LIMIT 50
          `).all();
          return jsonResponse(results);
        }
      }
      if (pathname === "/api/user/badges") {
        if (method === "GET") {
          if (!userId) {
            return errorResponse("\u30E6\u30FC\u30B6\u30FC\u304C\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 401);
          }
          const { results } = await env2.DB.prepare(`
            SELECT * FROM user_badges 
            WHERE user_id = ? 
            ORDER BY earned_at DESC
          `).bind(userId).all();
          return jsonResponse(results);
        }
      }
      if (pathname === "/api/posts") {
        if (method === "GET") {
          const category = url.searchParams.get("category");
          const search = url.searchParams.get("search");
          const sortBy = url.searchParams.get("sortBy") || "created_at";
          const limit = parseInt(url.searchParams.get("limit") || "20");
          const offset = parseInt(url.searchParams.get("offset") || "0");
          let query = `
            SELECT p.*, u.display_name, u.photo_url, u.level
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.encrypted_yw_id
            WHERE p.status = 'published'
          `;
          const params = [];
          if (category && ["qa", "howto", "showcase"].includes(category)) {
            query += " AND p.category = ?";
            params.push(category);
          }
          if (search) {
            query += " AND (p.title LIKE ? OR p.content LIKE ? OR p.tags LIKE ?)";
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
          }
          switch (sortBy) {
            case "popular":
              query += " ORDER BY p.likes DESC, p.views DESC";
              break;
            case "views":
              query += " ORDER BY p.views DESC";
              break;
            case "latest":
            default:
              query += " ORDER BY p.created_at DESC";
              break;
          }
          query += " LIMIT ? OFFSET ?";
          params.push(limit, offset);
          const { results } = await env2.DB.prepare(query).bind(...params).all();
          return jsonResponse(results);
        }
        if (method === "POST") {
          if (!userId) {
            return errorResponse("\u30E6\u30FC\u30B6\u30FC\u304C\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 401);
          }
          const data = await request.json();
          const { category, title: title2, content, tags, images, project_url } = data;
          if (!category || !title2 || !content) {
            return errorResponse("\u5FC5\u8981\u306A\u9805\u76EE\u304C\u4E0D\u8DB3\u3057\u3066\u3044\u307E\u3059", 400);
          }
          if (!["qa", "howto", "showcase"].includes(category)) {
            return errorResponse("\u7121\u52B9\u306A\u30AB\u30C6\u30B4\u30EA\u3067\u3059", 400);
          }
          await ensureUserExists(env2, userId);
          const tagsJson = tags ? JSON.stringify(tags) : null;
          const imagesJson = images ? JSON.stringify(images) : null;
          const result = await env2.DB.prepare(`
            INSERT INTO posts (user_id, category, title, content, tags, images, project_url, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `).bind(userId, category, title2, content, tagsJson, imagesJson, project_url || null).run();
          await env2.DB.prepare(`
            INSERT INTO user_points_log (user_id, points, reason)
            VALUES (?, 10, 'post_created')
          `).bind(userId).run();
          await env2.DB.prepare("UPDATE users SET points = points + 10 WHERE encrypted_yw_id = ?").bind(userId).run();
          return jsonResponse({
            success: true,
            message: "\u6295\u7A3F\u3092\u4F5C\u6210\u3057\u307E\u3057\u305F",
            postId: result.meta.last_row_id
          });
        }
      }
      if (pathname.startsWith("/api/posts/")) {
        const postId = pathname.split("/")[3];
        if (method === "GET") {
          const post = await env2.DB.prepare(`
            SELECT p.*, u.display_name, u.photo_url, u.level
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.encrypted_yw_id
            WHERE p.id = ? AND p.status = 'published'
          `).bind(postId).first();
          if (!post) {
            return errorResponse("\u6295\u7A3F\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093", 404);
          }
          const { results: comments } = await env2.DB.prepare(`
            SELECT c.*, u.display_name, u.photo_url, u.level
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.encrypted_yw_id
            WHERE c.post_id = ?
            ORDER BY c.is_best_answer DESC, c.likes DESC, c.created_at ASC
          `).bind(postId).all();
          await env2.DB.prepare("UPDATE posts SET views = views + 1 WHERE id = ?").bind(postId).run();
          return jsonResponse({
            ...post,
            comments
          });
        }
        if (method === "PUT") {
          if (!userId) {
            return errorResponse("\u30E6\u30FC\u30B6\u30FC\u304C\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 401);
          }
          const post = await env2.DB.prepare("SELECT user_id FROM posts WHERE id = ?").bind(postId).first();
          if (!post) {
            return errorResponse("\u6295\u7A3F\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093", 404);
          }
          if (post.user_id !== userId) {
            return errorResponse("\u3053\u306E\u6295\u7A3F\u3092\u7DE8\u96C6\u3059\u308B\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093", 403);
          }
          const data = await request.json();
          const { title: title2, content, tags, images, project_url, status } = data;
          const tagsJson = tags ? JSON.stringify(tags) : null;
          const imagesJson = images ? JSON.stringify(images) : null;
          await env2.DB.prepare(`
            UPDATE posts 
            SET title = ?, content = ?, tags = ?, images = ?, project_url = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).bind(title2, content, tagsJson, imagesJson, project_url || null, status || "published", postId).run();
          return jsonResponse({ success: true, message: "\u6295\u7A3F\u3092\u66F4\u65B0\u3057\u307E\u3057\u305F" });
        }
        if (method === "DELETE") {
          if (!userId) {
            return errorResponse("\u30E6\u30FC\u30B6\u30FC\u304C\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 401);
          }
          const post = await env2.DB.prepare("SELECT user_id FROM posts WHERE id = ?").bind(postId).first();
          if (!post) {
            return errorResponse("\u6295\u7A3F\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093", 404);
          }
          if (post.user_id !== userId) {
            return errorResponse("\u3053\u306E\u6295\u7A3F\u3092\u524A\u9664\u3059\u308B\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093", 403);
          }
          await env2.DB.prepare("DELETE FROM comments WHERE post_id = ?").bind(postId).run();
          await env2.DB.prepare("DELETE FROM posts WHERE id = ?").bind(postId).run();
          return jsonResponse({ success: true, message: "\u6295\u7A3F\u3092\u524A\u9664\u3057\u307E\u3057\u305F" });
        }
      }
      if (pathname === "/api/posts/like") {
        if (method === "POST") {
          if (!userId) {
            return errorResponse("\u30E6\u30FC\u30B6\u30FC\u304C\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 401);
          }
          const data = await request.json();
          const { postId } = data;
          await env2.DB.prepare("UPDATE posts SET likes = likes + 1 WHERE id = ?").bind(postId).run();
          return jsonResponse({ success: true, message: "\u3044\u3044\u306D\u3057\u307E\u3057\u305F" });
        }
      }
      if (pathname === "/api/comments") {
        if (method === "POST") {
          if (!userId) {
            return errorResponse("\u30E6\u30FC\u30B6\u30FC\u304C\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 401);
          }
          const data = await request.json();
          const { post_id, content } = data;
          if (!post_id || !content) {
            return errorResponse("\u5FC5\u8981\u306A\u9805\u76EE\u304C\u4E0D\u8DB3\u3057\u3066\u3044\u307E\u3059", 400);
          }
          const post = await env2.DB.prepare("SELECT id FROM posts WHERE id = ? AND status = ?").bind(post_id, "published").first();
          if (!post) {
            return errorResponse("\u6295\u7A3F\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093", 404);
          }
          await ensureUserExists(env2, userId);
          const result = await env2.DB.prepare(`
            INSERT INTO comments (post_id, user_id, content, created_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          `).bind(post_id, userId, content).run();
          await env2.DB.prepare(`
            INSERT INTO user_points_log (user_id, points, reason)
            VALUES (?, 5, 'comment_created')
          `).bind(userId).run();
          await env2.DB.prepare("UPDATE users SET points = points + 5 WHERE encrypted_yw_id = ?").bind(userId).run();
          const newComment = await env2.DB.prepare(`
            SELECT c.*, u.display_name, u.photo_url, u.level
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.encrypted_yw_id
            WHERE c.id = ?
          `).bind(result.meta.last_row_id).first();
          return jsonResponse({
            success: true,
            message: "\u30B3\u30E1\u30F3\u30C8\u3092\u6295\u7A3F\u3057\u307E\u3057\u305F",
            comment: newComment
          });
        }
      }
      if (pathname.startsWith("/api/comments/")) {
        const commentId = pathname.split("/")[3];
        if (method === "PUT") {
          if (!userId) {
            return errorResponse("\u30E6\u30FC\u30B6\u30FC\u304C\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 401);
          }
          const comment = await env2.DB.prepare("SELECT user_id FROM comments WHERE id = ?").bind(commentId).first();
          if (!comment) {
            return errorResponse("\u30B3\u30E1\u30F3\u30C8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093", 404);
          }
          if (comment.user_id !== userId) {
            return errorResponse("\u3053\u306E\u30B3\u30E1\u30F3\u30C8\u3092\u7DE8\u96C6\u3059\u308B\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093", 403);
          }
          const data = await request.json();
          const { content } = data;
          if (!content) {
            return errorResponse("\u30B3\u30E1\u30F3\u30C8\u5185\u5BB9\u304C\u5FC5\u8981\u3067\u3059", 400);
          }
          await env2.DB.prepare(`
            UPDATE comments 
            SET content = ?
            WHERE id = ?
          `).bind(content, commentId).run();
          return jsonResponse({ success: true, message: "\u30B3\u30E1\u30F3\u30C8\u3092\u66F4\u65B0\u3057\u307E\u3057\u305F" });
        }
        if (method === "DELETE") {
          if (!userId) {
            return errorResponse("\u30E6\u30FC\u30B6\u30FC\u304C\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 401);
          }
          const comment = await env2.DB.prepare("SELECT user_id FROM comments WHERE id = ?").bind(commentId).first();
          if (!comment) {
            return errorResponse("\u30B3\u30E1\u30F3\u30C8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093", 404);
          }
          if (comment.user_id !== userId) {
            return errorResponse("\u3053\u306E\u30B3\u30E1\u30F3\u30C8\u3092\u524A\u9664\u3059\u308B\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093", 403);
          }
          await env2.DB.prepare("DELETE FROM comments WHERE id = ?").bind(commentId).run();
          return jsonResponse({ success: true, message: "\u30B3\u30E1\u30F3\u30C8\u3092\u524A\u9664\u3057\u307E\u3057\u305F" });
        }
      }
      if (pathname === "/api/comments/like") {
        if (method === "POST") {
          if (!userId) {
            return errorResponse("\u30E6\u30FC\u30B6\u30FC\u304C\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 401);
          }
          const data = await request.json();
          const { commentId } = data;
          await env2.DB.prepare("UPDATE comments SET likes = likes + 1 WHERE id = ?").bind(commentId).run();
          return jsonResponse({ success: true, message: "\u30B3\u30E1\u30F3\u30C8\u306B\u3044\u3044\u306D\u3057\u307E\u3057\u305F" });
        }
      }
      if (pathname === "/api/comments/best-answer") {
        if (method === "POST") {
          if (!userId) {
            return errorResponse("\u30E6\u30FC\u30B6\u30FC\u304C\u8A8D\u8A3C\u3055\u308C\u3066\u3044\u307E\u305B\u3093", 401);
          }
          const data = await request.json();
          const { commentId, postId } = data;
          const post = await env2.DB.prepare("SELECT user_id FROM posts WHERE id = ?").bind(postId).first();
          if (!post) {
            return errorResponse("\u6295\u7A3F\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093", 404);
          }
          if (post.user_id !== userId) {
            return errorResponse("\u30D9\u30B9\u30C8\u30A2\u30F3\u30B5\u30FC\u3092\u9078\u3076\u6A29\u9650\u304C\u3042\u308A\u307E\u305B\u3093", 403);
          }
          await env2.DB.prepare("UPDATE comments SET is_best_answer = 0 WHERE post_id = ?").bind(postId).run();
          await env2.DB.prepare("UPDATE comments SET is_best_answer = 1 WHERE id = ?").bind(commentId).run();
          const comment = await env2.DB.prepare("SELECT user_id FROM comments WHERE id = ?").bind(commentId).first();
          if (comment) {
            await env2.DB.prepare(`
              INSERT INTO user_points_log (user_id, points, reason)
              VALUES (?, 20, 'best_answer_selected')
            `).bind(comment.user_id).run();
            await env2.DB.prepare("UPDATE users SET points = points + 20 WHERE encrypted_yw_id = ?").bind(comment.user_id).run();
          }
          return jsonResponse({ success: true, message: "\u30D9\u30B9\u30C8\u30A2\u30F3\u30B5\u30FC\u306B\u9078\u629E\u3057\u307E\u3057\u305F" });
        }
      }
      if (pathname === "/health") {
        return jsonResponse({ status: "OK", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
      }
      return errorResponse("\u30A8\u30F3\u30C9\u30DD\u30A4\u30F3\u30C8\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093", 404);
    } catch (error3) {
      console.error("Request handling error:", error3);
      return errorResponse("\u30B5\u30FC\u30D0\u30FC\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F", 500);
    }
  }
};
export {
  src_default as default
};
//# sourceMappingURL=index.js.map
