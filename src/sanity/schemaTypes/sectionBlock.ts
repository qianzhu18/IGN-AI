import { defineField, defineType } from "sanity";

export const sectionBlock = defineType({
  name: "sectionBlock",
  title: "正文段落",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "小标题",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "正文",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "body",
    },
  },
});
