import React, { useMemo } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    type Node,
    type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import UserNode from './nodeTypes/UserNode';
import GatewayNode from './nodeTypes/GatewayNode';
import MCPNode from './nodeTypes/MCPNode';
import DataSourceNode from './nodeTypes/DataSourceNode';
import SubagentNode from './nodeTypes/SubagentNode';
import SkillNode from './nodeTypes/SkillNode';
import LLMNode from './nodeTypes/LLMNode';
import ConfigNode from './nodeTypes/ConfigNode';
import SessionNode from './nodeTypes/SessionNode';
import SummarizerNode from './nodeTypes/SummarizerNode';
import OptimizerNode from './nodeTypes/OptimizerNode';
import RetryNode from './nodeTypes/RetryNode';
import SecurityNode from './nodeTypes/SecurityNode';
import type { NodeData } from '../types';

const nodeTypes = {
    userNode: UserNode,
    gatewayNode: GatewayNode,
    mcpNode: MCPNode,
    dataSourceNode: DataSourceNode,
    subagentNode: SubagentNode,
    skillNode: SkillNode,
    llmNode: LLMNode,
    configNode: ConfigNode,
    sessionNode: SessionNode,
    summarizerNode: SummarizerNode,
    optimizerNode: OptimizerNode,
    retryNode: RetryNode,
    securityNode: SecurityNode,
};

interface FlowCanvasProps {
    nodes: Node<NodeData>[];
    edges: Edge[];
    activeNodeIds?: string[];
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({ nodes, edges, activeNodeIds = [] }) => {
    const styledNodes = useMemo(() => {
        return nodes.map((node) => ({
            ...node,
            data: {
                ...node.data,
                active: activeNodeIds.length === 0 || activeNodeIds.includes(node.id),
                dimmed: activeNodeIds.length > 0 && !activeNodeIds.includes(node.id),
            },
        }));
    }, [nodes, activeNodeIds]);

    const styledEdges = useMemo(() => {
        return edges.map((edge) => {
            const sourceActive = activeNodeIds.length === 0 || activeNodeIds.includes(edge.source);
            const targetActive = activeNodeIds.length === 0 || activeNodeIds.includes(edge.target);
            const isActive = sourceActive && targetActive;
            return {
                ...edge,
                className: isActive ? 'edge-active' : 'edge-dimmed',
                animated: isActive,
            };
        });
    }, [edges, activeNodeIds]);

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={styledNodes}
                edges={styledEdges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                proOptions={{ hideAttribution: true }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnScroll
                zoomOnScroll
                minZoom={0.3}
                maxZoom={2}
            >
                <Background color="rgba(255,255,255,0.03)" gap={20} />
                <Controls
                    showInteractive={false}
                    className="!bg-white/5 !border-white/10 !rounded-lg"
                />
            </ReactFlow>
        </div>
    );
};

export default React.memo(FlowCanvas);
