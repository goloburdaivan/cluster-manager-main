<?php

namespace App\Services\ClusterAgent\Resources\Traits;

use Illuminate\Support\Facades\Cache;

trait CacheableResource
{
    protected function getCacheTtl(): int
    {
        return property_exists($this, 'cacheTtl') ? $this->cacheTtl : 300;
    }

    protected function remember(string $key, \Closure $callback, ?int $ttl = null)
    {
        $cacheKey = class_basename($this) . ':' . $key;

        $seconds = $ttl ?? $this->getCacheTtl();

        return Cache::remember($cacheKey, $seconds, $callback);
    }
}
