<?php

namespace App\Http\Requests\Deployment;

use Illuminate\Foundation\Http\FormRequest;

class ScaleDeploymentRequest extends FormRequest
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
            'namespace' => ['required', 'string'],
            'name' => ['required', 'string'],
            'replicas' => ['required', 'integer', 'min:1', 'max:110'],
        ];
    }
}
