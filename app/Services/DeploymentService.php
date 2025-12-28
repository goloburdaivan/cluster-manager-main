<?php

namespace App\Services;

use App\Services\ClusterAgent\K8sAgentClient;
use Illuminate\Support\Collection;

readonly class DeploymentService
{
    public function __construct(
        private K8sAgentClient $client,
    ) {
    }

    public function getDeployments(string $namespace = 'default'): Collection
    {
        return $this->client->deployments()->all($namespace);
    }

    public function scaleDeployment(string $namespace, string $name, int $replicas): bool
    {
        return $this->client->deployments()->scale($namespace, $name, $replicas);
    }
}
