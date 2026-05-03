import { defineField, defineType } from "sanity";

export const link = defineType({
  name: "link",
  title: "相关链接",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "链接名称",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "链接地址",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "href",
    },
  },
});
