export type ListNode = {
  id: string;
  child?: string[];
  next?: string;
}

export interface ListEntity {
  id: string;
  real_id?: string;
  title: string;
  // description?: string;
  // due_date?: number;
  is_root?: boolean;
  next: string | null;
  child: string | null;
  pageId: string;

  // for fe render
  parent: string;
}
