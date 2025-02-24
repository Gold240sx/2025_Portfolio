export function truncate(str: string, length: number) {
  const div = document.createElement("div");
  div.innerHTML = str;
  const text = div.textContent || div.innerText || "";
  return text.length > length ? text.substring(0, length) : text;
}
