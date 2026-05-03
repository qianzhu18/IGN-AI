import { defineField, defineType } from "sanity";

const typeOptions = [
  { title: "活动复盘", value: "recap" },
  { title: "成员故事", value: "story" },
  { title: "工具清单", value: "resource" },
  { title: "项目记录", value: "project" },
];

export const record = defineType({
  name: "record",
  title: "现场记录",
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
      title: "记录标题",
      type: "string",
      group: "core",
      validation: (Rule) => Rule.required().max(52),
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
      name: "type",
      title: "记录类型",
      type: "string",
      initialValue: "recap",
      options: { list: typeOptions, layout: "radio" },
      group: "core",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dateText",
      title: "时间文案",
      type: "string",
      description: "例如：2026 / 04、持续更新、Draft",
      group: "core",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "地点",
      type: "string",
      group: "core",
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
      group: "media",
    }),
    defineField({
      name: "excerpt",
      title: "摘要",
      type: "text",
      rows: 3,
      group: "core",
      validation: (Rule) => Rule.required().max(140),
    }),
    defineField({
      name: "outcomes",
      title: "产出标签",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "detail",
      validation: (Rule) => Rule.max(6),
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
      name: "content",
      title: "详情正文",
      type: "array",
      of: [{ type: "sectionBlock" }],
      group: "detail",
    }),
    defineField({
      name: "links",
      title: "相关链接",
      type: "array",
      of: [{ type: "link" }],
      group: "media",
    }),
    defineField({
      name: "sortOrder",
      title: "排序",
      type: "number",
      initialValue: 100,
      group: "publish",
      description: "数字越小越靠前。首页现场记录会优先显示靠前的 3 条。",
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
      type: "type",
      dateText: "dateText",
      location: "location",
      media: "coverImage",
    },
    prepare({ title, type, dateText, location, media }) {
      const typeLabel =
        typeOptions.find((option) => option.value === type)?.title || type;

      return {
        title,
        subtitle: [typeLabel, dateText, location].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
