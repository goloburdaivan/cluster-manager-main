import React from 'react';
import { Select } from '@radix-ui/themes';
import { router } from '@inertiajs/react';

export default function NamespaceSelector({ namespaces = [], disabled = false }) {
    const searchParams = new URLSearchParams(window.location.search);
    const currentNamespace = searchParams.get('namespace') || 'default';

    const handleValueChange = (value) => {
        const currentPath = window.location.pathname;

        router.get(
            currentPath,
            { namespace: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true
            }
        );
    };

    return (
        <Select.Root
            value={currentNamespace}
            onValueChange={handleValueChange}
            disabled={disabled}
        >
            <Select.Trigger style={{ minWidth: '150px' }} placeholder="Select namespace" />
            <Select.Content position="popper">
                <Select.Group>
                    <Select.Label>Namespaces</Select.Label>
                    {namespaces.map((ns) => {
                        const nsName = typeof ns === 'string' ? ns : ns.metadata?.name || ns.name;
                        return (
                            <Select.Item key={nsName} value={nsName}>
                                {nsName}
                            </Select.Item>
                        );
                    })}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    );
}
