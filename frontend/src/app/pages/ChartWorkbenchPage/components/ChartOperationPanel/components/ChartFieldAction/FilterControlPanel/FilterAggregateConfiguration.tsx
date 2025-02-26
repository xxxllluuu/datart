/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Select } from 'antd';
import { useI18NPrefix } from 'app/pages/ChartWorkbenchPage/hooks';
import {
  AggregateFieldActionType,
  ChartDataSectionField,
} from 'app/pages/ChartWorkbenchPage/models/ChartConfig';
import { ChartDataViewFieldType } from 'app/pages/ChartWorkbenchPage/models/ChartDataView';
import { FC, memo } from 'react';

const FilterAggregateConfiguration: FC<{
  config: ChartDataSectionField;
  aggregate?: string;
  onChange: (aggregate: string) => void;
}> = memo(({ config, aggregate, onChange }) => {
  const t = useI18NPrefix('viz.common.enum.aggregateTypes');

  const getAggregateByModelType = () => {
    switch (config?.type) {
      case ChartDataViewFieldType.STRING:
      case ChartDataViewFieldType.DATE:
        return [AggregateFieldActionType.NONE, AggregateFieldActionType.COUNT];
      case ChartDataViewFieldType.NUMERIC:
        return Object.values(AggregateFieldActionType);
      default:
        return [AggregateFieldActionType.NONE];
    }
  };

  return (
    <Select value={aggregate} onChange={onChange}>
      {getAggregateByModelType().map(agg => (
        <Select.Option key={agg} value={agg}>
          {t(agg)}
        </Select.Option>
      ))}
    </Select>
  );
});

export default FilterAggregateConfiguration;
