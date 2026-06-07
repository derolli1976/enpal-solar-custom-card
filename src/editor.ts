import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor, fireEvent } from 'custom-card-helpers';

import { EnpalSolarCardConfig, TileConfig } from './types';
import { EDITOR_NAME } from './const';

interface TileField {
  key: 'solar_power' | 'solar_yield' | 'battery' | 'wallbox' | 'car_charging';
  label: string;
}

const TILE_FIELDS: TileField[] = [
  { key: 'solar_power', label: 'Solarleistung (kW)' },
  { key: 'solar_yield', label: 'Solarertrag heute (kWh)' },
  { key: 'battery', label: 'Batteriestatus (%)' },
  { key: 'wallbox', label: 'Wallbox' },
  { key: 'car_charging', label: 'Auto laden (Schalter)' },
];

@customElement(EDITOR_NAME)
export class EnpalSolarCardEditor
  extends LitElement
  implements LovelaceCardEditor
{
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: EnpalSolarCardConfig;

  public setConfig(config: EnpalSolarCardConfig): void {
    this.config = config;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.config) {
      return nothing;
    }

    return html`
      <div class="editor">
        <div class="row">
          <ha-textfield
            label="Version"
            .value=${this.config.version ?? ''}
            .configValue=${'version'}
            @input=${this.valueChanged}
          ></ha-textfield>
        </div>

        <div class="row">
          <ha-textfield
            label="Badge-Text (Zeilenumbruch mit \\n)"
            .value=${this.config.badge_text ?? ''}
            .configValue=${'badge_text'}
            @input=${this.valueChanged}
          ></ha-textfield>
        </div>

        <h4>Kacheln</h4>
        ${TILE_FIELDS.map((field) => this.renderTileEditor(field))}
      </div>
    `;
  }

  private renderTileEditor(field: TileField): TemplateResult {
    const tile = (this.config[field.key] as TileConfig) ?? {};
    return html`
      <div class="tile-block">
        <div class="tile-title">${field.label}</div>
        <div class="row two">
          <ha-entity-picker
            .hass=${this.hass}
            .value=${tile.entity ?? ''}
            label="Entity"
            allow-custom-entity
            @value-changed=${(e: CustomEvent) =>
              this.tileChanged(field.key, 'entity', e.detail.value)}
          ></ha-entity-picker>
          <ha-textfield
            label="Beschriftung"
            .value=${tile.name ?? ''}
            @input=${(e: Event) =>
              this.tileChanged(
                field.key,
                'name',
                (e.target as HTMLInputElement).value,
              )}
          ></ha-textfield>
        </div>
      </div>
    `;
  }

  private valueChanged(ev: Event): void {
    const target = ev.target as HTMLInputElement & { configValue?: string };
    if (!target.configValue) {
      return;
    }
    const newConfig = { ...this.config, [target.configValue]: target.value };
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private tileChanged(
    key: TileField['key'],
    prop: keyof TileConfig,
    value: string,
  ): void {
    const existing = (this.config[key] as TileConfig) ?? {};
    const updatedTile: TileConfig = { ...existing, [prop]: value };
    if (value === '' || value === undefined) {
      delete (updatedTile as Record<string, unknown>)[prop];
    }
    const newConfig = { ...this.config, [key]: updatedTile };
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  static styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .row {
      display: flex;
      gap: 12px;
    }
    .row.two ha-entity-picker,
    .row.two ha-textfield {
      flex: 1;
    }
    ha-textfield,
    ha-entity-picker {
      width: 100%;
    }
    h4 {
      margin: 8px 0 0;
    }
    .tile-block {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      padding: 10px 12px;
    }
    .tile-title {
      font-weight: 600;
      margin-bottom: 8px;
    }
  `;
}
