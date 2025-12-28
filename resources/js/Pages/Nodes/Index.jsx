import React from 'react';
import AppLayout from '../../Layouts/AppLayout';
import {
    Table,
    Badge,
    Text,
    Heading,
    Card,
    Flex,
    Box
} from '@radix-ui/themes';
import { CheckCircledIcon, CrossCircledIcon, DesktopIcon } from '@radix-ui/react-icons';

export default function NodesIndex({ nodes }) {
    return (
        <AppLayout title="Cluster Overview">

            <Flex direction="column" gap="5">
                <Box>
                    <Heading size="6" mb="1">Nodes</Heading>
                    <Text color="gray" size="2">
                        Manage and monitor your Kubernetes worker nodes.
                    </Text>
                </Box>

                {/* Використовуємо Card для обрамлення таблиці (стиль Lens) */}
                <Card variant="surface" style={{ padding: 0 }}>
                    <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>CPU Usage</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Memory Usage</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell align="right">Version</Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {nodes.map((node) => (
                                <Table.Row key={node.name} align="center">
                                    <Table.RowHeaderCell>
                                        <Flex align="center" gap="2">
                                            <DesktopIcon color="gray" />
                                            <Text weight="medium">{node.name}</Text>
                                        </Flex>
                                    </Table.RowHeaderCell>

                                    <Table.Cell>
                                        {/* Badge автоматично підбирає кольори */}
                                        <Badge color={node.status === 'Ready' ? 'green' : 'red'} variant="soft">
                                            {node.status === 'Ready' && <CheckCircledIcon />}
                                            {node.status !== 'Ready' && <CrossCircledIcon />}
                                            {node.status}
                                        </Badge>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Text size="2" color="gray">{node.role}</Text>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Text size="2" weight="bold">{node.cpu}</Text>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <Text size="2" weight="bold">{node.memory}</Text>
                                    </Table.Cell>

                                    <Table.Cell align="right">
                                        <Badge color="gray" variant="outline">{node.version}</Badge>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Card>
            </Flex>
        </AppLayout>
    );
}
