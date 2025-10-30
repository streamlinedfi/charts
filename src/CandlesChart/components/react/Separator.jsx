import { divMixin } from '@streamlinedfi/div';
import styled from 'styled-components';

const Separator = styled.hr`
  border: 0;
  width: 100%;
  height: 1px;
  background: ${props => {
    if ([100, 200, 300, 400].includes(props.color)) {
      return props.theme[`fill${props.color}`];
    }
    return props.theme.fill200;
  }};
  margin: 16px 0;

  ${props => divMixin(props)};
`;

export default Separator;
