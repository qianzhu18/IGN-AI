import { defineField, defineType } from "sanity";

const statusOptions = [
  { title: "开放报名", value: "open" },
  { title: "筹备中", value: "planning" },
  { title: "已满员", value: "closed" },
  { title: "已结束", value: "finished" },
];

const formatOptions = [
  { title: "线下", value: "offline" },
  { title: "线上", value: "online" },
  { title: "线上 + 线下", value: "hybrid" },
];

export const event = defineType({
  name: "event",
  title: "活动",
  type: "document",
  groups: [
    { name: "core", title: "基础信息", default: true },
    { name: "media", title: "封面与链接" },
    { name: "detail", title: "详情内容" },
    { name: "publish", title: "发布控制" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "活动标题",
      type: "string",
      group: "core",
      validation: (Rule) => Rule.required().max(48),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      group: "publish",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "副标题",
      type: "string",
      group: "core",
      validation: (Rule) => Rule.max(64),
    }),
    defineField({
      name: "status",
      title: "活动状态",
      type: "string",
      initialValue: "planning",
      options: { list: statusOptions, layout: "radio" },
      group: "core",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dateText",
      title: "时间文案",
      type: "string",
      description: "例如：2026 / 05 下旬、筹备中、规划中",
      group: "core",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "地点",
      type: "string",
      group: "core",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "format",
      title: "活动形式",
      type: "string",
      initialValue: "offline",
      options: { list: formatOptions, layout: "radio" },
      group: "core",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "封面图",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "图片描述",
          type: "string",
          description: "用于无障碍描述和后续 SEO。",
        }),
      ],
    }),
    defineField({
      name: "coverUrl",
      title: "封面图 URL 备用",
      type: "url",
      description: "没有上传图片时，可以先填 public 或远程图片 URL。",
      group: "media",
    }),
    defineField({
      name: "excerpt",
      title: "一句话简介",
      type: "text",
      rows: 3,
      group: "core",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "tags",
      title: "标签",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "core",
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "registrationUrl",
      title: "报名 / 加入链接",
      type: "string",
      initialValue: "/join",
      group: "media",
      description: "可以填站内 /join，也可以填飞书、问卷星、Notion Form 等外部链接。",
    }),
    defineField({
      name: "registrationQrImage",
      title: "报名二维码",
      type: "image",
      group: "media",
      options: { hotspot: true },
      description: "如果这场活动更适合扫码报名，可以在详情页展示这张二维码。",
      fields: [
        defineField({
          name: "alt",
          title: "二维码描述",
          type: "string",
          description: "例如：活动报名二维码。",
        }),
      ],
    }),
    defineField({
      name: "audience",
      title: "适合谁参加",
      type: "array",
      of: [{ type: "string" }],
      group: "detail",
    }),
    defineField({
      name: "agenda",
      title: "活动流程",
      type: "array",
      of: [{ type: "string" }],
      group: "detail",
    }),
    defineField({
      name: "hosts",
      title: "主理人 / 嘉宾",
      type: "array",
      of: [{ type: "string" }],
      group: "detail",
    }),
    defineField({
      name: "notes",
      title: "活动说明",
      type: "array",
      of: [{ type: "string" }],
      group: "detail",
    }),
    defineField({
      name: "content",
      title: "详情正文",
      type: "array",
      of: [{ type: "sectionBlock" }],
      group: "detail",
    }),
    defineField({
      name: "sortOrder",
      title: "排序",
      type: "number",
      initialValue: 100,
      group: "publish",
      description: "数字越小越靠前。首页近期活动会优先显示靠前的 3 个未结束活动。",
    }),
  ],
  orderings: [
    {
      title: "排序优先",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      dateText: "dateText",
      location: "location",
      media: "coverImage",
    },
    prepare({ title, status, dateText, location, media }) {
      const statusLabel =
        statusOptions.find((option) => option.value === status)?.title || status;

      return {
        title,
        subtitle: [statusLabel, dateText, location].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
