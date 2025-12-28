<?php

namespace App\Http\Controllers;

use App\Contracts\Controllers\NeedsNamespaces;
use App\Http\Requests\Deployment\GetDeploymentsRequest;
use App\Http\Requests\Deployment\ScaleDeploymentRequest;
use App\Services\DeploymentService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DeploymentController extends Controller implements NeedsNamespaces
{
    public function __construct(
        private readonly DeploymentService $deploymentService,
    )
    {
    }

    public function index(GetDeploymentsRequest $request): Response
    {
        try {
            $data = $request->validated();

            $deployments = $this->deploymentService->getDeployments($data['namespace'] ?? 'default');

            return Inertia::render('Deployments/Index', [
                'deployments' => $deployments,
            ]);
        } catch (\Throwable $e) {
            return Inertia::render('Deployments/Index', [
                'deployments' => [],
                'error' => $e->getMessage(),
            ]);
        }
    }

    public function scale(ScaleDeploymentRequest $request): RedirectResponse
    {
        try {
            $data = $request->validated();

            $result = $this->deploymentService->scaleDeployment(
                $data['namespace'],
                $data['name'],
                $data['replicas']
            );

            if (!$result) {
                return back()->with('error', 'Failed to scale deployment');
            }

            return back()->with('success', 'Successfully scaled deployment');
        } catch (\Throwable $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
