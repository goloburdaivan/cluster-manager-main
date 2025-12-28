<?php

namespace App\Http\Requests\Deployment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateDeploymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'apiVersion' => ['required', 'string', Rule::in(['apps/v1'])],
            'kind' => ['required', 'string', Rule::in(['Deployment'])],
            'metadata' => ['required', 'array'],
            'metadata.name' => ['required', 'string', 'max:253', 'regex:/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/'],
            'metadata.namespace' => ['required', 'string'],
            'metadata.labels' => ['nullable', 'array'],
            'metadata.annotations' => ['nullable', 'array'],

            // --- Spec (Deployment) ---
            'spec' => ['required', 'array'],
            'spec.replicas' => ['nullable', 'integer', 'min:0', 'max:100'],
            'spec.revisionHistoryLimit' => ['nullable', 'integer', 'min:0'],
            'spec.paused' => ['nullable', 'boolean'],

            // Strategy
            'spec.strategy' => ['nullable', 'array'],
            'spec.strategy.type' => ['nullable', 'string', Rule::in(['RollingUpdate', 'Recreate'])],
            'spec.strategy.rollingUpdate' => ['nullable', 'required_if:spec.strategy.type,RollingUpdate', 'array'],
            'spec.strategy.rollingUpdate.maxSurge' => ['nullable'],
            'spec.strategy.rollingUpdate.maxUnavailable' => ['nullable'],

            // Selector
            'spec.selector' => ['required', 'array'],
            'spec.selector.matchLabels' => ['required', 'array'],

            'spec.template' => ['required', 'array'],
            'spec.template.metadata' => ['required', 'array'],
            'spec.template.metadata.labels' => ['required', 'array'],

            // Pod Spec
            'spec.template.spec' => ['required', 'array'],
            'spec.template.spec.restartPolicy' => ['nullable', 'string', Rule::in(['Always', 'OnFailure', 'Never'])],
            'spec.template.spec.nodeSelector' => ['nullable', 'array'],
            'spec.template.spec.serviceAccountName' => ['nullable', 'string'],

            // Containers
            'spec.template.spec.containers' => ['required', 'array', 'min:1'],
            'spec.template.spec.containers.*.name' => ['required', 'string'],
            'spec.template.spec.containers.*.image' => ['required', 'string'],
            'spec.template.spec.containers.*.imagePullPolicy' => ['nullable', Rule::in(['Always', 'Never', 'IfNotPresent'])],

            // Ports
            'spec.template.spec.containers.*.ports' => ['nullable', 'array'],
            'spec.template.spec.containers.*.ports.*.containerPort' => ['required', 'integer', 'min:1', 'max:65535'],
            'spec.template.spec.containers.*.ports.*.protocol' => ['nullable', Rule::in(['TCP', 'UDP', 'SCTP'])],

            // Resources
            'spec.template.spec.containers.*.resources' => ['nullable', 'array'],
            'spec.template.spec.containers.*.resources.limits' => ['nullable', 'array'],
            'spec.template.spec.containers.*.resources.requests' => ['nullable', 'array'],

            // Environment Variables
            'spec.template.spec.containers.*.env' => ['nullable', 'array'],
            'spec.template.spec.containers.*.env.*.name' => ['required_with:spec.template.spec.containers.*.env', 'string'],
            'spec.template.spec.containers.*.env.*.value' => ['nullable', 'string'],

            // Probes (Liveness/Readiness)
            'spec.template.spec.containers.*.livenessProbe' => ['nullable', 'array'],
            'spec.template.spec.containers.*.readinessProbe' => ['nullable', 'array'],

            // Volumes
            'spec.template.spec.volumes' => ['nullable', 'array'],
            'spec.template.spec.containers.*.volumeMounts' => ['nullable', 'array'],
        ];
    }
}
