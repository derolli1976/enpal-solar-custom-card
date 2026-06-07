# Enpal Solar Card

Eine Home Assistant Lovelace **Custom Card** für die Enpal Solar Integration: Kacheln für Solarleistung, Solarertrag, Batteriestatus, Wallbox, „Auto laden" und beliebig viele weitere Entitäten.

![Vorschau](docs/preview.png)

## Funktionen

- Dunkles, abgerundetes Kachel-Design mit blauem Verlaufshintergrund
- Kacheln: Solarleistung (kW), Solarertrag heute (kWh), Batteriestatus (%), Wallbox, Auto laden (Toggle)
- Beliebig viele zusätzliche Entitäts-Kacheln über `extra_tiles`
- Visueller Editor im Lovelace-UI (Entities per Picker auswählbar)
- `tap_action` / `more-info` Unterstützung pro Kachel
- Responsives Layout (Kacheln fließen automatisch um)

## Installation

### Manuell

1. `npm install`
2. `npm run build`
3. `dist/enpal-solar-card.js` nach `config/www/` deines Home Assistant kopieren
4. Ressource hinzufügen (Einstellungen → Dashboards → Ressourcen):

   ```yaml
   url: /local/enpal-solar-card.js
   type: module
   ```

### HACS (Custom Repository)

1. HACS → Custom repositories → dieses Repo als „Lovelace" hinzufügen
2. „Enpal Solar Card" installieren
3. Dashboard neu laden

## Konfiguration

Minimalbeispiel:

```yaml
type: custom:enpal-solar-card
solar_power:
  entity: sensor.enpal_solar_power
solar_yield:
  entity: sensor.enpal_solar_yield_today
battery:
  entity: sensor.enpal_battery_soc
wallbox:
  entity: sensor.enpal_wallbox_state
car_charging:
  entity: switch.enpal_car_charging
extra_tiles:
  - entity: sensor.enpal_grid_power
    name: Netzbezug
    icon: mdi:transmission-tower
```

Ein vollständiges Beispiel findest du in [`example/dashboard.yaml`](example/dashboard.yaml).

### Optionen

| Option         | Typ          | Beschreibung                                              |
| -------------- | ------------ | -------------------------------------------------------- |
| `solar_power`  | Tile         | Solarleistungs-Kachel                                    |
| `solar_yield`  | Tile         | Solarertrag-Kachel                                       |
| `battery`      | Tile         | Batteriestatus-Kachel                                    |
| `wallbox`      | Tile         | Wallbox-Kachel                                           |
| `car_charging` | Tile         | „Auto laden"-Kachel mit Toggle (`switch`/`input_boolean`) |
| `extra_tiles`  | Tile[]       | Beliebig viele zusätzliche Entitäts-Kacheln              |

#### Tile-Objekt

| Feld         | Typ     | Beschreibung                                       |
| ------------ | ------- | -------------------------------------------------- |
| `entity`     | string  | Entity-ID                                          |
| `name`       | string  | Überschrift der Kachel                             |
| `unit`       | string  | Einheit überschreiben                              |
| `icon`       | string  | MDI-Icon überschreiben (`mdi:...`)                 |
| `decimals`   | number  | Nachkommastellen                                   |
| `tap_action` | Action  | Aktion bei Klick (Standard: `more-info`)           |

## Entwicklung

```bash
npm install
npm run watch   # Rollup im Watch-Modus
npm run build   # Produktions-Build nach dist/
npm run lint    # ESLint
```

## Lizenz

MIT
