import { LitElement, html, css, TemplateResult, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCardEditor, fireEvent } from 'custom-card-helpers';

import { EnpalSolarCardConfig, TileConfig } from './types';
import { EDITOR_NAME } from './const';

interface TileField {
  key: 'solar_power' | 'solar_yield' | 'battery' | 'car_charging';
  label: string;
}

const TILE_FIELDS: TileField[] = [
  { key: 'solar_power', label: 'Solarleistung (kW)' },
  { key: 'solar_yield', label: 'Solarertrag heute (kWh)' },
  { key: 'battery', label: 'Batteriestatus (%)' },
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
        <h4>Kacheln</h4>
        ${TILE_FIELDS.map((field) => this.renderTileEditor(field))}
        ${this.renderWallboxEditor()}

        <h4>Weitere Entitäten</h4>
        ${(this.config.extra_tiles ?? []).map((tile, index) =>
          this.renderExtraTileEditor(tile, index),
        )}
        <mwc-button outlined @click=${this.addExtraTile}>
          + Entität hinzufügen
        </mwc-button>
      </div>
    `;
  }

  private renderWallboxEditor(): TemplateResult {
    const tile = this.config.wallbox ?? {};
    return html`
      <div class="tile-block">
        <div class="tile-title">Wallbox</div>
        <div class="row two">
          <ha-entity-picker
            .hass=${this.hass}
            .value=${tile.entity ?? ''}
            label="Zustand / Lademodus"
            allow-custom-entity
            @value-changed=${(e: CustomEvent) =>
              this.wallboxChanged('entity', e.detail.value)}
          ></ha-entity-picker>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${tile.secondary_entity ?? ''}
            label="Leistung (optional)"
            allow-custom-entity
            @value-changed=${(e: CustomEvent) =>
              this.wallboxChanged('secondary_entity', e.detail.value)}
          ></ha-entity-picker>
        </div>
        <div class="row two">
          <ha-textfield
            label="Beschriftung"
            .value=${tile.name ?? ''}
            @input=${(e: Event) =>
              this.wallboxChanged(
                'name',
                (e.target as HTMLInputElement).value,
              )}
          ></ha-textfield>
          <ha-icon-picker
            label="Icon"
            .value=${tile.icon ?? ''}
            @value-changed=${(e: CustomEvent) =>
              this.wallboxChanged('icon', e.detail.value)}
          ></ha-icon-picker>
        </div>
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

  private renderExtraTileEditor(
    tile: TileConfig,
    index: number,
  ): TemplateResult {
    return html`
      <div class="tile-block">
        <div class="tile-header">
          <span class="tile-title">Entität ${index + 1}</span>
          <mwc-button dense @click=${() => this.removeExtraTile(index)}>
            Entfernen
          </mwc-button>
        </div>
        <div class="row two">
          <ha-entity-picker
            .hass=${this.hass}
            .value=${tile.entity ?? ''}
            label="Entity"
            allow-custom-entity
            @value-changed=${(e: CustomEvent) =>
              this.extraTileChanged(index, 'entity', e.detail.value)}
          ></ha-entity-picker>
          <ha-textfield
            label="Beschriftung"
            .value=${tile.name ?? ''}
            @input=${(e: Event) =>
              this.extraTileChanged(
                index,
                'name',
                (e.target as HTMLInputElement).value,
              )}
          ></ha-textfield>
        </div>
        <div class="row two">
          <ha-icon-picker
            label="Icon"
            .value=${tile.icon ?? ''}
            @value-changed=${(e: CustomEvent) =>
              this.extraTileChanged(index, 'icon', e.detail.value)}
          ></ha-icon-picker>
          <ha-textfield
            label="Einheit"
            .value=${tile.unit ?? ''}
            @input=${(e: Event) =>
              this.extraTileChanged(
                index,
                'unit',
                (e.target as HTMLInputElement).value,
              )}
          ></ha-textfield>
        </div>
      </div>
    `;
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

  private wallboxChanged(prop: keyof TileConfig, value: string): void {
    const existing = this.config.wallbox ?? {};
    const updatedTile: TileConfig = { ...existing, [prop]: value };
    if (value === '' || value === undefined) {
      delete (updatedTile as Record<string, unknown>)[prop];
    }
    const newConfig = { ...this.config, wallbox: updatedTile };
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private addExtraTile(): void {
    const extra = [...(this.config.extra_tiles ?? []), {}];
    fireEvent(this, 'config-changed', {
      config: { ...this.config, extra_tiles: extra },
    });
  }

  private removeExtraTile(index: number): void {
    const extra = [...(this.config.extra_tiles ?? [])];
    extra.splice(index, 1);
    const newConfig = { ...this.config, extra_tiles: extra };
    if (extra.length === 0) {
      delete (newConfig as Record<string, unknown>).extra_tiles;
    }
    fireEvent(this, 'config-changed', { config: newConfig });
  }

  private extraTileChanged(
    index: number,
    prop: keyof TileConfig,
    value: string,
  ): void {
    const extra = [...(this.config.extra_tiles ?? [])];
    const updated: TileConfig = { ...extra[index], [prop]: value };
    if (value === '' || value === undefined) {
      delete (updated as Record<string, unknown>)[prop];
    }
    extra[index] = updated;
    fireEvent(this, 'config-changed', {
      config: { ...this.config, extra_tiles: extra },
    });
  }

  static styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .row.two > * {
      flex: 1 1 200px;
      min-width: 0;
    }
    ha-textfield,
    ha-entity-picker,
    ha-icon-picker {
      width: 100%;
      box-sizing: border-box;
    }
    h4 {
      margin: 8px 0 0;
    }
    .tile-block {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      padding: 10px 12px;
    }
    .tile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tile-title {
      font-weight: 600;
      margin-bottom: 8px;
    }
  `;
}
