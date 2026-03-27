import type { ShareData } from "@/types/game";

const SHARE_DATA_BYTE_LENGTH = 2;
const SHARE_CHOICES_LENGTH = 10;
const BASE64_URL_PATTERN = /^[A-Za-z0-9_-]+$/;

function isValidShareData(data: ShareData): boolean {
  if (data.choices.length < 1 || data.choices.length > SHARE_CHOICES_LENGTH) {
    return false;
  }

  if (!data.choices.every((choice) => choice === "A" || choice === "B")) {
    return false;
  }

  if (data.gender !== "male" && data.gender !== "female") {
    return false;
  }

  if (typeof data.isBankrupt !== "boolean") {
    return false;
  }

  if (data.isBankrupt) {
    return (
      Number.isInteger(data.bankruptNode) &&
      data.bankruptNode !== null &&
      data.bankruptNode >= 1 &&
      data.bankruptNode <= 10 &&
      data.choices.length === data.bankruptNode
    );
  }

  return data.bankruptNode === null && data.choices.length === SHARE_CHOICES_LENGTH;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(code: string): Uint8Array | null {
  if (!BASE64_URL_PATTERN.test(code)) {
    return null;
  }

  try {
    const normalized = code.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
    const binary = atob(normalized + padding);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  } catch {
    return null;
  }
}

export function encodeShareData(data: ShareData): string {
  if (!isValidShareData(data)) {
    return "";
  }

  let packed = 0;

  data.choices.forEach((choice, index) => {
    if (choice === "B") {
      packed |= 1 << (15 - index);
    }
  });

  if (data.gender === "male") {
    packed |= 1 << 5;
  }

  if (data.isBankrupt) {
    packed |= 1 << 4;
  }

  packed |= data.bankruptNode ?? 0;

  return bytesToBase64Url(new Uint8Array([packed >> 8, packed & 0xff]));
}

export function decodeShareData(code: string): ShareData | null {
  const bytes = base64UrlToBytes(code);

  if (!bytes || bytes.length !== SHARE_DATA_BYTE_LENGTH) {
    return null;
  }

  const packed = (bytes[0] << 8) | bytes[1];
  const choices: ShareData["choices"] = [];

  for (let index = 0; index < SHARE_CHOICES_LENGTH; index += 1) {
    const bit = (packed >> (15 - index)) & 1;
    choices.push(bit === 1 ? "B" : "A");
  }

  const gender = ((packed >> 5) & 1) === 1 ? "male" : "female";
  const isBankrupt = ((packed >> 4) & 1) === 1;
  const rawBankruptNode = packed & 0x0f;
  const bankruptNode = rawBankruptNode === 0 ? null : rawBankruptNode;

  const decoded: ShareData = {
    choices: isBankrupt ? choices.slice(0, bankruptNode ?? 0) : choices,
    gender,
    isBankrupt,
    bankruptNode,
  };

  return isValidShareData(decoded) ? decoded : null;
}
