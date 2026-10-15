/**
 * Read-only runtime transcription of the three accepted Table B records
 * and the Fairphone 5 repair sub-records.
 *
 * Values are copied from the accepted contract and source package.
 * This module does not match fuzzy names, score a phone, or apply a
 * repair scenario.
 */

const PACKAGE_PROVENANCE = "R&E-V0-SMARTPHONE-0.3.0";
const PACKAGE_COMMIT = "024a95392d2e1555a3c9b598fdc291bd341c3d6b";
const METRIC = "GWP100 / kg CO2e";

export const GENERIC_SMARTPHONE_MODEL_ID = "generic";
export const GENERIC_SMARTPHONE_MODEL_LABEL =
  "I don't know / use generic smartphone evidence";

/**
 * @param {string} display
 * @param {"source_reported_point" | "approximate_derived_point"} kind
 */
function point(display, kind) {
  const magnitude = Number(display);
  if (!Number.isFinite(magnitude)) {
    throw new Error("Model point display is not a finite number");
  }
  return Object.freeze({
    kind,
    display,
    magnitude_kg: magnitude,
    approximate: kind === "approximate_derived_point",
    comparator: null,
    bound_kg: null,
  });
}

/**
 * @param {string} boundDisplay
 */
function upperBound(boundDisplay) {
  const bound = Number(boundDisplay);
  if (!Number.isFinite(bound)) {
    throw new Error("Model upper bound is not a finite number");
  }
  return Object.freeze({
    kind: "upper_bound",
    display: `<${boundDisplay}`,
    magnitude_kg: null,
    approximate: true,
    comparator: "<",
    bound_kg: bound,
  });
}

/**
 * @param {Record<string, any>} record
 */
function sealRecord(record) {
  return Object.freeze({
    record_id: record.record_id,
    public_label: record.public_label,
    source_id: record.source_id,
    source_year: record.source_year,
    source_provenance: record.source_provenance,
    manufacturer: record.manufacturer,
    model: record.model,
    configuration: record.configuration,
    region: record.region,
    boundary: record.boundary,
    source_use_period_years: record.source_use_period_years,
    source_use_period_known: record.source_use_period_known,
    total: point(record.totalDisplay, "source_reported_point"),
    production: point(record.productionDisplay, record.productionKind),
    distribution: Object.freeze({
      ...point(record.distributionDisplay, record.distributionKind),
      phase_label: record.distributionPhaseLabel,
    }),
    use_phase: point(record.useDisplay, record.useKind),
    eol: record.eolBoundDisplay
      ? upperBound(record.eolBoundDisplay)
      : point(record.eolDisplay, record.eolKind),
    derived_values: record.derived_values,
    rounding_uncertainty: record.rounding_uncertainty,
    rounding_note: record.rounding_note,
    source_reported_shares: record.source_reported_shares ?? null,
    water_indicator_record: null,
    package_provenance: PACKAGE_PROVENANCE,
    package_commit: PACKAGE_COMMIT,
    metric: METRIC,
    status: "APPROVED_MODEL_SPECIFIC",
  });
}

const FAIRPHONE_5 = sealRecord({
  record_id: "MS-CLIMATE-FAIRPHONE5-S2-V0",
  public_label: "Fairphone 5",
  source_id: "S2",
  source_year: 2024,
  source_provenance: "Fraunhofer IZM LCA, commissioned by Fairphone B.V.",
  manufacturer: "Fairphone",
  model: "Fairphone 5",
  configuration: "Exact model. No additional configuration restriction is recorded.",
  region: null,
  boundary: "cradle-to-grave",
  source_use_period_years: 3,
  source_use_period_known: true,
  totalDisplay: "42.10",
  productionDisplay: "32.70",
  productionKind: "source_reported_point",
  distributionDisplay: "2.81",
  distributionKind: "source_reported_point",
  distributionPhaseLabel: "transport",
  useDisplay: "6.59",
  useKind: "source_reported_point",
  eolDisplay: "0.041",
  eolKind: "source_reported_point",
  eolBoundDisplay: null,
  derived_values: false,
  rounding_uncertainty: false,
  rounding_note: "Preserve the supplied precision. Do not add digits.",
});

const GALAXY_S25_EUR = sealRecord({
  record_id: "MS-CLIMATE-GALAXY-S25-EUR-S3-V0",
  public_label: "Samsung Galaxy S25 EUR",
  source_id: "S3",
  source_year: 2025,
  source_provenance: "Samsung manufacturer product environmental report",
  manufacturer: "Samsung",
  model: "Galaxy S25",
  configuration: "EUR configuration. Storage configuration is not recorded.",
  region: "EUR",
  boundary: "manufacturer lifecycle-carbon report",
  source_use_period_years: null,
  source_use_period_known: false,
  totalDisplay: "45.7",
  productionDisplay: "40.22",
  productionKind: "approximate_derived_point",
  distributionDisplay: "2.38",
  distributionKind: "approximate_derived_point",
  distributionPhaseLabel: "distribution",
  useDisplay: "2.97",
  useKind: "approximate_derived_point",
  eolDisplay: "0.14",
  eolKind: "approximate_derived_point",
  eolBoundDisplay: null,
  derived_values: true,
  rounding_uncertainty: true,
  rounding_note: "Phase kilograms are approximate. Total and shares are source-reported.",
  source_reported_shares: Object.freeze({
    production: "88.0%",
    distribution: "5.2%",
    use: "6.5%",
    disposal: "0.3%",
  }),
});

const IPHONE_16_128 = sealRecord({
  record_id: "MS-CLIMATE-IPHONE16-128GB-S4-V0",
  public_label: "Apple iPhone 16 128 GB",
  source_id: "S4",
  source_year: 2024,
  source_provenance: "Apple manufacturer product environmental report",
  manufacturer: "Apple",
  model: "iPhone 16",
  configuration: "128 GB only. Not Plus, 256 GB, or 512 GB.",
  region: null,
  boundary: "manufacturer ISO-based product footprint; first-owner model",
  source_use_period_years: 3,
  source_use_period_known: true,
  totalDisplay: "56.0",
  productionDisplay: "44.8",
  productionKind: "approximate_derived_point",
  distributionDisplay: "1.68",
  distributionKind: "approximate_derived_point",
  distributionPhaseLabel: "transportation",
  useDisplay: "10.08",
  useKind: "approximate_derived_point",
  eolDisplay: null,
  eolKind: null,
  eolBoundDisplay: "0.56",
  derived_values: true,
  rounding_uncertainty: true,
  rounding_note: "Phase kilograms are approximate. End of life is an inequality, not an exact value.",
});

export const APPROVED_SMARTPHONE_MODEL_RECORDS = Object.freeze([
  FAIRPHONE_5,
  GALAXY_S25_EUR,
  IPHONE_16_128,
]);

/**
 * Source and scenario reference only. Nothing here selects a repair mode.
 */
export const FAIRPHONE_5_REPAIR_SUBRECORDS = Object.freeze([
  Object.freeze({
    field: "repair.battery.diy",
    display: "0.568",
    magnitude_kg: 0.568,
    unit: "kg CO2e",
    source_id: "S2",
    status: "APPROVED_MODEL_SPECIFIC",
    applicability: "Fairphone 5 battery, DIY scenario",
  }),
  Object.freeze({
    field: "repair.battery.repair_center",
    display: "0.617",
    magnitude_kg: 0.617,
    unit: "kg CO2e",
    source_id: "S2",
    status: "APPROVED_MODEL_SPECIFIC",
    applicability: "Fairphone 5 battery, repair-centre scenario",
  }),
  Object.freeze({
    field: "repair.display.diy",
    display: "7.431",
    magnitude_kg: 7.431,
    unit: "kg CO2e",
    source_id: "S2",
    status: "APPROVED_MODEL_SPECIFIC",
    applicability: "Fairphone 5 display module, DIY",
  }),
  Object.freeze({
    field: "repair.display.repair_center",
    display: "7.493",
    magnitude_kg: 7.493,
    unit: "kg CO2e",
    source_id: "S2",
    status: "APPROVED_MODEL_SPECIFIC",
    applicability: "Fairphone 5 display module, repair-centre",
  }),
  Object.freeze({
    field: "repair.primary_pcba.full_module_diy",
    display: "17.840",
    magnitude_kg: 17.84,
    unit: "kg CO2e",
    source_id: "S2",
    status: "APPROVED_MODEL_SPECIFIC",
    applicability: "Fairphone 5 only",
  }),
  Object.freeze({
    field: "repair.primary_pcba.full_module_repair_center",
    display: "17.909",
    magnitude_kg: 17.909,
    unit: "kg CO2e",
    source_id: "S2",
    status: "APPROVED_MODEL_SPECIFIC",
    applicability: "Fairphone 5 only",
  }),
  Object.freeze({
    field: "repair.primary_pcba.board_level_part_repair_center",
    display: "6.959",
    magnitude_kg: 6.959,
    unit: "kg CO2e",
    source_id: "S2",
    status: "APPROVED_MODEL_SPECIFIC",
    applicability: "Fairphone 5 only",
  }),
]);

/**
 * Exact record id or exact public label only.
 *
 * @param {unknown} value
 * @returns {(typeof APPROVED_SMARTPHONE_MODEL_RECORDS)[number] | null}
 */
export function resolveApprovedModelRecord(value) {
  if (typeof value !== "string" || value.length === 0) return null;
  return (
    APPROVED_SMARTPHONE_MODEL_RECORDS.find(
      (record) => value === record.record_id || value === record.public_label,
    ) ?? null
  );
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isControlledModelChoice(value) {
  return value === GENERIC_SMARTPHONE_MODEL_ID || resolveApprovedModelRecord(value) != null;
}
