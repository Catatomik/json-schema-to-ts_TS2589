import { schema } from "@feathersjs/schema";
import { FromSchema } from "json-schema-to-ts";

const itineraryResultRawSchema = {
  definitions: {
    FOOTStageDetails: {
      type: "object",
      additionalProperties: false,
      required: ["distance"],
      properties: {
        distance: {
          type: "integer",
        },
      },
    },
    TBMStageDetails: {
      type: "object",
      additionalProperties: false,
      required: ["type", "line", "direction", "departure"],
      properties: {
        type: {
          type: "string",
          enum: ["BUS", "TRAM", "BATEAU"],
        },
        line: {
          type: "string",
        },
        direction: {
          type: "string",
        },
        departure: {
          type: "integer",
        },
      },
    },
    SNCFStageDetails: {
      type: "object",
      additionalProperties: false,
      required: ["type", "line", "direction", "departure"],
      properties: {
        type: {
          type: "string",
          enum: ["TRAIN"],
        },
        line: {
          type: "string",
        },
        direction: {
          type: "string",
        },
        departure: {
          type: "integer",
        },
      },
    },
  },
  $id: "ItineraryResult",
  type: "object",
  additionalProperties: false,
  required: ["code", "message", "lastActualization", "paths"],
  properties: {
    code: {
      type: "integer",
      minimum: 200,
      maximum: 599,
    },
    message: {
      type: "string",
    },
    lastActualization: {
      type: "integer",
    },
    paths: {
      type: "array",
      uniqueItems: true,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "totalDuration", "totalDistance", "departure", "from", "stages"],
        properties: {
          id: {
            type: "string",
          },
          totalDuration: {
            type: "integer",
          },
          totalDistance: {
            type: "integer",
          },
          departure: {
            type: "integer",
          },
          from: {
            type: "string",
          },
          stages: {
            type: "array",
            uniqueItems: true,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["type", "to", "duration", "details"],
              properties: {
                type: {
                  type: "string",
                  enum: ["FOOT", "TBM", "SNCF"],
                },
                to: {
                  type: "string",
                },
                duration: {
                  type: "integer",
                },
                details: {
                  type: "object",
                  oneOf: [
                    { $ref: "#/definitions/FOOTStageDetails" },
                    { $ref: "#/definitions/TBMStageDetails" },
                    { $ref: "#/definitions/SNCFStageDetails" },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
  allOf: [
    {
      if: {
        properties: {
          paths: {
            type: "array",
            items: {
              type: "object",
              properties: {
                stages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: { const: "FOOT" },
                    }
                  }
                }
              }
            }
          }
        }
      },
      then: {
        properties: {
          paths: {
            type: "array",
            items: {
              type: "object",
              properties: {
                stages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      details: {
                        $ref: "#/definitions/FOOTStageDetails",
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
    },
    {
      if: {
        properties: {
          paths: {
            type: "array",
            items: {
              type: "object",
              properties: {
                stages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: { const: "TBM" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      then: {
        properties: {
          paths: {
            type: "array",
            items: {
              type: "object",
              properties: {
                stages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      details: {
                        $ref: "#/definitions/TBMStageDetails",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      if: {
        properties: {
          paths: {
            type: "array",
            items: {
              type: "object",
              properties: {
                stages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: { const: "SNCF" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      then: {
        properties: {
          paths: {
            type: "array",
            items: {
              type: "object",
              properties: {
                stages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      details: {
                        $ref: "#/definitions/SNCFStageDetails",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  ],
} as const;

export const itineraryResultSchema = schema(itineraryResultRawSchema);

export type ItineraryResult = FromSchema<typeof itineraryResultRawSchema, { parseIfThenElseKeywords: true }>;

export type withFOOT = ItineraryResult & { paths: { stages: { type: "FOOT" }[] }[] };
export type withTBM = ItineraryResult & { paths: { stages: { type: "TBM" }[] }[] };
export type withSNCF = ItineraryResult & { paths: { stages: { type: "SNCF" }[] }[] };

// Real mess
const a: withFOOT = {} as any;
const b: withTBM = {} as any;
const c: withSNCF = {} as any;

// Expected

export type Stage_type = "FOOT" | "TBM" | "SNCF";

type ItineraryStageResult<S extends Stage_type> = S extends "FOOT"
  ? {
      type: S;
      details: {
        distance: number;
      };
    }
  : S extends "TBM"
  ? {
      type: S;
      details: {
        type: "BUS" | "TRAM" | "BATEAU";
        line: string;
        direction: string;
        departure: number;
      };
    }
  : S extends "SNCF"
  ? {
      type: S;
      details: {
        type: "TRAIN";
        line: string;
        direction: string;
        departure: number;
      };
    }
  : never;

export type HackedItineraryResult = {
  code: number;
  message: string;
  lastActualization: number;
  paths: {
    departure: number;
    id: string;
    totalDuration: number;
    totalDistance: number;
    from: string;
    stages: (ItineraryStageResult<Stage_type> & {
      to: string;
      duration: number;
    })[];
  }[];
};

// Contains correct types, without unwanted union
const hacked: HackedItineraryResult = {} as any;
if (hacked.paths[0].stages[0].type === "FOOT") hacked.paths[0].stages[0].details;
if (hacked.paths[0].stages[0].type === "TBM") hacked.paths[0].stages[0].details;
if (hacked.paths[0].stages[0].type === "SNCF") hacked.paths[0].stages[0].details;
