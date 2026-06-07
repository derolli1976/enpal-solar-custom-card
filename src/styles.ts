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
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

  .wallbox-mode {
    color: var(--enpal-label);
    font-size: 1.3rem;
    font-weight: 500;
    display: flex;
    align-items: baseline;
    gap: 6px;
    text-align: center;
  }

  .wallbox-mode .unit {
    font-size: 1rem;
    opacity: 0.85;
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

  .unavailable {
    color: var(--enpal-label);
    font-size: 1.4rem;
    opacity: 0.7;
  }
`;
