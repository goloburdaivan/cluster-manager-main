<?php

namespace App\Services\ClusterAgent\Resources;

use App\DTO\Topology\Graph;

class TopologyResource extends AbstractResource
{
    public function getTopology(string $namespace): Graph
    {
        $query = [
            'namespace' => $namespace,
        ];

        $response = $this->connector->get("/topology", $query)->json();

        return Graph::from($response);
    }
}
