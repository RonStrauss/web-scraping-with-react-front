import ScrappedContent from "./ScrappedContent";

export default interface ModalContent {
	vidoza?: { poster: string; video: string };
    streamtape?:{img:string;url:string};
    pageContent?:ScrappedContent
}
