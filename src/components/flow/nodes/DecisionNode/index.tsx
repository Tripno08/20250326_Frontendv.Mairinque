import React from 'react';
import { Handle, Position } from 'reactflow';
import { CustomNodeProps } from '../../../../types/flow';
import {
  Container,
  Header,
  Title,
  Content,
  Field,
  FieldLabel,
  FieldValue,
  Handles,
} from './styles';

export const DecisionNode: React.FC<CustomNodeProps> = ({ data, isConnectable, selected }) => {
  const decisionData = data as {
    criteria: string[];
    outcomes: string[];
    threshold: number;
  };

  return (
    <Container selected={selected}>
      <Header>
        <Title>Decisão</Title>
      </Header>

      <Content>
        <Field>
          <FieldLabel>Critérios:</FieldLabel>
          <FieldValue>{decisionData.criteria.join(', ')}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>Resultados:</FieldLabel>
          <FieldValue>{decisionData.outcomes.join(', ')}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>Limiar:</FieldLabel>
          <FieldValue>{decisionData.threshold}</FieldValue>
        </Field>
      </Content>

      <Handles>
        {isConnectable && (
          <>
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
            <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
          </>
        )}
      </Handles>
    </Container>
  );
};
