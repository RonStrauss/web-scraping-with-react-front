import { Dispatch, SetStateAction } from 'react';
import ScrappedContent from '../../Types/ScrappedContent';
import './Top.css';

type Props = {
	count: number;
	setCount: Dispatch<SetStateAction<number>>;
	url: string;
	setUrl: Dispatch<SetStateAction<string>>;
	toKeep: number;
	setToKeep: Dispatch<SetStateAction<number>>;
	fetchThisUrl: (url: string) => Promise<void>;
};

export const Top = ({ url, setUrl, fetchThisUrl, count, setCount,toKeep, setToKeep }: Props) => {
	return (
		<div className='Top'>
			<h1>Scrape A Site</h1>
			<div className='Top-form-field'>
				<input type='text' id='URLInput' placeholder='Enter Page Url Here' autoComplete='true' value={url} onChange={(e) => setUrl(e.target.value)} />
				<input type='number' id='PageInput' placeholder='Enter Page Number To Start At' value={count} onChange={(e) => setCount(+e.target.value)} />
				<button onClick={() => fetchThisUrl(url)}>Scrape That Shit</button>
				<select
					name='toKeep'
					id='toKeep'
					value={toKeep}
					onChange={(e) => {
						setToKeep(+(e.target as HTMLSelectElement).value);
					}}
				>
					{new Array(5).fill(1).map((v, i) => (
						<option value={(1 + +i) * 10} key={i}>
							{(1 + +i) * 10}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};
