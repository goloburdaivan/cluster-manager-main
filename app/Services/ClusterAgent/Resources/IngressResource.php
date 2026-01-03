<?php

namespace App\Services\ClusterAgent\Resources;

use App\DTO\K8sResources\Ingress\IngressData;
use App\DTO\K8sResources\Ingress\IngressListData;
use Illuminate\Support\Collection;

class IngressResource extends AbstractResource
{
    public function all(string $namespace = 'default'): Collection
    {
        $response = $this->connector
            ->get('/ingresses', $this->queryWithNamespace($namespace))
            ->json('data');

        return IngressListData::collect($response, Collection::class);
    }

    public function get(string $namespace, string $name): IngressData
    {
        $response = $this->connector->get("/ingresses/{$namespace}/{$name}")->json();

        return IngressData::from($response);
    }
}
