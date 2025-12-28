<?php

namespace App\Services;

use App\DTO\K8sResources\Deployment\DeploymentData;
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

    public function getDeployment(string $namespace, string $name): DeploymentData
    {
        return $this->client->deployments()->get($namespace, $name);
    }

    public function createDeployment(DeploymentData $deployment): bool
    {
        return $this->client->deployments()->create($deployment);
    }

    public function deleteDeployment(string $namespace, string $name): bool
    {
        return $this->client->deployments()->delete($namespace, $name);
    }

    public function scaleDeployment(string $namespace, string $name, int $replicas): bool
    {
        return $this->client->deployments()->scale($namespace, $name, $replicas);
    }
}
