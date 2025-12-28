<?php

namespace App\Http\Requests\Pod;

use App\Http\Requests\General\NamespaceRequest;

class GetPodsRequest extends NamespaceRequest
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
        return array_merge(parent::rules(), [
        ]);
    }
}
