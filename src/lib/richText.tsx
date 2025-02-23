import escapeHTML from "escape-html";

export const serializeRichText = (content: any): string => {
  if (!content) return "";

  return content.root.children
    .map((node: any) => {
      if (node.type === "paragraph") {
        return node.children
          .map((child: any) => escapeHTML(child.text))
          .join("");
      }
      return "";
    })
    .join("<br/>");
};
