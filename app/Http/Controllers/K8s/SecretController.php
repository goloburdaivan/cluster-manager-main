<?php

namespace App\Http\Controllers\K8s;

use App\Contracts\Controllers\NeedsNamespaces;
use App\Http\Controllers\Controller;
use App\Http\Requests\General\NamespaceRequest;
use App\Services\K8s\SecretService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class SecretController extends Controller implements NeedsNamespaces
{
    public function __construct(
        private readonly SecretService $secretService,
    ) {
    }

    public function index(NamespaceRequest $request): Response
    {
        $data = $request->validated();

        $secrets = $this->secretService->getSecrets($data['namespace'] ?? 'default');

        return Inertia::render('Secrets/Index', [
            'secrets' => $secrets,
        ]);
    }

    public function show(string $namespace, string $name): JsonResponse
    {
        $secret = $this->secretService->getSecret($namespace, $name);

        return response()->json($secret);
    }
}
