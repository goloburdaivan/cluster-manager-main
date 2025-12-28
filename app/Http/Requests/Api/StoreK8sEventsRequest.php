<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StoreK8sEventsRequest extends FormRequest
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
            '*' => ['required', 'array'],
            '*.metadata.uid' => ['required', 'string'],
            '*.type'    => ['required', 'string'],
            '*.reason'  => ['required', 'string'],
            '*.message' => ['nullable', 'string'],
            '*.involvedObject'           => ['required', 'array'],
            '*.involvedObject.kind'      => ['required', 'string'],
            '*.involvedObject.name'      => ['required', 'string'],
            '*.involvedObject.namespace' => ['nullable', 'string'],
            '*.involvedObject.uid'       => ['nullable', 'string'],
            '*.source'           => ['nullable', 'array'],
            '*.source.component' => ['nullable', 'string'],
            '*.source.host'      => ['nullable', 'string'],
            '*.count'          => ['nullable', 'integer'],
            '*.firstTimestamp' => ['nullable', 'date'],
            '*.lastTimestamp'  => ['nullable', 'date'],
        ];
    }
}
