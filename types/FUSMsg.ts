export interface FUSMsg {
  FUSMsg: {
    FUSHdr: {
      ProtoVer: string;
    };
    FUSBody: {
      Put: {
        ACCESS_MODE?: {
          Data: number;
        };
        BINARY_FILE_NAME?: {
          Data: string;
        };
        BINARY_NATURE?: {
          Data: number;
        };
        CLIENT_PRODUCT?: {
          Data: string;
        };
        DEVICE_FW_VERSION?: {
          Data: string;
        };
        DEVICE_LOCAL_CODE?: {
          Data: string;
        };
        DEVICE_MODEL_NAME?: {
          Data: string;
        };
        LOGIC_CHECK?: {
          Data: string;
        };
      };
    };
  };
}
