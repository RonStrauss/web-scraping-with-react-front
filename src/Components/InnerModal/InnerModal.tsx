import { Dispatch, SetStateAction, useState } from 'react';
import { API } from '../../App';
import FullscreenModalType from '../../Types/FullscreenModal';
import ModalContent from '../../Types/ModalContent';
import './InnerModal.scss';
import Tag from './Tag/Tag';

type Props = {
	modalContent: ModalContent;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
	setFullscreenModalSource: Dispatch<SetStateAction<FullscreenModalType | undefined>>;
	setIsFullscreenModalOpen: Dispatch<SetStateAction<boolean>>;
};
const tags = ['None', 'Cum', 'No Cum'] as const;

export type Tags = typeof tags;

export type TagType = (typeof tags)[number];

const InnerModal = ({ setIsModalOpen, modalContent, setFullscreenModalSource, setIsFullscreenModalOpen }: Props) => {
	const [videoTag, setVideoTag] = useState<TagType>(tags[0]);

	const openModalWithImage = (element: HTMLImageElement) => {
		const { top, left, width, height } = element.getBoundingClientRect();
		setFullscreenModalSource({
			img: element.src,
			width,
			height,
			left,
			top,
			objectFit: element.classList.contains('InnerModal-left-bottom') ? 'contain' : 'cover',
		});
		setIsFullscreenModalOpen(true);
	};

	const getClassName = () => {
		let str = '';

		if (modalContent.vidoza?.poster) {
			str = 'InnerModal-left-top-half-width';
		}

		if (!modalContent.streamtape?.img) {
			str += 'contain';
		}
		return str;
	};

	const downloadWithServer = async (url: string, filename: string = 'video.mp4', site: string, tag: TagType): Promise<void> => {
    const addTag = tag !== tags[0] ? '['+tag+']' : ''
		const res = await fetch(
			`${API}/download-from-this-link?${new URLSearchParams({
				url,
				filename: `${filename} ${addTag}.mp4`,
				site,
			})}`,
		);
	};

	return (
		<div
			className='InnerModal'
			onContextMenu={(e) => {
				if (!(e.target instanceof HTMLAnchorElement)) {
					e.preventDefault();
					setIsModalOpen(false);
				}
			}}
		>
			<div className='InnerModal-title' onContextMenu={e => e.stopPropagation()}>{modalContent.pageContent?.title}</div>
			<div className='InnerModal-body'>
				<div className='InnerModal-left'>
					<div
						className='InnerModal-left-top'
						style={{
							maxHeight: modalContent.streamtape?.img ? '46%' : 'calc(100% - 1rem)',
							height: modalContent.streamtape?.img ? 'initial' : '100%',
						}}
					>
						<img
							src={modalContent.pageContent?.img}
							className={getClassName()}
							onClick={(e) => {
								if (e.target instanceof HTMLImageElement) openModalWithImage(e.target);
							}}
						/>
						{modalContent.vidoza ? (
							<img
								src={modalContent.vidoza?.poster}
								onClick={(e) => {
									if (e.target instanceof HTMLImageElement) openModalWithImage(e.target);
								}}
								className='InnerModal-left-top-half-width'
							/>
						) : null}
					</div>
					{modalContent.streamtape?.img ? (
						<img
							className='InnerModal-left-bottom'
							onClick={(e) => {
								if (e.target instanceof HTMLImageElement) openModalWithImage(e.target);
							}}
							src={modalContent.streamtape?.img}
						/>
					) : null}
				</div>
				<div className='InnerModal-right'>
					<div className='InnerModal-right-field'>
						<a href={modalContent.pageContent?.link} target='_blank'>
							Original Page
						</a>
					</div>
					{modalContent.streamtape ? (
						<div className='InnerModal-right-field'>
							<div className='streamtape'></div>
							<button
								onClick={() => {
									downloadWithServer(modalContent.streamtape?.url || 'typescript is silly', modalContent.pageContent?.title, 'streamtape', videoTag);
								}}
							>
								Download Streamtape Video To Server
							</button>
							<form className='InnerModal-right-field-form'>
								<p>Choose a tag:</p>
								<div className='InnerModal-right-field-form-tag'>
									{tags.map((tag) => (
										<Tag {...{ tag, tags, setVideoTag, videoTag }} />
									))}
								</div>
							</form>
							<a href={`${API}/scrape-streamtape?url=${modalContent.streamtape.url}`} target='_blank'>
								Open Video In New Tab
							</a>
						</div>
					) : null}
					{modalContent.vidoza ? (
						<div className='InnerModal-right-field'>
							<a href={modalContent.vidoza.video} target='_blank'>
								Vidoza Video
							</a>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default InnerModal;
