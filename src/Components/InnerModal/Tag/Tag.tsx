import React, { Dispatch, SetStateAction } from 'react';
import { TagType, Tags } from '../InnerModal';

type Props = {
	tag: TagType;
	tags: Tags;
	videoTag: TagType;
	setVideoTag: Dispatch<SetStateAction<TagType>>;
};

const Tag = ({ tag, videoTag, setVideoTag, tags }: Props) => {
	return (
		<div className='InnerModal-right-field-form-tag'>
			<label htmlFor={tag}>{tag}</label>
			<input
				type='radio'
				onChange={(e) => (tags.includes(e.target.value as TagType) ? setVideoTag(e.target.value as TagType) : null)}
				name={tag}
				id={tag}
				value={tag}
				checked={tag === videoTag}
			/>
		</div>
	);
};

export default Tag;
