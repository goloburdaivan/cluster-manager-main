import React, { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout.jsx';
import { router } from '@inertiajs/react';
import {
    Table, Badge, Text, Heading, Card, Flex, Box, IconButton, Tooltip, Dialog, Button,
    DropdownMenu, Code
} from '@radix-ui/themes';
import {
    GlobeIcon,
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
import ServiceDetails from "../../Components/K8s/Service/ServiceDetails.jsx";

const getTypeColor = (type) => {
    switch (type) {
        case 'ClusterIP':
            return 'green';
        case 'NodePort':
            return 'amber';
        case 'LoadBalancer':
            return 'blue';
        case 'ExternalName':
            return 'purple';
        default:
            return 'gray';
    }
};

export default function ServicesIndex({ services, namespaces }) {
    console.log(services)
    const [selectedService, setSelectedService] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deletingService, setDeletingService] = useState(null);

    const handleReload = () => {
        router.reload({ only: ['services'] });
    };

    const handleDelete = () => {
        if (!deletingService) return;

        router.delete(`/services/${deletingService.namespace}/${deletingService.name}`, {
            onSuccess: () => {
                setDeletingService(null);
                if (selectedService?.name === deletingService.name) {
                    setSelectedService(null);
                }
            },
            preserveScroll: true
        });
    };

    return (
        <AppLayout title="Services">
            <Flex direction="column" gap="5">

                {/* HEADER */}
                <Flex justify="between" align="end">
                    <Box>
                        <Heading size="6" mb="1">Services</Heading>
                        <Text color="gray" size="2">
                            Manage network access and load balancing.
                        </Text>
                    </Box>

                    <Flex gap="3" align="center">
                        <NamespaceSelector namespaces={namespaces} />

                        <Tooltip content="Create Service">
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
                                <Table.ColumnHeaderCell>Cluster IP</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Ports</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>External IP</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell align="right"></Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {services.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={7} align="center">
                                        <Text color="gray" size="2" style={{ padding: '20px' }}>
                                            No services found.
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                services.map((svc) => (
                                    <Table.Row key={svc.uid} align="center">

                                        {/* NAME + ICON */}
                                        <Table.RowHeaderCell>
                                            <Flex align="center" gap="3">
                                                <Box style={{
                                                    padding: '6px',
                                                    backgroundColor: 'var(--accent-a3)',
                                                    borderRadius: '6px'
                                                }}>
                                                    <GlobeIcon color="var(--accent-9)" />
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
                                                        onClick={() => setSelectedService(svc)}
                                                    >
                                                        {svc.name}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Table.RowHeaderCell>

                                        {/* NAMESPACE */}
                                        <Table.Cell>
                                            <Text size="2" color="gray">{svc.namespace}</Text>
                                        </Table.Cell>

                                        {/* TYPE */}
                                        <Table.Cell>
                                            <Badge color={getTypeColor(svc.type)} variant="soft" radius="full">
                                                {svc.type}
                                            </Badge>
                                        </Table.Cell>

                                        {/* CLUSTER IP */}
                                        <Table.Cell>
                                            <Code variant="ghost" color="gray">{svc.cluster_ip}</Code>
                                        </Table.Cell>

                                        {/* PORTS */}
                                        <Table.Cell>
                                            <Text size="2">{svc.ports}</Text>
                                        </Table.Cell>

                                        {/* EXTERNAL IP */}
                                        <Table.Cell>
                                            {svc.external_ips && svc.external_ips.length > 0 ? (
                                                <Flex gap="1" wrap="wrap">
                                                    {svc.external_ips.map((ip, idx) => (
                                                        <Badge key={idx} variant="outline" color="gray">
                                                            {ip}
                                                        </Badge>
                                                    ))}
                                                </Flex>
                                            ) : (
                                                <Text size="1" color="gray">-</Text>
                                            )}
                                        </Table.Cell>

                                        {/* ACTIONS */}
                                        <Table.Cell align="right">
                                            <Flex gap="2" justify="end">

                                                <Tooltip content="Edit YAML (Coming Soon)">
                                                    <IconButton variant="ghost" color="gray" style={{ cursor: 'pointer' }}>
                                                        <Pencil1Icon />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip content="Delete Service">
                                                    <IconButton
                                                        variant="ghost"
                                                        color="red"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => setDeletingService(svc)}
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

                                                        <DropdownMenu.Item onSelect={() => navigator.clipboard.writeText(svc.name)}>
                                                            <ClipboardIcon /> Copy Name
                                                        </DropdownMenu.Item>

                                                        <DropdownMenu.Item onSelect={() => navigator.clipboard.writeText(svc.cluster_ip)}>
                                                            <ClipboardIcon /> Copy Cluster IP
                                                        </DropdownMenu.Item>

                                                        {/* Если это NodePort или LB, можно добавить кнопку "Открыть" */}
                                                        {(svc.type === 'NodePort' || svc.type === 'LoadBalancer') && (
                                                            <>
                                                                <DropdownMenu.Separator />
                                                                <DropdownMenu.Item disabled>
                                                                    <ExternalLinkIcon /> Open in Browser
                                                                </DropdownMenu.Item>
                                                            </>
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

                <RightPanel isOpen={!!selectedService} onClose={() => setSelectedService(null)}>
                    <ServiceDetails
                        service={selectedService}
                        onClose={() => setSelectedService(null)}
                    />
                </RightPanel>

                {/* DELETE DIALOG */}
                <Dialog.Root open={!!deletingService} onOpenChange={(open) => !open && setDeletingService(null)}>
                    <Dialog.Content style={{ maxWidth: 450 }}>
                        <Dialog.Title color="red">Delete Service</Dialog.Title>
                        <Dialog.Description size="2" mb="4">
                            Are you sure you want to delete the service <strong>{deletingService?.name}</strong> in namespace <strong>{deletingService?.namespace}</strong>?
                            <br /><br />
                            <Text color="gray" size="1">
                                This will remove the stable network endpoint. Pods will no longer be accessible via this service DNS name or IP.
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

            </Flex>
        </AppLayout>
    );
}
