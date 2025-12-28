<?php

namespace App\Services;

use App\DTO\K8sResources\Pod\PodDetailData;
use App\Services\ClusterAgent\K8sAgentClient;
use Illuminate\Support\Collection;

readonly class PodService
{
    public function __construct(
        private K8sAgentClient $client,
    ) {
    }

    public function getPods(string $namespace = "default"): Collection
    {
        return $this->client->pods()->all($namespace);
    }

    public function getPod(string $namespace, string $podName): PodDetailData
    {
        return $this->client->pods()->get($namespace, $podName);
    }
}
