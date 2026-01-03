<?php

namespace App\Services\K8s;

use App\DTO\K8sResources\Service\ServiceData;
use App\Services\ClusterAgent\K8sAgentClient;
use Illuminate\Support\Collection;

readonly class K8sServiceService
{
    public function __construct(
        private K8sAgentClient $k8sAgentClient
    ) {
    }

    public function getServices(string $namespace = 'default'): Collection
    {
        return $this->k8sAgentClient->services()->all($namespace);
    }

    public function getService(string $namespace, string $name): ServiceData
    {
        return $this->k8sAgentClient->services()->get($namespace, $name);
    }
}
