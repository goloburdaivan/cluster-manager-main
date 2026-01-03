<?php

namespace App\Services\K8s;

use App\DTO\K8sResources\ConfigMap\ConfigMapData;
use App\Services\ClusterAgent\K8sAgentClient;
use Illuminate\Support\Collection;

readonly class ConfigMapService
{
    public function __construct(
        private K8sAgentClient $client,
    ) {
    }

    public function getConfigMaps(string $namespace = 'default'): Collection
    {
        return $this->client->configMaps()->all($namespace);
    }

    public function getConfigMap(string $namespace, string $name): ConfigMapData
    {
        return $this->client->configMaps()->get($namespace, $name);
    }
}
