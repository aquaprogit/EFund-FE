import API from "../repository/api";
export type AddReportBody = {
    title: string,
    description: string,
    fundraisingId: string
}
class FundraisingsReports {
    static async addReport(body: AddReportBody) {
        try {
            return await API.post('/fundraising-reports', body)
        }
        catch (e) {
            console.error(e)
        }
    }
    static async addAttachments(id: string, body: FormData) {
        try {
            return await API.post(`/fundraising-reports/${id}/attachments`, body)
        }
        catch (e) {
            console.error(e)
        }
    }
    static async getReport(id: string) {
        try {
            return await API.get(`/fundraising-reports/${id}`)
        }
        catch (e) {
            console.error(e)

        }
    }

    static async deleteReport(id: string) {
        try {
            return await API.delete(`/fundraising-reports/${id}`)
        }
        catch (e) {
            console.error(e)

        }
    }

    static async deleteAttachment(reportId: string, id: string) {
        try {
            return await API.delete(`/fundraising-reports/${reportId}/attachments/${id}`)
        }
        catch (e) {
            console.error(e)
        }
    }
}

export default FundraisingsReports