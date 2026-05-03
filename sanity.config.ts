"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1wxr3e75";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19";

export default defineConfig({
  name: "ignai",
  title: "IGNAI 内容后台",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({
      defaultApiVersion: apiVersion,
    }),
  ],
});
