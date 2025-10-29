import React from 'react';
import Div from '../../../Div';
import Text from '../../../Text';
import { Table2 } from '../../../Table';

const { entries } = Object;

export default function Datawindow() {
  return (
    <Div $p={1.25}>
      <Text $size={16} $weight={600} $color={800} $mb={1}>
        Data window
      </Text>
      <Table2>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {entries({
            date: '12/12/2012 12:12AM',
            open: '123.12',
            high: '123.12',
            low: '123.12',
            close: '123.12',
            volume: '12312.12',
          }).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </Table2>
    </Div>
  );
}
