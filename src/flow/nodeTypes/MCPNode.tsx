import React from 'react';
import type { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { NodeData } from '../../types';

const MCPNode: React.FC<NodeProps> = ({ data }) => (
    <BaseNode data={data as NodeData} glowColor="#c084fc" borderColor="#c084fc" />
);
export default React.memo(MCPNode);
