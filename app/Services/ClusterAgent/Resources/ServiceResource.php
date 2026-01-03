<?php

namespace App\Services\ClusterAgent\Resources;

use App\DTO\K8sResources\Service\ServiceData;
use App\DTO\K8sResources\Service\ServiceListData;
use Illuminate\Support\Collection;

class ServiceResource extends AbstractResource
{
    public function all(string $namespace = 'default'): Collection
    {
        $response = $this->connector
            ->get('/services', $this->queryWithNamespace($namespace))
            ->json('data');

        return ServiceListData::collect($response, Collection::class);
    }

    public function get(string $namespace, string $name): ServiceData
    {
        $response = $this->connector->get("/services/$namespace/$name")->json('data');

        return ServiceData::from($response);
    }
}
