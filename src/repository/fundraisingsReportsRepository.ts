import { api } from "../services/api/api";

export type AddReportBody = {
    title: string,
    description: string,
    fundraisingId: string
}

export const fundraisingsReportsRepository = {
    addReport: async (body: AddReportBody) => {
        try {
            return await api.post('/fundraising-reports', body)
        }
        catch (e) {
            console.error(e)
        }
    },
    addAttachments: async (id: string, body: FormData) => {
        try {
            return await api.post(`/fundraising-reports/${id}/attachments`, body)
        }
        catch (e) {
            console.error(e)
        }
    },
    getReport: async (id: string) => {
        try {
            return await api.get(`/fundraising-reports/${id}`)
        }
        catch (e) {
            console.error(e)

        }
    },
    deleteReport: async (id: string) => {
        try {
            return await api.delete(`/fundraising-reports/${id}`)
        }
        catch (e) {
            console.error(e)

        }
    },
    deleteAttachment: async (reportId: string, id: string) => {
        try {
            return await api.delete(`/fundraising-reports/${reportId}/attachments/${id}`)
        }
        catch (e) {
            console.error(e)
        }
    }
}