import type { StructureResolver } from "sanity/structure";

const hiddenDocumentTypes = ["event", "record"];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("IGNAI 内容后台")
    .items([
      S.documentTypeListItem("event").title("近期活动"),
      S.documentTypeListItem("record").title("现场记录"),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId();
        return !id || !hiddenDocumentTypes.includes(id);
      }),
    ]);
