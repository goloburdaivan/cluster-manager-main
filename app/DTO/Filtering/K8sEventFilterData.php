<?php

namespace App\DTO\Filtering;

use App\Enums\K8sResources\Event\K8sObjectKind;
use App\Enums\SortDirection;
use Spatie\LaravelData\Data;

class K8sEventFilterData extends Data
{
    public function __construct(
        public ?string $namespace = null,
        public ?string $type = null,
        public ?K8sObjectKind $object_kind = null,
        public ?string $object_name = null,
        public string $sort_by = 'last_seen_at',
        public SortDirection $direction = SortDirection::DESC,
        public int $per_page = 15
    ) {}
}
