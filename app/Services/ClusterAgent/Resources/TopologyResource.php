<?php

namespace App\Services\ClusterAgent\Resources;

use App\DTO\Topology\Graph;

class TopologyResource extends AbstractResource
{
    public function getTopology(string $namespace): Graph
    {
        $response = $this->connector
            ->get("/topology", $this->queryWithNamespace($namespace))
            ->json();

        return Graph::from($response);
    }
}
