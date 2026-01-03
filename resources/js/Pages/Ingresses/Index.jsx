import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout.jsx';
import { router } from '@inertiajs/react';
import {
    Table, Badge, Text, Heading, Card, Flex, Box, IconButton, Tooltip, Dialog, Button,
    DropdownMenu, Code
} from '@radix-ui/themes';
import {
    Share1Icon,
    DotsHorizontalIcon,
    ReloadIcon,
    TrashIcon,
    Pencil1Icon,
    ClipboardIcon,
    ExternalLinkIcon
} from '@radix-ui/react-icons';
import { PlusIcon } from "lucide-react";

import NamespaceSelector from "../../Components/K8s/Namespace/NamespaceSelector.jsx";
import RightPanel from "../../Components/RightPanel";
import IngressDetails from "../../Components/K8s/Ingress/IngressDetails.jsx";

export default function IngressIndex({ ingresses, namespaces }) {
    const [selectedIngress, setSelectedIngress] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deletingIngress, setDeletingIngress] = useState(null);

    const handleReload = () => {
        router.reload({ only: ['ingresses'] });
    };

    const handleDelete = () => {
        if (!deletingIngress) return;

        router.delete(`/ingresses/${deletingIngress.namespace}/${deletingIngress.name}`, {
            onSuccess: () => {
                setDeletingIngress(null);
                if (selectedIngress?.name === deletingIngress.name) {
                    setSelectedIngress(null);
                }
            },
            preserveScroll: true
        });
    };

    return (
        <AppLayout title="Ingresses">
            <Flex direction="column" gap="5">

                {/* HEADER */}
                <Flex justify="between" align="end">
                    <Box>
                        <Heading size="6" mb="1">Ingresses</Heading>
                        <Text color="gray" size="2">
                            Manage external access to services (HTTP/HTTPS routes).
                        </Text>
                    </Box>

                    <Flex gap="3" align="center">
                        <NamespaceSelector namespaces={namespaces} />

                        <Tooltip content="Create Ingress">
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
                                <Table.ColumnHeaderCell>Load Balancer</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Rules (Hosts)</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Age</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell align="right"></Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {ingresses.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} align="center">
                                        <Text color="gray" size="2" style={{ padding: '20px' }}>
                                            No ingresses found.
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                ingresses.map((ing) => (
                                    <Table.Row key={ing.name} align="center">

                                        <Table.RowHeaderCell>
                                            <Flex align="center" gap="3">
                                                <Box style={{
                                                    padding: '6px',
                                                    backgroundColor: 'var(--accent-a3)',
                                                    borderRadius: '6px'
                                                }}>
                                                    <Share1Icon color="var(--pink-9)" />
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
                                                        onClick={() => setSelectedIngress(ing)}
                                                    >
                                                        {ing.name}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Table.RowHeaderCell>

                                        <Table.Cell>
                                            <Text size="2" color="gray">{ing.namespace}</Text>
                                        </Table.Cell>

                                        {/* LOAD BALANCER IP */}
                                        <Table.Cell>
                                            {ing.load_balancer ? (
                                                <Flex align="center" gap="2">
                                                    <Code variant="ghost" color="gray">{ing.load_balancer}</Code>
                                                    <ExternalLinkIcon style={{ opacity: 0.5 }} />
                                                </Flex>
                                            ) : (
                                                <Text size="2" color="gray">-</Text>
                                            )}
                                        </Table.Cell>

                                        {/* RULES (HOSTS) */}
                                        <Table.Cell>
                                            <Flex gap="2" wrap="wrap" style={{ maxWidth: 300 }}>
                                                {ing.rules && ing.rules.length > 0 ? (
                                                    ing.rules.map((host, i) => (
                                                        <Badge key={i} variant="outline" color="blue">
                                                            {host}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <Text size="2" color="gray">* (All hosts)</Text>
                                                )}
                                            </Flex>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Text size="2" color="gray">
                                                {new Date(ing.age).toLocaleDateString()}
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

                                                <Tooltip content="Delete Ingress">
                                                    <IconButton
                                                        variant="ghost"
                                                        color="red"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => setDeletingIngress(ing)}
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
                                                        <DropdownMenu.Item onSelect={() => navigator.clipboard.writeText(ing.name)}>
                                                            <ClipboardIcon /> Copy Name
                                                        </DropdownMenu.Item>
                                                        {ing.load_balancer && (
                                                            <DropdownMenu.Item onSelect={() => window.open(`http://${ing.load_balancer}`, '_blank')}>
                                                                <ExternalLinkIcon /> Open IP Address
                                                            </DropdownMenu.Item>
                                                        )}
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
                <RightPanel isOpen={!!selectedIngress} onClose={() => setSelectedIngress(null)}>
                    <IngressDetails
                        ingress={selectedIngress}
                        onClose={() => setSelectedIngress(null)}
                    />
                </RightPanel>

                {/* DELETE DIALOG */}
                <Dialog.Root open={!!deletingIngress} onOpenChange={(open) => !open && setDeletingIngress(null)}>
                    <Dialog.Content style={{ maxWidth: 450 }}>
                        <Dialog.Title color="red">Delete Ingress</Dialog.Title>
                        <Dialog.Description size="2" mb="4">
                            Are you sure you want to delete <strong>{deletingIngress?.name}</strong>?
                            <br /><br />
                            <Text color="gray" size="1">
                                External traffic routing to your services will stop immediately.
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

                {/* <CreateIngressModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} namespaces={namespaces} /> */}

            </Flex>
        </AppLayout>
    );
}
