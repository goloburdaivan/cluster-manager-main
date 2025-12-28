import React, {useState} from 'react';
import AppLayout from '../../Layouts/AppLayout.jsx';
import {router} from '@inertiajs/react';
import {
    Table, Badge, Text, Heading, Card, Flex, Box, IconButton, Tooltip, Dialog, Button, TextField,
    DropdownMenu,
} from '@radix-ui/themes';
import {
    ComponentPlaceholderIcon,
    DotsHorizontalIcon,
    ReloadIcon,
    TrashIcon,
    Pencil1Icon,
    HeightIcon, StackIcon, UpdateIcon, CounterClockwiseClockIcon
} from '@radix-ui/react-icons';

import NamespaceSelector from "../../Components/K8s/Namespace/NamespaceSelector.jsx";
import RightPanel from "../../Components/RightPanel";
import {ClipboardIcon, PauseIcon, PlayIcon, PlusIcon} from "lucide-react";
import CreateDeploymentModal from "../../Components/K8s/Deployment/CreateDeploymentModal.jsx";
import DeploymentDetails from "../../Components/K8s/Deployment/DeploymentDetails.jsx";

const getStatusColor = (status) => {
    switch (status) {
        case 'Ready':
        case 'Available':
            return 'green';
        case 'Progressing':
            return 'blue';
        case 'Scaling':
            return 'amber';
        case 'Failed':
            return 'red';
        default:
            return 'gray';
    }
};

export default function DeploymentsIndex({deployments, namespaces}) {
    const [selectedDeployment, setSelectedDeployment] = useState(null);
    const [scalingDeployment, setScalingDeployment] = useState(null);
    const [scaleCount, setScaleCount] = useState(1);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [deletingDeployment, setDeletingDeployment] = useState(null);

    const handleReload = () => {
        router.reload({only: ['deployments']});
    };

    const openScaleDialog = (deploy) => {
        setScalingDeployment(deploy);
        setScaleCount(deploy.replicas);
    };

    const handleScaleSubmit = () => {
        router.patch('/deployments/scale', {
            namespace: scalingDeployment.namespace,
            name: scalingDeployment.name,
            replicas: parseInt(scaleCount)
        }, {
            onSuccess: () => setScalingDeployment(null),
            preserveScroll: true
        });
    };

    const handleDelete = () => {
        if (!deletingDeployment) return;

        router.delete(`/deployments/${deletingDeployment.namespace}/${deletingDeployment.name}`, {
            onSuccess: () => {
                setDeletingDeployment(null);
                if (selectedDeployment?.name === deletingDeployment.name) {
                    setSelectedDeployment(null);
                }
            },
            preserveScroll: true
        });
    };

    return (
        <AppLayout title="Deployments">
            <Flex direction="column" gap="5">

                {/* --- HEADER --- */}
                <Flex justify="between" align="end">
                    <Box>
                        <Heading size="6" mb="1">Deployments</Heading>
                        <Text color="gray" size="2">
                            Manage deployment configurations and scaling.
                        </Text>
                    </Box>

                    <Flex gap="3" align="center">
                        <NamespaceSelector
                            namespaces={namespaces}
                        />
                        <Tooltip content="Create Deployment">
                            <IconButton onClick={() => setIsCreateOpen(true)}>
                                <PlusIcon />
                            </IconButton>
                        </Tooltip>
                        <IconButton variant="soft" color="gray" onClick={handleReload}>
                            <ReloadIcon/>
                        </IconButton>
                    </Flex>
                </Flex>

                <Card variant="surface" style={{padding: 0, overflow: 'hidden'}}>
                    <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Namespace</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Pods (Ready / Desired)</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Updated</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell align="right"></Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {deployments.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={6} align="center">
                                        <Text color="gray" size="2" style={{padding: '20px'}}>
                                            No deployments found.
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                deployments.map((deploy) => (
                                    <Table.Row key={deploy.name} align="center">

                                        <Table.RowHeaderCell>
                                            <Flex align="center" gap="3">
                                                <Box style={{
                                                    padding: '6px',
                                                    backgroundColor: 'var(--accent-a3)',
                                                    borderRadius: '6px'
                                                }}>
                                                    <StackIcon color="var(--accent-9)"/>
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
                                                        onClick={() => setSelectedDeployment(deploy)}
                                                    >
                                                        {deploy.name}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Table.RowHeaderCell>

                                        <Table.Cell>
                                            <Text size="2" color="gray">{deploy.namespace}</Text>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Flex align="center" gap="2">
                                                <Text size="2" weight="bold">{deploy.ready_replicas}</Text>
                                                <Text size="2" color="gray">/</Text>
                                                <Text size="2" color="gray">{deploy.replicas}</Text>
                                            </Flex>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Badge color={getStatusColor(deploy.status)} variant="soft" radius="full">
                                                <Box style={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: '50%',
                                                    backgroundColor: 'currentColor'
                                                }}/>
                                                {deploy.status}
                                            </Badge>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Text size="2">{deploy.updated_replicas}</Text>
                                        </Table.Cell>

                                        {/* ACTIONS */}
                                        <Table.Cell align="right">
                                            <Flex gap="2" justify="end">
                                                <Tooltip content="Scale Replicas">
                                                    <IconButton
                                                        variant="ghost"
                                                        color="blue"
                                                        style={{cursor: 'pointer'}}
                                                        onClick={() => openScaleDialog(deploy)}
                                                    >
                                                        <HeightIcon/>
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip content="Edit YAML (Coming Soon)">
                                                    <IconButton variant="ghost" color="gray"
                                                                style={{cursor: 'pointer'}}>
                                                        <Pencil1Icon/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip content="Delete Deployment">
                                                    <IconButton
                                                        variant="ghost"
                                                        color="red"
                                                        style={{cursor: 'pointer'}}
                                                        onClick={() => setDeletingDeployment(deploy)}
                                                    >
                                                        <TrashIcon/>
                                                    </IconButton>
                                                </Tooltip>

                                                <DropdownMenu.Root>
                                                    <DropdownMenu.Trigger>
                                                        <IconButton variant="ghost" color="gray">
                                                            <DotsHorizontalIcon />
                                                        </IconButton>
                                                    </DropdownMenu.Trigger>
                                                    <DropdownMenu.Content>

                                                        <DropdownMenu.Item onSelect={() => handleRestart(deploy)}>
                                                            <UpdateIcon /> Restart
                                                        </DropdownMenu.Item>

                                                        <DropdownMenu.Item onSelect={() => handleRollback(deploy)}>
                                                            <CounterClockwiseClockIcon /> Rollback
                                                        </DropdownMenu.Item>

                                                        <DropdownMenu.Separator />

                                                        {deploy.spec?.paused ? (
                                                            <DropdownMenu.Item onSelect={() => handleResume(deploy)}>
                                                                <PlayIcon /> Resume
                                                            </DropdownMenu.Item>
                                                        ) : (
                                                            <DropdownMenu.Item onSelect={() => handlePause(deploy)}>
                                                                <PauseIcon /> Pause Rollout
                                                            </DropdownMenu.Item>
                                                        )}

                                                        <DropdownMenu.Separator />

                                                        <DropdownMenu.Item onSelect={() => navigator.clipboard.writeText(deploy.name)}>
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

                <RightPanel isOpen={!!selectedDeployment} onClose={() => setSelectedDeployment(null)}>
                    <DeploymentDetails
                        deployment={selectedDeployment}
                        onClose={() => setSelectedDeployment(null)}
                    />
                </RightPanel>

                <Dialog.Root open={!!scalingDeployment} onOpenChange={(open) => !open && setScalingDeployment(null)}>
                    <Dialog.Content style={{maxWidth: 450}}>
                        <Dialog.Title>Scale Deployment</Dialog.Title>
                        <Dialog.Description size="2" mb="4">
                            Change the number of replicas for <strong>{scalingDeployment?.name}</strong>.
                        </Dialog.Description>
                        <Flex direction="column" gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">Replicas</Text>
                                <TextField.Root
                                    type="number"
                                    min="0"
                                    value={scaleCount}
                                    onChange={(e) => setScaleCount(e.target.value)}>
                                </TextField.Root>
                            </label>
                        </Flex>
                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close>
                                <Button variant="soft" color="gray">Cancel</Button>
                            </Dialog.Close>
                            <Button onClick={handleScaleSubmit}>Scale</Button>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>

                <Dialog.Root open={!!deletingDeployment} onOpenChange={(open) => !open && setDeletingDeployment(null)}>
                    <Dialog.Content style={{ maxWidth: 450 }}>
                        <Dialog.Title color="red">Delete Deployment</Dialog.Title>
                        <Dialog.Description size="2" mb="4">
                            Are you sure you want to delete the deployment <strong>{deletingDeployment?.name}</strong> in namespace <strong>{deletingDeployment?.namespace}</strong>?
                            <br/><br/>
                            <Text color="red" size="1">Warning: This action cannot be undone and will terminate all pods managed by this deployment.</Text>
                        </Dialog.Description>

                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close>
                                <Button variant="soft" color="gray">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button color="red" variant="solid" onClick={handleDelete}>
                                Delete
                            </Button>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Root>

                <CreateDeploymentModal
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    resourceType="Deployment"
                    namespaces={namespaces}
                />

            </Flex>
        </AppLayout>
    );
}
