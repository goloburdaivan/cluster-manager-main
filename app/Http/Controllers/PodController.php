<?php

namespace App\Http\Controllers;

use App\Contracts\Controllers\NeedsNamespaces;
use App\Http\Requests\Pod\GetPodsRequest;
use App\Services\PodService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class PodController extends Controller implements NeedsNamespaces
{
    public function __construct(
        private readonly PodService $podService,
    ) {
    }

    public function index(GetPodsRequest $request): Response
    {
        try {
            $data = $request->validated();

            $pods = $this->podService->getPods($data['namespace'] ?? 'default');

            return Inertia::render('Pods/Index', [
                'pods' => $pods,
            ]);
        } catch (\Throwable $e) {
            return Inertia::render('Pods/Index', [
                'pods' => [],
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function show(string $namespace, string $name): JsonResponse
    {
        try {
            $pod = $this->podService->getPod($namespace, $name);

            return response()->json($pod);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ]);
        }
    }
}
