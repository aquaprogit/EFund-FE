import { PagedRequest } from "./base/PagedRequest";

export interface SearchUsersRequest extends PagedRequest {
    query?: string;
}