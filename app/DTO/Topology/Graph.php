<?php

namespace App\DTO\Topology;

use Spatie\LaravelData\Data;

class Graph extends Data
{
    public function __construct(
        /** Для початку цього вистачить, потім можна задати більш типізовану структуру для елементів графу */
        public array $nodes = [],
        public array $edges = [],
    ) {
    }
}
