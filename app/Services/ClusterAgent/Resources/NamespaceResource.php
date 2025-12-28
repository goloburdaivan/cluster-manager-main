<?php

namespace App\Services\ClusterAgent\Resources;

use App\Services\ClusterAgent\Resources\Traits\CacheableResource;

class NamespaceResource extends AbstractResource
{
    use CacheableResource;

    public function all(): array
    {
        return $this->remember('all', function () {
            $response = $this->connector->get("/namespaces");
            return $response->json();
        });
    }
}
