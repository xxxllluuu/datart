import { Spin } from 'antd';
import useResizeObserver from 'app/hooks/useResizeObserver';
import { transparentize } from 'polished';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { ViewViewModelStages } from '../../constants';
import { selectCurrentEditingViewAttr } from '../../slice/selectors';
import { Error } from './Error';
import { Results } from './Results';

export const Outputs = memo(() => {
  const error = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'error' }),
  ) as string;
  const stage = useSelector(state =>
    selectCurrentEditingViewAttr(state, { name: 'stage' }),
  ) as ViewViewModelStages;

  const { height, ref } = useResizeObserver();

  return (
    <Wrapper ref={ref}>
      <Results height={height} />
      {error && <Error />}
      {stage === ViewViewModelStages.Running && (
        <LoadingMask>
          <Spin />
        </LoadingMask>
      )}
    </Wrapper>
  );
});

const Wrapper = styled.div`
  position: relative;
  display: flex;
  border-top: 1px solid ${p => p.theme.borderColorSplit};
`;

const LoadingMask = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${p => transparentize(0.5, p.theme.componentBackground)};
`;
