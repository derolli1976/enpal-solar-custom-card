import { LovelaceCardConfig } from 'custom-card-helpers';

export interface TileConfig {
  /** Entity id, e.g. sensor.enpal_solar_power */
  entity?: string;
  /** Override label shown above/below the value */
  name?: string;
  /** Override unit (otherwise taken from the entity) */
  unit?: string;
  /** Optional icon override (mdi:...) */
  icon?: string;
  /** Number of decimals to display (default: from entity) */
  decimals?: number;
  /** Optional secondary entity shown as an additional value line (e.g. wallbox power) */
  secondary_entity?: string;
  /** Override unit for the secondary entity */
  secondary_unit?: string;
  /** Tap action target (defaults to more-info of the entity) */
  tap_action?: ActionConfig;
}

export interface ActionConfig {
  action: 'more-info' | 'navigate' | 'url' | 'toggle' | 'none';
  navigation_path?: string;
  url_path?: string;
}

export interface EnpalSolarCardConfig extends LovelaceCardConfig {
  type: string;
  /** Optional headline shown at the top of the card */
  title?: string;

  /** Solar power (kW) tile */
  solar_power?: TileConfig;
  /** Solar yield today (kWh) tile */
  solar_yield?: TileConfig;
  /** Battery state of charge (%) tile */
  battery?: TileConfig;

  /** Wallbox tile */
  wallbox?: TileConfig;
  /** Car charging toggle tile */
  car_charging?: TileConfig;

  /** Additional free-form entity tiles */
  extra_tiles?: TileConfig[];
}
