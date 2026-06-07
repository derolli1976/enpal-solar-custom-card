import { css } from 'lit';

export const styles = css`
  :host {
    --enpal-bg-start: #1c3a63;
    --enpal-bg-end: #0a1828;
    --enpal-tile-bg: rgba(13, 27, 45, 0.55);
    --enpal-tile-border: rgba(120, 160, 210, 0.18);
    --enpal-label: #c5d3e6;
    --enpal-value: #6db6f2;
    --enpal-unit: #6db6f2;
    --enpal-icon: #e8f1fb;
    --enpal-badge-bg: #f5c542;
    --enpal-badge-text: #1a2a44;
    --enpal-toggle-on: #34c759;
    --enpal-radius: 18px;
  }

  ha-card {
    background: radial-gradient(
      circle at 50% 0%,
      var(--enpal-bg-start) 0%,
      var(--enpal-bg-end) 100%
    );
    border: none;
    border-radius: 22px;
    padding: 22px;
    overflow: hidden;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    gap: 18px;
  }

  .tile {
    background: var(--enpal-tile-bg);
    border: 1px solid var(--enpal-tile-border);
    border-radius: var(--enpal-radius);
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 10px;
    cursor: pointer;
    transition:
      transform 0.15s ease,
      background 0.15s ease;
    min-height: 150px;
    box-sizing: border-box;
  }

  .tile:hover {
    transform: translateY(-2px);
    background: rgba(20, 40, 65, 0.7);
  }

  .tile.no-action {
    cursor: default;
  }

  .tile.no-action:hover {
    transform: none;
    background: var(--enpal-tile-bg);
  }

  .tile ha-icon {
    --mdc-icon-size: 52px;
    color: var(--enpal-icon);
  }

  .label {
    color: var(--enpal-label);
    font-size: 1.05rem;
    font-weight: 400;
    letter-spacing: 0.2px;
  }

  .value {
    color: var(--enpal-value);
    font-size: 2.4rem;
    font-weight: 600;
    line-height: 1;
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .value .unit {
    color: var(--enpal-unit);
    font-size: 1.2rem;
    font-weight: 400;
    opacity: 0.85;
  }

  /* Wallbox spans the full right column height */
  .tile.wallbox {
    grid-column: 3;
    grid-row: 1 / span 2;
    min-height: unset;
  }

  /* Middle column second row holds charging + HA link stacked */
  .col-stack {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .col-stack .tile {
    min-height: 0;
    flex: 1;
  }

  .tile.charging {
    flex-direction: column;
    gap: 14px;
  }

  .charging-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
  }

  .charging-row ha-icon {
    --mdc-icon-size: 42px;
  }

  .tile.ha-link {
    flex-direction: row;
    gap: 12px;
    padding: 14px;
  }

  .tile.ha-link ha-icon {
    --mdc-icon-size: 34px;
  }

  .tile.ha-link .label {
    font-size: 1.1rem;
  }

  /* Toggle switch */
  .toggle {
    position: relative;
    width: 64px;
    height: 34px;
    border-radius: 17px;
    background: rgba(120, 140, 160, 0.5);
    transition: background 0.2s ease;
    flex: 0 0 auto;
  }

  .toggle.on {
    background: var(--enpal-toggle-on);
  }

  .toggle .knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #fff;
    transition: transform 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }

  .toggle.on .knob {
    transform: translateX(30px);
  }

  /* Version / badge tile */
  .tile.version {
    grid-column: 3;
    grid-row: 2;
    gap: 16px;
    justify-content: space-evenly;
  }

  .badge {
    background: var(--enpal-badge-bg);
    color: var(--enpal-badge-text);
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.15;
    text-align: center;
    padding: 12px 22px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
  }

  .version-line {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .version-line .v-label {
    color: var(--enpal-icon);
    font-size: 1.3rem;
  }

  .version-line .v-number {
    font-size: 2.8rem;
    font-weight: 700;
    background: linear-gradient(180deg, #aee0ff 0%, #2f8fe0 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .unavailable {
    color: var(--enpal-label);
    font-size: 1.4rem;
    opacity: 0.7;
  }

  @media (max-width: 600px) {
    .grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto;
    }
    .tile.wallbox {
      grid-column: 1 / span 2;
      grid-row: auto;
    }
    .col-stack {
      grid-column: 1 / span 2;
      grid-row: auto;
    }
    .tile.version {
      grid-column: 1 / span 2;
      grid-row: auto;
    }
  }
`;
