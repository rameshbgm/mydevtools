import { stringify } from "yaml";
export interface ComposePort { published: number; target: number; protocol: "tcp" | "udp" }
export interface ComposeVolume { name: string; target: string; readOnly: boolean }
export interface ComposeService { id: string; name: string; image: string; environment: string; command: string; ports: ComposePort[]; volumes: ComposeVolume[]; dependsOn: string[]; restart: "no" | "unless-stopped" | "on-failure" }
export interface ComposeTemplate { id: string; name: string; image: string; ports: [number, number][]; environment?: Record<string, string>; command?: string[]; volumes?: string[]; note: string; source: string }
const required = (key: string) => `\${${key}:?Set ${key} in .env}`;
export const COMPOSE_TEMPLATES: ComposeTemplate[] = [
    { id: "postgres", name: "PostgreSQL", image: "postgres:18", ports: [[5432,5432]], environment: { POSTGRES_USER: "dev", POSTGRES_DB: "app", POSTGRES_PASSWORD: required("POSTGRES_PASSWORD") }, volumes: ["/var/lib/postgresql"], note: "PostgreSQL 18+ uses a version-specific data directory under /var/lib/postgresql. Changing the major tag requires a deliberate data migration and mount review.", source: "https://hub.docker.com/_/postgres" },
    { id: "mysql", name: "MySQL", image: "mysql:8.4", ports: [[3306,3306]], environment: { MYSQL_ROOT_PASSWORD: required("MYSQL_ROOT_PASSWORD"), MYSQL_DATABASE: "app" }, volumes: ["/var/lib/mysql"], note: "The root password initializes a new data directory. Changing it in .env does not rotate an existing database password.", source: "https://hub.docker.com/_/mysql" },
    { id: "mariadb", name: "MariaDB", image: "mariadb:11.8", ports: [[3307,3306]], environment: { MARIADB_ROOT_PASSWORD: required("MARIADB_ROOT_PASSWORD"), MARIADB_DATABASE: "app" }, volumes: ["/var/lib/mysql"], note: "Uses host port 3307 to coexist with the MySQL starter. Initialization variables apply only to empty data directories.", source: "https://hub.docker.com/_/mariadb" },
    { id: "redis", name: "Redis", image: "redis:8", ports: [[6379,6379]], command: ["redis-server", "--appendonly", "yes", "--requirepass", required("REDIS_PASSWORD")], volumes: ["/data"], note: "Append-only persistence and an explicit required password. Configure ACLs/TLS for use beyond a local development stack.", source: "https://hub.docker.com/_/redis" },
    { id: "mongo", name: "MongoDB", image: "mongo:8", ports: [[27017,27017]], environment: { MONGO_INITDB_ROOT_USERNAME: "dev", MONGO_INITDB_ROOT_PASSWORD: required("MONGO_ROOT_PASSWORD") }, volumes: ["/data/db"], note: "Root initialization enables authentication for a new volume. Client authentication uses the admin database.", source: "https://hub.docker.com/_/mongo" },
    { id: "rabbitmq", name: "RabbitMQ", image: "rabbitmq:4-management", ports: [[5672,5672],[15672,15672]], environment: { RABBITMQ_DEFAULT_USER: "dev", RABBITMQ_DEFAULT_PASS: required("RABBITMQ_PASSWORD") }, volumes: ["/var/lib/rabbitmq"], note: "Includes the management UI on host port 15672. Use the provided non-guest account; review durable node identity before production use.", source: "https://hub.docker.com/_/rabbitmq" },
    { id: "nginx", name: "Nginx", image: "nginx:stable", ports: [[8080,80]], note: "Serves the image’s default page. Add your own configuration and content separately; this template does not infer upstream routes.", source: "https://hub.docker.com/_/nginx" },
    { id: "caddy", name: "Caddy", image: "caddy:2", ports: [[8081,80]], volumes: ["/data","/config"], note: "Serves the default HTTP page. A custom Caddyfile and explicit TLS/network design are required for a public deployment.", source: "https://hub.docker.com/_/caddy" },
    { id: "adminer", name: "Adminer", image: "adminer:5", ports: [[8082,8080]], note: "Database administration UI. Enter a database service name as the server; it does not provision a database.", source: "https://hub.docker.com/_/adminer" },
    { id: "memcached", name: "Memcached", image: "memcached:1.6", ports: [[11211,11211]], command: ["memcached", "-m", "64"], note: "Volatile cache without authentication in this starter. Bindings are loopback only; containers on the stack network can access it.", source: "https://hub.docker.com/_/memcached" },
    { id: "nats", name: "NATS JetStream", image: "nats:2", ports: [[4222,4222]], command: ["--jetstream", "--store_dir", "/data", "--auth", required("NATS_TOKEN")], volumes: ["/data"], note: "Single-node JetStream with a required token. Clustering, account permissions and TLS need separate configuration.", source: "https://docs.nats.io/running-a-nats-service/introduction/flags" },
    { id: "mailpit", name: "Mailpit", image: "axllent/mailpit:v1.27.4", ports: [[8025,8025],[1025,1025]], note: "Local SMTP capture and mail preview. This starter does not deliver real mail and has no web/SMTP authentication.", source: "https://mailpit.axllent.org/docs/install/docker/" },
];
export function serviceFromTemplate(template: ComposeTemplate, id: string, name = template.id): ComposeService {
    return { id, name, image: template.image, environment: Object.entries(template.environment ?? {}).map(([key,value]) => `${key}=${value}`).join("\n"), command: template.command ? JSON.stringify(template.command, null, 2) : "", ports: template.ports.map(([published,target]) => ({ published,target,protocol:"tcp" })), volumes: (template.volumes ?? []).map((target,index) => ({ name: `${name}-data${index ? `-${index + 1}` : ""}`, target, readOnly: false })), dependsOn: [], restart: "unless-stopped" };
}
export function parseComposeEnvironment(text: string): Record<string, string> {
    if (text.length > 32_768) throw new Error("Limit each environment block to 32 KiB.");
    const output: Record<string,string> = Object.create(null);
    for (const line of text.split(/\r?\n/)) {
        if (!line.trim() || line.trimStart().startsWith("#")) continue;
        const equals = line.indexOf("="), key = line.slice(0,equals).trim(), value = line.slice(equals + 1);
        if (equals < 1 || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)) throw new Error("Environment lines must use KEY=value. Values are literal text; surrounding quotes are retained.");
        if (Object.prototype.hasOwnProperty.call(output,key)) throw new Error(`Duplicate environment variable: ${key}.`);
        output[key] = value;
    }
    if (Object.keys(output).length > 128) throw new Error("Use at most 128 environment variables per service.");
    return output;
}
export function generateCompose(project: string, services: ComposeService[]) {
    if (!/^[a-z0-9][a-z0-9_-]{0,62}$/.test(project)) throw new Error("Project name: 1–63 lowercase letters, digits, hyphens or underscores, beginning with a letter or digit.");
    if (!services.length || services.length > 20) throw new Error("Choose 1–20 services.");
    const names = new Set<string>(), ids = new Set<string>(), ports = new Set<string>(), volumes: Record<string,object> = Object.create(null), output: Record<string,unknown> = Object.create(null), requirements = new Set<string>(), warnings: string[] = [], volumeUsers = new Map<string,Set<string>>();
    for (const service of services) {
        if (!service.id || ids.has(service.id)) throw new Error("Service identifiers must be unique."); ids.add(service.id);
        if (!/^[a-z][a-z0-9_-]{0,62}$/.test(service.name) || names.has(service.name)) throw new Error("Service names must be unique, start with a lowercase letter and contain at most 63 lowercase letters, digits, hyphens or underscores."); names.add(service.name);
    }
    const byName = new Map(services.map((service) => [service.name,service])), visiting = new Set<string>(), visited = new Set<string>();
    function checkDependencies(name: string) {
        if (visiting.has(name)) throw new Error(`Dependency cycle includes ${name}.`); if (visited.has(name)) return;
        visiting.add(name); const dependencies = byName.get(name)!.dependsOn;
        if (dependencies.length > 19 || new Set(dependencies).size !== dependencies.length) throw new Error(`${name}: dependencies must be unique.`);
        for (const dependency of dependencies) { if (!names.has(dependency)) throw new Error(`${name}: unknown dependency ${dependency}.`); checkDependencies(dependency); }
        visiting.delete(name); visited.add(name);
    }
    for (const service of services) {
        checkDependencies(service.name);
        if (!/^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,255}$/.test(service.image)) throw new Error(`${service.name}: enter a Docker image reference without whitespace or interpolation.`);
        if (!["no","unless-stopped","on-failure"].includes(service.restart)) throw new Error(`${service.name}: invalid restart policy.`);
        if (service.ports.length > 12 || service.volumes.length > 12) throw new Error(`${service.name}: use at most 12 ports and 12 named volumes.`);
        const environment = parseComposeEnvironment(service.environment);
        const settings: Record<string,unknown> = { image: service.image, restart: service.restart };
        if (Object.keys(environment).length) settings.environment = environment;
        if (service.command.trim()) {
            if (service.command.length > 16_384) throw new Error(`${service.name}: command exceeds 16 KiB.`);
            const command: unknown = JSON.parse(service.command);
            if (!Array.isArray(command) || !command.length || command.length > 128 || command.some((part) => typeof part !== "string" || part.length > 4096 || /\x00/.test(part))) throw new Error(`${service.name}: command must be a JSON array of 1–128 strings, with no NUL characters.`);
            settings.command = command;
        }
        if (service.ports.length) settings.ports = service.ports.map((port) => {
            if (![port.published,port.target].every((value) => Number.isInteger(value) && value >= 1 && value <= 65535) || !["tcp","udp"].includes(port.protocol)) throw new Error(`${service.name}: ports must be integers from 1 to 65535 with TCP or UDP.`);
            const key = `${port.published}/${port.protocol}`; if (ports.has(key)) throw new Error(`Host port collision: 127.0.0.1:${key}.`); ports.add(key);
            return { target: port.target, published: String(port.published), host_ip: "127.0.0.1", protocol: port.protocol };
        });
        const targets = new Set<string>();
        if (service.volumes.length) settings.volumes = service.volumes.map((volume) => {
            if (!/^[a-z0-9][a-z0-9_-]{0,62}$/.test(volume.name) || !/^\/(?:[A-Za-z0-9_.-]+\/?)*$/.test(volume.target) || volume.target.length > 256 || volume.target.split("/").some((part) => part === ".." || part === ".") || targets.has(volume.target)) throw new Error(`${service.name}: use unique absolute Linux mount paths and simple named volume names.`);
            targets.add(volume.target); volumes[volume.name] = {};
            const users = volumeUsers.get(volume.name) ?? new Set<string>(); users.add(service.name); volumeUsers.set(volume.name,users);
            return { type: "volume", source: volume.name, target: volume.target, read_only: Boolean(volume.readOnly) };
        });
        if (service.dependsOn.length) settings.depends_on = service.dependsOn;
        output[service.name] = settings;
        for (const text of [service.environment,service.command]) for (const match of text.matchAll(/(?<!\$)\$\{([A-Za-z_][A-Za-z0-9_]*):\?[^}]*\}/g)) requirements.add(match[1]);
        if (!service.image.includes(":" ) && !service.image.includes("@") || service.image.endsWith(":latest") || service.image.endsWith(":stable")) warnings.push(`${service.name}: the image tag can move. Pin an image digest for reproducible deployments.`);
    }
    for (const [volume,users] of volumeUsers) if (users.size > 1) warnings.push(`${volume} is shared by ${Array.from(users).join(", ")}. Separate database services should not share a data volume.`);
    const document: Record<string,unknown> = { name: project, services: output }; if (Object.keys(volumes).length) document.volumes = volumes;
    const yaml = "# Local development starter. Review images, licenses, secrets and readiness before running.\n" + stringify(document,{ lineWidth: 0 });
    if (yaml.length > 512 * 1024) throw new Error("Generated YAML exceeds 512 KiB.");
    const envExample = "# Copy to .env and replace every placeholder. Keep .env out of version control.\n" + Array.from(requirements).sort().map((key) => `${key}=CHANGE_ME`).join("\n") + "\n";
    return { yaml, envExample, requiredVariables: Array.from(requirements).sort(), warnings };
}
