<?php

namespace App\Services\ClusterAgent\Resources;

use App\DTO\K8sResources\Deployment\DeploymentData;
use Illuminate\Support\Collection;

class DeploymentResource extends AbstractResource
{
    public function all(string $namespace = 'default'): Collection
    {
        $query = [
            'namespace' => $namespace,
        ];

        $response = $this->connector->get('/deployments', $query);
        $deployments = $response->json('data');

        return DeploymentData::collect($deployments, Collection::class);
    }

    public function scale(string $namespace, string $name, int $replicas): bool
    {
        $body = [
            'namespace' => $namespace,
            'name' => $name,
            'replicas' => $replicas,
        ];

        $response = $this->connector->patch('/deployments/scale', $body)->json();

        return $response['success'];
    }
}
