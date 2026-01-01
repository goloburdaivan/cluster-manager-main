import React, { useCallback, useMemo } from 'react';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import AppLayout from '../../Layouts/AppLayout';
import { Card, Text, Flex, Box, Badge, Heading } from '@radix-ui/themes';
import {
    CubeIcon,
    GlobeIcon,
    FileTextIcon,
    LockClosedIcon,
    LayersIcon
} from '@radix-ui/react-icons';

const getNodeStyle = (kind) => {
    switch (kind) {
        case 'Service': return { icon: GlobeIcon, color: 'blue', label: 'SVC' };
        case 'Deployment': return { icon: CubeIcon, color: 'green', label: 'DPL' };
        case 'Secret': return { icon: LockClosedIcon, color: 'orange', label: 'SEC' };
        case 'ConfigMap': return { icon: FileTextIcon, color: 'gray', label: 'CM' };
        default: return { icon: LayersIcon, color: 'gray', label: 'RES' };
    }
};

const K8sNode = ({ data }) => {
    const { icon: Icon, color, label } = getNodeStyle(data.kind);

    return (
        <Box style={{ position: 'relative' }}>
            <Handle type="target" position={Position.Top} style={{ background: 'var(--gray-9)' }} />

            <Card style={{ minWidth: 200, padding: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <Flex gap="3" align="center">
                    <Box
                        style={{
                            padding: 8,
                            borderRadius: 'var(--radius-3)',
                            backgroundColor: `var(--${color}-3)`,
                            color: `var(--${color}-11)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Icon width="18" height="18" />
                    </Box>
                    <Flex direction="column" style={{ overflow: 'hidden' }}>
                        <Text size="2" weight="bold" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {data.name}
                        </Text>
                        <Flex gap="2" align="center">
                            <Badge size="1" color={color} variant="soft">{label}</Badge>
                            <Text size="1" color="gray">{data.kind}</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Card>

            <Handle type="source" position={Position.Bottom} style={{ background: 'var(--gray-9)' }} />
        </Box>
    );
};

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Настройки отступов
    const nodeWidth = 240;
    const nodeHeight = 80;

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

export default function TopologyMap({ topology }) {
    const initialNodes = topology.nodes.map(n => ({
        id: n.id,
        type: 'k8sNode',
        data: { label: n.name, kind: n.kind, name: n.name },
        position: { x: 0, y: 0 }
    }));

    const initialEdges = topology.edges.map((e, i) => ({
        id: `e${i}`,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        animated: true,
        style: { stroke: 'var(--gray-8)' }
    }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges,
        'TB'
    );

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    const nodeTypes = useMemo(() => ({ k8sNode: K8sNode }), []);

    return (
        <AppLayout title="Topology Map">
            <Flex direction="column" gap="4" style={{ height: 'calc(100vh - 100px)' }}>
                <Box>
                    <Heading size="6">Cluster Topology</Heading>
                    <Text color="gray" size="2">Visual representation of workloads and dependencies.</Text>
                </Box>

                <Card style={{ flexGrow: 1, padding: 0, overflow: 'hidden', background: 'var(--gray-2)' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        fitView
                        minZoom={0.2}
                        maxZoom={1.5}
                    >
                        <Background color="#aaa" gap={16} size={1} />
                        <Controls />
                    </ReactFlow>
                </Card>
            </Flex>
        </AppLayout>
    );
}
