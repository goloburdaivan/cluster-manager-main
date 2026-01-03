<?php

namespace App\Services\ClusterAgent\Resources;

use App\DTO\K8sResources\Node\NodeData;
use Illuminate\Support\Collection;

class NodeResource extends AbstractResource
{
    public function all(): Collection
    {
        $response = $this->connector->get("/nodes");

        return NodeData::collect($response->json()['nodes'], Collection::class);
    }
}
