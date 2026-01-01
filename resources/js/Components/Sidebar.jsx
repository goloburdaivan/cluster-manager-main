import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Box,
    Flex,
    Text,
    Button,
    ScrollArea
} from '@radix-ui/themes';
import {
    DashboardIcon,
    CubeIcon,
    LayersIcon,
    GearIcon,
    DesktopIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ComponentPlaceholderIcon,
    LockClosedIcon,
    GlobeIcon,
    ReaderIcon,
    BellIcon
} from '@radix-ui/react-icons';
import {Share2Icon} from "lucide-react";

// Структура меню
const MENU_ITEMS = [
    { label: 'Cluster', icon: <DashboardIcon />, href: '/' },
    { label: 'Nodes', icon: <DesktopIcon />, href: '/nodes' },
    { label: 'Events', icon: <BellIcon />, href: '/events' },
    { label: 'Topology', icon: <Share2Icon />, href: '/topology' },
    {
        label: 'Workloads',
        icon: <LayersIcon />,
        children: [
            { label: 'Pods', href: '/pods', icon: <CubeIcon /> },
            { label: 'Deployments', href: '/deployments', icon: <ComponentPlaceholderIcon /> },
            { label: 'Services', href: '/services', icon: <GlobeIcon /> },
        ]
    },
    {
        label: 'Config',
        icon: <ReaderIcon />,
        children: [
            { label: 'Namespaces', href: '/namespaces', icon: <CubeIcon /> },
            { label: 'Secrets', href: '/secrets', icon: <LockClosedIcon /> },
        ]
    },
    { label: 'Network', icon: <GlobeIcon />, href: '/network' },
    { label: 'Storage', icon: <ComponentPlaceholderIcon />, href: '/storage' },
];

const SidebarItem = ({ item, currentUrl }) => {
    const isActive = item.href ? (currentUrl === item.href || (item.href !== '/' && currentUrl.startsWith(item.href))) : false;
    const isGroupActive = item.children?.some(child => currentUrl.startsWith(child.href));

    const [isOpen, setIsOpen] = useState(isGroupActive);

    const baseButtonStyle = {
        width: '100%',
        height: '36px',
        justifyContent: 'flex-start',
        cursor: 'pointer',
        color: 'var(--gray-11)',
        fontWeight: 400,
        transition: 'all 0.1s ease',
        padding: '0 12px',
    };

    const activeButtonStyle = {
        ...baseButtonStyle,
        backgroundColor: '#3b5bfb',
        color: 'white',
        fontWeight: 500
    };

    // 1. Звичайний пункт (Leaf)
    if (!item.children) {
        return (
            <Link href={item.href} style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
                <Button
                    variant="ghost"
                    style={isActive ? activeButtonStyle : baseButtonStyle}
                    className={!isActive ? "sidebar-item-hover" : ""}
                >
                    <Flex align="center" gap="3" style={{ width: '100%' }}>
                        <Box style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                            {item.icon}
                        </Box>
                        <Text size="2" style={{ lineHeight: 1 }}>{item.label}</Text>
                    </Flex>
                </Button>
            </Link>
        );
    }

    // 2. Група (Parent) - ТУТ Є СТРІЛОЧКИ
    return (
        <Box mb="1">
            <Button
                variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    ...baseButtonStyle,
                    justifyContent: 'space-between', // Це розсуває текст і стрілочку по краях
                    color: isGroupActive || isOpen ? 'white' : 'var(--gray-11)'
                }}
                className="sidebar-item-hover"
            >
                <Flex align="center" gap="3">
                    <Box style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                        {item.icon}
                    </Box>
                    <Text size="2" style={{ lineHeight: 1 }}>{item.label}</Text>
                </Flex>

                {/* Стрілочки тут */}
                <Box style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    {isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </Box>
            </Button>

            {isOpen && (
                <Flex direction="column" gap="1" mt="1">
                    {item.children.map((child) => {
                        const isChildActive = currentUrl.startsWith(child.href);
                        return (
                            <Link key={child.href} href={child.href} style={{ textDecoration: 'none', display: 'block' }}>
                                <Button
                                    size="2"
                                    variant="ghost"
                                    style={{
                                        ...baseButtonStyle,
                                        height: '32px',
                                        paddingLeft: '36px',
                                        ...(isChildActive ? { color: '#5e7cff', fontWeight: 500 } : {})
                                    }}
                                    className={!isChildActive ? "sidebar-child-hover" : ""}
                                >
                                    <Text size="2" style={{ lineHeight: 1 }}>{child.label}</Text>
                                </Button>
                            </Link>
                        );
                    })}
                </Flex>
            )}
        </Box>
    );
};

export default function Sidebar() {
    const { url } = usePage();

    return (
        <Box
            style={{
                width: '240px',
                height: '100vh',
                backgroundColor: '#252526',
                borderRight: '1px solid #1e1e1e',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                position: 'sticky',
                top: 0,
                overflow: 'hidden'
            }}
        >
            {/* Header */}
            <Box p="3" style={{ borderBottom: '1px solid #333', backgroundColor: '#1e1e1e' }}>
                <Flex align="center" gap="3">
                    <Box
                        style={{
                            width: 36,
                            height: 36,
                            backgroundColor: '#3b5bfb',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}
                    >
                        <CubeIcon color="white" width="20" height="20" />
                    </Box>
                    <Flex direction="column" gap="0" style={{ overflow: 'hidden' }}>
                        <Text size="2" weight="bold" style={{ color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>minikube</Text>
                        <Text size="1" style={{ color: '#888' }}>Local Cluster</Text>
                    </Flex>
                </Flex>
            </Box>

            {/* Menu */}
            <Flex direction="column" style={{ flexGrow: 1, minHeight: 0, padding: '12px 0' }}>
                <ScrollArea type="hover" scrollbars="vertical" style={{ height: '100%', padding: '0 8px' }}>
                    <Flex direction="column" gap="1">
                        {MENU_ITEMS.map((item, index) => (
                            <SidebarItem key={index} item={item} currentUrl={url} />
                        ))}
                    </Flex>
                </ScrollArea>
            </Flex>

            {/* Footer */}
            <Box p="2" style={{ borderTop: '1px solid #333', backgroundColor: '#1e1e1e' }}>
                <Link href="/settings" style={{ textDecoration: 'none' }}>
                    <Button
                        variant="ghost"
                        style={{
                            width: '100%',
                            height: '36px',
                            justifyContent: 'flex-start',
                            color: '#aaa',
                            padding: '0 12px'
                        }}
                        className="sidebar-item-hover"
                    >
                        <Flex align="center" gap="3">
                            <GearIcon />
                            <Text size="2">Settings</Text>
                        </Flex>
                    </Button>
                </Link>
            </Box>

            <style>{`
                .sidebar-item-hover:hover {
                    background-color: rgba(255, 255, 255, 0.08) !important;
                    color: white !important;
                }
                .sidebar-child-hover:hover {
                    color: white !important;
                }
            `}</style>
        </Box>
    );
}
