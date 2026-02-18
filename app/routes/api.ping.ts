import type { Route } from "./+types/api.ping";

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const host = url.searchParams.get("host");

  if (!host) {
    return new Response(
      JSON.stringify({ error: "Host parameter required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // VULNERABLE: Direct command construction (simulated for safety)
  // In a real vulnerability, this would be: exec(`ping -c 4 ${host}`)
  // We simulate the vulnerability to show what would happen
  
  const command = `ping -c 4 ${host}`;
  
  // Check for common command injection patterns
  const injectionPatterns = [
    { pattern: /;/, description: "Command chaining with semicolon" },
    { pattern: /\|/, description: "Pipe operator" },
    { pattern: /`/, description: "Backtick command substitution" },
    { pattern: /\$\(/, description: "Command substitution $(...)" },
    { pattern: /&&/, description: "AND operator" },
    { pattern: /\|\|/, description: "OR operator" },
    { pattern: /&\s/, description: "Background process" },
  ];
  
  const detectedInjection = injectionPatterns.find(p => p.pattern.test(host));
  
  if (detectedInjection) {
    // Simulate what an attacker would see with successful command injection
    const injectedCommand = host.replace(/[^;&|`$()]+/, "").trim();
    
    return new Response(
      JSON.stringify({
        command: command,
        output: `PING ${host.split(/[;&|`]/)[0]} (93.184.216.34): 56 data bytes\n64 bytes from 93.184.216.34: icmp_seq=0 ttl=56 time=15.3 ms\n64 bytes from 93.184.216.34: icmp_seq=1 ttl=56 time=14.8 ms\n64 bytes from 93.184.216.34: icmp_seq=2 ttl=56 time=15.1 ms\n64 bytes from 93.184.216.34: icmp_seq=3 ttl=56 time=14.9 ms\n\n--- ${host.split(/[;&|`]/)[0]} ping statistics ---\n4 packets transmitted, 4 packets received, 0.0% packet loss\nround-trip min/avg/max/stddev = 14.8/15.0/15.3/0.2 ms\n\n[Simulated] Injected command would execute here: ${injectedCommand || host}\n[Simulated] Output: uid=33(www-data) gid=33(www-data) groups=33(www-data)`,
        simulated: true,
        vulnerability: {
          detected: true,
          type: detectedInjection.description,
          injectedInput: host
        }
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // Normal ping response simulation
  return new Response(
    JSON.stringify({
      command: command,
      output: `PING ${host} (93.184.216.34): 56 data bytes\n64 bytes from 93.184.216.34: icmp_seq=0 ttl=56 time=15.3 ms\n64 bytes from 93.184.216.34: icmp_seq=1 ttl=56 time=14.8 ms\n64 bytes from 93.184.216.34: icmp_seq=2 ttl=56 time=15.1 ms\n64 bytes from 93.184.216.34: icmp_seq=3 ttl=56 time=14.9 ms\n\n--- ${host} ping statistics ---\n4 packets transmitted, 4 packets received, 0.0% packet loss\nround-trip min/avg/max/stddev = 14.8/15.0/15.3/0.2 ms`,
      vulnerability: {
        detected: false,
        warning: "This endpoint is vulnerable to command injection"
      }
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

export async function action({ request }: Route.ActionArgs) {
  return new Response(
    JSON.stringify({ message: "Use GET request with ?host= parameter" }),
    { headers: { "Content-Type": "application/json" } }
  );
}
