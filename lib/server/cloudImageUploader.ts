import { createHmac, createHash, randomUUID } from "crypto";
import path from "path";
import sharp from "sharp";

type CloudImageConfig = {
  endpoint: string;
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  publicBaseUrl: string;
  pathPrefix: string;
  urlStyle: "path" | "virtual-hosted";
};

type UploadMemberAvatarInput = {
  dataUrl: string;
  fileName?: string;
  memberId?: string;
  memberSlug?: string;
};

export type CloudImageUploadResult = {
  key: string;
  url: string;
  size: number;
  contentType: string;
};

export type CloudImageListItem = {
  key: string;
  url: string;
  size: number;
  lastModified: string;
};

const MAX_INPUT_BYTES = 4 * 1024 * 1024;
const OUTPUT_CONTENT_TYPE = "image/webp";

function readEnv(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return "";
}

function getCloudImageConfig(): CloudImageConfig | null {
  const endpoint = readEnv(
    "CLOUD_IMAGE_ENDPOINT",
    "OPUBLISH_R2_ENDPOINT",
    "R2_ENDPOINT",
    "OSS_ENDPOINT",
    "S3_ENDPOINT",
  );
  const bucket = readEnv(
    "CLOUD_IMAGE_BUCKET",
    "OPUBLISH_R2_BUCKET",
    "R2_BUCKET",
    "OSS_BUCKET",
    "S3_BUCKET",
  );
  const accessKeyId = readEnv(
    "CLOUD_IMAGE_ACCESS_KEY_ID",
    "R2_ACCESS_KEY_ID",
    "OSS_ACCESS_KEY_ID",
    "S3_ACCESS_KEY_ID",
    "AWS_ACCESS_KEY_ID",
  );
  const secretAccessKey = readEnv(
    "CLOUD_IMAGE_SECRET_ACCESS_KEY",
    "R2_SECRET_ACCESS_KEY",
    "OSS_SECRET_ACCESS_KEY",
    "S3_SECRET_ACCESS_KEY",
    "AWS_SECRET_ACCESS_KEY",
  );

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    return null;
  }

  const style = readEnv("CLOUD_IMAGE_URL_STYLE", "R2_URL_STYLE", "OSS_URL_STYLE", "S3_URL_STYLE");
  const endpointHost = normalizeEndpoint(endpoint).hostname.toLowerCase();
  const urlStyle =
    style === "path" || style === "virtual-hosted"
      ? style
      : endpointHost.includes("aliyuncs.com")
        ? "virtual-hosted"
        : "path";

  return {
    endpoint,
    bucket,
    region: readEnv("CLOUD_IMAGE_REGION", "OSS_REGION", "S3_REGION") || "auto",
    accessKeyId,
    secretAccessKey,
    publicBaseUrl: readEnv(
      "CLOUD_IMAGE_PUBLIC_BASE_URL",
      "OPUBLISH_R2_PUBLIC_BASE_URL",
      "R2_PUBLIC_BASE_URL",
      "OSS_PUBLIC_BASE_URL",
    ),
    pathPrefix:
      readEnv("CLOUD_IMAGE_PATH_PREFIX", "OPUBLISH_R2_PREFIX", "R2_PATH_PREFIX", "OSS_PATH_PREFIX") ||
      "ignai",
    urlStyle,
  };
}

export function isCloudImageUploadConfigured() {
  return Boolean(getCloudImageConfig());
}

function hmac(key: Buffer | string, value: string) {
  return createHmac("sha256", key).update(value).digest();
}

function sha256Hex(value: Buffer | string) {
  return createHash("sha256").update(value).digest("hex");
}

function encodePathname(pathname: string) {
  return pathname
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")
    .replace(/%2F/g, "/");
}

function encodeQueryValue(value: string) {
  return encodeURIComponent(value)
    .replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
}

function buildCanonicalQueryString(searchParams: URLSearchParams) {
  const entries: Array<[string, string]> = [];
  searchParams.forEach((value, key) => {
    entries.push([key, value]);
  });

  return entries
    .sort(([leftKey, leftValue], [rightKey, rightValue]) => {
      if (leftKey === rightKey) return leftValue.localeCompare(rightValue);
      return leftKey.localeCompare(rightKey);
    })
    .map(([key, value]) => `${encodeQueryValue(key)}=${encodeQueryValue(value)}`)
    .join("&");
}

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}

function normalizeEndpoint(rawEndpoint: string) {
  const withProtocol = /^https?:\/\//i.test(rawEndpoint)
    ? rawEndpoint
    : `https://${rawEndpoint}`;
  return new URL(withProtocol);
}

function buildObjectUrl(config: CloudImageConfig, key: string) {
  const endpoint = normalizeEndpoint(config.endpoint);
  const endpointPath = trimSlashes(endpoint.pathname);
  const keyPath = trimSlashes(key);

  if (config.urlStyle === "path") {
    const pathname = [endpointPath, config.bucket, keyPath].filter(Boolean).join("/");
    return new URL(`/${pathname}`, endpoint.origin);
  }

  const host = `${config.bucket}.${endpoint.host}`;
  const pathname = [endpointPath, keyPath].filter(Boolean).join("/");
  return new URL(`${endpoint.protocol}//${host}/${pathname}`);
}

function buildPublicUrl(config: CloudImageConfig, key: string) {
  if (!config.publicBaseUrl) {
    return buildObjectUrl(config, key).toString();
  }

  const base = config.publicBaseUrl.endsWith("/")
    ? config.publicBaseUrl
    : `${config.publicBaseUrl}/`;
  return `${base}${encodePathname(trimSlashes(key))}`;
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;,]+);base64,(.+)$/);
  if (!match?.[1] || !match?.[2]) {
    throw new Error("INVALID_DATA_URL");
  }

  if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(match[1])) {
    throw new Error("UNSUPPORTED_IMAGE_TYPE");
  }

  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length > MAX_INPUT_BYTES) {
    throw new Error("IMAGE_TOO_LARGE");
  }

  return buffer;
}

async function normalizeAvatarImage(buffer: Buffer) {
  return sharp(buffer, { failOn: "none" })
    .rotate()
    .resize(512, 512, { fit: "cover" })
    .webp({ quality: 86 })
    .toBuffer();
}

function sanitizePathSegment(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function buildMemberAvatarPrefix(config: CloudImageConfig, memberId?: string, memberSlug?: string) {
  const memberFolder = sanitizePathSegment(memberSlug) || sanitizePathSegment(memberId) || "unassigned";
  return [trimSlashes(config.pathPrefix), "members", "avatars", memberFolder]
    .filter(Boolean)
    .join("/");
}

function buildObjectKey(
  config: CloudImageConfig,
  fileName = "avatar",
  memberId?: string,
  memberSlug?: string,
) {
  const ext = ".webp";
  const baseName = path
    .basename(fileName, path.extname(fileName))
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const date = new Date();
  const yyyy = String(date.getUTCFullYear());
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const name = baseName || "avatar";
  return [
    buildMemberAvatarPrefix(config, memberId, memberSlug),
    yyyy,
    mm,
    `${name}-${randomUUID()}${ext}`,
  ]
    .filter(Boolean)
    .join("/");
}

function buildAuthHeaders({
  config,
  url,
  method,
  body,
  contentType,
}: {
  config: CloudImageConfig;
  url: URL;
  method: "GET" | "PUT";
  body: Buffer | string;
  contentType?: string;
}) {
  const now = new Date();
  const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, "");
  const amzDate = `${dateStamp}T${now.toISOString().slice(11, 19).replace(/:/g, "")}Z`;
  const payloadHash = sha256Hex(body);
  const service = "s3";
  const credentialScope = `${dateStamp}/${config.region}/${service}/aws4_request`;

  const headers: Record<string, string> = {
    host: url.host,
    "x-amz-content-sha256": payloadHash,
    "x-amz-date": amzDate,
  };
  if (contentType) {
    headers["content-type"] = contentType;
  }
  const signedHeaders = Object.keys(headers).sort().join(";");
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map((key) => `${key}:${headers[key]}\n`)
    .join("");
  const canonicalRequest = [
    method,
    encodePathname(url.pathname),
    buildCanonicalQueryString(url.searchParams),
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = hmac(
    hmac(hmac(hmac(`AWS4${config.secretAccessKey}`, dateStamp), config.region), service),
    "aws4_request",
  );
  const signature = createHmac("sha256", signingKey).update(stringToSign).digest("hex");

  return {
    ...headers,
    authorization: `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

function decodeXmlEntity(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function readXmlTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return match?.[1] ? decodeXmlEntity(match[1]) : "";
}

function parseListBucketResult(xml: string, config: CloudImageConfig): CloudImageListItem[] {
  const contents = xml.match(/<Contents>[\s\S]*?<\/Contents>/g) || [];

  return contents
    .map((block) => {
      const key = readXmlTag(block, "Key");
      const size = Number(readXmlTag(block, "Size")) || 0;
      const lastModified = readXmlTag(block, "LastModified");
      return key
        ? {
            key,
            url: buildPublicUrl(config, key),
            size,
            lastModified,
          }
        : null;
    })
    .filter((item): item is CloudImageListItem => Boolean(item))
    .sort((left, right) => right.lastModified.localeCompare(left.lastModified));
}

export async function uploadMemberAvatarFromDataUrl({
  dataUrl,
  fileName,
  memberId,
  memberSlug,
}: UploadMemberAvatarInput): Promise<CloudImageUploadResult> {
  const config = getCloudImageConfig();
  if (!config) {
    throw new Error("CLOUD_IMAGE_NOT_CONFIGURED");
  }

  const original = parseDataUrl(dataUrl);
  const image = await normalizeAvatarImage(original);
  const key = buildObjectKey(config, fileName, memberId, memberSlug);
  const uploadUrl = buildObjectUrl(config, key);
  const headers = buildAuthHeaders({
    config,
    url: uploadUrl,
    method: "PUT",
    body: image,
    contentType: OUTPUT_CONTENT_TYPE,
  });

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers,
    body: image,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CLOUD_IMAGE_UPLOAD_FAILED:${response.status}:${text.slice(0, 300)}`);
  }

  return {
    key,
    url: buildPublicUrl(config, key),
    size: image.length,
    contentType: OUTPUT_CONTENT_TYPE,
  };
}

export async function listMemberAvatars({
  memberId,
  memberSlug,
  limit = 300,
}: {
  memberId?: string;
  memberSlug?: string;
  limit?: number;
}): Promise<CloudImageListItem[]> {
  const config = getCloudImageConfig();
  if (!config) {
    throw new Error("CLOUD_IMAGE_NOT_CONFIGURED");
  }

  const prefix = `${buildMemberAvatarPrefix(config, memberId, memberSlug)}/`;
  const url = buildObjectUrl(config, "");
  url.searchParams.set("list-type", "2");
  url.searchParams.set("prefix", prefix);
  url.searchParams.set("max-keys", String(Math.min(Math.max(limit, 1), 1000)));

  const headers = buildAuthHeaders({
    config,
    url,
    method: "GET",
    body: "",
  });

  const response = await fetch(url, { method: "GET", headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CLOUD_IMAGE_LIST_FAILED:${response.status}:${text.slice(0, 300)}`);
  }

  return parseListBucketResult(await response.text(), config).slice(0, limit);
}
