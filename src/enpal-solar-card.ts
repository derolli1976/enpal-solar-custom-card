import { LitElement, html, nothing, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  HomeAssistant,
  LovelaceCard,
  LovelaceCardEditor,
  handleAction,
} from 'custom-card-helpers';

import { EnpalSolarCardConfig, TileConfig, ActionConfig } from './types';
import { styles } from './styles';
import { CARD_NAME, CARD_VERSION, EDITOR_NAME, ICONS } from './const';

@customElement(CARD_NAME)
export class EnpalSolarCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private config!: EnpalSolarCardConfig;

  public static styles = styles;

  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import('./editor');
    return document.createElement(EDITOR_NAME) as LovelaceCardEditor;
  }

  public static getStubConfig(): Partial<EnpalSolarCardConfig> {
    return {
      type: `custom:${CARD_NAME}`,
      solar_power: { entity: 'sensor.enpal_solar_power', name: 'Solarleistung' },
      solar_yield: {
        entity: 'sensor.enpal_solar_yield_today',
        name: 'Solarertrag heute',
      },
      battery: { entity: 'sensor.enpal_battery_soc', name: 'Batteriestatus' },
      wallbox: { entity: 'sensor.enpal_wallbox_state', name: 'Wallbox' },
      car_charging: {
        entity: 'switch.enpal_car_charging',
        name: 'Auto laden',
      },
    };
  }

  public setConfig(config: EnpalSolarCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    this.config = {
      title: 'Enpal',
      ...config,
    };
  }

  public getCardSize(): number {
    return 5;
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.config || !this.hass) {
      return nothing;
    }

    return html`
      <ha-card>
        <div class="grid">
          ${this.renderValueTile(this.config.solar_power, ICONS.solarPower)}
          ${this.renderValueTile(this.config.solar_yield, ICONS.solarYield)}
          ${this.renderValueTile(this.config.battery, ICONS.battery)}
          ${this.renderWallbox()} ${this.renderCharging()}
          ${(this.config.extra_tiles ?? []).map((tile) =>
            this.renderValueTile(tile, ICONS.generic),
          )}
        </div>
      </ha-card>
    `;
  }

  private renderValueTile(
    tile: TileConfig | undefined,
    defaultIcon: string,
  ): TemplateResult {
    if (!tile) {
      return html``;
    }
    const stateObj = tile.entity ? this.hass.states[tile.entity] : undefined;
    const icon = tile.icon ?? defaultIcon;
    const label = tile.name ?? this.entityName(tile);

    let valueTemplate: TemplateResult;
    if (!stateObj) {
      valueTemplate = html`<span class="unavailable">—</span>`;
    } else {
      const { value, unit } = this.formatState(stateObj, tile);
      valueTemplate = html`
        <div class="value">
          <span>${value}</span>${unit
            ? html`<span class="unit">${unit}</span>`
            : nothing}
        </div>
      `;
    }

    const actionable = !!tile.entity || !!tile.tap_action;
    return html`
      <div
        class="tile ${actionable ? '' : 'no-action'}"
        @click=${() => this.onTileClick(tile)}
      >
        <ha-icon icon="${icon}"></ha-icon>
        <span class="label">${label}</span>
        ${valueTemplate}
      </div>
    `;
  }

  private renderWallbox(): TemplateResult {
    const tile = this.config.wallbox;
    if (!tile) {
      return html``;
    }
    const icon = tile.icon ?? ICONS.wallbox;
    const label = tile.name ?? 'Wallbox';
    const actionable = !!tile.entity || !!tile.tap_action;

    const mainState = tile.entity ? this.hass.states[tile.entity] : undefined;
    const secondaryState = tile.secondary_entity
      ? this.hass.states[tile.secondary_entity]
      : undefined;

    let mainTemplate: TemplateResult | typeof nothing = nothing;
    if (mainState) {
      const { value, unit } = this.formatState(mainState, tile);
      mainTemplate = html`
        <div class="wallbox-mode">
          <span>${value}</span>${unit
            ? html`<span class="unit">${unit}</span>`
            : nothing}
        </div>
      `;
    }

    let secondaryTemplate: TemplateResult | typeof nothing = nothing;
    if (secondaryState) {
      const { value, unit } = this.formatState(secondaryState, {
        unit: tile.secondary_unit,
      });
      secondaryTemplate = html`
        <div class="value">
          <span>${value}</span>${unit
            ? html`<span class="unit">${unit}</span>`
            : nothing}
        </div>
      `;
    }

    return html`
      <div
        class="tile wallbox ${actionable ? '' : 'no-action'}"
        @click=${() => this.onTileClick(tile)}
      >
        <ha-icon icon="${icon}"></ha-icon>
        <span class="label">${label}</span>
        ${mainTemplate} ${secondaryTemplate}
      </div>
    `;
  }

  private renderCharging(): TemplateResult {
    const tile = this.config.car_charging;
    if (!tile) {
      return html``;
    }
    const icon = tile.icon ?? ICONS.car;
    const label = tile.name ?? 'Auto laden';
    const stateObj = tile.entity ? this.hass.states[tile.entity] : undefined;
    const isOn = stateObj ? this.isStateOn(stateObj.state) : false;

    return html`
      <div class="tile charging no-action">
        <span class="label">${label}</span>
        <div class="charging-row">
          <ha-icon icon="${icon}"></ha-icon>
          <div
            class="toggle ${isOn ? 'on' : ''}"
            role="switch"
            aria-checked=${isOn}
            @click=${() => this.toggleEntity(tile)}
          >
            <div class="knob"></div>
          </div>
        </div>
      </div>
    `;
  }

  /* ---------- helpers ---------- */

  private entityName(tile?: TileConfig): string {
    if (!tile?.entity) {
      return '';
    }
    const stateObj = this.hass.states[tile.entity];
    return stateObj?.attributes?.friendly_name ?? tile.entity;
  }

  private formatState(
    stateObj: HomeAssistant['states'][string],
    tile?: TileConfig,
  ): { value: string; unit: string } {
    const raw = stateObj.state;
    const unit =
      tile?.unit ?? (stateObj.attributes?.unit_of_measurement as string) ?? '';

    const num = Number(raw);
    if (raw === '' || Number.isNaN(num)) {
      const hass = this.hass as HomeAssistant & {
        formatEntityState?: (stateObj: unknown) => string;
      };
      const display =
        typeof hass.formatEntityState === 'function'
          ? hass.formatEntityState(stateObj)
          : raw;
      return { value: display, unit: tile?.unit ?? '' };
    }

    const decimals =
      tile?.decimals ?? (Number.isInteger(num) ? 0 : 1);
    const value = num.toLocaleString(this.hass.locale?.language ?? 'de', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return { value, unit };
  }

  private isStateOn(state: string): boolean {
    return ['on', 'charging', 'true', 'home', 'active'].includes(
      state.toLowerCase(),
    );
  }

  private onTileClick(tile?: TileConfig): void {
    if (!tile) {
      return;
    }
    if (tile.tap_action) {
      this.runAction(tile.tap_action);
    } else if (tile.entity) {
      this.fireMoreInfo(tile.entity);
    }
  }

  private toggleEntity(tile?: TileConfig): void {
    if (!tile?.entity) {
      return;
    }
    const [domain] = tile.entity.split('.');
    this.hass.callService(domain, 'toggle', { entity_id: tile.entity });
  }

  private runAction(action?: ActionConfig): void {
    if (!action || action.action === 'none') {
      return;
    }
    handleAction(this, this.hass, { tap_action: action } as never, 'tap');
  }

  private fireMoreInfo(entityId: string): void {
    const event = new CustomEvent('hass-more-info', {
      bubbles: true,
      composed: true,
      detail: { entityId },
    });
    this.dispatchEvent(event);
  }
}

/* Register in the custom card picker */
(window as unknown as { customCards: unknown[] }).customCards =
  (window as unknown as { customCards: unknown[] }).customCards || [];
(window as unknown as { customCards: unknown[] }).customCards.push({
  type: CARD_NAME,
  name: 'Enpal Solar Card',
  description:
    'Dashboard tiles for the Enpal solar integration (Solarleistung, Ertrag, Batterie, Wallbox, Auto laden).',
  preview: true,
});

// eslint-disable-next-line no-console
console.info(
  `%c ENPAL-SOLAR-CARD %c v${CARD_VERSION} `,
  'color: #fff; background: #1c3a63; font-weight: 700;',
  'color: #1c3a63; background: #f5c542; font-weight: 700;',
);
