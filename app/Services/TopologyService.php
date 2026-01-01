<?php

namespace App\Services;

use App\DTO\Topology\Graph;
use App\Services\ClusterAgent\K8sAgentClient;

readonly class TopologyService
{
    public function __construct(
        private K8sAgentClient $k8sAgentClient,
    ) {
    }

    public function getTopology(string $namespace): Graph
    {
        return $this->k8sAgentClient->topology()->getTopology($namespace);
    }
}
