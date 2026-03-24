import { useEffect, useState, useRef } from "react";

interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  service: string;
}

const sampleLogs = [
  {
    level: "INFO",
    message: "Starting gRPC server on port :50051",
    service: "api-gateway",
  },
  {
    level: "DEBUG",
    message: "Loading configuration from /etc/config/app.yaml",
    service: "config-loader",
  },
  {
    level: "INFO",
    message: "Connected to Redis cluster (3 nodes)",
    service: "cache-client",
  },
  {
    level: "INFO",
    message: "Health check passed for all services",
    service: "health-monitor",
  },
  {
    level: "WARN",
    message: "High memory usage detected: 78%",
    service: "metrics-collector",
  },
  {
    level: "INFO",
    message: "New connection established from 10.0.1.45",
    service: "connection-manager",
  },
  {
    level: "DEBUG",
    message: "Processing request: POST /api/v1/users",
    service: "http-handler",
  },
  { level: "INFO", message: "Query executed in 12ms", service: "database" },
  {
    level: "ERROR",
    message: "Rate limit exceeded for client_id: abc123",
    service: "rate-limiter",
  },
  {
    level: "INFO",
    message: "Message published to topic: user.events",
    service: "kafka-producer",
  },
  {
    level: "DEBUG",
    message: "Circuit breaker state: CLOSED",
    service: "circuit-breaker",
  },
  {
    level: "INFO",
    message: "Response sent: 200 OK (45ms)",
    service: "http-handler",
  },
  { level: "WARN", message: "Slow query detected: 230ms", service: "database" },
  {
    level: "INFO",
    message: "Pod scaled to 3 replicas",
    service: "horizontal-pod-autoscaler",
  },
  {
    level: "DEBUG",
    message: "Cache hit for key: user_12345",
    service: "cache-client",
  },
];

const levelColors: Record<string, string> = {
  INFO: "text-blue-400",
  WARN: "text-yellow-400",
  ERROR: "text-red-400",
  DEBUG: "text-gray-400",
};

export default function LiveLogStreamer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let logId = 0;

    const generateLog = () => {
      const randomLog =
        sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
      const newLog: LogEntry = {
        id: logId++,
        timestamp: new Date().toISOString(),
        ...randomLog,
      };

      setLogs((prev) => [...prev.slice(-19), newLog]);
    };

    // Initial logs
    for (let i = 0; i < 5; i++) {
      setTimeout(() => generateLog(), i * 200);
    }

    // Stream logs
    const interval = setInterval(() => {
      if (isStreaming) {
        generateLog();
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isStreaming]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[#111111] border border-[#222222] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#222222] bg-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${isStreaming ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
              />
              <span className="font-mono text-sm text-gray-300">
                Live Log Stream
              </span>
            </div>
            <span className="text-gray-500">|</span>
            <span className="font-mono text-xs text-gray-500">
              ws://localhost:8080/stream
            </span>
          </div>
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="px-3 py-1.5 text-sm font-mono rounded bg-[#1a1a1a] hover:bg-[#222222] text-gray-300 transition-colors"
          >
            {isStreaming ? "Pause" : "Resume"}
          </button>
        </div>

        {/* Log Container */}
        <div
          ref={logContainerRef}
          className="h-80 overflow-y-auto p-4 font-mono text-xs space-y-1 scrollbar-thin"
        >
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-3 opacity-0 animate-fade-in"
              style={{ animationFillMode: "forwards" }}
            >
              <span className="text-gray-500 select-none">
                {new Date(log.timestamp).toLocaleTimeString("en-US", {
                  hour12: false,
                })}
              </span>
              <span
                className={`${levelColors[log.level]} select-none min-w-[50px]`}
              >
                [{log.level}]
              </span>
              <span className="text-purple-400 select-none min-w-[140px]">
                {log.service}:
              </span>
              <span className="text-gray-300">{log.message}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#222222] bg-[#0a0a0a]">
          <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
            <span>Showing last {logs.length} entries</span>
            <span>Buffer: 1000 lines</span>
          </div>
        </div>
      </div>
    </div>
  );
}
