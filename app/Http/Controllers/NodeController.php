<?php

namespace App\Http\Controllers;

use App\Services\NodeService;
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
