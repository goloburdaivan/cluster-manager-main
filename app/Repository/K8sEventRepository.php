<?php

namespace App\Repository;

use App\DTO\Filtering\K8sEventFilterData;
use App\Models\K8sEvent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class K8sEventRepository extends AbstractRepository
{
    public function model(): string
    {
        return K8sEvent::class;
    }

    public function saveBatch(array $eventsData): int
    {
        $uniqueBy = ['uid'];
        $updateColumns = [
            'count',
            'type',
            'reason',
            'message',
            'last_seen_at',
            'updated_at',
        ];

        return $this->upsert($eventsData, $uniqueBy, $updateColumns);
    }

    public function getFiltered(K8sEventFilterData $filters, int $limit = 500): Collection
    {
        return $this->buildFilterQuery($filters)
            ->limit($limit)
            ->get();
    }

    public function paginateFiltered(K8sEventFilterData $filters): LengthAwarePaginator
    {
        return $this->buildFilterQuery($filters)
            ->paginate($filters->per_page)
            ->withQueryString();
    }

    protected function buildFilterQuery(K8sEventFilterData $filters): Builder
    {
        $query = $this->query();

        $query->when($filters->namespace, fn($q, $v) => $q->where('namespace', $v))
            ->when($filters->object_kind, fn($q, $v) => $q->where('object_kind', $v->value))
            ->when($filters->object_name, fn($q, $v) => $q->where('object_name', 'like', $v . '%'))
            ->when($filters->type, fn($q, $v) => $q->where('type', $v));

        $allowedSorts = [
            'last_seen_at',
            'count',
            'object_kind'
        ];

        if (in_array($filters->sort_by, $allowedSorts)) {
            $query->orderBy($filters->sort_by, $filters->direction->value);
        } else {
            $query->orderBy('last_seen_at', 'desc');
        }

        return $query;
    }
}
