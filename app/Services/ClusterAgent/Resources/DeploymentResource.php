<?php

namespace App\Services\ClusterAgent\Resources;

use App\DTO\K8sResources\Deployment\DeploymentData;
use App\DTO\K8sResources\Deployment\DeploymentListData;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
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

        return DeploymentListData::collect($deployments, Collection::class);
    }

    public function get(string $namespace, string $name): DeploymentData
    {
        $deployment = $this->connector->get("/deployments/{$namespace}/{$name}")->json('data');

        return DeploymentData::from($deployment);
    }

    public function create(DeploymentData $deployment): bool
    {
        $response = $this->connector->post('/deployments', $deployment->toArray());

        return $response->created();
    }

    public function delete(string $namespace, string $name): bool
    {
        $response = $this->connector->delete("/deployments/{$namespace}/{$name}");

        return $response->json('success');
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
