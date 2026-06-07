# Enpal Solar Card

Eine Home Assistant Lovelace **Custom Card** für die Enpal Solar Integration – im Look des Version-3.0.0-Ankündigungsbilds: Kacheln für Solarleistung, Solarertrag, Batteriestatus, Wallbox, „Auto laden" und ein Versions-/Badge-Feld.

![Vorschau](docs/preview.png)

## Funktionen

- Dunkles, abgerundetes Kachel-Design mit blauem Verlaufshintergrund (wie im Ankündigungsbild)
- Kacheln: Solarleistung (kW), Solarertrag heute (kWh), Batteriestatus (%), Wallbox, Auto laden (Toggle)
- Home-Assistant-Link-Kachel mit konfigurierbarer Aktion
- Gelbes Badge (z. B. „360 aktive Installationen") + große Versionsnummer
- Visueller Editor im Lovelace-UI (Entities per Picker auswählbar)
- `tap_action` / `more-info` Unterstützung pro Kachel
- Responsives Layout (3 Spalten → 2 Spalten auf schmalen Displays)

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
version: "3.0.0"
badge_text: "360 aktive\nInstallationen"
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
```

Ein vollständiges Beispiel findest du in [`example/dashboard.yaml`](example/dashboard.yaml).

### Optionen

| Option           | Typ     | Beschreibung                                                |
| ---------------- | ------- | ----------------------------------------------------------- |
| `version`        | string  | Versionsnummer rechts unten (Standard: 3.0.0)               |
| `badge_text`     | string  | Text im gelben Badge, `\n` für Zeilenumbruch                |
| `solar_power`    | Tile    | Solarleistungs-Kachel                                       |
| `solar_yield`    | Tile    | Solarertrag-Kachel                                          |
| `battery`        | Tile    | Batteriestatus-Kachel                                       |
| `wallbox`        | Tile    | Wallbox-Kachel                                              |
| `car_charging`   | Tile    | „Auto laden"-Kachel mit Toggle (`switch`/`input_boolean`)   |
| `home_assistant` | Action  | Aktion der Home-Assistant-Link-Kachel                       |

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
