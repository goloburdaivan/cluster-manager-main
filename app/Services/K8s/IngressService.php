<?php

namespace App\Services\K8s;

use App\DTO\K8sResources\Ingress\IngressData;
use App\Services\ClusterAgent\K8sAgentClient;
use Illuminate\Support\Collection;

readonly class IngressService
{
    public function __construct(
        private K8sAgentClient $client,
    ) {
    }

    public function getIngresses(string $namespace = 'default'): Collection
    {
        return $this->client->ingresses()->all($namespace);
    }

    public function getIngress(string $namespace, string $name): IngressData
    {
        return $this->client->ingresses()->get($namespace, $name);
    }
}
