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

import Chart from 'app/pages/ChartWorkbenchPage/models/Chart';
import * as datartChartHelper from 'app/utils/chart';
import { fetchPluginChart } from 'app/utils/fetch';
import { Omit } from 'utils/object';
import { request } from 'utils/request';

class ChartPluginLoader {
  async loadPlugins(paths: string[]) {
    // const customModelPaths = [
    //   './custom-chart-plugins/demo-custom-line-chart.js',
    //   // './custom-chart-plugins/demo-echart-3d-bar-chart.js',
    //   './custom-chart-plugins/demo-d3js-scatter-chart.js',
    // ];

    const loadPluginTasks = (paths || []).map(async path => {
      const result = await fetchPluginChart(path);
      if (!result) {
        return Promise.resolve(result);
      }

      /* Known Issue: file path only allow in src folder by create-react-app file scope limition by CRA
       * Git Issue: https://github.com/facebook/create-react-app/issues/5563
       * Suggestions: Use es6 `import` api to load file and compatible with ES Modules
       */
      // tslint:disable-next-line:no-eval
      // eslint-disable-next-line no-eval
      const customPlugin = eval(`(${result})`)({
        dHelper: { ...datartChartHelper, request, tranform: () => 1 },
      });
      return this.convertToDatartChartModel(customPlugin);
    });
    return Promise.all(loadPluginTasks);
  }

  convertToDatartChartModel(customPlugin) {
    const chart = new Chart(
      customPlugin.meta.id,
      customPlugin.meta.name,
      customPlugin.meta.icon,
      customPlugin.meta.requirements,
    );
    return Object.assign(chart, Omit(customPlugin, ['meta']));
  }
}
export default ChartPluginLoader;
