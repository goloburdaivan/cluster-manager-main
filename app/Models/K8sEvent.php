<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class K8sEvent extends Model
{
    protected $fillable = [
        'uid',
        'namespace',
        'type',
        'reason',
        'message',
        'object_kind',
        'object_name',
        'object_uid',
        'source_component',
        'source_host',
        'count',
        'first_seen_at',
        'last_seen_at',
    ];

    protected $casts = [
        'first_seen_at' => 'datetime',
        'last_seen_at' => 'datetime',
        'count' => 'integer',
    ];

    public function prunable()
    {
        return static::query()->where('last_seen_at', '<=', now()->subDays(7));
    }
}
