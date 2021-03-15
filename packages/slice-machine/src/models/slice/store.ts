
import { Widget } from 'lib/models/common/widgets';
import { WidgetsArea } from 'lib/models/common/Variation';
import { ComponentMetadata } from 'lib/models/common/Component';
import {
  ActionType as VariationActions,
  updateWidgetMockConfig,
  deleteWidgetMockConfig,
} from './variation/actions';

import {
  ActionType as SliceActions,
  saveSlice,
  pushSlice,
  generateCustomScreenShot,
  generateScreenShot,
} from './actions';
import Store from 'lib/models/ui/Store';

export default class SliceStore implements Store {
  constructor(readonly dispatch: ({ type, payload }: { type: string, payload?: any }) => void) {}

  reset = () => { this.dispatch({ type: SliceActions.Reset }) }
  save = saveSlice(this.dispatch)
  push = pushSlice(this.dispatch)
  generateScreenShot = generateScreenShot(this.dispatch)
  generateCustomScreenShot = generateCustomScreenShot(this.dispatch)
  updateMetadata = (value: ComponentMetadata) => this.dispatch({ type: SliceActions.UpdateMetadata, payload: value })

  variation = (variationId: string) => {
    return {
      addWidget: (widgetsArea: WidgetsArea, key: string, value: Widget) => {
        this.dispatch({ type: VariationActions.AddWidget, payload: { variationId, widgetsArea, key, value } }) 
      },
      replaceWidget: (widgetsArea: WidgetsArea, previousKey: string, newKey: string, value: Widget) => {
        console.log('replace widget store')
        this.dispatch({ type: VariationActions.ReplaceWidget, payload: { variationId, widgetsArea, previousKey, newKey, value } }) 
      },
      reorderWidget: (widgetsArea: WidgetsArea, start: number, end: number) => {
        this.dispatch({ type: VariationActions.ReorderWidget, payload: { variationId, widgetsArea, start, end }})
      },
      removeWidget: (widgetsArea: WidgetsArea, key: string) => {
        this.dispatch({ type: VariationActions.RemoveWidget, payload: { variationId, widgetsArea, key } })
      },
      updateWidgetMockConfig: updateWidgetMockConfig(this.dispatch)(variationId),
      deleteWidgetMockConfig: deleteWidgetMockConfig(this.dispatch)(variationId)
    }
  }
}