import React from 'react';
import type { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { NodeData } from '../../types';

const DataSourceNode: React.FC<NodeProps> = ({ data }) => {
    const d = data as NodeData;
    return <BaseNode data={d} glowColor={d.color} borderColor={d.color} />;
};
export default React.memo(DataSourceNode);
