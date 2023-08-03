import { Pagination } from "type/pagination";

export const getOffset = ({ page, size }: Pagination) => (page - 1) * size;
