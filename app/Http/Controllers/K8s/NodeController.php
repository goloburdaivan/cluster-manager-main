<?php

namespace App\Http\Controllers\K8s;

use App\Http\Controllers\Controller;
use App\Services\K8s\NodeService;
use Inertia\Inertia;
use Inertia\Response;

class NodeController extends Controller
{
    public function __construct(
        private readonly NodeService $nodeService,
    ) {
    }

    public function index(): Response
    {
        try {
            $nodes = $this->nodeService->getNodes();

            return Inertia::render('Nodes/Index', [
                'nodes' => $nodes,
            ]);
        } catch (\Throwable $e) {
            return Inertia::render('Nodes/Index', [
                'nodes' => [],
                'error' => $e->getMessage(),
            ]);
        }
    }
}
