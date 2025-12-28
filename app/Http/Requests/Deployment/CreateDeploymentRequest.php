<?php

namespace App\Http\Requests\Deployment;

use Illuminate\Contracts\Validation\ValidationRule;
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
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'apiVersion' => ['required', 'string'],
            'kind'       => ['required', 'string', Rule::in(['Deployment'])],
            'metadata'           => ['required', 'array'],
            'metadata.name'      => ['required', 'string', 'max:253', 'regex:/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/'],
            'metadata.namespace' => ['required', 'string'],
            'spec' => ['required', 'array'],
            'spec.replicas' => ['nullable', 'integer', 'max:100'],
        ];
    }
}
