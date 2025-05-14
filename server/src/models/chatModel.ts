export interface chat {
  c_id: string;
  c_name: string;
  created_at: string;
  type: "group" | "private";
  participants_id: string[];
}
