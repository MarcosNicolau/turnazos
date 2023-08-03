import { Pagination } from "types/pagination";

export const getOffset = ({ page, size }: Pagination) => (page - 1) * size;
