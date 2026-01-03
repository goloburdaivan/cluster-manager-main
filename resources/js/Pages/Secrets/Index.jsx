import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout.jsx';
import { router } from '@inertiajs/react';
import {
    Table, Badge, Text, Heading, Card, Flex, Box, IconButton, Tooltip, Dialog, Button,
    DropdownMenu
} from '@radix-ui/themes';
import {
    LockClosedIcon,
    DotsHorizontalIcon,
    ReloadIcon,
    TrashIcon,
    Pencil1Icon,
    ClipboardIcon,
    FileTextIcon
} from '@radix-ui/react-icons';
import { PlusIcon } from "lucide-react";

import NamespaceSelector from "../../Components/K8s/Namespace/NamespaceSelector.jsx";
import RightPanel from "../../Components/RightPanel";
import SecretDetails from "../../Components/K8s/Secret/SecretDetails.jsx";

// Хелпер для цвета типа секрета
const getTypeColor = (type) => {
    switch (type) {
        case 'Opaque': return 'gray';
        case 'kubernetes.io/tls': return 'blue';
        case 'kubernetes.io/dockerconfigjson': return 'plum';
        case 'kubernetes.io/service-account-token': return 'cyan';
        default: return 'amber';
    }
};

export default function SecretsIndex({ secrets, namespaces }) {
    const [selectedSecret, setSelectedSecret] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deletingSecret, setDeletingSecret] = useState(null);

    const handleReload = () => {
        router.reload({ only: ['secrets'] });
    };

    const handleDelete = () => {
        if (!deletingSecret) return;

        router.delete(`/secrets/${deletingSecret.namespace}/${deletingSecret.name}`, {
            onSuccess: () => {
                setDeletingSecret(null);
                if (selectedSecret?.name === deletingSecret.name) {
                    setSelectedSecret(null);
                }
            },
            preserveScroll: true
        });
    };

    return (
        <AppLayout title="Secrets">
            <Flex direction="column" gap="5">

                {/* HEADER */}
                <Flex justify="between" align="end">
                    <Box>
                        <Heading size="6" mb="1">Secrets</Heading>
                        <Text color="gray" size="2">
                            Manage sensitive data like passwords, OAuth tokens, and SSH keys.
                        </Text>
                    </Box>

                    <Flex gap="3" align="center">
                        <NamespaceSelector namespaces={namespaces} />

                        <Tooltip content="Create Secret">
                            <IconButton onClick={() => setIsCreateOpen(true)}>
                                <PlusIcon />
                            </IconButton>
                        </Tooltip>

                        <IconButton variant="soft" color="gray" onClick={handleReload}>
                            <ReloadIcon />
                        </IconButton>
                    </Flex>
                </Flex>

                {/* TABLE */}
                <Card variant="surface" style={{ padding: 0, overflow: 'hidden' }}>
                    <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Namespace</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Keys</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Age</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell align="right"></Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {secrets.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} align="center">
                                        <Text color="gray" size="2" style={{ padding: '20px' }}>
                                            No secrets found (or access denied).
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                secrets.map((sec) => (
                                    <Table.Row key={sec.uid || sec.name} align="center">

                                        {/* NAME + ICON */}
                                        <Table.RowHeaderCell>
                                            <Flex align="center" gap="3">
                                                <Box style={{
                                                    padding: '6px',
                                                    backgroundColor: 'var(--amber-4)', // Оранжевый фон
                                                    borderRadius: '6px'
                                                }}>
                                                    <LockClosedIcon color="var(--amber-11)" />
                                                </Box>
                                                <Flex direction="column">
                                                    <Text
                                                        weight="medium"
                                                        style={{
                                                            color: 'var(--accent-9)',
                                                            cursor: 'pointer',
                                                            textDecoration: 'none'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                                        onClick={() => setSelectedSecret(sec)}
                                                    >
                                                        {sec.name}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Table.RowHeaderCell>

                                        <Table.Cell>
                                            <Text size="2" color="gray">{sec.namespace}</Text>
                                        </Table.Cell>

                                        {/* TYPE */}
                                        <Table.Cell>
                                            <Badge color={getTypeColor(sec.type)} variant="soft">
                                                {sec.type}
                                            </Badge>
                                        </Table.Cell>

                                        {/* KEYS (Files inside) */}
                                        <Table.Cell>
                                            <Flex gap="2" wrap="wrap" style={{ maxWidth: 350 }}>
                                                {sec.keys && sec.keys.length > 0 ? (
                                                    sec.keys.slice(0, 3).map((key) => (
                                                        <Badge key={key} variant="outline" color="gray">
                                                            {key}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <Text size="2" color="gray">-</Text>
                                                )}
                                                {sec.keys && sec.keys.length > 3 && (
                                                    <Badge variant="surface" color="gray">+{sec.keys.length - 3} more</Badge>
                                                )}
                                            </Flex>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Text size="2" color="gray">
                                                {new Date(sec.age).toLocaleDateString()}
                                            </Text>
                                        </Table.Cell>

                                        {/* ACTIONS */}
                                        <Table.Cell align="right">
                                            <Flex gap="2" justify="end">

                                                <Tooltip content="Edit YAML">
                                                    <IconButton variant="ghost" color="gray" style={{ cursor: 'pointer' }}>
                                                        <Pencil1Icon />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip content="Delete">
                                                    <IconButton
                                                        variant="ghost"
                                                        color="red"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => setDeletingSecret(sec)}
                                                    >
                                                        <TrashIcon />
                                                    </IconButton>
                                                </Tooltip>

                                                <DropdownMenu.Root>
                                                    <DropdownMenu.Trigger>
                                                        <IconButton variant="ghost" color="gray">
                                                            <DotsHorizontalIcon />
                                                        </IconButton>
                                                    </DropdownMenu.Trigger>
                                                    <DropdownMenu.Content>
                                                        <DropdownMenu.Item onSelect={() => navigator.clipboard.writeText(sec.name)}>
                                                            <ClipboardIcon /> Copy Name
                                                        </DropdownMenu.Item>
                                                    </DropdownMenu.Content>
                                                </DropdownMenu.Root>
                                            </Flex>
                                        </Table.Cell>

                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>
                </Card>

                {/* DETAILS PANEL */}
                <RightPanel isOpen={!!selectedSecret} onClose={() => setSelectedSecret(null)}>
                    <SecretDetails
                        secret={selectedSecret}
                        onClose={() => setSelectedSecret(null)}
                    />
                </RightPanel>

                {/* DELETE DIALOG */}
                <Dialog.Root open={!!deletingSecret} onOpenChange={(open) => !open && setDeletingSecret(null)}>
                    <Dialog.Content style={{ maxWidth: 450 }}>
                        <Dialog.Title color="red">Delete Secret</Dialog.Title>
                        <Dialog.Description size="2" mb="4">
                            Are you sure you want to delete <strong>{deletingSecret?.name}</strong>?
                            <br /><br />
                            <Text color="red" size="1">
                                Warning: Applications using this secret will likely crash or fail to authenticate.
                            </Text>
                        </Dialog.Description>

                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close>
                                <Button variant="soft" color="gray">Cancel</Button>
                            </Dialog.Close>
                            <Button color="red" variant="solid" onClick={handleDelete}>Delete</Button>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>

                {/* <CreateSecretModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} namespaces={namespaces} /> */}

            </Flex>
        </AppLayout>
    );
}
