import React from 'react';
import type { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { NodeData } from '../../types';

const SummarizerNode: React.FC<NodeProps> = ({ data }) => (
    <BaseNode data={data as NodeData} glowColor="#5eead4" borderColor="#5eead4" />
);
export default React.memo(SummarizerNode);
