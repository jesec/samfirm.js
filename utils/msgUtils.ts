import crypto from "crypto";
import { j2xParser } from "fast-xml-parser";

import type { FUSMsg } from "../types/FUSMsg";

const parser = new j2xParser({});

const getLogicCheck = (input: string, nonce: string) => {
  let out = "";

  for (let i = 0; i < nonce.length; i++) {
    const char: number = nonce.charCodeAt(i);
    out += input[char & 0xf];
  }

  return out;
};

export const getBinaryInformMsg = (
  version: string,
  region: string,
  model: string,
  nonce: string
): string => {
  const msg: FUSMsg = {
    FUSMsg: {
      FUSHdr: {
        ProtoVer: "1.0",
      },
      FUSBody: {
        Put: {
          ACCESS_MODE: {
            Data: 2,
          },
          BINARY_NATURE: {
            Data: 1,
          },
          CLIENT_PRODUCT: {
            Data: "Smart Switch",
          },
          DEVICE_FW_VERSION: {
            Data: version,
          },
          DEVICE_LOCAL_CODE: {
            Data: region,
          },
          DEVICE_MODEL_NAME: {
            Data: model,
          },
          LOGIC_CHECK: {
            Data: getLogicCheck(version, nonce),
          },
        },
      },
    },
  };

  return parser.parse(msg);
};

export const getBinaryInitMsg = (filename: string, nonce: string): string => {
  const msg: FUSMsg = {
    FUSMsg: {
      FUSHdr: {
        ProtoVer: "1.0",
      },
      FUSBody: {
        Put: {
          BINARY_FILE_NAME: {
            Data: filename,
          },
          LOGIC_CHECK: {
            Data: getLogicCheck(filename.split(".")[0].slice(-16), nonce),
          },
        },
      },
    },
  };

  return parser.parse(msg);
};

export const getDecryptionKey = (
  version: string,
  logicalValue: string
): Buffer => {
  return crypto
    .createHash("md5")
    .update(getLogicCheck(version, logicalValue))
    .digest();
};
