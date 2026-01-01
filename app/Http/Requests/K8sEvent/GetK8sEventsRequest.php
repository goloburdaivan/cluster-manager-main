<?php

namespace App\Http\Requests\K8sEvent;

use App\Enums\K8sResources\Event\K8sObjectKind;
use App\Enums\SortDirection;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GetK8sEventsRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'namespace' => ['nullable', 'string'],
            'type' => ['nullable', 'string'],
            'object_kind' => ['nullable', 'string', Rule::enum(K8sObjectKind::class)],
            'object_name' => ['nullable', 'string'],
            'sort_by' => ['nullable', 'string', Rule::in(
                'first_seen_at',
                'last_seen_at',
                'count',
                'object_kind',
            )],
            'direction'   => ['nullable', 'string', Rule::enum(SortDirection::class)],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}
