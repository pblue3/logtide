<script lang="ts">
    import Breadcrumbs from "$lib/components/docs/Breadcrumbs.svelte";
    import CodeBlock from "$lib/components/docs/CodeBlock.svelte";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { AlertCircle, CheckCircle2 } from "lucide-svelte";
</script>

<div class="docs-content">
    <Breadcrumbs />

    <h1 class="text-3xl font-bold mb-4">Deployment Guide</h1>
    <p class="text-lg text-muted-foreground mb-8">
        Production deployment instructions for LogWard using Docker Compose.
    </p>

    <h2
        id="automated-deployment"
        class="text-2xl font-semibold mb-4 scroll-mt-20 border-b border-border pb-2"
    >
        Automated Deployment (Recommended)
    </h2>

    <div class="mb-12 space-y-6">
        <Card>
            <CardHeader>
                <div class="flex items-start gap-3">
                    <CheckCircle2 class="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                        <CardTitle class="text-base"
                            >One-Click Installation</CardTitle
                        >
                    </div>
                </div>
            </CardHeader>
            <CardContent class="text-sm text-muted-foreground">
                The automated installer handles everything for you - from
                prerequisites checks to database migrations.
            </CardContent>
        </Card>

        <div>
            <h3 class="text-lg font-semibold mb-3">Quick Start (5 Minutes)</h3>
            <CodeBlock
                lang="bash"
                code={`# Clone the repository
git clone https://github.com/logward-dev/logward.git
cd logward

# Run the installer
chmod +x install.sh
./install.sh`}
            />

            <div class="mt-4 space-y-3">
                <p class="text-sm text-muted-foreground">
                    The installer will automatically:
                </p>
                <ul class="space-y-2 text-sm text-muted-foreground ml-4">
                    <li class="flex items-start gap-2">
                        <CheckCircle2
                            class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                        />
                        <span>Check Docker and Docker Compose installation</span
                        >
                    </li>
                    <li class="flex items-start gap-2">
                        <CheckCircle2
                            class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                        />
                        <span
                            >Verify required ports (5432, 6379, 8080, 3000)</span
                        >
                    </li>
                    <li class="flex items-start gap-2">
                        <CheckCircle2
                            class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                        />
                        <span
                            >Generate secure random passwords (32 characters)</span
                        >
                    </li>
                    <li class="flex items-start gap-2">
                        <CheckCircle2
                            class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                        />
                        <span
                            >Create <code>docker/.env</code> configuration file</span
                        >
                    </li>
                    <li class="flex items-start gap-2">
                        <CheckCircle2
                            class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                        />
                        <span>Pull and build Docker images</span>
                    </li>
                    <li class="flex items-start gap-2">
                        <CheckCircle2
                            class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                        />
                        <span
                            ><strong
                                >Run database migrations automatically</strong
                            ></span
                        >
                    </li>
                    <li class="flex items-start gap-2">
                        <CheckCircle2
                            class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                        />
                        <span
                            >Start all services (PostgreSQL, Redis, Backend,
                            Worker, Frontend)</span
                        >
                    </li>
                    <li class="flex items-start gap-2">
                        <CheckCircle2
                            class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                        />
                        <span
                            >Perform health checks and display access URLs</span
                        >
                    </li>
                </ul>
            </div>
        </div>

        <div class="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div class="flex items-start gap-3">
                <CheckCircle2
                    class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                />
                <div>
                    <p
                        class="font-semibold text-green-600 dark:text-green-400 mb-1"
                    >
                        Installation Complete
                    </p>
                    <p class="text-sm text-muted-foreground">
                        Access LogWard at <code>http://localhost:3000</code> or
                        <code>http://your-server-ip:3000</code>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <h2
        id="manual-deployment"
        class="text-2xl font-semibold mb-4 scroll-mt-20 border-b border-border pb-2"
    >
        Manual Deployment (Alternative)
    </h2>

    <div class="mb-12 space-y-6">
        <Card>
            <CardHeader>
                <div class="flex items-start gap-3">
                    <AlertCircle class="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                        <CardTitle class="text-base"
                            >Before You Deploy</CardTitle
                        >
                    </div>
                </div>
            </CardHeader>
            <CardContent class="text-sm text-muted-foreground">
                Make sure you have Docker and Docker Compose installed on your
                server.
            </CardContent>
        </Card>

        <div>
            <h3 class="text-lg font-semibold mb-3">
                Step 1: Clone and Configure
            </h3>
            <CodeBlock
                lang="bash"
                code={`# Clone the repository
git clone https://github.com/logward-dev/logward.git
cd logward/docker

# Copy environment template
cp ../.env.example .env

# Edit .env with your configuration
nano .env`}
            />
        </div>

        <div>
            <h3 class="text-lg font-semibold mb-3">
                Step 2: Start All Services
            </h3>
            <CodeBlock
                lang="bash"
                code={`# Build and start all services
docker compose up -d --build

# Check service health
docker compose ps

# View logs
docker compose logs -f backend`}
            />

            <Card class="mt-4">
                <CardHeader>
                    <div class="flex items-start gap-3">
                        <CheckCircle2 class="w-5 h-5 text-primary mt-0.5" />
                        <div>
                            <CardTitle class="text-base"
                                >Automatic Migrations</CardTitle
                            >
                            <p class="text-sm text-muted-foreground mt-2">
                                Database migrations run automatically when the
                                backend container starts. No manual commands
                                needed!
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent class="text-sm text-muted-foreground">
                    <p>The entrypoint script will:</p>
                    <ul class="list-disc list-inside mt-2 space-y-1 ml-2">
                        <li>Wait for PostgreSQL to be ready</li>
                        <li>Run pending migrations automatically</li>
                        <li>Start the application</li>
                    </ul>
                    <p class="mt-3">
                        View migration logs: <code class="text-xs"
                            >docker compose logs backend | grep migration</code
                        >
                    </p>
                </CardContent>
            </Card>
        </div>

        <div class="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div class="flex items-start gap-3">
                <CheckCircle2
                    class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                />
                <div>
                    <p
                        class="font-semibold text-green-600 dark:text-green-400 mb-1"
                    >
                        Services Running
                    </p>
                    <p class="text-sm text-muted-foreground">
                        Access LogWard at <code>http://your-server-ip:3000</code
                        >
                    </p>
                </div>
            </div>
        </div>
    </div>

    <h2
        id="monitoring"
        class="text-2xl font-semibold mb-4 scroll-mt-20 border-b border-border pb-2"
    >
        Monitoring & Maintenance
    </h2>

    <div class="mb-8 space-y-6">
        <div>
            <h3 class="text-lg font-semibold mb-3">Health Checks</h3>
            <CodeBlock
                lang="bash"
                code={`# Check all services status
docker compose ps

# Check backend health
curl http://localhost:8080/health

# Check database
docker compose exec postgres psql -U logward -d logward -c "SELECT COUNT(*) FROM logs;"`}
            />
        </div>

        <div>
            <h3 class="text-lg font-semibold mb-3">Common Commands</h3>
            <CodeBlock
                lang="bash"
                code={`# Restart a service
docker compose restart backend

# View service logs
docker compose logs --tail=100 -f backend

# Stop all services
docker compose down

# Update to latest version
git pull origin main
docker compose up -d --build`}
            />
        </div>

        <div>
            <h3 class="text-lg font-semibold mb-3">Database Backup</h3>
            <CodeBlock
                lang="bash"
                code={`# Create backup
docker compose exec postgres pg_dump -U logward logward > backup_$(date +%Y%m%d).sql

# Restore from backup
docker compose exec -T postgres psql -U logward logward < backup_20250115.sql`}
            />
        </div>
    </div>
</div>

<style>
    .docs-content :global(code:not(pre code)) {
        @apply px-1.5 py-0.5 bg-muted rounded text-sm font-mono;
    }
</style>
