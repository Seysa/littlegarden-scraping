const start = new Date();
let lastLog: Date = start;
export function log(...args: any[]) {
  const sinceLastLog = (new Date().getTime() - lastLog.getTime()) / 1000;
  lastLog = new Date();
  const sinceStart = (lastLog.getTime() - start.getTime()) / 1000;
  // 2.2 seconds # 1.1 seconds ## (log)
  console.log(sinceStart, "seconds #", sinceLastLog, "seconds ##", ...args);
}
