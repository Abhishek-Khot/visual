import React from 'react';
import type { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { NodeData } from '../../types';

const GatewayNode: React.FC<NodeProps> = ({ data }) => (
    <BaseNode data={data as NodeData} glowColor="#22d3ee" borderColor="#22d3ee" />
);
export default React.memo(GatewayNode);
