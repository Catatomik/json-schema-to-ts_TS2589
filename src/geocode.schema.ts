import { schema } from "@feathersjs/schema";
import { FromSchema } from "json-schema-to-ts";

const geocodeResultRawSchema = {
  definitions: {
    Addresses: {
      type: "object",
      additionalProperties: false,
      required: [
        "code_postal",
        "commune",
        "fantoir",
        "nom_voie",
        "nom_voie_lowercase",
        "numero",
        "type_voie",
      ],
      properties: {
        code_postal: {
          type: "integer",
        },
        commune: {
          type: "string",
        },
        fantoir: {
          type: "string",
        },
        nom_voie: {
          type: "string",
        },
        nom_voie_lowercase: {
          type: "string",
        },
        numero: {
          type: "integer",
        },
        rep: {
          type: "string",
        },
        type_voie: {
          type: "string",
        },
      },
    },
    TBM_Stops: {
      type: "object",
      additionalProperties: false,
      required: ["type", "vehicule", "libelle", "libelle_lowercase", "actif"],
      properties: {
        type: {
          type: "string",
          enum: ["CLASSIQUE", "DELESTAGE", "AUTRE", "FICTIF"],
        },
        vehicule: {
          type: "string",
          enum: ["BUS", "TRAM", "BATEAU"],
        },
        libelle: {
          type: "string",
        },
        libelle_lowercase: {
          type: "string",
        },
        actif: {
          type: "integer",
          enum: [0, 1],
        },
      },
    },
    SNCF_Stops: {
      type: "object",
      additionalProperties: false,
      required: ["name", "name_lowercase"],
      properties: {
        name: {
          type: "string",
        },
        name_lowercase: {
          type: "string",
        },
      },
    },
    coords: {
      type: "array",
      items: [{ type: "number" }, { type: "number" }],
      minItems: 2,
      maxItems: 2,
    },
  },
  $id: "GeocodeResult",
  type: "object",
  additionalProperties: false,
  required: ["_id", "coords", "GEOCODE_type", "dedicated", "createdAt", "updatedAt"],
  properties: {
    _id: {
      type: "integer",
    },
    coords: {
      $ref: "#/definitions/coords",
    },
    GEOCODE_type: {
      type: "string",
      enum: ["Addresses", "TBM_Stops", "SNCF_Stops"],
    },
    dedicated: {
      oneOf: [
        { $ref: "#/definitions/Addresses" },
        { $ref: "#/definitions/TBM_Stops" },
        { $ref: "#/definitions/SNCF_Stops" },
      ],
    },
    createdAt: {
      type: "number",
    },
    updatedAt: {
      type: "number",
    },
  },
  allOf: [
    {
      if: {
        properties: {
          GEOCODE_type: { const: "Addresses" },
        },
      },
      then: {
        properties: {
          dedicated: { $ref: "#/definitions/Addresses" },
        },
      },
    },
    {
      if: {
        properties: {
          GEOCODE_type: { const: "TBM_Stops" },
        },
      },
      then: {
        properties: {
          dedicated: { $ref: "#/definitions/TBM_Stops" },
        },
      },
    },
    {
      if: {
        properties: {
          GEOCODE_type: { const: "SNCF_Stops" },
        },
      },
      then: {
        properties: {
          dedicated: { $ref: "#/definitions/SNCF_Stops" },
        },
      },
    },
  ],
} as const;

export const geocodeResultSchema = schema(geocodeResultRawSchema);

export type GeocodeResult = FromSchema<typeof geocodeResultRawSchema, { parseIfThenElseKeywords: true }>;

export type withAddresses = GeocodeResult & { GEOCODE_type: "Addresses" };
export type withTBM_Stops = GeocodeResult & { GEOCODE_type: "TBM_Stops" };
export type withSNCF_Stops = GeocodeResult & { GEOCODE_type: "SNCF_Stops" };

// Contains correct types, but also the unconditional type
const a: withAddresses = {} as any;
const b: withTBM_Stops = {} as any;
const c: withSNCF_Stops = {} as any;

// Expected

export type GEOCODE_type = "Addresses" | "TBM_Stops" | "SNCF_Stops";
export type GeocodeSpecificResult<G extends GEOCODE_type> = G extends "Addresses"
  ? {
      GEOCODE_type: G;
      dedicated: {
        rep?: string | undefined;
        code_postal: number;
        commune: string;
        fantoir: string;
        nom_voie: string;
        nom_voie_lowercase: string;
        numero: number;
        type_voie: string;
      };
    }
  : G extends "TBM_Stops"
  ? {
      GEOCODE_type: G;
      dedicated: {
        type: "CLASSIQUE" | "DELESTAGE" | "AUTRE" | "FICTIF";
        vehicule: "BUS" | "TRAM" | "BATEAU";
        libelle: string;
        libelle_lowercase: string;
        actif: 0 | 1;
      };
    }
  : G extends "SNCF_Stops"
  ? {
      GEOCODE_type: G;
      dedicated: {
        name: string;
        name_lowercase: string;
      };
    }
  : never;
export type HackedGeocodeResult = GeocodeSpecificResult<GEOCODE_type> & {
  _id: number;
  coords: [number, number];
  createdAt: number;
  updatedAt: number;
};

// Contains correct types, without unwanted union
const hacked: HackedGeocodeResult = {} as any;
if (hacked.GEOCODE_type === "Addresses") hacked.dedicated;
if (hacked.GEOCODE_type === "TBM_Stops") hacked.dedicated;
if (hacked.GEOCODE_type === "SNCF_Stops") hacked.dedicated;
