<?php

namespace App\Providers;

use App\Services\ClusterAgent\AgentConnector;
use App\Services\ClusterAgent\K8sAgentClient;
use Illuminate\Support\ServiceProvider;
use Psr\Log\LoggerInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(AgentConnector::class, function ($app) {
            return new AgentConnector(
                $app->make(LoggerInterface::class),
                baseUrl: config('services.cluster_agent.base_url', 'http://localhost:8080/api/v1'),
                clientTimeout: config('services.cluster_agent.timeout', 5),
            );
        });

        $this->app->singleton(K8sAgentClient::class, function ($app) {
            return new K8sAgentClient(
                $app->make(AgentConnector::class),
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
