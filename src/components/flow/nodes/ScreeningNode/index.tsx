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

export const ScreeningNode: React.FC<CustomNodeProps> = ({ data, isConnectable, selected }) => {
  const screeningData = data as {
    instrument: string;
    frequency: string;
    threshold: number;
    domains: string[];
  };

  return (
    <Container selected={selected}>
      <Header>
        <Title>Rastreio</Title>
      </Header>

      <Content>
        <Field>
          <FieldLabel>Instrumento:</FieldLabel>
          <FieldValue>{screeningData.instrument}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>Frequência:</FieldLabel>
          <FieldValue>{screeningData.frequency}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>Limiar:</FieldLabel>
          <FieldValue>{screeningData.threshold}</FieldValue>
        </Field>

        <Field>
          <FieldLabel>Domínios:</FieldLabel>
          <FieldValue>{screeningData.domains.join(', ')}</FieldValue>
        </Field>
      </Content>

      <Handles>
        {isConnectable && (
          <>
            <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
            <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
          </>
        )}
      </Handles>
    </Container>
  );
};
