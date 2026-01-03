import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout.jsx';
import { router } from '@inertiajs/react';
import {
    Table, Badge, Text, Heading, Card, Flex, Box, IconButton, Tooltip, Dialog, Button,
    DropdownMenu
} from '@radix-ui/themes';
import {
    FileTextIcon,
    DotsHorizontalIcon,
    ReloadIcon,
    TrashIcon,
    Pencil1Icon,
    ClipboardIcon,
    LockClosedIcon
} from '@radix-ui/react-icons';
import { PlusIcon } from "lucide-react";

import NamespaceSelector from "../../Components/K8s/Namespace/NamespaceSelector.jsx";
import RightPanel from "../../Components/RightPanel";
import ConfigMapDetails from "../../Components/K8s/ConfigMap/ConfigMapDetails.jsx";

export default function ConfigMapsIndex({ configMaps, namespaces }) {
    const [selectedConfig, setSelectedConfig] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deletingConfig, setDeletingConfig] = useState(null);

    const handleReload = () => {
        router.reload({ only: ['configMaps'] });
    };

    const handleDelete = () => {
        if (!deletingConfig) return;

        router.delete(`/configmaps/${deletingConfig.namespace}/${deletingConfig.name}`, {
            onSuccess: () => {
                setDeletingConfig(null);
                if (selectedConfig?.name === deletingConfig.name) {
                    setSelectedConfig(null);
                }
            },
            preserveScroll: true
        });
    };

    return (
        <AppLayout title="ConfigMaps">
            <Flex direction="column" gap="5">

                {/* HEADER */}
                <Flex justify="between" align="end">
                    <Box>
                        <Heading size="6" mb="1">ConfigMaps</Heading>
                        <Text color="gray" size="2">
                            Manage configuration data detached from application code.
                        </Text>
                    </Box>

                    <Flex gap="3" align="center">
                        <NamespaceSelector namespaces={namespaces} />

                        <Tooltip content="Create ConfigMap">
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
                                <Table.ColumnHeaderCell>Keys</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Age</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell align="right"></Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {configMaps.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={5} align="center">
                                        <Text color="gray" size="2" style={{ padding: '20px' }}>
                                            No config maps found.
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                configMaps.map((cm) => (
                                    <Table.Row key={cm.name} align="center">

                                        {/* NAME + ICON */}
                                        <Table.RowHeaderCell>
                                            <Flex align="center" gap="3">
                                                <Box style={{
                                                    padding: '6px',
                                                    backgroundColor: 'var(--accent-a3)',
                                                    borderRadius: '6px'
                                                }}>
                                                    <FileTextIcon color="var(--accent-9)" />
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
                                                        onClick={() => setSelectedConfig(cm)}
                                                    >
                                                        {cm.name}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Table.RowHeaderCell>

                                        <Table.Cell>
                                            <Text size="2" color="gray">{cm.namespace}</Text>
                                        </Table.Cell>

                                        {/* KEYS (Files inside) */}
                                        <Table.Cell>
                                            <Flex gap="2" wrap="wrap" style={{ maxWidth: 400 }}>
                                                {cm.keys && cm.keys.length > 0 ? (
                                                    cm.keys.slice(0, 3).map((key) => (
                                                        <Badge key={key} variant="outline" color="gray">
                                                            {key}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <Text size="2" color="gray">-</Text>
                                                )}
                                                {cm.keys && cm.keys.length > 3 && (
                                                    <Badge variant="surface" color="gray">+{cm.keys.length - 3} more</Badge>
                                                )}
                                            </Flex>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Text size="2" color="gray">
                                                {new Date(cm.age).toLocaleDateString()}
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
                                                        onClick={() => setDeletingConfig(cm)}
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
                                                        <DropdownMenu.Item onSelect={() => navigator.clipboard.writeText(cm.name)}>
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
                <RightPanel isOpen={!!selectedConfig} onClose={() => setSelectedConfig(null)}>
                    <ConfigMapDetails
                        configMap={selectedConfig}
                        onClose={() => setSelectedConfig(null)}
                    />
                </RightPanel>

                {/* DELETE DIALOG */}
                <Dialog.Root open={!!deletingConfig} onOpenChange={(open) => !open && setDeletingConfig(null)}>
                    <Dialog.Content style={{ maxWidth: 450 }}>
                        <Dialog.Title color="red">Delete ConfigMap</Dialog.Title>
                        <Dialog.Description size="2" mb="4">
                            Are you sure you want to delete <strong>{deletingConfig?.name}</strong>?
                            <br /><br />
                            <Text color="gray" size="1">
                                Pods referencing this ConfigMap might fail to start or behave unexpectedly.
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

                {/*<CreateConfigMapModal*/}
                {/*    isOpen={isCreateOpen}*/}
                {/*    onClose={() => setIsCreateOpen(false)}*/}
                {/*    namespaces={namespaces}*/}
                {/*/>*/}

            </Flex>
        </AppLayout>
    );
}
