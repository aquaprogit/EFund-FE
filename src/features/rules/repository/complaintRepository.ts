import api from "../../../shared/api/api";
import { ApiResponse } from "../../../shared/models/api/pagination/ApiResponse";
import { Complaint } from "../models/Complaint";
import { ComplaintAcceptRequest, ComplaintRejectRequest, ComplaintRequestChangesRequest } from "../models/ComplaintAcceptRequest";
import { ComplaintStatus } from "../models/ComplaintStatus";
import { CreateComplaintRequest } from "../models/CreateComplaintRequest";
import { urls } from "./urls";

export const complaintRepository = {
    createComplaint: async (request: CreateComplaintRequest): Promise<ApiResponse<Complaint>> => {
        return await api.post<CreateComplaintRequest, Complaint>(urls.createComplaint, request);
    },

    getComplaints: async (status: ComplaintStatus): Promise<ApiResponse<Complaint[]>> => {
        return await api.get<Complaint[]>(urls.getComplaints, {}, { status });
    },

    getComplaint: async (id: string): Promise<ApiResponse<Complaint>> => {
        return await api.get<Complaint>(urls.getComplaint(id));
    },

    rejectComplaint: async (request: ComplaintRejectRequest): Promise<ApiResponse<{}>> => {
        return await api.post<ComplaintRejectRequest, {}>(urls.rejectComplaint, request);
    },

    acceptComplaint: async (request: ComplaintAcceptRequest): Promise<ApiResponse<{}>> => {
        return await api.post<ComplaintAcceptRequest, {}>(urls.acceptComplaint, request);
    },

    requestChanges: async (request: ComplaintRequestChangesRequest): Promise<ApiResponse<{}>> => {
        return await api.post<ComplaintRequestChangesRequest, {}>(urls.requestChanges, request);
    }
};
