<script lang="ts">
    import Breadcrumbs from "$lib/components/docs/Breadcrumbs.svelte";
    import CodeBlock from "$lib/components/docs/CodeBlock.svelte";
    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { ExternalLink } from "lucide-svelte";
</script>

<div class="docs-content">
    <Breadcrumbs />

    <div class="flex items-center justify-between mb-4">
        <h1 class="text-3xl font-bold">Kotlin SDK</h1>
        <a
            href="https://github.com/logward-dev/logward-sdk-kotlin"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
            <ExternalLink class="w-4 h-4" />
            GitHub
        </a>
    </div>

    <p class="text-lg text-muted-foreground mb-8">
        Official Kotlin SDK for LogWard with coroutines support, automatic
        batching, retry logic, circuit breaker, query API, and middleware
        integrations for Ktor, Spring Boot, and Jakarta Servlet.
    </p>

    <h2
        id="installation"
        class="text-2xl font-semibold mb-4 scroll-mt-20 border-b border-border pb-2"
    >
        Installation
    </h2>

    <div class="mb-8 space-y-6">
        <div>
            <h3 class="text-lg font-semibold mb-3">Gradle (Kotlin DSL)</h3>
            <CodeBlock
                lang="kotlin"
                code={`dependencies {
    implementation("io.github.logward-dev:logward-sdk-kotlin:0.2.0")
}`}
            />
        </div>

        <div>
            <h3 class="text-lg font-semibold mb-3">Gradle (Groovy)</h3>
            <CodeBlock
                lang="groovy"
                code={`dependencies {
    implementation 'io.github.logward-dev:logward-sdk-kotlin:0.2.0'
}`}
            />
        </div>

        <div>
            <h3 class="text-lg font-semibold mb-3">Maven</h3>
            <CodeBlock
                lang="xml"
                code={`<dependency>
    <groupId>io.github.logward-dev</groupId>
    <artifactId>logward-sdk-kotlin</artifactId>
    <version>0.2.0</version>
</dependency>`}
            />
        </div>
    </div>

    <h2
        id="quick-start"
        class="text-2xl font-semibold mb-4 scroll-mt-20 border-b border-border pb-2"
    >
        Quick Start
    </h2>

    <div class="mb-8">
        <CodeBlock
            lang="kotlin"
            code={`import dev.logward.sdk.LogWardClient
import dev.logward.sdk.models.LogWardClientOptions

val client = LogWardClient(
    LogWardClientOptions(
        apiUrl = "http://localhost:8080",
        apiKey = "lp_your_api_key_here"
    )
)

// Send logs
client.info("api-gateway", "Server started", mapOf("port" to 3000))
client.error("database", "Connection failed", RuntimeException("Timeout"))

// Graceful shutdown (also automatic on JVM shutdown)
runBlocking {
    client.close()
}`}
        />
    </div>

    <h2
        id="features"
        class="text-2xl font-semibold mb-4 scroll-mt-20 border-b border-border pb-2"
    >
        Features
    </h2>

    <div class="mb-8 grid gap-3">
        <Card>
            <CardContent class="pt-4 text-sm">
                <ul class="space-y-2">
                    <li>
                        ✅ Automatic batching with configurable size and
                        interval
                    </li>
                    <li>✅ Retry logic with exponential backoff</li>
                    <li>✅ Circuit breaker pattern for fault tolerance</li>
                    <li>
                        ✅ Max buffer size with drop policy to prevent memory
                        leaks
                    </li>
                    <li>✅ Query API for searching and filtering logs</li>
                    <li>✅ Live tail with Server-Sent Events (SSE)</li>
                    <li>✅ Trace ID context for distributed tracing</li>
                    <li>✅ Global metadata added to all logs</li>
                    <li>✅ Structured error serialization</li>
                    <li>✅ Internal metrics (logs sent, errors, latency)</li>
                    <li>✅ Coroutines support for async operations</li>
                    <li>✅ Ktor Plugin for automatic HTTP logging</li>
                    <li>
                        ✅ Spring Boot Interceptor for automatic HTTP logging
                    </li>
                    <li>
                        ✅ Jakarta Servlet Filter for automatic HTTP logging
                    </li>
                    <li>✅ Kotlin Multiplatform ready</li>
                </ul>
            </CardContent>
        </Card>
    </div>

    <h2
        id="configuration"
        class="text-2xl font-semibold mb-4 scroll-mt-20 border-b border-border pb-2"
    >
        Configuration
    </h2>

    <div class="mb-8">
        <CodeBlock
            lang="kotlin"
            code={`val client = LogWardClient(LogWardClientOptions(
    // Required
    apiUrl = "http://localhost:8080",
    apiKey = "lp_your_api_key",
    
    // Optional - Performance
    batchSize = 100,              // Max logs per batch (default: 100)
    flushInterval = 5.seconds,    // Flush interval (default: 5s)
    maxBufferSize = 10000,        // Max logs in buffer (default: 10000)
    
    // Optional - Reliability
    maxRetries = 3,               // Max retry attempts (default: 3)
    retryDelay = 1.seconds,       // Initial retry delay (default: 1s)
    circuitBreakerThreshold = 5,  // Failures before circuit opens (default: 5)
    circuitBreakerTimeout = 60.seconds, // Circuit reset timeout (default: 60s)
    
    // Optional - Metadata
    globalMetadata = mapOf(       // Added to all logs
        "environment" to "production",
        "version" to "1.0.0"
    ),
    
    // Optional - Features
    enableMetrics = true,         // Enable metrics collection (default: true)
    debug = false                 // Enable debug logging (default: false)
))`}
        />
    </div>

    <h2
        id="logging"
        class="text-2xl font-semibold mb-4 scroll-mt-20 border-b border-border pb-2"
    >
        Logging Methods
    </h2>

    <div class="mb-8 space-y-6">
        <div>
            <h3 class="text-lg font-semibold mb-3">Basic Logging</h3>
            <CodeBlock
                lang="kotlin"
                code={`// Log levels: debug, info, warn, error, critical
client.debug("service-name", "Debug message", mapOf("detail" to "value"))
client.info("api-gateway", "Request received", mapOf("method" to "GET", "path" to "/users"))
client.warn("cache", "Cache miss", mapOf("key" to "user:123"))
client.error("database", "Query failed", mapOf("query" to "SELECT *"))
client.critical("system", "Out of memory", mapOf("used" to "95%"))`}
            />
        </div>

        <div>
            <h3 class="text-lg font-semibold mb-3">
                Error Logging with Auto-Serialization
            </h3>
            <CodeBlock
                lang="kotlin"
                code={`// Automatically serializes exception details
try {
    database.connect()
} catch (e: SQLException) {
    client.error("database", "Connection failed", e)
    // Automatically includes: exception type, message, and stack trace
}`}
            />
        </div>

        <div>
            <h3 class="text-lg font-semibold mb-3">Trace ID Context</h3>
            <CodeBlock
                lang="kotlin"
                code={`// Manual trace ID
client.withTraceId("550e8400-e29b-41d4-a716-446655440000") {
    client.info("api", "Processing request")
    client.info("db", "Query executed")
}

// Scoped trace ID (coroutines)
coroutineScope {
    client.withTraceId("my-trace-id") {
        launch { client.info("worker-1", "Task started") }
        launch { client.info("worker-2", "Task started") }
    }
}

// Auto-generated trace ID
client.withTraceId { // generates UUID
    client.info("api", "Request processing")
}`}
            />
        </div>
    </div>

    <h2
        id="middleware"
        class="text-2xl font-semibold mb-4 scroll-mt-20 border-b border-border pb-2"
    >
        Middleware Integration
    </h2>

    <div class="mb-8 space-y-6">
        <div>
            <h3 class="text-lg font-semibold mb-3">Ktor Plugin</h3>
            <p class="text-sm text-muted-foreground mb-3">
                Automatically log HTTP requests and responses in Ktor
                applications.
            </p>
            <CodeBlock
                lang="kotlin"
                code={`import dev.logward.sdk.middleware.LogWardPlugin
import io.ktor.server.application.*

fun Application.module() {
    install(LogWardPlugin) {
        apiUrl = "http://localhost:8080"
        apiKey = "lp_your_api_key_here"
        serviceName = "ktor-app"

        // Optional configuration
        logRequests = true
        logResponses = true
        logErrors = true
        skipHealthCheck = true
        skipPaths = setOf("/metrics", "/internal")

        // Client options
        batchSize = 100
        flushInterval = 5.seconds
        enableMetrics = true
        globalMetadata = mapOf("env" to "production")
    }
}

// Access client manually in routes
routing {
    get("/api/custom") {
        val client = call.application.attributes[LogWardClientKey]
        client.info("my-service", "Custom business logic executed",
            mapOf("userId" to 123, "action" to "custom_operation"))
        call.respondText("OK")
    }
}`}
            />
        </div>

        <div>
            <h3 class="text-lg font-semibold mb-3">Spring Boot Interceptor</h3>
            <p class="text-sm text-muted-foreground mb-3">
                Automatically log HTTP requests and responses in Spring Boot
                applications.
            </p>
            <CodeBlock
                lang="kotlin"
                code={`import dev.logward.sdk.LogWardClient
import dev.logward.sdk.middleware.LogWardInterceptor
import dev.logward.sdk.models.LogWardClientOptions
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class LogWardConfig : WebMvcConfigurer {

    @Bean
    fun logWardClient() = LogWardClient(
        LogWardClientOptions(
            apiUrl = "http://localhost:8080",
            apiKey = "lp_your_api_key_here"
        )
    )

    @Bean
    fun logWardInterceptor(client: LogWardClient) = LogWardInterceptor(
        client = client,
        serviceName = "spring-boot-app",
        logRequests = true,
        logResponses = true,
        skipHealthCheck = true
    )

    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(logWardInterceptor(logWardClient()))
    }
}`}
            />
        </div>

        <div>
            <h3 class="text-lg font-semibold mb-3">Jakarta Servlet Filter</h3>
            <p class="text-sm text-muted-foreground mb-3">
                Automatically log HTTP requests and responses in Jakarta Servlet
                applications (Tomcat, Jetty, etc.).
            </p>
            <CodeBlock
                lang="kotlin"
                code={`import dev.logward.sdk.LogWardClient
import dev.logward.sdk.middleware.LogWardFilter
import dev.logward.sdk.models.LogWardClientOptions

// Create client
val client = LogWardClient(
    LogWardClientOptions(
        apiUrl = "http://localhost:8080",
        apiKey = "lp_your_api_key_here"
    )
)

// Create filter
val filter = LogWardFilter(
    client = client,
    serviceName = "servlet-app",
    logRequests = true,
    logResponses = true,
    skipHealthCheck = true
)

// Add to servlet context
servletContext.addFilter("logWard", filter)`}
            />
        </div>
    </div>

    <h2
        id="query-api"
        class="text-2xl font-semibold mb-4 scroll-mt-20 border-b border-border pb-2"
    >
        Query API
    </h2>

    <div class="mb-8 space-y-6">
        <div>
            <h3 class="text-lg font-semibold mb-3">Basic Query</h3>
            <CodeBlock
                lang="kotlin"
                code={`// Search logs
val result = client.query(
    service = "api-gateway",
    level = "error",
    from = "2025-01-15T00:00:00Z",
    to = "2025-01-15T23:59:59Z",
    limit = 100
)

println("Found \${result.total} error logs")
result.logs.forEach { log ->
    println("[\${log.time}] \${log.message}")
}`}
            />
        </div>

        <div>
            <h3 class="text-lg font-semibold mb-3">Full-Text Search</h3>
            <CodeBlock
                lang="kotlin"
                code={`val result = client.query(
    q = "timeout OR connection",  // Full-text search
    level = "error",
    limit = 50
)`}
            />
        </div>

        <div>
            <h3 class="text-lg font-semibold mb-3">Get Logs by Trace ID</h3>
            <CodeBlock
                lang="kotlin"
                code={`val logs = client.getLogsByTraceId(
    traceId = "550e8400-e29b-41d4-a716-446655440000"
)

// Returns all logs with the same trace_id
logs.forEach { log ->
    println("[\${log.service}] \${log.message}")
}`}
            />
        </div>
    </div>

    <h2
        id="live-streaming"
        class="text-2xl font-semibold mb-4 scroll-mt-20 border-b border-border pb-2"
    >
        Live Streaming (SSE)
    </h2>

    <div class="mb-8">
        <CodeBlock
            lang="kotlin"
            code={`// Stream logs in real-time
client.liveTail(
    service = "api-gateway",
    level = "error"
) { log ->
    // Called for each new log
    println("[\${log.time}] \${log.message}")
}

// Stream will automatically reconnect on connection loss`}
        />
    </div>

    <h2
        id="metrics"
        class="text-2xl font-semibold mb-4 scroll-mt-20 border-b border-border pb-2"
    >
        Metrics
    </h2>

    <div class="mb-8">
        <CodeBlock
            lang="kotlin"
            code={`// Get internal metrics
val metrics = client.getMetrics()

println("Logs sent: \${metrics.logsSent}")
println("Logs failed: \${metrics.logsFailed}")
println("Avg latency: \${metrics.avgLatencyMs}ms")
println("Circuit breaker state: \${metrics.circuitBreakerState}")`}
        />
    </div>

    <h2
        id="best-practices"
        class="text-2xl font-semibold mb-4 scroll-mt-20 border-b border-border pb-2"
    >
        Best Practices
    </h2>

    <div class="space-y-4">
        <Card>
            <CardHeader>
                <CardTitle class="text-base"
                    >1. Use Middleware for HTTP Logging</CardTitle
                >
            </CardHeader>
            <CardContent class="text-sm text-muted-foreground">
                Leverage built-in middleware plugins (Ktor, Spring Boot, Jakarta
                Servlet) for automatic HTTP request/response logging instead of
                manual instrumentation.
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle class="text-base"
                    >2. Use Coroutines for Async</CardTitle
                >
            </CardHeader>
            <CardContent class="text-sm text-muted-foreground">
                Leverage Kotlin coroutines for non-blocking log operations in
                high-concurrency applications.
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle class="text-base">3. Graceful Shutdown</CardTitle>
            </CardHeader>
            <CardContent class="text-sm text-muted-foreground">
                Always call <code>client.close()</code> on shutdown to ensure buffered
                logs are flushed before JVM terminates. The SDK also registers an
                automatic shutdown hook.
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle class="text-base">4. Use Global Metadata</CardTitle>
            </CardHeader>
            <CardContent class="text-sm text-muted-foreground">
                Set global metadata (environment, version) at initialization to
                avoid repeating it in every log call.
            </CardContent>
        </Card>
    </div>
</div>

<style>
    .docs-content :global(code:not(pre code)) {
        padding-left: 0.375rem;
        padding-right: 0.375rem;
        padding-top: 0.125rem;
        padding-bottom: 0.125rem;
        background-color: hsl(var(--muted));
        border-radius: 0.25rem;
        font-size: 0.875rem;
        font-family: ui-monospace, monospace;
    }
</style>
