import { popupTargetFromElement } from '@blocksuite/affine-components/context-menu';
import { computed } from '@preact/signals-core';
import { html } from 'lit/static-html.js';

import type { SelectTag } from '../../core/index.js';

import { popTagSelect } from '../../core/component/tags/multi-tag-select.js';
import { BaseCellRenderer } from '../../core/property/index.js';
import { createFromBaseCellRenderer } from '../../core/property/renderer.js';
import { createIcon } from '../../core/utils/uni-icon.js';
import {
  type SelectPropertyData,
  selectPropertyModelConfig,
} from './define.js';

export class SelectCell extends BaseCellRenderer<string[], SelectPropertyData> {
  override render() {
    const value = this.value ? [this.value] : [];
    return html`
      <affine-multi-tag-view
        .value="${value}"
        .options="${this.property.data$.value.options}"
      ></affine-multi-tag-view>
    `;
  }
}

export class SelectCellEditing extends BaseCellRenderer<
  string,
  SelectPropertyData
> {
  private popTagSelect = () => {
    this._disposables.add({
      dispose: popTagSelect(
        popupTargetFromElement(
          this.querySelector('affine-multi-tag-view') ?? this
        ),
        {
          mode: 'single',
          options: this.options$,
          onOptionsChange: this._onOptionsChange,
          value: this._value,
          onChange: this._onChange,
          onComplete: this._editComplete,
          minWidth: 400,
        }
      ),
    });
  };

  _editComplete = () => {
    this.selectCurrentCell(false);
  };

  _onChange = ([id]: string[]) => {
    this.onChange(id);
  };

  _onOptionsChange = (options: SelectTag[]) => {
    this.property.dataUpdate(data => {
      return {
        ...data,
        options,
      };
    });
  };

  options$ = computed(() => {
    return this.property.data$.value.options;
  });

  get _value() {
    const value = this.value;
    return value ? [value] : [];
  }

  override firstUpdated() {
    this.popTagSelect();
  }

  override render() {
    return html`
      <affine-multi-tag-view
        .value="${this._value}"
        .options="${this.options$.value}"
      ></affine-multi-tag-view>
    `;
  }
}

export const selectPropertyConfig =
  selectPropertyModelConfig.createPropertyMeta({
    icon: createIcon('SingleSelectIcon'),
    cellRenderer: {
      view: createFromBaseCellRenderer(SelectCell),
      edit: createFromBaseCellRenderer(SelectCellEditing),
    },
  });
