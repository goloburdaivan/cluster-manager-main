<?php

namespace App\Services\K8s;

use App\Services\ClusterAgent\K8sAgentClient;
use Illuminate\Support\Collection;

readonly class NodeService
{
    public function __construct(
        private K8sAgentClient $client,
    ) {
    }

    public function getNodes(): Collection
    {
        return $this->client->nodes()->all();
    }
}
