<?php

namespace App\Services\ClusterAgent\Resources;

use App\DTO\K8sResources\Pod\PodData;
use App\DTO\K8sResources\Pod\PodDetailData;
use Illuminate\Support\Collection;

class PodResource extends AbstractResource
{
    public function all(string $namespace = 'default'): Collection
    {
        $response = $this->connector
            ->get('/pods', $this->queryWithNamespace($namespace))
            ->json('data');

        return PodData::collect($response, Collection::class);
    }

    public function get(string $namespace, string $name): PodDetailData
    {
        $response = $this->connector->get("/pods/{$namespace}/{$name}")->json();

        return PodDetailData::from($response);
    }
}
