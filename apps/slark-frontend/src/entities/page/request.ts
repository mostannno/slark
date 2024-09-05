import { sendRequest, jsonPost } from "shared/fetch";
import { PageEntity } from "./type";

export async function getAllPages() {
  const result = await sendRequest<PageEntity[]>("/page/queryAll");
  return "error" in result ? [] : result;
}

export async function addPage() {
  const result = await jsonPost<PageEntity>("/page/create");
  return "error" in result ? null : result;
}

export async function updatePage(
  pages: ({ id: string } & Partial<Omit<PageEntity, "id">>)[]
) {
  const result = await jsonPost<PageEntity>("/page/update", pages);
  if (result && "error" in result ) {
    throw 'update page failed';
  }
}

export async function deletePage(id: string) {
  return jsonPost("/page/delete", { id });
}
