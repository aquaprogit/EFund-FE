import Attachment from "./Attachment";

export default interface Report {
    id: string;
    title: string;
    description: string;
    attachments: Attachment[];
}