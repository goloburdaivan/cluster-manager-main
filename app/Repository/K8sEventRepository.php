<?php

namespace App\Repository;

use App\Models\K8sEvent;

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
            'updated_at'
        ];

        return $this->upsert($eventsData, $uniqueBy, $updateColumns);
    }
}
