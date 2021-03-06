import { useState, useEffect, useRef } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { CSVLink } from 'react-csv';
import './App.css';
import ErrorPopup from './ErrorPopup';

const alertSound = require('./alert.mp3');

const initForm = {
	binCode: '',
	skuCode: '',
	scanItem: '',
};

const dummyCsvFields = {
	vendor_code: 'VCDAM22',
	purchase_order_code: 'DA-20-21/135..',
	qty: '1',
	cartoncode: 'C001519-1',
};

const csvHeaders = [
	{ label: 'Sku Code', key: 'sku_code' },
	{ label: 'Sku Size', key: 'size' },
	{ label: 'Color', key: 'color' },
	{ label: 'Item Code', key: 'barcode' },
	{ label: 'Vendor Code', key: 'vendor_code' },
	{ label: 'Purchase Order Code', key: 'purchase_order_code' },
	{ label: 'Oty', key: 'qty' },
	{ label: 'cartoncode', key: 'cartoncode' },
];

const CSVDownload = (props) => {
	const btnRef = useRef(null);
	useEffect(() => btnRef.current?.click(), [btnRef]);
	return (
		<CSVLink {...props}>
			<span ref={btnRef} />
		</CSVLink>
	);
};

function App() {
	const [tableNo, setTableNo] = useState(localStorage.getItem('tableNo') || '');
	const [formData, setFormData] = useState(initForm);
	const [errorMsg, setErrorMsg] = useState('');
	const [download, setDownload] = useState({});
	const [loading, setLoading] = useState(false);
  const [focusBarcodeInput, setFocusBarcodeInput] = useState(false);

	const handleTableNumberSet = (e) => {
		localStorage.setItem('tableNo', e.target.value);
		setTableNo(e.target.value);
	};

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			setLoading(true);
			setDownload({});
			setErrorMsg('');

			const data = {
				table: tableNo,
				bin: formData?.binCode,
				sku: formData?.skuCode,
				barcode: formData?.scanItem,
			};

			// const response = await fetch(
			// 	'https://api.recoder.damensch.com/process/dummy-success',
			// 	{
			// const response = await fetch(
			// 	'https://api.recoder.damensch.com/process/dummy-fail',
			// 	{
			const response = await fetch('https://api.recoder.damensch.com/process/recode', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const jsonData = await response.json();
			console.log('JSON', jsonData);

			if (jsonData.status === 'error') throw jsonData;

			jsonData.color = `"${jsonData.color}"`;
			console.log('**************************');
			console.log('JSON', { ...jsonData, ...dummyCsvFields });
			// console.log('dummy',dummyCsvFields )
			console.log('**************************');

			setDownload({ show: true, data: [{ ...jsonData, ...dummyCsvFields }] });
			// setFormData((state) => {
			// 	return {
			// 		...state,
			// 		scanItem: '',
			// 	};
			// });
		} catch (err) {
			console.log('FAIL!!', err);
			var audio = new Audio(alertSound);
			audio.play();
			setErrorMsg(err?.msg || 'Something went wrong!!');
		}
		setFormData((state) => {
			return {
				...state,
				scanItem: '',
			};
		});
		setLoading(false);
    setFocusBarcodeInput(true);
	};

	const handleChange = (key, val) => {
		setDownload({});
		setErrorMsg('');
		setFormData((state) => {
			return { ...state, [key]: val };
		});
	};

	return (
		<div className='App'>
			<Online>
				{loading && <div className='loader'></div>}
				{errorMsg ? (
					<ErrorPopup errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
				) : (
					<form onSubmit={handleSubmit}>
						<label>
							Table No.
							<input
								required
								type='text'
								value={tableNo}
								onChange={handleTableNumberSet}
							/>
						</label>
						<div className='main-form-data'>
							<label>
								Bin Code
								<input
									required
									type='text'
									value={formData.binCode}
									onChange={(e) => handleChange('binCode', e.target.value)}
								/>
							</label>
							<label>
								SKU Code
								<input
									required
									type='text'
									value={formData.skuCode}
									onChange={(e) => handleChange('skuCode', e.target.value)}
								/>
							</label>
						</div>

						<label>
							Scan Item
							<input
								required
                autoFocus={focusBarcodeInput}
								type='text'
								value={formData.scanItem}
								onChange={(e) => handleChange('scanItem', e.target.value)}
							/>
						</label>

						<input disabled={loading} type='submit' value='Enter' />
						{errorMsg && <div className='error'>{errorMsg}</div>}
					</form>
				)}

				<div className='item-data-container'>
					<div>Scanned Items: 0</div>
					<div>Printed Items: 0</div>
					<div>Error Items: 0</div>
				</div>
				{download?.show && (
					<>
						<span className='success'>Success!! </span>
						{/* <CSVLink
              filename={`barcode_label_damensch_${new Date().getTime()}.csv`}
							data={download?.data}
							headers={csvHeaders}
							// onClick={() => {
							// 	setDownload(false);
							// }}
						>
							Download CSV
						</CSVLink> */}
						<CSVDownload
							data={download?.data}
							headers={csvHeaders}
							enclosingCharacter={``}
							filename={`barcode_lable_damensch_${new Date().getTime()}.csv`}
							target='_blank'
						/>
					</>
				)}
			</Online>
			<Offline>
				<span className='offline'>
					You're offline right now. Check your connection.
				</span>
			</Offline>
		</div>
	);
}

export default App;
